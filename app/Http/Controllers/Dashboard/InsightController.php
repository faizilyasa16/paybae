<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\TopUp;
use App\Models\Transfer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class InsightController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $monthParam = $request->query('month'); // e.g. "0" for Jan, "4" for May
        
        if ($monthParam !== null && is_numeric($monthParam)) {
            $month = (int) $monthParam + 1; // convert 0-indexed to 1-indexed
            $year = Carbon::now()->year;
            // Jika bulan yang dipilih lebih besar dari bulan sekarang, berarti tahun lalu
            if ($month > Carbon::now()->month) {
                $year = $year - 1;
            }
            $targetDate = Carbon::create($year, $month, 1);
        } else {
            $targetDate = Carbon::now();
            $monthParam = $targetDate->month - 1; // 0-indexed
        }

        $startOfMonth = $targetDate->copy()->startOfMonth();
        $endOfMonth = $targetDate->copy()->endOfMonth();

        // Data bulan yang dipilih
        $currentMonthIncome = TopUp::where('user_id', $user->id)
            ->where('status', 'PAID')
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        $currentMonthExpense = Transfer::where('user_id', $user->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->selectRaw('SUM(amount + fee) as total')
            ->value('total') ?? 0;

        // Data bulan sebelumnya untuk perbandingan
        $lastMonthStart = $targetDate->copy()->subMonth()->startOfMonth();
        $lastMonthEnd = $targetDate->copy()->subMonth()->endOfMonth();

        $lastMonthIncome = TopUp::where('user_id', $user->id)
            ->where('status', 'PAID')
            ->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
            ->sum('amount');

        $lastMonthExpense = Transfer::where('user_id', $user->id)
            ->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
            ->selectRaw('SUM(amount + fee) as total')
            ->value('total') ?? 0;

        $cashflow = $currentMonthIncome - $currentMonthExpense;
        $lastCashflow = $lastMonthIncome - $lastMonthExpense;
        $cashflowChange = $lastCashflow != 0 
            ? round((($cashflow - $lastCashflow) / abs($lastCashflow)) * 100) 
            : ($cashflow > 0 ? 100 : 0);

        $driver = \Illuminate\Support\Facades\DB::connection()->getDriverName();
        $dayExpr = $driver === 'sqlite' 
            ? "CAST(strftime('%d', created_at) AS INTEGER) as day" 
            : "DAY(created_at) as day";

        // Daily cashflow untuk chart
        $dailyTopUps = TopUp::where('user_id', $user->id)
            ->where('status', 'PAID')
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->selectRaw("$dayExpr, SUM(amount) as total")
            ->groupBy('day')
            ->pluck('total', 'day')
            ->toArray();

        $dailyTransfers = Transfer::where('user_id', $user->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->selectRaw("$dayExpr, SUM(amount + fee) as total")
            ->groupBy('day')
            ->pluck('total', 'day')
            ->toArray();

        $daysInMonth = $targetDate->copy()->daysInMonth;
        $dailyData = [];
        for ($d = 1; $d <= $daysInMonth; $d++) {
            $income = (float)($dailyTopUps[$d] ?? 0);
            $expense = (float)($dailyTransfers[$d] ?? 0);
            $dailyData[] = [
                'day'     => $d,
                'income'  => $income,
                'expense' => $expense,
            ];
        }

        $incomeIcons = [
            'Gaji' => '💼',
            'Investasi' => '📈',
            'Uang Saku' => '💵',
            'Lainnya' => '💰',
        ];

        $expenseIcons = [
            'Makanan & Minuman' => '🍔',
            'Belanja' => '🛍️',
            'Tagihan' => '🧾',
            'Hiburan' => '🎬',
            'Transportasi' => '🚗',
            'Edukasi' => '🎓',
            'Kesehatan' => '🏥',
            'Lainnya' => '💸',
        ];

        // Top up per kategori untuk breakdown income
        $incomeByCategory = TopUp::where('user_id', $user->id)
            ->where('status', 'PAID')
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->selectRaw("COALESCE(category, 'Lainnya') as category_name, SUM(amount) as total")
            ->groupByRaw("COALESCE(category, 'Lainnya')")
            ->orderByDesc('total')
            ->get()
            ->map(function ($item) use ($user, $startOfMonth, $endOfMonth, $currentMonthIncome, $incomeIcons) {
                $categoryName = $item->category_name;
                $transactions = TopUp::where('user_id', $user->id)
                    ->where('status', 'PAID')
                    ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                    ->where(function($query) use ($categoryName) {
                        if ($categoryName === 'Lainnya') {
                            $query->whereNull('category')->orWhere('category', 'Lainnya');
                        } else {
                            $query->where('category', $categoryName);
                        }
                    })
                    ->orderByDesc('created_at')
                    ->get()
                    ->map(function($t) {
                        return [
                            'id' => $t->id,
                            'type' => 'income',
                            'amount' => (float)$t->amount,
                            'title' => 'Top Up ' . $t->bank_code,
                            'detail' => $t->virtual_account_number ? 'VA: ' . $t->virtual_account_number : '',
                            'date' => $t->created_at->format('d M Y, H:i'),
                            'description' => null,
                        ];
                    });

                return [
                    'name'         => $categoryName,
                    'amount'       => (float) $item->total,
                    'percent'      => $currentMonthIncome > 0 ? round(($item->total / $currentMonthIncome) * 100) : 0,
                    'icon'         => $incomeIcons[$categoryName] ?? '💰',
                    'transactions' => $transactions->values(),
                ];
            });

        // Transfer per kategori untuk breakdown expense
        $expenseByCategory = Transfer::where('user_id', $user->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->selectRaw("COALESCE(category, 'Lainnya') as category_name, SUM(amount + fee) as total")
            ->groupByRaw("COALESCE(category, 'Lainnya')")
            ->orderByDesc('total')
            ->get()
            ->map(function ($item) use ($user, $startOfMonth, $endOfMonth, $currentMonthExpense, $expenseIcons) {
                $categoryName = $item->category_name;
                $transactions = Transfer::where('user_id', $user->id)
                    ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                    ->where(function($query) use ($categoryName) {
                        if ($categoryName === 'Lainnya') {
                            $query->whereNull('category')->orWhere('category', 'Lainnya');
                        } else {
                            $query->where('category', $categoryName);
                        }
                    })
                    ->orderByDesc('created_at')
                    ->get()
                    ->map(function($t) {
                        return [
                            'id' => $t->id,
                            'type' => 'expense',
                            'amount' => (float)($t->amount + $t->fee),
                            'title' => $t->account_holder_name,
                            'detail' => $t->bank_code === 'QRIS' ? 'Pembayaran QRIS' : 'Transfer ' . $t->bank_code . ' (' . $t->account_number . ')',
                            'date' => $t->created_at->format('d M Y, H:i'),
                            'description' => $t->description,
                        ];
                    });

                return [
                    'name'         => $categoryName,
                    'amount'       => (float) $item->total,
                    'percent'      => $currentMonthExpense > 0 ? round(($item->total / $currentMonthExpense) * 100) : 0,
                    'icon'         => $expenseIcons[$categoryName] ?? '💸',
                    'transactions' => $transactions->values(),
                ];
            });

        // 5 detail transaksi terbaru
        $latestTopUps = TopUp::where('user_id', $user->id)
            ->where('status', 'PAID')
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $latestTransfers = Transfer::where('user_id', $user->id)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $recentTransactions = $latestTopUps->map(function ($t) use ($incomeIcons) {
            return [
                'id' => 'topup_' . $t->id,
                'type' => 'income',
                'amount' => (float)$t->amount,
                'category' => $t->category ?? 'Lainnya',
                'title' => 'Top Up ' . $t->bank_code,
                'detail' => $t->virtual_account_number ? 'VA: ' . $t->virtual_account_number : '',
                'date' => $t->created_at->format('d M Y, H:i'),
                'icon' => $incomeIcons[$t->category ?? 'Lainnya'] ?? '💰',
                'created_at' => $t->created_at,
            ];
        })->concat($latestTransfers->map(function ($t) use ($expenseIcons) {
            return [
                'id' => 'transfer_' . $t->id,
                'type' => 'expense',
                'amount' => (float)($t->amount + $t->fee),
                'category' => $t->category ?? 'Lainnya',
                'title' => $t->account_holder_name,
                'detail' => $t->bank_code === 'QRIS' ? 'Pembayaran QRIS' : 'Transfer ' . $t->bank_code,
                'date' => $t->created_at->format('d M Y, H:i'),
                'icon' => $expenseIcons[$t->category ?? 'Lainnya'] ?? '💸',
                'created_at' => $t->created_at,
            ];
        }))
        ->sortByDesc('created_at')
        ->take(5)
        ->values();

        $data = [
            'summary' => [
                'cashflow'        => (float) $cashflow,
                'cashflowChange'  => $cashflowChange,
                'netBalance'      => (float) $cashflow,
                'incomes'         => (float) $currentMonthIncome,
                'expenses'        => (float) $currentMonthExpense,
            ],
            'dailyData'          => $dailyData,
            'incomeCategories'   => $incomeByCategory->values(),
            'expenseCategories'  => $expenseByCategory->values(),
            'recentTransactions' => $recentTransactions,
            'currentMonth'       => $targetDate->format('M'),
            'currentMonthIndex'  => (int) $monthParam,
        ];

        // Jika request dari fetch internal (query json=1), kembalikan JSON biasa
        if ($request->query('json')) {
            return response()->json($data);
        }

        return Inertia::render('User/Insight', $data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
