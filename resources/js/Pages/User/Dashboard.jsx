import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { 
    FiSend, 
    FiPlusSquare, 
    FiClock, 
    FiArrowRight, 
    FiEye,
    FiEyeOff,
    FiCoffee,
    FiZap,
    FiCopy,
    FiCheck
} from "react-icons/fi";
import { SiShopee } from "react-icons/si";
import { BsBank } from "react-icons/bs";
import ShowToggle from "../Component/ShowToggle";
import { AiFillRobot } from "react-icons/ai";
import DashboardLayout from "../Component/DashboardLayout";

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth?.user || { name: 'Ahmad' };
    const [copied, setCopied] = useState(false);

    const copyRekening = () => {
        const noRek = user.no_rekening || '';
        navigator.clipboard.writeText(noRek).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="relative overflow-hidden min-h-full">
            <Head title="Dashboard - Paybae" />

            {/* Background elements to match the soft green theme */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50 rounded-full blur-[100px] -z-10 -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-50/80 rounded-full blur-[80px] -z-10 translate-y-1/3 -translate-x-1/3"></div>
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 md:pt-10">
                {/* Header Section */}
                <div className="mb-6 animate-fade-in-up flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
                            Selamat Datang, {user.name} <span className="text-2xl">👋</span>
                        </h1>
                        <p className="text-slate-500 mt-1 text-sm sm:text-base font-medium">Kendalikan keuanganmu dengan mudah.</p>
                    </div>
                    {user.profile?.profile_picture ? (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0 hidden md:block">
                            <img 
                                src={`/storage/${user.profile.profile_picture}`} 
                                alt={user.name} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-100 flex items-center justify-center border-2 border-white shadow-md text-green-600 font-bold text-xl flex-shrink-0 hidden md:flex">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                    )}
                </div>

                {/* Main Card (Saldo) */}
                <ShowToggle>
                    {({ show, toggle }) => (
                        <div className="relative bg-gradient-to-br from-[#80c868] via-[#61a94a] to-[#4e8d3b] rounded-[24px] p-6 text-white shadow-2xl shadow-green-600/20 overflow-hidden mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                            <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-black/10 rounded-full blur-2xl"></div>
                            
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md shadow-sm border border-white/10">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                        </div>
                                        <span className="text-sm font-semibold text-white/90">Saldo Utama</span>
                                    </div>
                                    <button onClick={toggle} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-md border border-white/10 shadow-sm hover:scale-105">
                                        {show ? <FiEyeOff className="w-4 h-4 text-white" /> : <FiEye className="w-4 h-4 text-white" />}
                                    </button>
                                </div>
                                
                                <div className="mb-2">
                                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-sm">{ show ? "Rp. 20.500.000" : "Rp. ••••••••" }</h2>
                                </div>
                                
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-green-50 mb-8 font-medium mt-4">
                                    <button
                                        onClick={copyRekening}
                                        className="flex items-center gap-2 group cursor-pointer select-all active:scale-95 transition-transform"
                                        title="Klik untuk menyalin nomor rekening"
                                    >
                                        <span className="tracking-wider">{user.no_rekening} • Paybae</span>
                                        <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full transition-all duration-300 ${
                                            copied
                                                ? 'bg-white/30 text-white'
                                                : 'bg-white/10 text-white/70 group-hover:bg-white/20 group-hover:text-white'
                                        }`}>
                                            {copied
                                                ? <><FiCheck className="w-3 h-3" /> Tersalin!</>
                                                : <><FiCopy className="w-3 h-3" /> Salin</>
                                            }
                                        </span>
                                    </button>
                                </div>
                        
                        <div className="flex gap-3 sm:gap-4">
                            <Link
                                href={route('transfer.index')}
                                className="flex-1 bg-[#5b9e45] hover:bg-[#68ad51] border border-green-400/40 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <FiSend className="w-4 h-4" /> Transfer
                            </Link>
                            <Link
                                href={route('topup.index')}
                                className="flex-1 bg-[#f4fbf2] hover:bg-white text-[#52933e] py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <FiPlusSquare className="w-4 h-4" /> Top Up
                            </Link>
                            <Link
                                href={route('history.index')}
                                className="flex-1 bg-[#f4fbf2] hover:bg-white text-[#52933e] py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <FiClock className="w-4 h-4" /> Riwayat
                            </Link>
                        </div>
                    </div>
                </div>
                )}
                </ShowToggle>

                {/* Ringkasan Transaksi */}
                <div className="bg-white rounded-[20px] p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 text-lg">Ringkasan Transaksi</h3>
                        <a href="#" className="text-sm font-bold text-[#61a94a] hover:text-[#4e8d3b] flex items-center gap-1 transition-colors">
                            Lihat Semua <FiArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-[#f2fbf4] border border-green-100 rounded-[16px] p-3.5 sm:p-5 transition-transform hover:scale-[1.02] overflow-hidden">
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mb-1">Pemasukan</p>
                            <p className="text-base sm:text-xl md:text-2xl font-extrabold text-[#52933e] whitespace-nowrap tracking-tight truncate">+Rp7.500.000</p>
                        </div>
                        <div className="bg-[#fff8f6] border border-orange-50 rounded-[16px] p-3.5 sm:p-5 transition-transform hover:scale-[1.02] overflow-hidden">
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mb-1">Pengeluaran</p>
                            <p className="text-base sm:text-xl md:text-2xl font-extrabold text-[#d85c49] whitespace-nowrap tracking-tight truncate">-Rp3.200.000</p>
                        </div>
                    </div>
                {/* AI Prediksi & Rekomendasi */}
                <div className="my-6 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
                    {/* Card Header - Dark premium */}
                    <div className="relative bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-t-[20px] px-5 py-4 overflow-hidden">
                        {/* Subtle glow blobs */}
                        <div className="absolute -top-6 -right-6 w-28 h-28 bg-[#61a94a]/20 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-4 left-10 w-20 h-20 bg-violet-500/10 rounded-full blur-2xl"></div>

                        <div className="relative flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#61a94a] to-[#4e8d3b] flex items-center justify-center shadow-lg shadow-green-900/30">
                                <AiFillRobot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm leading-tight">AI Prediksi & Rekomendasi</h3>
                                <p className="text-slate-400 text-xs mt-0.5">Berdasarkan pola transaksimu bulan ini</p>
                            </div>
                        </div>
                    </div>

                    {/* Cards Container */}
                    <div className="bg-white rounded-b-[20px] border border-t-0 border-slate-100 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)] overflow-hidden divide-y divide-slate-50">

                        {/* Item 1 — Prediksi Pengeluaran */}
                        <div className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50/70 transition-colors">
                            <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-orange-400 uppercase tracking-wide mb-1">Prediksi Bulan Depan</p>
                                <p className="text-slate-800 font-bold text-base leading-tight">Rp 3.654.000</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                                        ↑ +14%
                                    </span>
                                    <span className="text-xs text-slate-400">dari pengeluaran bulan ini</span>
                                </div>
                            </div>
                        </div>

                        {/* Item 2 — Rekomendasi Hemat */}
                        <div className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50/70 transition-colors">
                            <div className="w-10 h-10 rounded-2xl bg-[#f2fbf4] border border-green-100 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-[#52933e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-[#52933e] uppercase tracking-wide mb-1">Rekomendasi Hemat</p>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    Pola belanja online naik <span className="font-bold text-slate-800">20%</span>. Kurangi 1x pesan antar/minggu
                                </p>
                                <div className="mt-2 flex items-center gap-2 bg-[#f2fbf4] px-3 py-1.5 rounded-lg border border-green-100 w-fit">
                                    <svg className="w-3.5 h-3.5 text-[#52933e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                    <span className="text-xs font-bold text-[#52933e]">Hemat ~Rp 180.000/bulan</span>
                                </div>
                            </div>
                        </div>

                        {/* Item 3 — Prediksi Tabungan */}
                        <div className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50/70 transition-colors">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-1">Prediksi Tabungan</p>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    Jika disiplin hemat, tabunganmu bisa naik dalam <span className="font-bold text-slate-800">3 bulan</span> ke depan
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full w-[23%] bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
                                    </div>
                                    <span className="text-xs font-bold text-blue-500">+23%</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                </div>

                {/* Bottom Section: Transaksi & Analisis */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    {/* Transaksi Terbaru */}
                    <div className="lg:col-span-2 bg-white rounded-[20px] p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 order-2 lg:order-1">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-bold text-slate-800 text-lg">Transaksi</h3>
                            <a href="#" className="text-sm font-bold text-[#61a94a] hover:text-[#4e8d3b] flex items-center gap-1 transition-colors">
                                Lihat Semua <FiArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            {/* Item 1 */}
                            <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-100/50 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[14px] bg-[#fff5eb] text-[#f08a38] flex items-center justify-center text-xl shadow-sm border border-orange-100/50 group-hover:scale-105 transition-transform">
                                        <SiShopee />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-base">Shopee</h4>
                                        <p className="text-xs text-slate-500 font-medium">Belanja Online</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-[#d85c49]">-Rp840.000</p>
                                </div>
                            </div>
                            
                            {/* Item 2 */}
                            <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-100/50 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[14px] bg-[#f2fbf4] text-[#52933e] flex items-center justify-center text-xl shadow-sm border border-green-100/50 group-hover:scale-105 transition-transform">
                                        <BsBank />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-base">Transfer Bank</h4>
                                        <p className="text-xs text-slate-500 font-medium">Bambang Indra</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-[#52933e]">+Rp2.500.000</p>
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-100/50 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[14px] bg-[#fffaf0] text-[#eab308] flex items-center justify-center text-xl shadow-sm border border-yellow-100/50 group-hover:scale-105 transition-transform">
                                        <FiZap className="fill-yellow-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-base">PLN</h4>
                                        <p className="text-xs text-slate-500 font-medium">Bayar Listrik</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-[#d85c49]">-Rp540.000</p>
                                </div>
                            </div>

                            {/* Item 4 */}
                            <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-100/50 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[14px] bg-[#f2fbf4] text-[#52933e] flex items-center justify-center text-xl shadow-sm border border-green-100/50 group-hover:scale-105 transition-transform">
                                        <FiCoffee />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">Makan & Minum</h4>
                                        <p className="text-xs text-slate-500 font-medium">KFC</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-800">Rp150.000</p>
                                </div>
                            </div>
                            
                            {/* Item 5 */}
                            <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-100/50 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[14px] bg-[#fffaf0] text-[#eab308] flex items-center justify-center text-xl shadow-sm border border-yellow-100/50 group-hover:scale-105 transition-transform">
                                        <FiZap className="fill-yellow-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-base">Transfer haskai</h4>
                                        <p className="text-xs text-slate-500 font-medium">23 Apr 2024</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-[#d85c49]">-Rp540.000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Analisis Pengeluaran */}
                    <div className="bg-white rounded-[20px] p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 flex flex-col relative overflow-hidden order-1 lg:order-2">
                        {/* Decorative background for the card */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#f2fbf4] rounded-full blur-3xl -z-10 opacity-70"></div>
                        
                        <div className="text-center mb-6 mt-1">
                            <h3 className="font-bold text-slate-800 text-lg mb-1">Analisis Pengeluaran</h3>
                            <p className="text-2xl font-extrabold text-[#52933e]">Rp8.250.000</p>
                        </div>
                        
                        {/* Pie Chart Representation */}
                        <div className="relative w-52 h-52 mx-auto mb-8 flex-shrink-0 group">
                            {/* Simple CSS Donut Chart */}
                            <div className="absolute inset-0 rounded-full shadow-md border-4 border-white/50 transition-transform duration-500 group-hover:scale-105" style={{
                                background: "conic-gradient(#5c9f45 0% 40%, #eab308 40% 55%, #6366f1 55% 70%, #d1d5db 70% 100%)"
                            }}></div>
                            
                            {/* Inner white circle for donut effect */}
                            <div className="absolute inset-[27%] bg-white rounded-full shadow-inner flex items-center justify-center">
                                <div className="text-center">
                                    <span className="block font-bold text-2xl text-slate-700 leading-none">40%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-auto">
                            <div className="flex items-center gap-3 mb-5 bg-[#fcfdfc] p-3 rounded-xl border border-slate-50">
                                <div className="w-3.5 h-3.5 rounded-full bg-[#5c9f45] shadow-sm"></div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-slate-800">Makan & Minum</h4>
                                    <p className="text-xs text-slate-500 font-medium">Rp3.350.000</p>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-2">
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    3 Mei 2024
                                </div>
                                <a href="#" className="text-xs font-bold text-[#61a94a] hover:text-[#4e8d3b] flex items-center gap-1">
                                    Lihat Detail <FiArrowRight className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

Dashboard.layout = page => <DashboardLayout children={page} />;