import React from "react";
import { Head, usePage } from "@inertiajs/react";
import { 
    FiSend, 
    FiPlusSquare, 
    FiClock, 
    FiArrowRight, 
    FiEye,
    FiEyeOff,
    FiCoffee,
    FiZap
} from "react-icons/fi";
import { SiShopee } from "react-icons/si";
import { BsBank } from "react-icons/bs";
import ShowToggle from "../Component/ShowToggle";

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth?.user || { name: 'Ahmad' };

    return (
        <div className="min-h-screen bg-[#fafaf9] font-sans pb-20 relative overflow-hidden">
            <Head title="Dashboard - Paybae" />

            {/* Background elements to match the soft green theme */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50 rounded-full blur-[100px] -z-10 -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-50/80 rounded-full blur-[80px] -z-10 translate-y-1/3 -translate-x-1/3"></div>
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
                {/* Header Section */}
                <div className="mb-6 animate-fade-in-up">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
                        Selamat Datang, {user.name} <span className="text-2xl">👋</span>
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm sm:text-base font-medium">Kendalikan keuanganmu dengan mudah.</p>
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
                                
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-green-50 mb-8 font-medium">
                                    <span>No. 1234 • Paybae</span>
                                    <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center shadow-sm">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                </div>
                        
                        <div className="flex gap-3 sm:gap-4">
                            <button className="flex-1 bg-[#5b9e45] hover:bg-[#68ad51] border border-green-400/40 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                <FiSend className="w-4 h-4" /> Transfer
                            </button>
                            <button className="flex-1 bg-[#f4fbf2] hover:bg-white text-[#52933e] py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                <FiPlusSquare className="w-4 h-4" /> Top Up
                            </button>
                            <button className="flex-1 bg-[#f4fbf2] hover:bg-white text-[#52933e] py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                <FiClock className="w-4 h-4" /> Riwayat
                            </button>
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
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#f2fbf4] border border-green-100 rounded-[16px] p-4 sm:p-5 transition-transform hover:scale-[1.02]">
                            <p className="text-sm text-slate-500 font-medium mb-1">Pemasukan</p>
                            <p className="text-xl sm:text-2xl font-extrabold text-[#52933e]">+Rp7.500.000</p>
                        </div>
                        <div className="bg-[#fff8f6] border border-orange-50 rounded-[16px] p-4 sm:p-5 transition-transform hover:scale-[1.02]">
                            <p className="text-sm text-slate-500 font-medium mb-1">Pengeluaran</p>
                            <p className="text-xl sm:text-2xl font-extrabold text-[#d85c49]">-Rp3.200.000</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Transaksi & Analisis */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    {/* Transaksi Terbaru */}
                    <div className="lg:col-span-2 bg-white rounded-[20px] p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60">
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
                                        <p className="text-xs text-slate-500 font-medium">Rp3.350.000</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-800">Rp3.350.000</p>
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
                    <div className="bg-white rounded-[20px] p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 flex flex-col relative overflow-hidden">
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