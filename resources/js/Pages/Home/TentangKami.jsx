import React from "react";
import { Head, Link } from "@inertiajs/react";
import { FaEye, FaRocket, FaShieldAlt, FaRobot, FaSync, FaArrowLeft } from "react-icons/fa";
import Navbar from "../Component/Navigation";

export default function TentangKami() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
            <Head title="Tentang Kami - PAYBAE" />
            <Navbar />

            {/* Ambient background glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-green-300/20 to-lime-300/20 dark:from-green-950/20 dark:to-lime-950/20 rounded-full blur-3xl -z-10 animate-pulse duration-[8s]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-lime-300/10 to-green-300/20 dark:from-lime-950/10 dark:to-green-950/20 rounded-full blur-3xl -z-10 animate-pulse duration-[10s]" />

            <div className="max-w-5xl mx-auto pt-36 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Back to Home Button */}
                <div className="mb-8">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                    >
                        <FaArrowLeft className="w-3 h-3" /> Kembali ke Beranda
                    </Link>
                </div>

                {/* Hero Section */}
                <div className="mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-xs sm:text-sm font-semibold mb-6 border border-green-200/50 dark:border-green-800/30 shadow-sm animate-fade-in-up">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Tentang PAYBAE
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 leading-tight mb-8">
                        Lebih dari Sekadar Dompet Digital. <br className="hidden sm:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-lime-500 to-green-600 dark:from-green-400 dark:via-lime-400 dark:to-green-500">
                            Kami adalah Sahabat Finansialmu.
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl font-light">
                        Berawal dari keresahan melihat banyaknya masyarakat yang kesulitan melacak pengeluaran mereka, kami hadir memadukan kemudahan transaksi dengan kecerdasan buatan untuk masa depan keuangan yang lebih baik.
                    </p>
                </div>

                {/* Vision & Mission Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {/* Vision Card */}
                    <div className="bg-white/85 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-8 sm:p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-green-500 to-lime-500"></div>
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <FaEye className="w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Visi</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                            Menciptakan masyarakat yang melek finansial dan bebas dari jebakan perilaku konsumtif.
                        </p>
                    </div>

                    {/* Mission Card */}
                    <div className="bg-white/85 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-8 sm:p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-lime-500 to-green-500"></div>
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-lime-50 dark:bg-lime-950/50 text-lime-600 dark:text-lime-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <FaRocket className="w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Misi</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                            Menyediakan layanan smart e-wallet yang aman, cepat dan transparan, menghadirkan AI yang proaktif serta mengubah pencatatan keuangan menjadi otomatis.
                        </p>
                    </div>
                </div>

                {/* Pillars Section */}
                <div className="bg-gradient-to-br from-green-600 to-lime-700 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl shadow-green-500/20 mb-20">
                    <div className="absolute right-0 bottom-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -z-10 translate-x-1/3 translate-y-1/3"></div>
                    <div className="absolute left-0 top-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl -z-10 -translate-x-1/3 -translate-y-1/3"></div>
                    
                    <div className="relative z-10">
                        <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">Membangun Masa Depan Finansial yang Lebih Cerdik</h3>
                        <p className="text-green-100 text-lg mb-10 max-w-2xl font-light">
                            Kami mengintegrasikan teknologi terdepan untuk menghadirkan pengalaman kelola uang yang belum pernah ada sebelumnya.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/15 transition-all duration-300">
                                <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                                    <FaShieldAlt className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="font-bold text-lg mb-2">Aman & Transparan</h4>
                                <p className="text-green-100 text-sm font-light leading-relaxed">Setiap transaksi dienkripsi penuh dan dilindungi verifikasi PIN untuk keamanan mutlak.</p>
                            </div>
                            
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/15 transition-all duration-300">
                                <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                                    <FaRobot className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="font-bold text-lg mb-2">AI Proaktif</h4>
                                <p className="text-green-100 text-sm font-light leading-relaxed">Teknologi LSTM mendeteksi perilaku boros dan memberi rekomendasi hemat secara real-time.</p>
                            </div>
                            
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/15 transition-all duration-300">
                                <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                                    <FaSync className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="font-bold text-lg mb-2">Otomatisasi Penuh</h4>
                                <p className="text-green-100 text-sm font-light leading-relaxed">Lupakan pencatatan manual. Semua pengeluaran dan pemasukan terekam otomatis.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action Section */}
                <div className="text-center max-w-xl mx-auto">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Siap untuk memulai langkah finansial barumu?</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 font-light">Gabung bersama ribuan pengguna lainnya yang telah berhasil mengontrol keuangan mereka bersama PAYBAE.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link 
                            href="/register" 
                            className="px-8 py-3.5 bg-gradient-to-r from-green-600 to-lime-500 hover:from-green-700 hover:to-lime-600 text-white font-semibold rounded-full shadow-lg shadow-green-500/25 hover:scale-[1.02] transition-all duration-200"
                        >
                            Daftar Sekarang
                        </Link>
                        <Link 
                            href="/" 
                            className="px-8 py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
