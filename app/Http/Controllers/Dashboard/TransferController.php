<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Transaction;
use App\Models\User;
use App\Services\XenditService;
use Illuminate\Support\Str;

class TransferController extends Controller
{
    protected $xenditService;

    public function __construct(XenditService $xenditService)
    {
        $this->xenditService = $xenditService;
    }

    /**
     * Display the transfer page.
     */
    public function index()
    {
        return Inertia::render('User/Transfer');
    }

    /**
     * Process the transfer request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'recipient_account' => 'required|string|min:10|max:20',
            'recipient_name' => 'required|string|min:2|max:100',
            'recipient_bank' => 'required|string|in:bca,bni,bri,mandiri,btn,cimb,ocbc,danamon,maybank,bukopin,syariah_mandiri,bpd_jawa_barat,bpd_dki,bpd_jawa_tengah,bpd_jawa_timur,bpd_yogyakarta,bpd_banten,bpd_bali,bpd_nusa_tenggara_barat,bpd_nusa_tenggara_timur,bpd_kalimantan_barat,bpd_kalimantan_selatan,bpd_kalimantan_timur,bpd_kalimantan_utara,bpd_sulawesi_utara,bpd_sulawesi_tenggara,bpd_sulawesi_selatan,bpd_gorontalo,bpd_sulawesi_barat,bpd_maluku,bpd_maluku_utara,bpd_papua,bpd_papua_barat',
            'amount' => 'required|numeric|min:10000|max:50000000',
            'description' => 'nullable|string|max:255',
        ]);

        $user = Auth::user();

        // Check if user has sufficient balance
        if ($user->balance < $request->amount) {
            return response()->json([
                'success' => false,
                'message' => 'Saldo tidak mencukupi untuk melakukan transfer.',
            ], 400);
        }

        $externalId = 'transfer_' . Str::random(16);

        // Create transaction record
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'reference_id' => $externalId,
            'type' => 'transfer',
            'amount' => $request->amount,
            'status' => 'pending',
            'payment_method' => 'bank_transfer',
            'description' => $request->description ?: 'Transfer ke ' . $request->recipient_name . ' (' . strtoupper($request->recipient_bank) . ')',
            'recipient_account' => $request->recipient_account,
            'recipient_name' => $request->recipient_name,
            'recipient_bank' => $request->recipient_bank,
        ]);

        try {
            $transferData = [
                'external_id' => $externalId,
                'amount' => $request->amount,
                'bank_code' => $request->recipient_bank,
                'account_holder_name' => $request->recipient_name,
                'account_number' => $request->recipient_account,
                'description' => $request->description ?: 'Transfer via Paybae',
            ];

            $transferResult = $this->xenditService->createBankTransfer($transferData);

            // Update transaction with transfer details
            $transaction->update([
                'payment_id' => $transferResult['id'] ?? null,
                'status' => 'success', // For demo purposes, assume success
            ]);

            // Deduct from user balance
            $user->decrement('balance', $request->amount);

            return response()->json([
                'success' => true,
                'message' => 'Transfer berhasil diproses.',
                'transaction' => $transaction,
                'redirect_url' => route('transfer.success', $transaction->id),
            ]);

        } catch (\Exception $e) {
            $transaction->update(['status' => 'failed']);
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses transfer: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function success($id)
    {
        $user = Auth::user();
        $transaction = Transaction::where('user_id', $user->id)
            ->where('type', 'transfer')
            ->where(function ($query) use ($id) {
                $query->where('id', $id)
                    ->orWhere('reference_id', $id);
            })
            ->firstOrFail();

        return Inertia::render('User/TransferSuccess', [
            'transaction' => $transaction,
            'user' => $user,
        ]);
    }

    /**
     * Get bank list for transfer
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
            ['code' => 'syariah_mandiri', 'name' => 'Mandiri Syariah'],
            ['code' => 'bpd_jawa_barat', 'name' => 'BPD Jawa Barat'],
            ['code' => 'bpd_dki', 'name' => 'BPD DKI'],
            ['code' => 'bpd_jawa_tengah', 'name' => 'BPD Jawa Tengah'],
            ['code' => 'bpd_jawa_timur', 'name' => 'BPD Jawa Timur'],
            ['code' => 'bpd_yogyakarta', 'name' => 'BPD Yogyakarta'],
            ['code' => 'bpd_banten', 'name' => 'BPD Banten'],
            ['code' => 'bpd_bali', 'name' => 'BPD Bali'],
            ['code' => 'bpd_nusa_tenggara_barat', 'name' => 'BPD NTB'],
            ['code' => 'bpd_nusa_tenggara_timur', 'name' => 'BPD NTT'],
            ['code' => 'bpd_kalimantan_barat', 'name' => 'BPD Kalimantan Barat'],
            ['code' => 'bpd_kalimantan_selatan', 'name' => 'BPD Kalimantan Selatan'],
            ['code' => 'bpd_kalimantan_timur', 'name' => 'BPD Kalimantan Timur'],
            ['code' => 'bpd_kalimantan_utara', 'name' => 'BPD Kalimantan Utara'],
            ['code' => 'bpd_sulawesi_utara', 'name' => 'BPD Sulawesi Utara'],
            ['code' => 'bpd_sulawesi_tenggara', 'name' => 'BPD Sulawesi Tenggara'],
            ['code' => 'bpd_sulawesi_selatan', 'name' => 'BPD Sulawesi Selatan'],
            ['code' => 'bpd_gorontalo', 'name' => 'BPD Gorontalo'],
            ['code' => 'bpd_sulawesi_barat', 'name' => 'BPD Sulawesi Barat'],
            ['code' => 'bpd_maluku', 'name' => 'BPD Maluku'],
            ['code' => 'bpd_maluku_utara', 'name' => 'BPD Maluku Utara'],
            ['code' => 'bpd_papua', 'name' => 'BPD Papua'],
            ['code' => 'bpd_papua_barat', 'name' => 'BPD Papua Barat'],
        ];

        return response()->json(['banks' => $banks]);
    }
}