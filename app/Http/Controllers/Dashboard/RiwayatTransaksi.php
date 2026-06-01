<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\TopUp;
use App\Models\Transfer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class RiwayatTransaksi extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Ambil semua top up yang udah ada
        $topUps = TopUp::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($topup) {
                return [
                    'id'     => $topup->id,
                    'title'  => 'Top Up ' . $topup->bank_code,
                    'desc'   => 'Kategori: ' . ($topup->category ?? 'Lainnya') . ' • VA: ' . ($topup->virtual_account_number ?? '-'),
                    'amount' => (float) $topup->amount,
                    'type'   => 'Pemasukan',
                    'status' => $topup->status,
                    'date'   => $topup->created_at->format('d M Y, H:i'),
                    'source' => 'topup',
                ];
            });

        // Ambil semua transfer yang udah ada
        $transfers = Transfer::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($transfer) {
                return [
                    'id'     => $transfer->id,
                    'title'  => 'Transfer ke ' . $transfer->account_holder_name,
                    'desc'   => 'Kategori: ' . ($transfer->category ?? 'Lainnya') . ' • ' . $transfer->bank_code . ' • ' . $transfer->account_number,
                    'amount' => -((float) $transfer->amount + (float) $transfer->fee),
                    'type'   => 'Pengeluaran',
                    'status' => $transfer->status,
                    'date'   => $transfer->created_at->format('d M Y, H:i'),
                    'source' => 'transfer',
                ];
            });

        // Gabungkan dan urutkan berdasarkan tanggal terbaru
        $transactions = $topUps->concat($transfers)
            ->sortByDesc('date')
            ->values();

        // Hitung total pemasukan & pengeluaran yang udah ada
        $totalPemasukan = TopUp::where('user_id', $user->id)
            ->where('status', 'PAID')
            ->sum('amount');

        $totalPengeluaran = Transfer::where('user_id', $user->id)
            ->selectRaw('SUM(amount + fee) as total')
            ->value('total') ?? 0;

        return Inertia::render('User/Riwayat', [
            'transactions'     => $transactions,
            'total_pemasukan'  => (float) $totalPemasukan,
            'total_pengeluaran' => (float) $totalPengeluaran,
        ]);
    }
}
