import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '../Component/DashboardLayout';
import { FiChevronLeft, FiChevronRight, FiChevronDown, FiTrendingUp, FiTrendingDown, FiDollarSign, FiArrowUpRight, FiArrowDownRight, FiActivity, FiSliders, FiCpu } from 'react-icons/fi';
import { AiFillRobot } from 'react-icons/ai';

const formatRupiah = (angka) => {
    if (angka === null || angka === undefined || isNaN(angka)) return 'Rp0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

const formatCompact = (value) => {
    if (!value || value === 0) return '0';
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
};

const CATEGORY_COLORS = [
    { bg: 'rgba(52, 211, 153, 0.12)', stroke: '#34d399', text: '#059669' },
    { bg: 'rgba(244, 114, 182, 0.12)', stroke: '#f472b6', text: '#db2777' },
    { bg: 'rgba(250, 204, 21, 0.12)', stroke: '#facc15', text: '#ca8a04' },
    { bg: 'rgba(96, 165, 250, 0.12)', stroke: '#60a5fa', text: '#2563eb' },
    { bg: 'rgba(248, 113, 113, 0.12)', stroke: '#f87171', text: '#dc2626' },
    { bg: 'rgba(167, 139, 250, 0.12)', stroke: '#a78bfa', text: '#7c3aed' },
    { bg: 'rgba(251, 146, 60, 0.12)', stroke: '#fb923c', text: '#ea580c' },
    { bg: 'rgba(45, 212, 191, 0.12)', stroke: '#2dd4bf', text: '#0d9488' },
];

export default function Insight() {
    const pageProps = usePage().props;

    const {
        summary: propSummary,
        dailyData: propDailyData,
        incomeCategories: propIncomeCategories,
        expenseCategories: propExpenseCategories,
        recentTransactions: propRecentTransactions,
        currentMonth: propCurrentMonth,
        currentMonthIndex: propMonthIndex,
    } = pageProps || {};

    const [viewMode, setViewMode] = useState('expense');
    const [viewTab, setViewTab] = useState('general'); // 'general' or 'ai'
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(
        typeof propMonthIndex === 'number' ? propMonthIndex : new Date().getMonth()
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [barTooltip, setBarTooltip] = useState(null);
    const [donutTooltip, setDonutTooltip] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);
    const [activeHoverCategory, setActiveHoverCategory] = useState(null);
    const [expandedCategory, setExpandedCategory] = useState(null);

    // AI Recommendation states
    const [aiData, setAiData] = useState(null);
    const [aiLoading, setAiLoading] = useState(true);
    const [aiError, setAiError] = useState(false);
    const [simulationPercent, setSimulationPercent] = useState(15); // default 15% budget cut simulation

    const [summary, setSummary] = useState({
        cashflow: propSummary?.cashflow ?? 0,
        cashflowChange: propSummary?.cashflowChange ?? 0,
        netBalance: propSummary?.netBalance ?? 0,
        incomes: propSummary?.incomes ?? 0,
        expenses: propSummary?.expenses ?? 0,
    });
    const [dailyData, setDailyData] = useState(Array.isArray(propDailyData) ? propDailyData : []);
    const [expenseCats, setExpenseCats] = useState(Array.isArray(propExpenseCategories) ? propExpenseCategories : []);
    const [incomeCats, setIncomeCats] = useState(Array.isArray(propIncomeCategories) ? propIncomeCategories : []);
    const [recentTransactions, setRecentTransactions] = useState(Array.isArray(propRecentTransactions) ? propRecentTransactions : []);

    // Reset expanded category on month change or view mode toggle
    useEffect(() => {
        setExpandedCategory(null);
    }, [selectedMonthIndex, viewMode]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const fullMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const isFirstRender = useRef(true);

    // Fetch data when month changes
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        setIsLoading(true);
        setFetchError(false);

        // Get CSRF token from meta tag or cookie
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        fetch(`/insight?month=${selectedMonthIndex}&json=1`, {
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrfToken,
            },
            credentials: 'same-origin',
        })
            .then(res => {
                if (!res.ok) throw new Error('Network error');
                return res.json();
            })
            .then(data => {
                setSummary({
                    cashflow: data.summary?.cashflow ?? 0,
                    cashflowChange: data.summary?.cashflowChange ?? 0,
                    netBalance: data.summary?.netBalance ?? 0,
                    incomes: data.summary?.incomes ?? 0,
                    expenses: data.summary?.expenses ?? 0,
                });
                setDailyData(Array.isArray(data.dailyData) ? data.dailyData : []);
                setExpenseCats(Array.isArray(data.expenseCategories) ? data.expenseCategories : []);
                setIncomeCats(Array.isArray(data.incomeCategories) ? data.incomeCategories : []);
                setRecentTransactions(Array.isArray(data.recentTransactions) ? data.recentTransactions : []);
                setIsLoading(false);
            })
            .catch(() => {
                setFetchError(true);
                setIsLoading(false);
            });
    }, [selectedMonthIndex]);

    const handlePrevMonth = useCallback(() => {
        setSelectedMonthIndex((prev) => (prev === 0 ? 11 : prev - 1));
    }, []);

    const handleNextMonth = useCallback(() => {
        setSelectedMonthIndex((prev) => (prev === 11 ? 0 : prev + 1));
    }, []);

    // Memoize categories with colors
    const expenseCategories = useMemo(() =>
        expenseCats.map((cat, i) => ({
            ...cat,
            bgColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length].bg,
            stroke: CATEGORY_COLORS[i % CATEGORY_COLORS.length].stroke,
            textColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length].text,
        })), [expenseCats]
    );

    const incomeCategories = useMemo(() =>
        incomeCats.map((cat, i) => ({
            ...cat,
            bgColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length].bg,
            stroke: CATEGORY_COLORS[i % CATEGORY_COLORS.length].stroke,
            textColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length].text,
        })), [incomeCats]
    );

    const activeCategories = viewMode === 'expense' ? expenseCategories : incomeCategories;
    const activeTotal = viewMode === 'expense' ? summary.expenses : summary.incomes;
    const activeLabel = viewMode === 'expense' ? 'Total pengeluaran' : 'Total pemasukan';

    // Safe max calculation
    const maxDailyValue = useMemo(() => {
        if (!dailyData || dailyData.length === 0) return 1;
        const values = dailyData.map(d => Math.max(d.income || 0, d.expense || 0));
        return Math.max(...values, 1);
    }, [dailyData]);

    // Donut chart segments calculated via useMemo (no side effects during render)
    const donutSegments = useMemo(() => {
        if (!activeCategories || activeCategories.length === 0) return [];
        const totalPercent = activeCategories.reduce((sum, c) => sum + (c.percent || 0), 0) || 1;
        let cumulative = 0;
        return activeCategories.map((cat) => {
            const offset = cumulative;
            cumulative += (cat.percent || 0);
            return { ...cat, offset };
        });
    }, [activeCategories]);

    // Loading overlay
    const LoadingOverlay = () => (
        <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm z-40 flex items-center justify-center rounded-2xl">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-[#52933e]/30 border-t-[#52933e] rounded-full animate-spin"></div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Memuat data...</span>
            </div>
        </div>
    );

    return (
        <div className="relative overflow-hidden min-h-full pb-28 bg-[#fafaf9] dark:bg-slate-950 font-sans text-slate-800 dark:text-white">
            <Head title="Insight Akun - Paybae" />

            {/* Header gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#52933e]/5 to-transparent dark:from-[#52933e]/10 pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-5 pt-8 relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-[22px] font-bold tracking-tight">Insight Akun</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ringkasan keuangan bulan {fullMonths[selectedMonthIndex]}</p>
                    </div>
                </div>

                {/* Date Selector */}
                <div className="flex items-center justify-between mb-8 relative z-20">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrevMonth}
                            className="w-10 h-10 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
                        >
                            <FiChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        </button>
                        <span className="font-bold text-base w-10 text-center">{months[selectedMonthIndex]}</span>
                        <button
                            onClick={handleNextMonth}
                            className="w-10 h-10 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
                        >
                            <FiChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        </button>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 rounded-full transition-all active:scale-95 shadow-sm"
                        >
                            Bulan <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>

                                <div
                                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-lg dark:shadow-none border border-slate-200/80 dark:border-slate-700/80 z-20 py-3 grid grid-cols-3 gap-1.5 px-3"
                                    style={{ animation: 'fadeInUp 0.2s ease-out' }}
                                >
                                    {months.map((month, idx) => (
                                        <button
                                            key={month}
                                            onClick={() => {
                                                setSelectedMonthIndex(idx);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`py-2.5 text-sm font-semibold rounded-xl transition-all ${
                                                selectedMonthIndex === idx
                                                ? 'bg-[#52933e] text-white shadow-sm shadow-green-600/20'
                                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                        >
                                            {month}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Loading state */}
                {isLoading && (
                    <div className="flex items-center justify-center py-4 mb-4">
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 px-5 py-3 rounded-full shadow-sm">
                            <div className="w-5 h-5 border-2 border-[#52933e]/30 border-t-[#52933e] rounded-full animate-spin"></div>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Memuat data {months[selectedMonthIndex]}...</span>
                        </div>
                    </div>
                )}

                {/* Error state */}
                {fetchError && !isLoading && (
                    <div className="flex items-center justify-center py-4 mb-4">
                        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200/80 dark:border-red-800/40 px-5 py-3 rounded-full">
                            <span className="text-sm font-medium text-red-600 dark:text-red-400">Gagal memuat data. Coba lagi.</span>
                            <button
                                onClick={() => {
                                    const current = selectedMonthIndex;
                                    setSelectedMonthIndex(-1);
                                    setTimeout(() => setSelectedMonthIndex(current), 50);
                                }}
                                className="text-sm font-bold text-red-600 dark:text-red-400 underline"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {/* Summary Cards */}
                <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-40' : 'opacity-100'}`}>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Cashflow Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[20px] p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center mb-4">
                                {summary.cashflow >= 0
                                    ? <FiTrendingUp className="w-5 h-5 text-[#52933e]" />
                                    : <FiTrendingDown className="w-5 h-5 text-[#d85c49]" />
                                }
                            </div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Total cashflow</p>
                            <p className={`font-bold text-sm mb-1.5 ${summary.cashflow >= 0 ? 'text-[#52933e]' : 'text-[#d85c49]'}`}>
                                {formatRupiah(summary.cashflow)}
                            </p>
                            <p className="text-[11px] font-medium text-slate-400">
                                <span className={`inline-flex items-center gap-0.5 font-bold ${summary.cashflowChange >= 0 ? 'text-[#52933e]' : 'text-[#d85c49]'}`}>
                                    {summary.cashflowChange >= 0
                                        ? <FiArrowUpRight className="w-3 h-3" />
                                        : <FiArrowDownRight className="w-3 h-3" />
                                    }
                                    {summary.cashflowChange >= 0 ? '+' : ''}{summary.cashflowChange}%
                                </span>
                                {' '}vs bulan lalu
                            </p>
                        </div>

                        {/* Net Balance Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[20px] p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center mb-4">
                                <FiDollarSign className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                            </div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Net balance</p>
                            <p className={`font-bold text-sm ${summary.netBalance >= 0 ? 'text-[#52933e]' : 'text-[#d85c49]'}`}>
                                {formatRupiah(summary.netBalance)}
                            </p>
                        </div>
                    </div>

                    {/* Income / Expense Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-[#34d399]"></div>
                                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Pemasukan {months[selectedMonthIndex]}</p>
                            </div>
                            <p className="font-bold text-[15px] text-[#059669]">{formatRupiah(summary.incomes)}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-[#ef4444]"></div>
                                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Pengeluaran {months[selectedMonthIndex]}</p>
                            </div>
                            <p className="font-bold text-[15px] text-[#dc2626]">{formatRupiah(summary.expenses)}</p>
                        </div>
                    </div>

                    {/* Daily Cash Flow Chart */}
                    <div className="mb-10 mt-2">
                        <h3 className="font-bold mb-6 text-[15px] px-1">Arus Kas Harian</h3>
                        {dailyData.length > 0 ? (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative">
                                <div className="relative h-44 border-l border-b border-slate-200/60 dark:border-slate-700 ml-10 pl-2 pb-2">
                                    {/* Y-axis labels */}
                                    <span className="absolute -left-10 top-0 text-[9px] font-medium text-slate-400">
                                        {formatCompact(maxDailyValue)}
                                    </span>
                                    <span className="absolute -left-4 top-1/2 -translate-y-1/2 text-[9px] font-medium text-slate-400">0</span>
                                    <span className="absolute -left-10 bottom-0 text-[9px] font-medium text-slate-400">
                                        -{formatCompact(maxDailyValue)}
                                    </span>

                                    {/* Grid lines */}
                                    <div className="absolute left-0 right-0 top-0 border-t border-dashed border-slate-200 dark:border-slate-700"></div>
                                    <div className="absolute left-0 right-0 top-1/2 border-t border-slate-100 dark:border-slate-800"></div>

                                    {/* Bars */}
                                    <div
                                        className="absolute inset-0 flex justify-between items-end px-1 pt-4 pb-0 z-10 h-full"
                                        style={{ overflowX: 'auto' }}
                                        onMouseLeave={() => setBarTooltip(null)}
                                    >
                                        {dailyData.map((d, i) => {
                                            const incomeHeight = maxDailyValue > 0 ? Math.min(((d.income || 0) / maxDailyValue) * 100, 100) : 0;
                                            const expenseHeight = maxDailyValue > 0 ? Math.min(((d.expense || 0) / maxDailyValue) * 100, 100) : 0;
                                            return (
                                                <div
                                                    key={i}
                                                    className="flex flex-col items-center justify-end h-full relative cursor-pointer group"
                                                    style={{ width: `${Math.max(100 / dailyData.length, 3)}%`, minWidth: '3px' }}
                                                    onMouseEnter={(e) => {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
                                                        setBarTooltip({
                                                            day: d.day,
                                                            income: d.income || 0,
                                                            expense: d.expense || 0,
                                                            x: rect.left - parentRect.left + rect.width / 2,
                                                            y: 0,
                                                        });
                                                    }}
                                                    onMouseLeave={() => setBarTooltip(null)}
                                                >
                                                    {/* Income bar (top half) */}
                                                    <div className="absolute bottom-1/2 flex flex-col items-center justify-end w-full h-1/2 pb-0">
                                                        {(d.income || 0) > 0 && (
                                                            <div
                                                                className="w-[70%] bg-[#34d399] rounded-t-[3px] hover:opacity-80 transition-all"
                                                                style={{ height: `${incomeHeight}%` }}
                                                            ></div>
                                                        )}
                                                    </div>
                                                    {/* Expense bar (bottom half) */}
                                                    <div className="absolute top-1/2 flex flex-col items-center justify-start w-full h-1/2 pt-0">
                                                        {(d.expense || 0) > 0 && (
                                                            <div
                                                                className="w-[70%] bg-[#ef4444] rounded-b-[3px] hover:opacity-80 transition-all"
                                                                style={{ height: `${expenseHeight}%` }}
                                                            ></div>
                                                        )}
                                                    </div>
                                                    {/* Day label - show every 5 days or first/last */}
                                                    {(d.day === 1 || d.day % 5 === 0 || d.day === dailyData.length) && (
                                                        <span className="absolute -bottom-6 text-[9px] font-medium text-slate-400">{d.day}</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Bar Tooltip */}
                                    {barTooltip && (
                                        <div
                                            className="absolute z-30 bg-slate-800 dark:bg-slate-700 text-white px-3 py-2.5 rounded-xl shadow-lg text-[11px] pointer-events-none whitespace-nowrap"
                                            style={{ left: barTooltip.x, top: -8, transform: 'translateX(-50%) translateY(-100%)' }}
                                        >
                                            <p className="font-bold mb-1">Hari {barTooltip.day}</p>
                                            {barTooltip.income > 0 && <p className="text-[#34d399]">↑ Masuk: {formatRupiah(barTooltip.income)}</p>}
                                            {barTooltip.expense > 0 && <p className="text-[#f87171]">↓ Keluar: {formatRupiah(barTooltip.expense)}</p>}
                                            {barTooltip.income === 0 && barTooltip.expense === 0 && <p className="text-slate-400">Tidak ada transaksi</p>}
                                            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-slate-800 dark:border-t-slate-700"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Chart legend */}
                                <div className="flex items-center justify-center gap-6 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#34d399]"></div>
                                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Pemasukan</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Pengeluaran</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                                    <FiTrendingUp className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                                </div>
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Belum ada data cashflow</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Data arus kas bulan {fullMonths[selectedMonthIndex]} akan muncul di sini.</p>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-slate-200/60 dark:border-slate-800 my-8"></div>

                    {/* Spending by category */}
                    <div>
                        <h3 className="font-bold mb-4 text-[15px] px-1">Kategori Transaksi</h3>

                        {/* Segmented Control */}
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-8 border border-slate-200/60 dark:border-slate-700">
                            <button
                                onClick={() => setViewMode('income')}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${viewMode === 'income' ? 'bg-white dark:bg-slate-900 shadow-sm text-[#52933e] border border-slate-200/50 dark:border-slate-700/50' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                Pemasukan
                            </button>
                            <button
                                onClick={() => setViewMode('expense')}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${viewMode === 'expense' ? 'bg-white dark:bg-slate-900 shadow-sm text-[#d85c49] border border-slate-200/50 dark:border-slate-700/50' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                Pengeluaran
                            </button>
                        </div>

                        {activeCategories.length > 0 ? (
                            <>
                                {/* Donut Chart */}
                                <div className="flex justify-center mb-10">
                                    <div className="relative w-[200px] h-[200px]">
                                        <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full" onMouseLeave={() => setDonutTooltip(null)}>
                                            {/* Background circle when not full */}
                                            <circle cx="50" cy="50" r="35" fill="transparent" stroke="#f1f5f9" strokeWidth="18" className="dark:stroke-slate-800" />
                                            {donutSegments.map((seg, i) => {
                                                const isHighlighted = !activeHoverCategory || activeHoverCategory === seg.name;
                                                return (
                                                    <circle
                                                        key={i}
                                                        cx="50" cy="50" r="35"
                                                        fill="transparent"
                                                        stroke={seg.stroke}
                                                        strokeWidth="18"
                                                        strokeDasharray={`${(seg.percent || 0) * 2.2} 220`}
                                                        strokeDashoffset={`-${(seg.offset || 0) * 2.2}`}
                                                        className="cursor-pointer transition-opacity duration-200 hover:opacity-75"
                                                        style={{
                                                            opacity: isHighlighted ? 1 : 0.3,
                                                            transition: 'opacity 0.2s ease-in-out',
                                                        }}
                                                        onMouseEnter={() => setDonutTooltip({ name: seg.name, amount: seg.amount, percent: seg.percent, color: seg.stroke })}
                                                        onMouseLeave={() => setDonutTooltip(null)}
                                                    />
                                                );
                                            })}
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
                                            {donutTooltip ? (
                                                <>
                                                    <span className="text-[9px] text-slate-500 dark:text-slate-400 mb-0.5 truncate max-w-[90%]">{donutTooltip.name}</span>
                                                    <span className="font-bold text-[13px]">{formatRupiah(donutTooltip.amount)}</span>
                                                    <span className="text-[10px] font-semibold mt-0.5" style={{ color: donutTooltip.color }}>{donutTooltip.percent}%</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-[9px] text-slate-500 dark:text-slate-400 mb-1">{activeLabel}</span>
                                                    <span className="font-bold text-[14px]">{formatRupiah(activeTotal)}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="mb-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-2">
                                    {activeCategories.map((cat, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.stroke }}></div>
                                            <span className="text-[12px] font-medium text-slate-600 dark:text-slate-300">{cat.name} ({cat.percent}%)</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Category breakdown list */}
                                <div className="mb-6">
                                    <h3 className="font-bold mb-4 text-[15px] px-1">Detail Kategori</h3>
                                    <div className="space-y-3">
                                        {activeCategories.map((cat, i) => {
                                            const isDonutHovered = donutTooltip?.name === cat.name;
                                            const isExpanded = expandedCategory === cat.name;
                                            return (
                                                <div key={i} className="flex flex-col animate-[fadeInUp_0.2s_ease-out]">
                                                    <div
                                                        onClick={() => setExpandedCategory(isExpanded ? null : cat.name)}
                                                        onMouseEnter={() => setActiveHoverCategory(cat.name)}
                                                        onMouseLeave={() => setActiveHoverCategory(null)}
                                                        className={`flex items-center justify-between group cursor-pointer transition-all duration-200 p-4 rounded-2xl border ${
                                                            isDonutHovered 
                                                            ? 'bg-white dark:bg-slate-900 border-[#52933e] dark:border-[#52933e] shadow-md scale-[1.01]' 
                                                            : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div
                                                                className="w-11 h-11 rounded-full flex items-center justify-center text-xl transition-transform group-hover:scale-105"
                                                                style={{ backgroundColor: cat.bgColor }}
                                                            >
                                                                {cat.icon || (viewMode === 'income' ? '💰' : '💸')}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-sm mb-0.5 text-slate-800 dark:text-white">{cat.name}</p>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                        <div
                                                                            className="h-full rounded-full transition-all duration-500"
                                                                            style={{ width: `${cat.percent || 0}%`, backgroundColor: cat.stroke }}
                                                                        ></div>
                                                                    </div>
                                                                    <p className="text-[11px] font-medium text-slate-400">{cat.percent}%</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`text-sm font-bold tracking-tight ${viewMode === 'income' ? 'text-[#52933e]' : 'text-slate-800 dark:text-white'}`}>
                                                                {viewMode === 'income' ? '+' : '-'}{formatRupiah(cat.amount)}
                                                            </span>
                                                            <FiChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                                        </div>
                                                    </div>

                                                    {/* Expanded Transactions List */}
                                                    {isExpanded && (
                                                        <div 
                                                            className="mt-2 mx-1 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/80 rounded-xl p-3.5 space-y-2.5"
                                                            style={{ animation: 'fadeInUp 0.2s ease-out' }}
                                                        >
                                                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 px-1">
                                                                Rincian Transaksi
                                                            </p>
                                                            {cat.transactions && cat.transactions.length > 0 ? (
                                                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                                                    {cat.transactions.map((t, idx) => (
                                                                        <div key={idx} className="bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800/40 flex items-center justify-between shadow-xs">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                                                                                    {t.title}
                                                                                </span>
                                                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                                                                        {t.detail}
                                                                                    </span>
                                                                                    {t.description && (
                                                                                        <>
                                                                                            <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
                                                                                            <span className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                                                                                                "{t.description}"
                                                                                            </span>
                                                                                        </>
                                                                                    )}
                                                                                </div>
                                                                                <span className="text-[9px] text-slate-400">
                                                                                    {t.date}
                                                                                </span>
                                                                            </div>
                                                                            <span className={`text-xs font-bold ${t.type === 'income' ? 'text-[#34d399]' : 'text-slate-700 dark:text-slate-300'}`}>
                                                                                {t.type === 'income' ? '+' : '-'}{formatRupiah(t.amount)}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-xs text-slate-400 italic text-center py-2">
                                                                    Tidak ada riwayat transaksi
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Transaksi Terbaru */}
                                <div className="mt-8 border-t border-slate-200/60 dark:border-slate-800 pt-6">
                                    <h3 className="font-bold mb-4 text-[15px] px-1">Transaksi Terbaru (5 Teratas)</h3>
                                    {recentTransactions && recentTransactions.length > 0 ? (
                                        <div className="space-y-2.5">
                                            {recentTransactions.map((tx, idx) => (
                                                <div 
                                                    key={tx.id || idx} 
                                                    className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-3.5 rounded-2xl transition-all shadow-sm hover:shadow-md animate-[fadeInUp_0.2s_ease-out]"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-lg">
                                                            {tx.icon || (tx.type === 'income' ? '💰' : '💸')}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-xs text-slate-800 dark:text-white mb-0.5">
                                                                {tx.title}
                                                            </p>
                                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                                                    {tx.category} • {tx.detail}
                                                                </span>
                                                            </div>
                                                            <p className="text-[9px] text-slate-400 mt-0.5">
                                                                {tx.date}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`text-xs font-bold tracking-tight ${tx.type === 'income' ? 'text-[#52933e]' : 'text-slate-800 dark:text-white'}`}>
                                                        {tx.type === 'income' ? '+' : '-'}{formatRupiah(tx.amount)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col items-center justify-center py-8 text-center">
                                            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Belum ada transaksi di bulan ini</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                    <FiDollarSign className="w-7 h-7 text-slate-300 dark:text-slate-600" />
                                </div>
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                    Belum ada data {viewMode === 'income' ? 'pemasukan' : 'pengeluaran'}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 max-w-[240px]">
                                    Data {viewMode === 'income' ? 'pemasukan' : 'pengeluaran'} bulan {fullMonths[selectedMonthIndex]} akan muncul di sini.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Inline animation keyframes */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

Insight.layout = page => <DashboardLayout children={page} />;
