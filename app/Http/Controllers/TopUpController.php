<?php

namespace App\Http\Controllers;

use App\Models\TopUp;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class TopUpController extends Controller
{
    /**
     * Daftar bank yang mendukung Virtual Account Xendit.
     */
    private array $banks = [
        ['code' => 'BCA',     'name' => 'Bank Central Asia (BCA)'],
        ['code' => 'BNI',     'name' => 'Bank Negara Indonesia (BNI)'],
        ['code' => 'BRI',     'name' => 'Bank Rakyat Indonesia (BRI)'],
        ['code' => 'MANDIRI', 'name' => 'Bank Mandiri'],
        ['code' => 'PERMATA', 'name' => 'Bank Permata'],
        ['code' => 'BSI',     'name' => 'Bank Syariah Indonesia (BSI)'],
        ['code' => 'CIMB',    'name' => 'CIMB Niaga'],
    ];

    /**
     * @dev Tampilkan dashboard Top Up (Recent Top Ups & Supported Banks)
     */
    public function index()
    {
        $user = Auth::user();

        $wallet = Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );

        // Top up sebulan terakhir (diurutkan dari yang paling baru)
        $recentTopUps = TopUp::where('user_id', $user->id)
            ->where('created_at', '>=', Carbon::now()->subMonth())
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('User/TopUp', [
            'banks'         => $this->banks,
            'recent_topups' => $recentTopUps,
            'balance'       => (float) $wallet->balance,
        ]);
    }

    /**
     * @dev Process Top Up Request from Xendit VA API
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'bank_code' => ['required', 'string', 'in:BCA,BNI,BRI,MANDIRI,PERMATA,BSI,CIMB'],
            'amount'    => ['required', 'numeric', 'min:10000', 'max:50000000'],
            'category'  => ['nullable', 'string', 'in:Gaji,Investasi,Uang Saku,Lainnya'],
        ], [
            'bank_code.required' => 'Bank harus dipilih.',
            'bank_code.in'       => 'Bank yang dipilih tidak valid.',
            'amount.required'    => 'Nominal top up harus diisi.',
            'amount.min'         => 'Minimal top up adalah Rp 10.000.',
            'amount.max'         => 'Maksimal top up adalah Rp 50.000.000.',
            'category.in'        => 'Kategori tidak valid.',
        ]);

        $user = Auth::user();
        $externalId = 'TOPUP-' . $user->id . '-' . time() . '-' . strtoupper(substr(uniqid(), -6));
        $expiresAt = now()->addHours(24);
        $virtualAccountNumber = null;

        try {
            \Xendit\Xendit::setApiKey(config('xendit.secret_key'));

            $vaParams = [
                'external_id'       => $externalId,
                'bank_code'         => $validated['bank_code'],
                'name'              => $user->name,
                'expected_amount'   => (int) $validated['amount'],
                'expiration_date'   => $expiresAt->toIso8601String(),
                'is_closed'         => true,
                'is_single_use'     => true,
            ];

            $response = \Xendit\VirtualAccounts::create($vaParams);
            $virtualAccountNumber = $response['account_number'];

        } catch (\Xendit\Exceptions\ApiException $e) {
            return redirect()->route('topup.index')
                ->with('error', 'Gagal membuat Virtual Account: ' . $e->getMessage());
        } catch (\Exception $e) {
            return redirect()->route('topup.index')
                ->with('error', 'Terjadi kesalahan saat menghubungi Xendit. Silakan coba lagi.');
        }

        $topUp = TopUp::create([
            'user_id'               => $user->id,
            'external_id'           => $externalId,
            'virtual_account_number'=> $virtualAccountNumber,
            'bank_code'             => $validated['bank_code'],
            'amount'                => $validated['amount'],
            'category'              => $validated['category'] ?? 'Lainnya',
            'status'                => 'PENDING',
            'expires_at'            => $expiresAt,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'topup'   => $topUp,
            ]);
        }

        return redirect()->route('topup.show', $topUp->id)
            ->with('success', 'Virtual Account berhasil dibuat. Silakan lakukan pembayaran sebelum ' . $expiresAt->format('d M Y H:i') . ' WIB.');
    }

    /**
     * @dev Detail View TopUp Request
     */
    public function show($id)
    {
        $user  = Auth::user();
        $topUp = TopUp::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $wallet = Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );

        return Inertia::render('User/TopUpDetail', [
            'topup'   => $topUp,
            'balance' => (float) $wallet->balance,
        ]);
    }

    /**
     * @dev Testing Simulator for Top Up request bypassing Xendit real APIs.
     */
    public function simulate(Request $request)
    {
        $validated = $request->validate([
            'bank_code' => 'required',
            'va_number' => 'required',
            'amount' => 'required|numeric'
        ]);

        $response = \Illuminate\Support\Facades\Http::withBasicAuth(config('xendit.secret_key'), '')
            ->post('https://api.xendit.co/pool_virtual_accounts/simulate_payment', [
                'bank_code' => $validated['bank_code'],
                'bank_account_number' => $validated['va_number'],
                'transfer_amount' => (int) $validated['amount'],
                'amount' => (int) $validated['amount']
            ]);

        if ($response->successful()) {
            $topUp = \App\Models\TopUp::where('virtual_account_number', $validated['va_number'])->where('status', 'PENDING')->first();
            if ($topUp) {
                $topUp->update(['status' => 'PAID']);
                $wallet = \App\Models\Wallet::firstOrCreate(
                    ['user_id' => $topUp->user_id],
                    ['balance' => 0]
                );
                $wallet->increment('balance', $topUp->amount);
            }
            
            return response()->json(['success' => true, 'message' => 'Pembayaran berhasil disimulasikan!']);
        }

        return response()->json(['success' => false, 'message' => 'Gagal: ' . $response->body()], 400);
    }
}
