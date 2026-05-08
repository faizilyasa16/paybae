import React, { useState } from 'react';
import DashboardLayout from "../Component/DashboardLayout";
import { Head, usePage } from "@inertiajs/react";
import { FiSearch, FiArrowDownLeft } from "react-icons/fi";
import { BsBank } from "react-icons/bs";
import TransactionItem from "../Component/TransactionItem";

export default function Riwayat() {
    const { transactions = [] } = usePage().props;
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('Semua'); // Pilihan: Semua, Pemasukan, Pengeluaran

    const allTransactions = transactions.map((trx) => {
        const amount = Number(trx.amount);
        const isIncome = amount >= 0;
        const title = trx.type === 'topup' ? 'Top Up Saldo' : 'Transaksi';
        const desc = trx.description || (trx.type === 'topup' ? 'Top up saldo akun' : 'Aktivitas transaksi');
        const date = new Date(trx.created_at).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        return {
            id: trx.id,
            title,
            desc,
            amount,
            type: isIncome ? 'Pemasukan' : 'Pengeluaran',
            date,
            status: trx.status,
            payment_method: trx.payment_method,
            icon: trx.type === 'topup' ? BsBank : FiArrowDownLeft,
            color: isIncome ? 'text-[#52933e]' : 'text-[#d85c49]',
            bg: isIncome ? 'bg-[#f2fbf4]' : 'bg-[#fff8f6]',
            border: isIncome ? 'border-green-100/50' : 'border-red-100/50',
        };
    });

    // Filter akan langsung bereaksi secara otomatis setiap kali variabel search atau filter berubah
    const filteredTransactions = allTransactions.filter(trx => {
        const matchSearch = trx.title.toLowerCase().includes(search.toLowerCase()) || trx.desc.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'Semua' ? true : trx.type === filter;
        return matchSearch && matchFilter;
    });

    // Format mata uang Rupiah (sudah ada di dalam komponen TransactionItem)

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
                            <TransactionItem 
                                key={trx.id}
                                icon={trx.icon}
                                title={trx.title}
                                desc={trx.desc}
                                date={trx.date}
                                amount={trx.amount}
                                type={trx.type}
                                color={trx.color}
                                bg={trx.bg}
                                border={trx.border}
                            />
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