import React, { useState } from 'react';
import DashboardLayout from "../Component/DashboardLayout";
import { Head } from "@inertiajs/react";
import { FiSearch, FiZap, FiCoffee, FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { SiShopee } from "react-icons/si";
import { BsBank } from "react-icons/bs";

// Data dummy untuk contoh transaksi
const allTransactions = [
    { id: 1, title: 'Shopee', desc: 'Belanja Online', amount: -840000, type: 'Pengeluaran', date: 'Hari Ini, 14:30', icon: SiShopee, color: 'text-[#f08a38]', bg: 'bg-[#fff5eb]', border: 'border-orange-100/50' },
    { id: 2, title: 'Transfer Bank', desc: 'Bambang Indra', amount: 2500000, type: 'Pemasukan', date: 'Kemarin, 09:15', icon: BsBank, color: 'text-[#52933e]', bg: 'bg-[#f2fbf4]', border: 'border-green-100/50' },
    { id: 3, title: 'PLN', desc: 'Bayar Listrik', amount: -540000, type: 'Pengeluaran', date: '28 Apr 2024', icon: FiZap, color: 'text-[#eab308]', bg: 'bg-[#fffaf0]', border: 'border-yellow-100/50' },
    { id: 4, title: 'Makan & Minum', desc: 'KFC', amount: -150000, type: 'Pengeluaran', date: '27 Apr 2024', icon: FiCoffee, color: 'text-[#52933e]', bg: 'bg-[#f2fbf4]', border: 'border-green-100/50' },
    { id: 5, title: 'Transfer Masuk', desc: 'Gaji Bulanan', amount: 8500000, type: 'Pemasukan', date: '25 Apr 2024', icon: FiArrowDownLeft, color: 'text-[#52933e]', bg: 'bg-[#f2fbf4]', border: 'border-green-100/50' },
    { id: 6, title: 'Transfer Keluar', desc: 'Haskai', amount: -540000, type: 'Pengeluaran', date: '23 Apr 2024', icon: FiArrowUpRight, color: 'text-[#d85c49]', bg: 'bg-[#fff8f6]', border: 'border-red-100/50' },
];

export default function Riwayat() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('Semua'); // Pilihan: Semua, Pemasukan, Pengeluaran

    // Filter akan langsung bereaksi secara otomatis setiap kali variabel search atau filter berubah
    const filteredTransactions = allTransactions.filter(trx => {
        const matchSearch = trx.title.toLowerCase().includes(search.toLowerCase()) || trx.desc.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'Semua' ? true : trx.type === filter;
        return matchSearch && matchFilter;
    });

    // Format mata uang Rupiah
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    return (
        <div className="pt-6 md:pt-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20">
            <Head title="Riwayat Transaksi - Paybae" />
            
            <div className="mb-8 animate-fade-in-up">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">Riwayat Transaksi</h1>
                <p className="text-slate-500 text-sm sm:text-base font-medium">Pantau semua aktivitas keuanganmu di sini.</p>
            </div>

            {/* Bagian Search & Filter (Sticky agar tetap terlihat saat di-scroll) */}
            <div className="bg-white rounded-[20px] p-4 sm:p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 mb-6 sticky top-4 z-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Input Pencarian Otomatis */}
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiSearch className="text-slate-400 w-5 h-5" />
                        </div>
                        <input 
                            type="text" 
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 rounded-xl text-sm font-medium text-slate-700 transition-all placeholder-slate-400 outline-none"
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
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List Transaksi */}
            <div className="bg-white rounded-[20px] p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 min-h-[400px] animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="flex flex-col gap-3">
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((trx) => (
                            <div key={trx.id} className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-100/50 group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-[14px] ${trx.bg} ${trx.color} flex items-center justify-center text-xl shadow-sm border ${trx.border} group-hover:scale-105 transition-transform flex-shrink-0`}>
                                        <trx.icon />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-base">{trx.title}</h4>
                                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                                            <span className="truncate max-w-[90px] sm:max-w-none">{trx.desc}</span>
                                            <span className="text-slate-300 font-bold flex-shrink-0">&bull;</span>
                                            <span className="whitespace-nowrap">{trx.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className={`font-bold ${trx.amount > 0 ? 'text-[#52933e]' : 'text-slate-800'}`}>
                                        {trx.amount > 0 ? '+' : ''}{formatRupiah(trx.amount).replace(',00', '')}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <FiSearch className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700">Transaksi tidak ditemukan</h3>
                            <p className="text-sm text-slate-500 mt-1">Coba gunakan kata kunci lain untuk mencari.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

Riwayat.layout = page => <DashboardLayout children={page} />;