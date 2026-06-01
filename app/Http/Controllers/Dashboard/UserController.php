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

        // Collect daily expenses for the last 30 days
        $transfers = \App\Models\Transfer::where('user_id', $user->id)
            ->where('created_at', '>=', $oneMonthAgo)
            ->orderBy('created_at')
            ->get();
            
        $dailyExpenses = [];
        // initialize 30 days of 0
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
        
        $avgExpense7d = 0;
        if (count($transactionHistory) >= 7) {
            $last7days = array_slice($transactionHistory, -7);
            $avgExpense7d = array_sum($last7days) / 7;
        }

        $balance = (float) $wallet->balance;
        // Estimasi monthly income: ambil yang terbesar antara pemasukan, pengeluaran, atau saldo
        // Karena jika user bisa belanja segitu, income minimal segitu
        $monthlyIncome = max((float) $totalPemasukan, (float) $totalPengeluaran, $balance);
        if ($monthlyIncome <= 0) {
            $monthlyIncome = 3000000; // default Rp 3 juta jika belum ada data
        }
        $savingsRate = min(max(($monthlyIncome - (float) $totalPengeluaran) / $monthlyIncome, -1.0), 1.0);

        $payload = [
            'monthly_income' => $monthlyIncome,
            'balance' => $balance,
            'savings_rate' => $savingsRate,
            'day_of_month' => Carbon::now()->day,
            'transaction_history' => $transactionHistory,
            'avg_expense_7d' => $avgExpense7d,
        ];

        try {
            $baseUrl = rtrim(config('services.capstone.url', 'http://localhost:8004'), '/');
            $apiUrl = $baseUrl . '/deep-recommend';
            $response = Http::timeout(15)->post($apiUrl, $payload);

            if ($response->successful()) {
                $data = $response->json();

                // Tambah predicted_expense untuk tampilan frontend
                $data['predicted_expense'] = round($avgExpense7d * 7, 0);

                // Map predicted_savings ke format yang dipakai frontend
                $data['predicted_savings'] = [
                    'per_day' => $data['predicted_savings']['per_day'] ?? 0,
                    'for_next_days' => $data['predicted_savings']['for_30_days'] ?? 0,
                    'for_7_days' => $data['predicted_savings']['for_7_days'] ?? 0,
                    'for_30_days' => $data['predicted_savings']['for_30_days'] ?? 0,
                    'period_days' => 30,
                ];

                // Map input_source ke used_prediction_from untuk kompatibilitas frontend
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
