<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Transaction;
use App\Services\XenditService;
use Illuminate\Support\Str;

class TopUpController extends Controller
{
    protected $xenditService;

    public function __construct(XenditService $xenditService)
    {
        $this->xenditService = $xenditService;
    }

    /**
     * Display the top up page.
     */
    public function index()
    {
        return Inertia::render('User/TopUp');
    }

    /**
     * Process the top up request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:10000|max:10000000',
            'payment_method' => 'required|string|in:bank_transfer,qris,gopay,ovo,dana',
            'bank_code' => 'required_if:payment_method,bank_transfer|string|in:bca,bni,bri,mandiri,btn,cimb,ocbc,danamon,maybank,bukopin,syariah_mandiri,bpd_jawa_barat,bpd_dki,bpd_jawa_tengah,bpd_jawa_timur,bpd_yogyakarta,bpd_banten,bpd_bali,bpd_nusa_tenggara_barat,bpd_nusa_tenggara_timur,bpd_kalimantan_barat,bpd_kalimantan_selatan,bpd_kalimantan_timur,bpd_kalimantan_utara,bpd_sulawesi_utara,bpd_sulawesi_tenggara,bpd_sulawesi_selatan,bpd_gorontalo,bpd_sulawesi_barat,bpd_maluku,bpd_maluku_utara,bpd_papua,bpd_papua_barat',
        ]);

        $user = Auth::user();
        $externalId = 'topup_' . Str::random(16);

        // Create transaction record
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'reference_id' => $externalId,
            'type' => 'topup',
            'amount' => $request->amount,
            'status' => 'pending',
            'payment_method' => $request->payment_method,
            'description' => 'Top up saldo via ' . $this->getPaymentMethodName($request->payment_method),
        ]);

        try {
            $paymentData = [
                'external_id' => $externalId,
                'amount' => $request->amount,
                'currency' => config('xendit.currency'),
                'description' => 'Top up saldo Paybae',
                'country' => 'ID',
                'customer' => [
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'success_redirect_url' => route('topup.success', $transaction->id),
                'failure_redirect_url' => route('topup.index'),
                'callback_url' => route('webhook.xendit'),
            ];

            $paymentResult = null;

            switch ($request->payment_method) {
                case 'bank_transfer':
                    // For bank transfer, we create a virtual account using Xendit VA
                    $vaData = [
                        'external_id' => $externalId,
                        'bank_code' => $request->bank_code,
                        'name' => $user->name,
                        'expected_amount' => $request->amount,
                    ];
                    $paymentResult = $this->xenditService->createVirtualAccount($vaData);
                    break;
                case 'qris':
                    $paymentResult = $this->xenditService->createQRIS($paymentData);
                    break;
                case 'gopay':
                case 'ovo':
                case 'dana':
                    $ewalletType = strtoupper($request->payment_method);
                    if ($request->payment_method === 'gopay') {
                        $ewalletType = 'SHOPEEPAY'; // Xendit uses SHOPEEPAY for GoPay
                    }
                    $paymentData['ewallet_type'] = $ewalletType;
                    $paymentResult = $this->xenditService->createEWalletPayment($paymentData);
                    break;
            }

            // Update transaction with payment details
            $transaction->update([
                'payment_id' => $paymentResult['id'] ?? null,
                'payment_url' => $paymentResult['invoice_url'] ?? $paymentResult['qr_string'] ?? null,
                'bank_code' => $request->bank_code ?? null,
            ]);

            return response()->json([
                'success' => true,
                'payment' => $paymentResult,
                'transaction' => $transaction,
                'user' => $user,
                'redirect_url' => $this->getRedirectUrl($paymentResult, $request->payment_method),
            ]);

        } catch (\Exception $e) {
            $transaction->update(['status' => 'failed']);
            Log::error('TopUpController store error', [
                'user_id' => $user->id,
                'transaction_id' => $transaction->id,
                'exception' => $e,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat pembayaran: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show top up success page.
     */
    public function success($id)
    {
        $user = Auth::user();
        $transaction = Transaction::where('user_id', $user->id)
            ->where('type', 'topup')
            ->where(function ($query) use ($id) {
                $query->where('id', $id)
                    ->orWhere('reference_id', $id);
            })
            ->firstOrFail();

        return Inertia::render('User/TopUpSuccess', [
            'transaction' => $transaction,
            'user' => $user,
        ]);
    }

    /**
     * Get payment method name
     */
    private function getPaymentMethodName($method)
    {
        $names = [
            'bank_transfer' => 'Bank Transfer',
            'qris' => 'QRIS',
            'gopay' => 'GoPay',
            'ovo' => 'OVO',
            'dana' => 'DANA',
        ];

        return $names[$method] ?? $method;
    }

    /**
     * Get redirect URL based on payment method
     */
    private function getRedirectUrl($paymentResult, $method)
    {
        switch ($method) {
            case 'bank_transfer':
                // For VA, return null - no redirect needed
                return null;
            case 'qris':
                // Show QR code page
                return route('payment.qr', ['id' => $paymentResult['id']]);
            case 'gopay':
            case 'ovo':
            case 'dana':
                // Redirect to the checkout URL returned by Xendit
                if (isset($paymentResult['actions']) && is_array($paymentResult['actions']) && count($paymentResult['actions']) > 0) {
                    return $paymentResult['actions'][0]['url'] ?? null;
                }
                if (isset($paymentResult['payment_method']) && isset($paymentResult['payment_method']['ewallet'])) {
                    $ewallet = $paymentResult['payment_method']['ewallet'];
                    return $ewallet['account']['checkout_url'] ?? $ewallet['account']['id'] ?? null;
                }
                return null;
            default:
                return null;
        }
    }

    /**
     * Show QR code page
     */
    public function showQR($qrId)
    {
        try {
            $qrData = $this->xenditService->getQRCode($qrId);
            return Inertia::render('User/PaymentQR', [
                'qrData' => $qrData,
            ]);
        } catch (\Exception $e) {
            return redirect()->route('topup.index')->with('error', 'QR Code tidak ditemukan');
        }
    }

    /**
     * Get list of banks
     */
    public function getBanks()
    {
        $banks = [
            ['code' => 'bca', 'name' => 'BCA'],
            ['code' => 'bni', 'name' => 'BNI'],
            ['code' => 'bri', 'name' => 'BRI'],
            ['code' => 'mandiri', 'name' => 'Mandiri'],
            ['code' => 'btn', 'name' => 'BTN'],
            ['code' => 'cimb', 'name' => 'CIMB Niaga'],
            ['code' => 'ocbc', 'name' => 'OCBC NISP'],
            ['code' => 'danamon', 'name' => 'Danamon'],
            ['code' => 'maybank', 'name' => 'Maybank'],
            ['code' => 'bukopin', 'name' => 'Bukopin'],
        ];

        return response()->json(['banks' => $banks]);
    }
}