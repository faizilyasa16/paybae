import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '../Component/DashboardLayout';
import { FiChevronLeft, FiChevronRight, FiChevronDown, FiTrendingUp, FiDollarSign } from 'react-icons/fi';

export default function Insight() {
    const [viewMode, setViewMode] = useState('expense'); // 'income' or 'expense'
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(2); // 2 = Mar
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const handlePrevMonth = () => {
        setSelectedMonthIndex((prev) => (prev === 0 ? 11 : prev - 1));
    };

    const handleNextMonth = () => {
        setSelectedMonthIndex((prev) => (prev === 11 ? 0 : prev + 1));
    };

    // Mock data based on screenshots
    const summary = {
        cashflow: 'IDR 1.079.865,00',
        cashflowChange: '+731%',
        netBalance: 'IDR 908.765,00',
        incomes: 'IDR 1.751.100,00',
        expenses: 'IDR 671.235,00'
    };

    const dailyData = [
        { day: 1, value: 800 },
        { day: 2, value: 150, isExpense: true, expenseValue: 400 },
        { day: 3, value: 0 },
        { day: 4, value: 0, isExpense: true, expenseValue: 150 },
        { day: 5, value: 0 },
        { day: 6, value: 250 },
        { day: 7, value: 0 },
        { day: 8, value: 0 },
    ];

    const expenseCategories = [
        { name: 'Food & Beverage', percent: 47, amount: '-IDR 314.000,00', color: 'bg-[#e0f8e9]', icon: '🍔' },
        { name: 'Bills & Utilities', percent: 27, amount: '-IDR 180.000,00', color: 'bg-[#fcecf3]', icon: '🧾' },
        { name: 'Nabung', percent: 15, amount: '-IDR 100.000,00', color: 'bg-[#fef9c3]', icon: '🏦' },
        { name: 'Shopping', percent: 8, amount: '-IDR 53.235,00', color: 'bg-[#e0efff]', icon: '🛍️' },
        { name: 'Transport', percent: 4, amount: '-IDR 24.000,00', color: 'bg-[#fde8e8]', icon: '🚕' },
    ];

    const incomeCategories = [
        { name: 'for me', percent: 91, amount: '+IDR 1.600.000,00', color: 'bg-[#e0f8e9]', icon: '💰' },
        { name: 'Shopping', percent: 9, amount: '+IDR 151.100,00', color: 'bg-[#fcecf3]', icon: '🛍️' },
    ];

    const activeCategories = viewMode === 'expense' ? expenseCategories : incomeCategories;
    const activeTotal = viewMode === 'expense' ? summary.expenses : summary.incomes;
    const activeLabel = viewMode === 'expense' ? 'Total expenses' : 'Total incomes';

    return (
        <div className="relative overflow-hidden min-h-full pb-28 bg-white font-sans text-slate-800">
            <Head title="Insights - Paybae" />

            <div className="max-w-4xl mx-auto px-5 pt-8">
                {/* Header */}
                <h1 className="text-[22px] font-bold text-center mb-8">Insights</h1>

                {/* Date Selector */}
                <div className="flex items-center justify-between mb-8 relative z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={handlePrevMonth} className="w-10 h-10 rounded-full border border-slate-200/80 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors active:scale-95">
                            <FiChevronLeft className="w-5 h-5 text-slate-600" />
                        </button>
                        <span className="font-bold text-base w-8 text-center">{months[selectedMonthIndex]}</span>
                        <button onClick={handleNextMonth} className="w-10 h-10 rounded-full border border-slate-200/80 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors active:scale-95">
                            <FiChevronRight className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-100 hover:bg-slate-100 px-4 py-2 rounded-full transition-colors active:scale-95"
                        >
                            Month <FiChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isDropdownOpen && (
                            <>
                                {/* Overlay to close dropdown when clicking outside */}
                                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                                
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-sm border border-slate-200/80 z-20 py-2 grid grid-cols-3 gap-1 px-2 animate-fade-in-up">
                                    {months.map((month, idx) => (
                                        <button
                                            key={month}
                                            onClick={() => {
                                                setSelectedMonthIndex(idx);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`py-2 text-sm font-semibold rounded-xl transition-colors ${
                                                selectedMonthIndex === idx 
                                                ? 'bg-[#1b9a59] text-white' 
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="border border-slate-200/80 bg-white rounded-[20px] p-5">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
                            <FiTrendingUp className="w-5 h-5 text-slate-700" />
                        </div>
                        <p className="text-xs font-medium text-slate-500 mb-1">Total cashflow</p>
                        <p className="font-bold text-[#1b9a59] text-sm mb-1">{summary.cashflow}</p>
                        <p className="text-[11px] font-medium text-slate-400"><span className="text-[#1b9a59] font-bold">{summary.cashflowChange}</span> vs last month</p>
                    </div>
                    <div className="border border-slate-200/80 bg-white rounded-[20px] p-5">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
                            <FiDollarSign className="w-5 h-5 text-slate-700" />
                        </div>
                        <p className="text-xs font-medium text-slate-500 mb-1">Net balance</p>
                        <p className="font-bold text-[#1b9a59] text-sm">{summary.netBalance}</p>
                    </div>
                </div>

                {/* Income / Expense Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8 px-1">
                    <div>
                        <p className="text-[11px] text-slate-500 mb-0.5">Mar incomes</p>
                        <p className="font-bold text-[14px]">{summary.incomes}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] text-slate-500 mb-0.5">Mar expenses</p>
                        <p className="font-bold text-[14px]">{summary.expenses}</p>
                    </div>
                </div>

                {/* Daily Cash Flow */}
                <div className="mb-10 mt-6">
                    <h3 className="font-bold mb-6 text-[15px] px-1">Daily Cash Flow</h3>
                    <div className="relative h-44 border-l border-b border-slate-100 ml-10 pl-2 pb-2">
                        {/* Y-axis labels */}
                        <span className="absolute -left-9 top-0 text-[9px] font-medium text-slate-400">500K</span>
                        <span className="absolute -left-4 top-1/2 -translate-y-1/2 text-[9px] font-medium text-slate-400">0</span>
                        <span className="absolute -left-10 bottom-0 text-[9px] font-medium text-slate-400">-500K</span>
                        
                        {/* Grid lines */}
                        <div className="absolute left-0 right-0 top-0 border-t border-dashed border-slate-200"></div>
                        <div className="absolute left-0 right-0 top-1/2 border-t border-slate-100"></div>
                        
                        {/* X-axis ticks */}
                        <div className="absolute left-0 right-0 top-1/2 flex justify-between px-3">
                            {[1,2,3,4,5,6,7,8].map(i => (
                                <div key={i} className="w-0.5 h-1 bg-slate-300"></div>
                            ))}
                        </div>
                        
                        {/* Bars */}
                        <div className="absolute inset-0 flex justify-between items-end px-3 pt-4 pb-0 z-10 h-full">
                            {dailyData.map((d, i) => (
                                <div key={i} className="flex flex-col items-center justify-end h-full w-4 relative">
                                    {/* Income bar (top half) */}
                                    <div className="absolute bottom-1/2 flex flex-col items-center justify-end w-full h-1/2 pb-0">
                                        {d.value > 0 && (
                                            <div 
                                                className="w-full bg-[#34d399] rounded-t-[3px]" 
                                                style={{ height: `${(d.value / 1000) * 100}%` }}
                                            ></div>
                                        )}
                                    </div>
                                    {/* Expense bar (bottom half) */}
                                    <div className="absolute top-1/2 flex flex-col items-center justify-start w-full h-1/2 pt-0">
                                        {d.isExpense && (
                                            <div 
                                                className="w-full bg-[#ef4444] rounded-b-[3px]" 
                                                style={{ height: `${(d.expenseValue / 1000) * 100}%` }}
                                            ></div>
                                        )}
                                    </div>
                                    <span className="absolute -bottom-6 text-[9px] font-medium text-slate-400">{d.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 my-8"></div>

                {/* Spending by category */}
                <div>
                    <h3 className="font-bold mb-4 text-[15px] px-1">Spending by category</h3>
                    
                    {/* Segmented Control */}
                    <div className="flex bg-slate-50 p-1 rounded-xl mb-10 border border-slate-100">
                        <button 
                            onClick={() => setViewMode('income')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${viewMode === 'income' ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-slate-800 border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Income
                        </button>
                        <button 
                            onClick={() => setViewMode('expense')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${viewMode === 'expense' ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-slate-800 border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Expense
                        </button>
                    </div>

                    {/* Donut Chart */}
                    <div className="flex justify-center mb-10">
                        <div className="relative w-[200px] h-[200px]">
                            {/* SVG Donut implementation for accurate segmenting based on data */}
                            <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                                {viewMode === 'expense' ? (
                                    <>
                                        <circle cx="50" cy="50" r="35" fill="transparent" stroke="#e0f8e9" strokeWidth="20" strokeDasharray={`${47 * 2.2} 220`} />
                                        <circle cx="50" cy="50" r="35" fill="transparent" stroke="#fcecf3" strokeWidth="20" strokeDasharray={`${27 * 2.2} 220`} strokeDashoffset={`-${47 * 2.2}`} />
                                        <circle cx="50" cy="50" r="35" fill="transparent" stroke="#fef9c3" strokeWidth="20" strokeDasharray={`${15 * 2.2} 220`} strokeDashoffset={`-${(47 + 27) * 2.2}`} />
                                        <circle cx="50" cy="50" r="35" fill="transparent" stroke="#e0efff" strokeWidth="20" strokeDasharray={`${8 * 2.2} 220`} strokeDashoffset={`-${(47 + 27 + 15) * 2.2}`} />
                                        <circle cx="50" cy="50" r="35" fill="transparent" stroke="#fde8e8" strokeWidth="20" strokeDasharray={`${4 * 2.2} 220`} strokeDashoffset={`-${(47 + 27 + 15 + 8) * 2.2}`} />
                                    </>
                                ) : (
                                    <>
                                        <circle cx="50" cy="50" r="35" fill="transparent" stroke="#e0f8e9" strokeWidth="20" strokeDasharray={`${91 * 2.2} 220`} />
                                        <circle cx="50" cy="50" r="35" fill="transparent" stroke="#fcecf3" strokeWidth="20" strokeDasharray={`${9 * 2.2} 220`} strokeDashoffset={`-${91 * 2.2}`} />
                                    </>
                                )}
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                <span className="text-[9px] text-slate-500 mb-1">{activeLabel}</span>
                                <span className="font-bold text-[13px]">{activeTotal}</span>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mb-12 space-y-3 px-2">
                        {activeCategories.map((cat, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                                    <span className="text-[13px] font-medium text-slate-700">{cat.name}</span>
                                </div>
                                <span className="text-[13px] font-medium text-slate-500">{cat.percent}%</span>
                            </div>
                        ))}
                    </div>

                    {/* Category breakdown */}
                    <div>
                        <h3 className="font-bold mb-5 text-[15px] px-1">Category breakdown</h3>
                        <div className="space-y-3">
                            {activeCategories.map((cat, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-2xl transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-50/80 border border-slate-100 rounded-full flex items-center justify-center text-2xl group-hover:bg-white transition-colors">
                                            {cat.icon}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm mb-0.5 text-slate-800">{cat.name}</p>
                                            <p className="text-xs text-slate-500">{cat.name}</p>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-bold tracking-tight ${viewMode === 'income' ? 'text-[#1b9a59]' : 'text-slate-800'}`}>
                                        {cat.amount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Insight.layout = page => <DashboardLayout children={page} />;
