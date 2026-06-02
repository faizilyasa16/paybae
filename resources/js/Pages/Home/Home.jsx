import React, { useState, useEffect, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import { 
    FaPlay, 
    FaShieldAlt, 
    FaLock, 
    FaCheckCircle, 
    FaWallet, 
    FaPaperPlane, 
    FaHistory, 
    FaClipboardList, 
    FaUsers, 
    FaThLarge, 
    FaUserPlus, 
    FaExchangeAlt, 
    FaChartLine, 
    FaRegSmile, 
    FaBolt, 
    FaGift,
    FaArrowRight,
    FaInstagram,
    FaFacebook,
    FaTwitter,
    FaDollarSign,
    FaYoutube,
    FaQrcode,
    FaBrain
} from "react-icons/fa";
import Navbar from "../Component/Navigation";
import TentangKami from "./TentangKami.jsx";
import FAQ from "./FAQ.jsx";

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
            <Head title="Paybae - Atur Keuangan, Capai Tujuanmu" />
            <Navbar />

            {/* HERO SECTION */}
            <header className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-32">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-gradient-to-tr from-green-300/20 to-lime-300/20 dark:from-green-950/20 dark:to-lime-950/20 rounded-full blur-3xl -z-10" />
                <div className="absolute top-1/2 left-0 w-[30%] h-[50%] bg-gradient-to-tr from-lime-300/10 to-green-300/10 dark:from-lime-950/10 dark:to-green-950/10 rounded-full blur-3xl -z-10" />

                <div className="max-w-7xl mx-auto px-6 lg:px-20 w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
                    {/* Left Column: Text Content */}
                    <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-slate-800 dark:text-white leading-tight">
                            Atur Keuanganmu, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-lime-500 dark:from-green-400 dark:to-lime-400">
                                Capai Tujuanmu
                            </span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-xl leading-relaxed font-light">
                            Paybae membantumu mencapai keuangan yang sehat dengan prediksi AI dalam pola pengeluaran, analisis tabungan dan rekomendasi hemat
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto mb-10">
                            <Link 
                                href="/register"
                                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-green-600 to-lime-500 text-white font-semibold text-lg shadow-lg shadow-green-500/25 hover:scale-[1.02] hover:shadow-green-500/40 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Mulai Sekarang <FaArrowRight className="text-sm" />
                            </Link>
                            <a href="#cara-kerja" className="flex items-center gap-3 text-slate-700 dark:text-slate-200 hover:text-green-600 dark:hover:text-green-400 transition font-semibold">
                                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400">
                                    <FaPlay className="text-xs ml-[2px]" />
                                </span>
                                Lihat Cara Kerja
                            </a>
                        </div>
                        
                        {/* Stats / Social Proof */}
                        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 w-full flex flex-row items-center justify-center lg:justify-start gap-6 lg:gap-8 flex-wrap">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <FaShieldAlt className="text-green-600 dark:text-green-400" />
                                <span className="text-sm font-medium">Aman & Terpercaya</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <FaLock className="text-green-600 dark:text-green-400" />
                                <span className="text-sm font-medium">Data 100% Terlindungi</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <FaCheckCircle className="text-green-600 dark:text-green-400" />
                                <span className="text-sm font-medium">Gratis Digunakan</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <FaBrain className="text-green-600 dark:text-green-400" />
                                <span className="text-sm font-medium">Integrasi AI pintar</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Hero Mockup */}
                    <div className="flex-1 flex justify-center lg:justify-end relative w-full lg:w-auto">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-green-200 to-lime-100 dark:from-green-900/10 dark:to-lime-900/10 rounded-full blur-3xl opacity-60 -z-10" />
                        <img 
                            src="/img/hero-mockup.png" 
                            alt="Mockup Aplikasi Paybae" 
                            className="w-full max-w-[320px] lg:max-w-md xl:max-w-[420px] object-contain drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500" 
                        />
                    </div>
                </div>
            </header>

            {/* FITUR SECTION */}
            <section id="fitur" className="py-20 bg-white dark:bg-slate-900/50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 lg:px-20 text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">
                        Semua Fitur yang Kamu Butuhkan
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-16 font-light">
                        Paybae hadir dengan berbagai fitur untuk memudahkan pengelolaan keuanganmu.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-8 rounded-2xl hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 hover:-translate-y-1 group">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FaWallet className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-0">Saldo Digital</h3>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-8 rounded-2xl hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 hover:-translate-y-1 group">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FaPaperPlane className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-0">Transfer Uang</h3>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-8 rounded-2xl hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 hover:-translate-y-1 group">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FaHistory className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-0">Riwayat Transaksi</h3>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-8 rounded-2xl hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 hover:-translate-y-1 group">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FaClipboardList className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-0">AI Prediksi Pengeluaran & Tabungan</h3>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-8 rounded-2xl hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 hover:-translate-y-1 group">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FaUsers className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-0">Data Pelanggan</h3>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-8 rounded-2xl hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 hover:-translate-y-1 group">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FaThLarge className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-0">Rekomendasi Hemat</h3>
                        </div>

                        {/* Feature 7 */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-8 rounded-2xl hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 hover:-translate-y-1 group">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FaQrcode className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-0">QR Scan</h3>
                        </div>

                        {/* Feature 8 */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-8 rounded-2xl hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 hover:-translate-y-1 group">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <FaBrain className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-0">AI Pembaca Struk & Simulasi Prediksi Pengeluaran</h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* CARA KERJA SECTION */}
            <section id="cara-kerja" className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 lg:px-20 text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">
                        3 Langkah Mudah Menggunakan Paybae
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-16 font-light">
                        Mulai perjalanan keuanganmu bersama Paybae
                    </p>

                    <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-6">
                        {/* Horizontal connecting line (hidden on mobile) */}
                        <div className="hidden md:block absolute top-[54px] left-[15%] right-[15%] h-[2px] bg-slate-200 dark:bg-slate-800 -z-0" />

                        {/* Step 1 */}
                        <div className="flex-1 flex flex-col items-center relative z-10 max-w-xs">
                            <div className="w-12 h-12 rounded-full bg-green-600 text-white font-extrabold flex items-center justify-center mb-4 border-4 border-slate-50 dark:border-slate-900 shadow-md">
                                1
                            </div>
                            <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-6 shadow-sm hover:scale-105 transition-transform">
                                <FaUserPlus className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Daftar Akun</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-light text-center leading-relaxed">
                                Buat akun Paybae kamu dengan mudah dan cepat.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex-1 flex flex-col items-center relative z-10 max-w-xs">
                            <div className="w-12 h-12 rounded-full bg-green-600 text-white font-extrabold flex items-center justify-center mb-4 border-4 border-slate-50 dark:border-slate-900 shadow-md">
                                2
                            </div>
                            <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-6 shadow-sm hover:scale-105 transition-transform">
                                <FaExchangeAlt className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Mulai Bertransaksi</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-light text-center leading-relaxed">
                                Manfaatkan fitur transaksi untuk kemudahan mu
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex-1 flex flex-col items-center relative z-10 max-w-xs">
                            <div className="w-12 h-12 rounded-full bg-green-600 text-white font-extrabold flex items-center justify-center mb-4 border-4 border-slate-50 dark:border-slate-900 shadow-md">
                                3
                            </div>
                            <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-6 shadow-sm hover:scale-105 transition-transform">
                                <FaChartLine className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Pantau & Capai Tujuan</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-light text-center leading-relaxed">
                                Pantau keuntungan mu dengan AI Prediksi & Rekomendasi Hemat
                            </p>
                        </div>
                    </div>
                </div>
            </section>



            {/* AI SMART INSIGHT SECTION */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-16">
                    {/* Left side: Premium Vector Illustration of AI Robot with Chart */}
                    <div className="flex-1 flex justify-center relative w-full lg:w-auto">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-tr from-green-200 to-lime-100 dark:from-green-900/10 dark:to-lime-900/10 rounded-full blur-3xl opacity-60 -z-10" />
                        <svg className="w-full max-w-[340px] lg:max-w-md h-auto" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Cute robot body */}
                            <rect x="180" y="240" width="140" height="130" rx="30" fill="url(#robotBodyGlow)" stroke="#059669" strokeWidth="6" />
                            {/* Robot head */}
                            <rect x="190" y="140" width="120" height="90" rx="45" fill="#f8fafc" stroke="#059669" strokeWidth="6" />
                            <rect x="205" y="155" width="90" height="60" rx="30" fill="#1e293b" />
                            {/* Robot eyes (Glowing green) */}
                            <circle cx="230" cy="185" r="10" fill="#10b981" />
                            <circle cx="270" cy="185" r="10" fill="#10b981" />
                            {/* Robot ears */}
                            <circle cx="185" cy="185" r="8" fill="#059669" />
                            <circle cx="315" cy="185" r="8" fill="#059669" />
                            {/* Robot antenna */}
                            <line x1="250" y1="140" x2="250" y2="105" stroke="#059669" strokeWidth="6" />
                            <circle cx="250" cy="95" r="12" fill="#10b981" className="animate-pulse" />
                            {/* Robot arms */}
                            <path d="M145 280 C145 280, 160 280, 180 270" stroke="#059669" strokeWidth="6" strokeLinecap="round" />
                            <path d="M320 270 C340 280, 365 295, 380 295" stroke="#059669" strokeWidth="6" strokeLinecap="round" />
                            {/* Cute heart light on center of chest */}
                            <path d="M250 320 C250 320, 240 310, 240 300 C240 292, 246 288, 250 293 C254 288, 260 292, 260 300 C260 310, 250 320, 250 320 Z" fill="#10b981" />

                            {/* Chart Card held by Robot */}
                            <g transform="translate(230, 260)">
                                <rect x="0" y="0" width="220" height="150" rx="20" fill="white" filter="url(#cardShadow)" />
                                <rect x="0" y="0" width="220" height="150" rx="20" fill="white" stroke="#e2e8f0" strokeWidth="2" />
                                {/* Chart grid lines */}
                                <line x1="20" y1="120" x2="200" y2="120" stroke="#f1f5f9" strokeWidth="2" />
                                <line x1="20" y1="90" x2="200" y2="90" stroke="#f1f5f9" strokeWidth="2" />
                                <line x1="20" y1="60" x2="200" y2="60" stroke="#f1f5f9" strokeWidth="2" />
                                {/* Upward chart line */}
                                <path d="M20 115 L60 95 L100 105 L140 75 L180 50 L200 35" fill="none" stroke="#10b981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                                {/* Dot on top */}
                                <circle cx="200" cy="35" r="7" fill="#059669" />
                                {/* Mini chart bars */}
                                <rect x="30" y="120" width="12" height="-15" rx="2" fill="#34d399" />
                                <rect x="70" y="120" width="12" height="-35" rx="2" fill="#34d399" />
                                <rect x="110" y="120" width="12" height="-25" rx="2" fill="#34d399" />
                                <rect x="150" y="120" width="12" height="-60" rx="2" fill="#10b981" />
                            </g>

                            {/* Definitions */}
                            <defs>
                                <linearGradient id="robotBodyGlow" x1="180" y1="240" x2="320" y2="370" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#ffffff" />
                                    <stop offset="1" stopColor="#f1f5f9" />
                                </linearGradient>
                                <filter id="cardShadow" x="-10" y="-10" width="245" height="175" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                    <feDropShadow dx="2" dy="8" stdDeviation="8" floodColor="#0f172a" floodOpacity="0.08" />
                                </filter>
                            </defs>
                        </svg>
                    </div>

                    {/* Right side: AI Info */}
                    <div className="flex-1 flex flex-col items-start">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-xs sm:text-sm font-semibold mb-6 border border-green-200/50 dark:border-green-800/30">
                            AI Smart Insight
                        </div>
                        
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-6">
                            Wawasan Cerdas untuk Keuangan Lebih Baik
                        </h2>
                        
                        <p className="text-slate-600 dark:text-slate-300 mb-8 font-light leading-relaxed">
                            Paybae menggunakan AI untuk menganalisis kebiasaan keuanganmu dan memberikan insight terbaik.
                        </p>

                        <div className="space-y-6 w-full">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 text-sm">âœ“</span>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">Prediksi Pengeluaran</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-light">Ketahui estimasi pengeluaran dalam 7 hari.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 text-sm">âœ“</span>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">Prediksi Tabungan</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-light">Lihat potensi tabungan dalam 7 hari dan 30 hari berdasarkan kebiasaan mu.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 text-sm">âœ“</span>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">Rekomendasi Hemat</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-light">Dapatkan tips dan rekomendasi pengeluaran hemat.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BAGAIMANA AI PAYBAE BEKERJA - NEW DETAILED SECTION */}
            <AiWorkflowSection />

            {/* DOWNLOAD APP BANNER */}
            <section className="py-12 bg-white dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-20">
                    <div className="bg-gradient-to-r from-green-600 to-lime-600 rounded-3xl p-8 sm:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl shadow-green-500/10">
                        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl -z-0" />
                        
                        <div className="relative z-10 flex-1 text-center lg:text-left">
                            <h2 className="text-3xl font-extrabold mb-4">Siap Mengatur Keuanganmu?</h2>
                            <p className="text-green-50 font-light max-w-xl">
                                Bergabung sekarang dan rasakan kemudahan mengelola keuangan bersama Paybae.
                            </p>
                        </div>
                        
                        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
                            <Link 
                                href="/register" 
                                className="w-full sm:w-auto px-8 py-4 bg-white text-green-700 font-bold rounded-full hover:bg-slate-50 transition shadow-md flex items-center justify-center gap-2"
                            >
                                Mulai Sekarang <FaArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section id="faq" className="pt-20">
                <FAQ />
            </section>

            {/* KENAPA HARUS PAYBAE */}
            <section className="py-20 bg-white dark:bg-slate-900/50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 lg:px-20">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-16 text-center">
                        Kenapa Harus Paybae?
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Benefit 1 */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 shrink-0 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center">
                                <FaShieldAlt className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-850 dark:text-white mb-2">Aman & Terpercaya</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-light leading-relaxed">
                                    Data kamu dilindungi dengan teknologi keamanan terbaik.
                                </p>
                            </div>
                        </div>

                        {/* Benefit 2 */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 shrink-0 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center">
                                <FaRegSmile className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-850 dark:text-white mb-2">Mudah Digunakan</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-light leading-relaxed">
                                    Desain sederhana dan intuitif untuk semua orang.
                                </p>
                            </div>
                        </div>

                        {/* Benefit 3 */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 shrink-0 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center">
                                <FaBolt className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-850 dark:text-white mb-2">Cepat & Efisien</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-light leading-relaxed">
                                    Semua transaksi dilakukan dengan cepat dan praktis.
                                </p>
                            </div>
                        </div>

                        {/* Benefit 4 */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 shrink-0 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center">
                                <FaGift className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-850 dark:text-white mb-2">Gratis Digunakan</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-light leading-relaxed">
                                    Nikmati semua fitur Paybae secara gratis.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Embedded Sections */}
            <section id="tentang-kami" className="pt-20">
                <TentangKami />
            </section>

            {/* FOOTER */}
            <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 lg:px-20 pt-16 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                        {/* Column Brand */}
                        <div className="lg:col-span-2">
                            <img src="/img/paybae.png" alt="Logo Paybae" className="h-9 w-auto mb-6" />
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-light leading-relaxed max-w-sm mb-6">
                                Atur keuanganmu, capai tujuanmu bersama Paybae.
                            </p>
                            <div className="flex items-center gap-4 text-slate-400">
                                <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition"><FaInstagram className="w-5 h-5" /></a>
                                <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition"><FaFacebook className="w-5 h-5" /></a>
                                <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition"><FaTwitter className="w-5 h-5" /></a>
                                <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition"><FaYoutube className="w-5 h-5" /></a>
                            </div>
                        </div>

                        {/* Column 2: Produk */}
                        <div>
                            <h4 className="font-bold text-slate-850 dark:text-white mb-6">Produk</h4>
                            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-light">
                                <li><a href="#fitur" className="hover:text-green-600 dark:hover:text-green-400 transition">Fitur</a></li>
                                <li><a href="#cara-kerja" className="hover:text-green-600 dark:hover:text-green-400 transition">Cara Kerja</a></li>
                                <li><Link href="/faq" className="hover:text-green-600 dark:hover:text-green-400 transition">FAQ</Link></li>
                            </ul>
                        </div>

                        {/* Column 3: Perusahaan */}
                        <div>
                            <h4 className="font-bold text-slate-850 dark:text-white mb-6">Perusahaan</h4>
                            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-light">
                                <li><Link href="/tentang-kami" className="hover:text-green-600 dark:hover:text-green-400 transition">Tentang Kami</Link></li>
                            </ul>
                        </div>

                        {/* Column 4: Bantuan */}
                        <div>
                            <h4 className="font-bold text-slate-850 dark:text-white mb-6">Bantuan</h4>
                            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-light">
                                <li><a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition">Pusat Bantuan</a></li>
                                <li><Link href="/privacy" className="hover:text-green-600 dark:hover:text-green-400 transition">Kebijakan Privasi</Link></li>
                                <li><a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition">Syarat & Ketentuan</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500">
                        <p>Â© 2026 Paybae. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

/* ========================================
   AI WORKFLOW SECTION COMPONENT
   ======================================== */
function AiWorkflowSection() {
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [counters, setCounters] = useState({ accuracy: 0, users: 0, savings: 0 });

    // Intersection Observer for scroll-triggered animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Auto-cycle active step
    useEffect(() => {
        if (!isVisible) return;
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, [isVisible]);

    // Animated counters
    useEffect(() => {
        if (!isVisible) return;
        const targets = { accuracy: 95, users: 10, savings: 30 };
        const duration = 2000;
        const steps = 60;
        let current = { accuracy: 0, users: 0, savings: 0 };
        let step = 0;
        const interval = setInterval(() => {
            step++;
            const progress = Math.min(step / steps, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCounters({
                accuracy: Math.round(targets.accuracy * ease),
                users: Math.round(targets.users * ease * 10) / 10,
                savings: Math.round(targets.savings * ease),
            });
            if (step >= steps) clearInterval(interval);
        }, duration / steps);
        return () => clearInterval(interval);
    }, [isVisible]);

    const pipelineSteps = [
        {
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                    <rect x="4" y="6" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
                    <path d="M4 12h24" stroke="currentColor" strokeWidth="2" />
                    <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                    <circle cx="14" cy="9" r="1.5" fill="currentColor" />
                    <path d="M10 17h12M10 21h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            ),
            title: "Pengumpulan Data",
            desc: "AI mengumpulkan data transaksi, pemasukan, dan pengeluaranmu secara otomatis dan aman.",
            detail: "Setiap transaksi dianalisis secara real-time",
        },
        {
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" />
                    <path d="M16 8v8l5.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="16" cy="16" r="3" fill="currentColor" />
                    <path d="M8 5l2 3M24 5l-2 3M5 12l3 1M27 12l-3 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            ),
            title: "Analisis AI Cerdas",
            desc: "Deep Learning memproses pola keuanganmu untuk menemukan insight yang tidak terlihat.",
            detail: "Algoritma prediktif dengan akurasi tinggi",
        },
        {
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                    <path d="M6 22l7-7 5 5 8-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="26" cy="10" r="3" fill="currentColor" />
                    <path d="M4 28h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            ),
            title: "Rekomendasi Pintar",
            desc: "Dapatkan prediksi pengeluaran, potensi tabungan, dan tips hemat yang personal.",
            detail: "Saran yang disesuaikan dengan profilmu",
        },
    ];

    return (
        <section
            ref={sectionRef}
            id="ai-workflow"
            className="py-24 bg-gradient-to-b from-white via-green-50/30 to-white dark:from-slate-900/50 dark:via-lime-950/10 dark:to-slate-900/50 transition-colors duration-300 overflow-hidden relative"
        >
            {/* Decorative background elements */}
            <div className="absolute top-20 left-0 w-72 h-72 bg-green-200/20 dark:bg-green-900/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-20 right-0 w-96 h-96 bg-lime-200/20 dark:bg-lime-900/10 rounded-full blur-3xl -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-green-100/10 to-lime-100/10 dark:from-green-950/5 dark:to-lime-950/5 rounded-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-20">
                {/* Section Header */}
                <div
                    className={`text-center mb-20 transition-all duration-1000 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-green-50 to-lime-50 dark:from-green-950/40 dark:to-lime-950/40 text-green-700 dark:text-green-400 text-sm font-semibold mb-6 border border-green-200/50 dark:border-green-800/30 shadow-sm">
                        <FaBrain className="w-4 h-4" />
                        Teknologi AI Terdepan
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white mb-5">
                        Bagaimana{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-lime-500 dark:from-green-400 dark:to-lime-400">
                            AI Paybae
                        </span>{" "}
                        Bekerja?
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light text-lg leading-relaxed">
                        Tiga langkah cerdas yang mengubah data transaksimu menjadi wawasan keuangan yang actionable.
                    </p>
                </div>

                {/* Pipeline Steps */}
                <div className="relative mb-20">
                    {/* Connecting line (desktop) */}
                    <div className="hidden lg:block absolute top-[72px] left-[16%] right-[16%] h-[3px] bg-gradient-to-r from-green-200 via-lime-300 to-green-200 dark:from-green-900/40 dark:via-lime-700/40 dark:to-green-900/40 rounded-full -z-0" />
                    {/* Animated pulse on line */}
                    <div
                        className={`hidden lg:block absolute top-[70px] h-[7px] w-20 bg-gradient-to-r from-transparent via-green-400 to-transparent dark:via-green-500 rounded-full -z-0 transition-all duration-1000 ${
                            isVisible ? "opacity-100" : "opacity-0"
                        }`}
                        style={{
                            left: `${16 + activeStep * 34}%`,
                            transition: "left 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s",
                        }}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
                        {pipelineSteps.map((step, idx) => (
                            <div
                                key={idx}
                                className={`relative flex flex-col items-center text-center transition-all duration-700 ${
                                    isVisible
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-12"
                                }`}
                                style={{ transitionDelay: `${idx * 200 + 200}ms` }}
                            >
                                {/* Step number circle */}
                                <div
                                    className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                                        activeStep === idx
                                            ? "bg-gradient-to-br from-green-500 to-lime-600 text-white shadow-lg shadow-green-500/30 scale-110"
                                            : "bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 border-2 border-green-200 dark:border-green-800/50 shadow-sm"
                                    }`}
                                >
                                    {step.icon}
                                    {/* Pulse ring when active */}
                                    {activeStep === idx && (
                                        <span className="absolute inset-0 rounded-2xl border-2 border-green-400/50 animate-ping" />
                                    )}
                                </div>

                                {/* Card */}
                                <div
                                    className={`w-full p-6 rounded-2xl transition-all duration-500 ${
                                        activeStep === idx
                                            ? "bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-xl shadow-green-500/10 border border-green-200/60 dark:border-green-700/30 -translate-y-1"
                                            : "bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:shadow-green-500/5"
                                    }`}
                                >
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <span
                                            className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${
                                                activeStep === idx
                                                    ? "bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400"
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                                            }`}
                                        >
                                            Step {idx + 1}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-light leading-relaxed mb-3">
                                        {step.desc}
                                    </p>
                                    <p
                                        className={`text-xs font-medium transition-all duration-500 ${
                                            activeStep === idx
                                                ? "text-green-600 dark:text-green-400 opacity-100"
                                                : "text-slate-400 dark:text-slate-500 opacity-60"
                                        }`}
                                    >
                                        âš¡ {step.detail}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Stats & Live Demo Panel */}
                <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-1000 delay-500 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                    }`}
                >
                    {/* Left: Live Demo Simulation */}
                    <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-700/30 p-8 shadow-xl shadow-green-500/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-green-100/40 to-transparent dark:from-green-900/20 rounded-full blur-2xl -z-0" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                                    AI Sedang Menganalisis
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                                Simulasi Prediksi AI
                            </h3>

                            {/* Mini chart visualization */}
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 mb-6 border border-slate-100 dark:border-slate-800">
                                <div className="flex items-end justify-between gap-2 h-32 mb-4">
                                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                        <div
                                            key={i}
                                            className={`flex-1 rounded-t-lg transition-all duration-1000 ${
                                                isVisible ? "" : ""
                                            } ${
                                                i === 6
                                                    ? "bg-gradient-to-t from-green-500 to-lime-400 shadow-sm shadow-green-500/20"
                                                    : i >= 5
                                                    ? "bg-green-300 dark:bg-green-700/50"
                                                    : "bg-slate-200 dark:bg-slate-700"
                                            }`}
                                            style={{
                                                height: isVisible ? `${h}%` : "0%",
                                                transitionDelay: `${i * 100 + 800}ms`,
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
                                    <span>Sen</span>
                                    <span>Sel</span>
                                    <span>Rab</span>
                                    <span>Kam</span>
                                    <span>Jum</span>
                                    <span className="text-green-600 dark:text-green-400 font-semibold">Sab</span>
                                    <span className="text-green-600 dark:text-green-400 font-semibold">Min*</span>
                                </div>
                            </div>

                            {/* Prediction result */}
                            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200/50 dark:border-green-800/30">
                                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
                                    <FaBrain className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                                        Prediksi: Pengeluaran akan turun 12%
                                    </p>
                                    <p className="text-xs text-green-600/70 dark:text-green-400/70">
                                        Berdasarkan pola 30 hari terakhir
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: AI Stats */}
                    <div className="flex flex-col gap-6">
                        {/* Stat Card 1 */}
                        <div className="flex-1 bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/30 p-6 shadow-lg shadow-green-500/5 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-0.5">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Akurasi Prediksi
                                </h4>
                                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 rounded-full font-semibold">
                                    Tinggi
                                </span>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-extrabold text-slate-800 dark:text-white">
                                    {counters.accuracy}%
                                </span>
                            </div>
                            <div className="mt-3 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-lime-400 rounded-full transition-all duration-2000"
                                    style={{ width: isVisible ? `${counters.accuracy}%` : "0%" }}
                                />
                            </div>
                        </div>

                        {/* Stat Card 2 */}
                        <div className="flex-1 bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/30 p-6 shadow-lg shadow-green-500/5 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-0.5">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Pengguna Terbantu
                                </h4>
                                <span className="text-xs px-2 py-1 bg-lime-100 dark:bg-lime-950/50 text-lime-700 dark:text-lime-400 rounded-full font-semibold">
                                    Aktif
                                </span>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-extrabold text-slate-800 dark:text-white">
                                    {counters.users}K+
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                                Pengguna mendapat insight AI setiap hari
                            </p>
                        </div>

                        {/* Stat Card 3 */}
                        <div className="flex-1 bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/30 p-6 shadow-lg shadow-green-500/5 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-0.5">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Rata-rata Hemat
                                </h4>
                                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 rounded-full font-semibold">
                                    â†‘ Meningkat
                                </span>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-lime-500 dark:from-green-400 dark:to-lime-400">
                                    {counters.savings}%
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                                Penghematan per bulan dengan rekomendasi AI
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
