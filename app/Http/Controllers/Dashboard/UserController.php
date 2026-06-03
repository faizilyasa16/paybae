<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\TopUp;
use App\Models\Transfer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;

class UserController extends Controller
{
    /**
     * @dev Render User Dashboard view
     */
    public function index()
    {
        $user = Auth::user();
        $oneMonthAgo = Carbon::now()->subMonth();
        
        $wallet = \App\Models\Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );

        // Transaksi terbaru (gabungan top up & transfer, 5 terakhir)
        $recentTopUps = TopUp::where('user_id', $user->id)
            ->where('created_at', '>=', $oneMonthAgo)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($topup) {
                return [
                    'id'         => 'topup-' . $topup->id,
                    'title'      => 'Top Up ' . $topup->bank_code,
                    'desc'       => 'VA: ' . ($topup->virtual_account_number ?? '-'),
                    'amount'     => (float) $topup->amount,
                    'type'       => 'Pemasukan',
                    'status'     => $topup->status,
                    'date'       => $topup->created_at->format('d M Y, H:i'),
                    'created_at' => $topup->created_at->toIso8601String(),
                ];
            });

        $recentTransfers = Transfer::where('user_id', $user->id)
            ->where('created_at', '>=', $oneMonthAgo)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($transfer) {
                return [
                    'id'         => 'transfer-' . $transfer->id,
                    'title'      => 'Transfer ke ' . $transfer->account_holder_name,
                    'desc'       => $transfer->bank_code . ' • ' . $transfer->account_number,
                    'amount'     => -((float) $transfer->amount + (float) $transfer->fee),
                    'type'       => 'Pengeluaran',
                    'status'     => $transfer->status,
                    'date'       => $transfer->created_at->format('d M Y, H:i'),
                    'created_at' => $transfer->created_at->toIso8601String(),
                ];
            });

        $recentTransactions = $recentTopUps->concat($recentTransfers)
            ->sortByDesc('created_at')
            ->values()
            ->take(5);

        // Ringkasan pemasukan & pengeluaran sebulan terakhir
        $totalPemasukan = TopUp::where('user_id', $user->id)
            ->where('created_at', '>=', $oneMonthAgo)
            ->where('status', 'PAID')
            ->sum('amount');

        $totalPengeluaran = Transfer::where('user_id', $user->id)
            ->where('created_at', '>=', $oneMonthAgo)
            ->selectRaw('SUM(amount + fee) as total')
            ->value('total') ?? 0;

        return Inertia::render('User/Dashboard', [
            'balance'            => (float) $wallet->balance,
            'recent_transactions' => $recentTransactions,
            'total_pemasukan'    => (float) $totalPemasukan,
            'total_pengeluaran'  => (float) $totalPengeluaran,
        ]);
    }

    public function create() {}

    public function recommend(Request $request)
    {
        $user = Auth::user();
        $oneMonthAgo = Carbon::now()->subMonth();
        $wallet = \App\Models\Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );
        $totalPemasukan = \App\Models\TopUp::where('user_id', $user->id)
            ->where('created_at', '>=', $oneMonthAgo)
            ->where('status', 'PAID')
            ->sum('amount');
        $totalPengeluaran = \App\Models\Transfer::where('user_id', $user->id)
            ->where('created_at', '>=', $oneMonthAgo)
            ->selectRaw('SUM(amount + fee) as total')
            ->value('total') ?? 0;
        $transfers = \App\Models\Transfer::where('user_id', $user->id)
            ->where('created_at', '>=', $oneMonthAgo)
            ->orderBy('created_at')
            ->get();
        $dailyExpenses = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $dailyExpenses[$date] = 0;
        }
        foreach ($transfers as $transfer) {
            $date = $transfer->created_at->format('Y-m-d');
            if (isset($dailyExpenses[$date])) {
                $dailyExpenses[$date] += ($transfer->amount + $transfer->fee);
            }
        }

        $transactionHistory = array_values($dailyExpenses);
        $balance = (float) $wallet->balance;
        if ((float) $totalPemasukan > 0) {
            $monthlyIncome = (float) $totalPemasukan;
        } elseif ((float) $totalPengeluaran > 0) {
            $monthlyIncome = (float) $totalPengeluaran; //fallback: minimal bisa belanja segini
        } else {
            $monthlyIncome = 3000000; //default Rp 3 juta jika belum ada data sama sekali
        }
        $savingsRate = min(max(($monthlyIncome - (float) $totalPengeluaran) / $monthlyIncome, -1.0), 1.0);
        //caritahu kapan transaksi non-zero pertama kali terjadi dalam 30 hari terakhir (cold-start detection)
        $firstNonZeroIndex = -1;
        foreach ($transactionHistory as $index => $amount) {
            if ($amount > 0) {
                $firstNonZeroIndex = $index;
                break;
            }
        }

        $activeDays = 30; //default jika histori penuh
        if ($firstNonZeroIndex !== -1) {
            $activeDays = 30 - $firstNonZeroIndex;
        }
        $avgExpense7d = 0;
        if (count($transactionHistory) >= 7) {
            $last7days = array_slice($transactionHistory, -7);
            $rawAvgExpense7d = array_sum($last7days) / 7;
            //jika hari aktif transaksi < 7 hari, lakukan smoothing (meredam lonjakan transaksi satu kali di awal)
            if ($activeDays < 7) {
                //baseline pengeluaran harian wajar (asumsi 30% dari pendapatan bulanan dibagi 30)
                $baselineAvgExpense = ($monthlyIncome * 0.3) / 30;
                $avgExpense7d = ($rawAvgExpense7d * $activeDays / 7) + ($baselineAvgExpense * (7 - $activeDays) / 7);
            } else {
                $avgExpense7d = $rawAvgExpense7d;
            }
        }

        $payload = [
            'monthly_income' => $monthlyIncome,
            'balance' => $balance,
            'savings_rate' => $savingsRate,
            'day_of_month' => Carbon::now()->day,
            'transaction_history' => $transactionHistory,
            'avg_expense_7d' => $avgExpense7d,
        ];
        try {
            $baseUrl = rtrim(config('services.capstone.url', 'https://precious-rebirth-production-c9f7.up.railway.app'), '/');
            if (!preg_match('~^(?:f|ht)tps?://~i', $baseUrl)) {
                $baseUrl = 'https://' . $baseUrl;
            }
            $apiUrl = $baseUrl . '/deep-recommend';
            $response = Http::timeout(15)->post($apiUrl, $payload);
            if ($response->successful()) {
                $data = $response->json();
                //tambah predicted_expense untuk tampilan frontend
                $data['predicted_expense'] = round($avgExpense7d * 7, 0);
                //hitung potensi hemat berdasarkan pengurangan pengeluaran
                $factorMap = [0 => 0.0, 1 => 0.0, 2 => 0.20, 3 => 0.10, 4 => 0.05];
                $actionId = $data['action_id'] ?? 0;
                $factor = $factorMap[$actionId] ?? 0.0;
                $reductionPerDay = $avgExpense7d * $factor;
                $perDay = $reductionPerDay > 0 ? $reductionPerDay : ($data['predicted_savings']['per_day'] ?? 0);
                //tampilkan predicted_savings ke format yang dipakai frontend
                $data['predicted_savings'] = [
                    'per_day' => round($perDay, 0),
                    'for_next_days' => round($perDay * 30, 0),
                    'for_7_days' => round($perDay * 7, 0),
                    'for_30_days' => round($perDay * 30, 0),
                    'period_days' => 30,
                ];
                //Map input_source ke used_prediction_from untuk kompatibilitas frontend
                $data['used_prediction_from'] = $data['input_source'] ?? 'deep_learning';
                $data['source'] = 'Deep Learning (LSTM)';
                return response()->json($data);
            }
            return response()->json([
                'error' => 'API Error',
                'details' => $response->body()
            ], $response->status());

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Deep Recommend API Connection Error:', [
                'message' => $e->getMessage()
            ]);
            return response()->json([
                'error' => 'Could not connect to recommendation API',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function simulate(Request $request)
    {
        $request->validate([
            'nominal' => 'required|numeric|min:0.01',
        ]);

        $user = Auth::user();
        $oneMonthAgo = Carbon::now()->subMonth();

        $wallet = \App\Models\Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0]
        );

        $balance = (float) $wallet->balance;

        $totalPemasukan = \App\Models\TopUp::where('user_id', $user->id)
            ->where('created_at', '>=', $oneMonthAgo)
            ->where('status', 'PAID')
            ->sum('amount');

        $totalPengeluaran = \App\Models\Transfer::where('user_id', $user->id)
            ->where('created_at', '>=', $oneMonthAgo)
            ->selectRaw('SUM(amount + fee) as total')
            ->value('total') ?? 0;

        $simNominal = (float) $request->input('nominal');
        $afterBalance = $balance - $simNominal;

        $income = $totalPemasukan > 0 ? (float) $totalPemasukan : 3000000.0;

        $savingsRateBefore = (($income - (float) $totalPengeluaran) / $income) * 100;
        $savingsRateAfter = (($income - ((float) $totalPengeluaran + $simNominal)) / $income) * 100;

        $warningText = "";
        $status = "";

        if ($savingsRateAfter < 0) {
            $warningText = "Transaksi ini sangat berbahaya! Pengeluaranmu akan melebihi total pendapatanmu.";
            $status = "danger";
        } else if ($savingsRateAfter < 10) {
            $warningText = "Peringatan: Rasio tabunganmu akan berada di bawah batas aman (10%). Pertimbangkan kembali.";
            $status = "warning";
        } else if ($savingsRateAfter < $savingsRateBefore - 10) {
            $warningText = "Transaksi ini cukup besar dan akan memotong drastis target tabunganmu.";
            $status = "warning";
        } else {
            $warningText = "Pengeluaran ini masih dalam batas wajar, pastikan barang ini adalah kebutuhan yang bermanfaat.";
            $status = "safe";
        }

        return response()->json([
            'before' => $balance,
            'after' => $afterBalance,
            'savingsRateBefore' => number_format($savingsRateBefore, 1) . '%',
            'savingsRateAfter' => number_format($savingsRateAfter, 1) . '%',
            'warning' => $warningText,
            'status' => $status
        ]);
    }

    public function store(Request $request) {}

    public function show(string $id) {}

    public function edit(string $id) {}

    public function update(Request $request, string $id) {}

    public function destroy(string $id) {}

    public function logout(Request $request)
    {
        Auth::logout();
        
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect('/login');
    }
}
