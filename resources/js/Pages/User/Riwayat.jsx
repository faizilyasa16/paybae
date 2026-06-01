import React, { useState } from 'react';
import DashboardLayout from "../Component/DashboardLayout";
import { Head, usePage } from "@inertiajs/react";
import { FiSearch, FiArrowDownLeft, FiArrowUpRight, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { BsBank } from "react-icons/bs";

const formatRupiah = (angka) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

// Map status ke style badge
const statusStyle = {
    PAID:    { badge: 'bg-green-100 text-green-700', dot: 'bg-green-500', label: 'Berhasil' },
    PENDING: { badge: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400', label: 'Menunggu' },
    FAILED:  { badge: 'bg-red-100 text-red-600', dot: 'bg-red-500', label: 'Gagal' },
    COMPLETED: { badge: 'bg-green-100 text-green-700', dot: 'bg-green-500', label: 'Berhasil' },
};

export default function Riwayat() {
    const { transactions = [], total_pemasukan = 0, total_pengeluaran = 0 } = usePage().props;
    
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('Semua'); // Pilihan: Semua, Pemasukan, Pengeluaran

    // Filter akan langsung bereaksi secara otomatis setiap kali variabel search atau filter berubah
    const filteredTransactions = transactions.filter(trx => {
        const matchSearch = trx.title.toLowerCase().includes(search.toLowerCase()) || trx.desc.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'Semua' ? true : trx.type === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div className="pt-6 md:pt-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20">
            <Head title="Riwayat Transaksi - Paybae" />
            
            <div className="mb-6 animate-fade-in-up">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white mb-2">Riwayat Transaksi</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium">Pantau semua aktivitas keuanganmu di sini.</p>
            </div>

            {/* Ringkasan Pemasukan & Pengeluaran */}
            <div className="grid grid-cols-2 gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                <div className="bg-[#f2fbf4] border border-green-100 rounded-[16px] p-4 transition-transform hover:scale-[1.02]">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <FiTrendingUp className="w-4 h-4 text-[#52933e]" />
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pemasukan</span>
                    </div>
                    <p className="text-lg sm:text-xl font-extrabold text-[#52933e] tracking-tight truncate">
                        +{formatRupiah(total_pemasukan)}
                    </p>
                </div>
                <div className="bg-[#fff8f6] border border-orange-50 rounded-[16px] p-4 transition-transform hover:scale-[1.02]">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                            <FiTrendingDown className="w-4 h-4 text-[#d85c49]" />
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pengeluaran</span>
                    </div>
                    <p className="text-lg sm:text-xl font-extrabold text-[#d85c49] tracking-tight truncate">
                        -{formatRupiah(total_pengeluaran)}
                    </p>
                </div>
            </div>

            {/* Bagian Search & Filter (Sticky agar tetap terlihat saat di-scroll) */}
            <div className="bg-white dark:bg-slate-900 rounded-[20px] p-4 sm:p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 dark:border-slate-800/60 mb-6 sticky top-4 z-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="flex flex-col gap-4">
                    {/* Input Pencarian Otomatis */}
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiSearch className="text-slate-400 w-5 h-5" />
                        </div>
                        <input 
                            type="text" 
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 transition-all placeholder-slate-400 outline-none"
                            placeholder="Cari transaksi atau nama..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)} // Ini yang membuat live search tanpa enter
                        />
                    </div>
                    
                    {/* Tombol Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar w-full">
                        {['Semua', 'Pemasukan', 'Pengeluaran'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                                    filter === f 
                                    ? 'bg-[#52933e] text-white shadow-md shadow-green-600/20' 
                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List Transaksi */}
            <div className="bg-white dark:bg-slate-900 rounded-[20px] p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 dark:border-slate-800/60 min-h-[400px] animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="flex flex-col gap-3">
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((trx) => {
                            const isIncome = trx.type === 'Pemasukan';
                            const s = statusStyle[trx.status] || statusStyle['PENDING'];
                            
                            return (
                                <div
                                    key={trx.id + '-' + trx.source}
                                    className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-100/50 dark:border-slate-800/50 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center text-lg shadow-sm dark:shadow-none border group-hover:scale-105 transition-transform flex-shrink-0 ${
                                            isIncome 
                                                ? 'bg-[#f2fbf4] text-[#52933e] border-green-100/50' 
                                                : 'bg-[#fff8f6] text-[#d85c49] border-red-100/50'
                                        }`}>
                                            {isIncome 
                                                ? <FiArrowDownLeft className="w-5 h-5" /> 
                                                : <FiArrowUpRight className="w-5 h-5" />
                                            }
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate">{trx.title}</h4>
                                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                                <span className="truncate max-w-[100px] sm:max-w-none">{trx.desc}</span>
                                                <span className="text-slate-300 font-bold flex-shrink-0">&bull;</span>
                                                <span className="whitespace-nowrap">{trx.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-2">
                                        <p className={`font-bold text-sm ${isIncome ? 'text-[#52933e]' : 'text-[#d85c49]'}`}>
                                            {isIncome ? '+' : ''}{formatRupiah(trx.amount)}
                                        </p>
                                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.badge}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                            {s.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <FiSearch className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                                {transactions.length === 0 ? 'Belum ada transaksi' : 'Transaksi tidak ditemukan'}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                {transactions.length === 0 
                                    ? 'Aktivitas transaksi akan muncul di sini.' 
                                    : 'Coba gunakan kata kunci lain untuk mencari.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

Riwayat.layout = page => <DashboardLayout children={page} />;