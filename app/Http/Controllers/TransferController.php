<?php

namespace App\Http\Controllers;

use App\Models\Transfer;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Carbon\Carbon;

class TransferController extends Controller
{
    /**
     * Biaya admin per transaksi transfer (dalam Rupiah).
     */
    private const TRANSFER_FEE = 2500;

    /**
     * Daftar bank tujuan transfer (disbursement) yang didukung Xendit.
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
     * @dev Render Transfer form including balances
     */
    public function index()
    {
        $user = Auth::user();

        $wallet = Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );

        // Transfer sebulan terakhir (diurutkan dari yang paling baru)
        $recentTransfers = Transfer::where('user_id', $user->id)
            ->where('created_at', '>=', Carbon::now()->subMonth())
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('User/Transfer', [
            'banks'            => $this->banks,
            'recent_transfers' => $recentTransfers,
            'balance'          => (float) $wallet->balance,
            'transfer_fee'     => self::TRANSFER_FEE,
        ]);
    }

    /**
     * @dev Process new transfer based on Xendit Disbursement
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'bank_code'           => ['required', 'string', 'in:BCA,BNI,BRI,MANDIRI,PERMATA,BSI,CIMB'],
            'account_number'      => ['required', 'string', 'min:6', 'max:30'],
            'account_holder_name' => ['required', 'string', 'max:100'],
            'amount'              => ['required', 'numeric', 'min:10000'],
            'description'         => ['nullable', 'string', 'max:255'],
            'pin'                 => ['required', 'string', 'size:6'],
            'category'            => ['nullable', 'string', 'in:Makanan & Minuman,Belanja,Tagihan,Hiburan,Transportasi,Edukasi,Kesehatan,Lainnya'],
        ], [
            'bank_code.required'           => 'Bank tujuan harus dipilih.',
            'bank_code.in'                 => 'Bank tujuan tidak valid.',
            'account_number.required'      => 'Nomor rekening tujuan harus diisi.',
            'account_number.min'           => 'Nomor rekening minimal 6 digit.',
            'account_holder_name.required' => 'Nama pemilik rekening harus diisi.',
            'amount.required'              => 'Nominal transfer harus diisi.',
            'amount.min'                   => 'Minimal transfer adalah Rp 10.000.',
            'pin.required'                 => 'PIN harus diisi.',
            'pin.size'                     => 'PIN harus 6 digit.',
            'category.in'                  => 'Kategori tidak valid.',
        ]);

        $user = Auth::user();

        if (!Hash::check($validated['pin'], $user->pin)) {
            return back()->withErrors(['pin' => 'PIN yang Anda masukkan salah.'])->withInput(
                $request->except('pin')
            );
        }

        $wallet = Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );

        $totalDebit = $validated['amount'] + self::TRANSFER_FEE;

        if ($wallet->balance < $totalDebit) {
            return back()->withErrors([
                'amount' => 'Saldo tidak mencukupi. Saldo Anda: Rp ' . number_format($wallet->balance, 0, ',', '.') .
                            ', dibutuhkan: Rp ' . number_format($totalDebit, 0, ',', '.') . ' (termasuk biaya Rp ' . number_format(self::TRANSFER_FEE, 0, ',', '.') . ').',
            ])->withInput($request->except('pin'));
        }

        $externalId = 'TRF-' . $user->id . '-' . time() . '-' . strtoupper(substr(uniqid(), -6));

        return DB::transaction(function () use ($user, $wallet, $validated, $externalId, $totalDebit) {

            $wallet->decrement('balance', $totalDebit);

            $transfer = Transfer::create([
                'user_id'             => $user->id,
                'external_id'         => $externalId,
                'bank_code'           => $validated['bank_code'],
                'account_number'      => $validated['account_number'],
                'account_holder_name' => $validated['account_holder_name'],
                'amount'              => $validated['amount'],
                'category'            => $validated['category'] ?? 'Lainnya',
                'fee'                 => self::TRANSFER_FEE,
                'description'         => $validated['description'] ?? null,
                'status'              => 'COMPLETED',
            ]);

            // @dev Connect to Xendit Disbursements API here when package is pulled in. 
            // Saat Xendit aktif, ubah status awal ke 'PENDING' dan update via webhook.

            return response()->json([
                'success' => true,
                'message' => 'Transfer berhasil!',
                'transfer' => $transfer
            ]);
            
        });
    }

    /**
     * @dev Fetch detailed information on the specific transfer
     */
    public function show($id)
    {
        $user     = Auth::user();
        $transfer = Transfer::where('id', $id)
            ->where('user_id', $user->id)   // Hanya bisa lihat miliknya sendiri
            ->firstOrFail();

        $wallet = Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );

        return Inertia::render('User/TransferDetail', [
            'transfer' => $transfer,
            'balance'  => (float) $wallet->balance,
        ]);
    }
    public function qrisPay(Request $request)
    {
        $validated = $request->validate([
            'merchant_name' => ['required', 'string'],
            'amount'        => ['required', 'numeric', 'min:1'],
            'description'   => ['nullable', 'string', 'max:255'],
            'pin'           => ['required', 'string', 'size:6'],
            'category'      => ['nullable', 'string', 'in:Makanan & Minuman,Belanja,Tagihan,Hiburan,Transportasi,Edukasi,Kesehatan,Lainnya'],
        ]);

        $user = Auth::user();

        if (!Hash::check($validated['pin'], $user->pin)) {
            return response()->json(['errors' => ['pin' => 'PIN yang Anda masukkan salah.']], 422);
        }

        $wallet = Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );

        $totalDebit = $validated['amount'];

        if ($wallet->balance < $totalDebit) {
            return response()->json(['errors' => ['amount' => 'Saldo tidak mencukupi.']], 422);
        }

        $externalId = 'QRIS-' . $user->id . '-' . time() . '-' . strtoupper(substr(uniqid(), -6));

        return DB::transaction(function () use ($user, $wallet, $validated, $externalId, $totalDebit) {

            $wallet->decrement('balance', $totalDebit);

            $transfer = Transfer::create([
                'user_id'             => $user->id,
                'external_id'         => $externalId,
                'bank_code'           => 'QRIS',
                'account_number'      => 'ID' . rand(1000000000, 9999999999),
                'account_holder_name' => $validated['merchant_name'],
                'amount'              => $validated['amount'],
                'category'            => $validated['category'] ?? 'Lainnya',
                'fee'                 => 0,
                'description'         => $validated['description'] ?? null,
                'status'              => 'COMPLETED',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pembayaran QRIS berhasil!',
                'transfer' => $transfer
            ]);
        });
    }

    public function storeStruk(Request $request)
    {
        $validated = $request->validate([
            'merchant_name' => ['required', 'string'],
            'amount'        => ['required', 'numeric', 'min:1'],
            'category'      => ['nullable', 'string'],
            'date'          => ['nullable', 'string'],
        ]);

        $user = Auth::user();

        $wallet = Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );

        $externalId = 'STRUK-' . $user->id . '-' . time() . '-' . strtoupper(substr(uniqid(), -6));

        return DB::transaction(function () use ($user, $wallet, $validated, $externalId) {
            $wallet->decrement('balance', $validated['amount']);

            $transfer = Transfer::create([
                'user_id'             => $user->id,
                'external_id'         => $externalId,
                'bank_code'           => 'STRUK',
                'account_number'      => 'REC' . rand(1000000000, 9999999999),
                'account_holder_name' => $validated['merchant_name'],
                'amount'              => $validated['amount'],
                'category'            => $validated['category'] ?? 'Lainnya',
                'fee'                 => 0,
                'description'         => 'Catat Struk: ' . ($validated['date'] ?? ''),
                'status'              => 'COMPLETED',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Struk berhasil dicatat!',
                'transfer' => $transfer
            ]);
        });
    }
}
