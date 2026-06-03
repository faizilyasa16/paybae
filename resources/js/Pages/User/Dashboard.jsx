import React, { useState, useEffect } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import {
    FiSend,
    FiPlusSquare,
    FiClock,
    FiArrowRight,
    FiEye,
    FiEyeOff,
    FiArrowDownLeft,
    FiArrowUpRight,
    FiCopy,
    FiCheck,
} from "react-icons/fi";
import { BsBank } from "react-icons/bs";
import ShowToggle from "../Component/ShowToggle";
import { AiFillRobot } from "react-icons/ai";
import DashboardLayout from "../Component/DashboardLayout";
import TimeMachineModal from "../Component/TimeMachineModal";

const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(angka);

export default function Dashboard() {
    const { auth, balance, recent_transactions = [], total_pemasukan = 0, total_pengeluaran = 0 } = usePage().props;
    const user = auth?.user || { name: "Ahmad" };
    const [copied, setCopied] = useState(false);
    
    const [aiData, setAiData] = useState(null);
    const [aiLoading, setAiLoading] = useState(true);
    const [isTimeMachineOpen, setIsTimeMachineOpen] = useState(false);
    const [donutHover, setDonutHover] = useState(null); // { name, amount, percent, color }

    // Hitung kategori chart dari data nyata
    const totalFlow = total_pemasukan + total_pengeluaran + Math.max(balance, 0);
    const chartCategories = totalFlow > 0 ? [
        { name: 'Pemasukan', amount: total_pemasukan, percent: Math.round((total_pemasukan / totalFlow) * 100), color: '#5c9f45' },
        { name: 'Pengeluaran', amount: total_pengeluaran, percent: Math.round((total_pengeluaran / totalFlow) * 100), color: '#ef4444' },
        { name: 'Sisa Saldo', amount: Math.max(balance, 0), percent: Math.round((Math.max(balance, 0) / totalFlow) * 100), color: '#6366f1' },
    ].filter(c => c.amount > 0) : [
        { name: 'Belum ada data', amount: 0, percent: 100, color: '#d1d5db' },
    ];

    // Normalisasi persen agar total = 100
    const totalPercent = chartCategories.reduce((sum, c) => sum + c.percent, 0);
    if (totalPercent > 0 && totalPercent !== 100) {
        chartCategories[chartCategories.length - 1].percent += (100 - totalPercent);
    }

    // Build conic-gradient string secara dinamis
    const conicGradient = (() => {
        let cumPct = 0;
        const stops = chartCategories.map((cat) => {
            const start = cumPct;
            cumPct += cat.percent;
            return `${cat.color} ${start}% ${cumPct}%`;
        });
        return `conic-gradient(${stops.join(', ')})`;
    })();

    // Cari kategori terbesar untuk tampilan default di tengah donut
    const largestCat = chartCategories.reduce((a, b) => a.amount >= b.amount ? a : b, chartCategories[0]);

    useEffect(() => {
        fetch('/api/recommend')
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setAiData(data);
                }
                setAiLoading(false);
            })
            .catch(err => {
                console.error(err);
                setAiLoading(false);
            });
    }, []);

    // Default balance to 0 if not provided
    const userBalance = balance ?? 0;

    const copyRekening = () => {
        const noRek = user.no_rekening || "";
        navigator.clipboard.writeText(noRek).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const getCleanAdvice = (actionName, rawAdvice) => {
        if (aiLoading) return "Memuat rekomendasi AI...";
        if (!rawAdvice) return "Tidak ada rekomendasi.";
        
        let cleaned = rawAdvice.replace(/^\[(?:Deep Learning|XGBoost|Random Forest)\] Pola pengeluaran Anda:\s*[a-zA-Z\s]+\s*\([^)]*\)\.\s*/i, '');
        
        return cleaned;
    };

    const getSavingsPerDay = () => {
        if (!aiData) return 0;
        const avgExpenseDaily = (aiData.predicted_expense || 0) / 7;
        const factorMap = { 0: 0.0, 1: 0.0, 2: 0.20, 3: 0.10, 4: 0.05 };
        const factor = factorMap[aiData.action_id] ?? 0.0;
        return avgExpenseDaily * factor;
    };

    const getStatusName = () => {
        if (aiLoading) return "Menganalisis...";
        if (!aiData || !aiData.advice) return "Tidak Diketahui";
        
        const match = aiData.advice.match(/Pola pengeluaran Anda:\s*([a-zA-Z\s]+)\s*\(/i);
        if (match && match[1]) {
            return match[1].trim();
        }
        
        // Fallback
        const fallbackMap = {
            0: "Sangat Hemat",
            1: "Hemat",
            2: "Normal",
            3: "Boros",
            4: "Sangat Boros"
        };
        return fallbackMap[aiData.action_id] || "Tidak Diketahui";
    };

    return (
        <div className="relative overflow-hidden min-h-full">
            <Head title="Dashboard - Paybae" />

            {/* Background elements to match the soft green theme */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50 dark:bg-green-900/20 rounded-full blur-[100px] -z-10 -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-50 dark:bg-green-900/20/80 rounded-full blur-[80px] -z-10 translate-y-1/3 -translate-x-1/3"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 md:pt-10">
                {/* Header Section */}
                <div className="mb-6 animate-fade-in-up flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                            Selamat Datang, {user.name}{" "}
                            <span className="text-2xl">👋</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base font-medium">
                            Kendalikan keuanganmu dengan mudah.
                        </p>
                    </div>
                    {user.profile?.profile_picture ? (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-md flex-shrink-0 hidden md:block">
                            <img
                                src={`/storage/${user.profile.profile_picture}`}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-100 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-md text-green-600 font-bold text-xl flex-shrink-0 hidden md:flex">
                            {user.name
                                ? user.name.charAt(0).toUpperCase()
                                : "A"}
                        </div>
                    )}
                </div>

                {/* Main Card (Saldo) */}
                <ShowToggle>
                    {({ show, toggle }) => (
                        <div
                            className="relative bg-gradient-to-br from-[#80c868] via-[#61a94a] to-[#4e8d3b] rounded-[24px] p-6 text-white shadow-2xl shadow-green-600/20 overflow-hidden mb-6 animate-fade-in-up"
                            style={{ animationDelay: "100ms" }}
                        >
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 dark:bg-slate-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                            <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-black/10 rounded-full blur-2xl"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-white/20 dark:bg-slate-900/20 rounded-lg backdrop-blur-md shadow-sm dark:shadow-none border border-white/10 dark:border-slate-800/10">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2.5"
                                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                                ></path>
                                            </svg>
                                        </div>
                                        <span className="text-sm font-semibold text-white/90">
                                            Saldo Utama
                                        </span>
                                    </div>
                                    <button
                                        onClick={toggle}
                                        className="p-2 bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:hover:bg-slate-900/20 rounded-full transition-all backdrop-blur-md border border-white/10 dark:border-slate-800/10 shadow-sm dark:shadow-none hover:scale-105"
                                    >
                                        {show ? (
                                            <FiEyeOff className="w-4 h-4 text-white" />
                                        ) : (
                                            <FiEye className="w-4 h-4 text-white" />
                                        )}
                                    </button>
                                </div>

                                <div className="mb-2">
                                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-sm dark:shadow-none">
                                        {show
                                            ? new Intl.NumberFormat("id-ID", {
                                                  style: "currency",
                                                  currency: "IDR",
                                                  minimumFractionDigits: 0,
                                              }).format(userBalance)
                                            : "Rp. ••••••••"}
                                    </h2>
                                </div>

                                <div className="flex items-center gap-2 text-xs sm:text-sm text-green-50 mb-8 font-medium mt-4">
                                    <button
                                        onClick={copyRekening}
                                        className="flex items-center gap-2 group cursor-pointer select-all active:scale-95 transition-transform"
                                        title="Klik untuk menyalin nomor rekening"
                                    >
                                        <span className="tracking-wider">
                                            {user.no_rekening} • Paybae
                                        </span>
                                        <span
                                            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full transition-all duration-300 ${
                                                copied
                                                    ? "bg-white/30 dark:bg-slate-900/30 text-white"
                                                    : "bg-white/10 dark:bg-slate-900/10 text-white/70 group-hover:bg-white/20 dark:group-hover:bg-slate-900/20 group-hover:text-white"
                                            }`}
                                        >
                                            {copied ? (
                                                <>
                                                    <FiCheck className="w-3 h-3" />{" "}
                                                    Tersalin!
                                                </>
                                            ) : (
                                                <>
                                                    <FiCopy className="w-3 h-3" />{" "}
                                                    Salin
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </div>

                                <div className="flex gap-3 sm:gap-4">
                                    <Link
                                        href="/transfer"
                                        className="flex-1 bg-[#5b9e45] hover:bg-[#68ad51] border border-green-400/40 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        <FiSend className="w-4 h-4" /> Transfer
                                    </Link>
                                    <Link
                                        href="/topup"
                                        className="flex-1 bg-[#f4fbf2] hover:bg-white dark:hover:bg-slate-900 text-[#52933e] py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        <FiPlusSquare className="w-4 h-4" /> Top
                                        Up
                                    </Link>
                                    <Link
                                        href="/history"
                                        className="flex-1 bg-[#f4fbf2] hover:bg-white dark:hover:bg-slate-900 text-[#52933e] py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        <FiClock className="w-4 h-4" /> Riwayat
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </ShowToggle>

                {/* Ringkasan Transaksi */}
                <div
                    className="bg-white dark:bg-slate-900 rounded-[20px] p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 dark:border-slate-800/60 mb-6 animate-fade-in-up"
                    style={{ animationDelay: "200ms" }}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                            Ringkasan Transaksi
                        </h3>
                        <Link
                            href="/history"
                            className="text-sm font-bold text-[#61a94a] hover:text-[#4e8d3b] flex items-center gap-1 transition-colors"
                        >
                            Lihat Semua <FiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-[#f2fbf4] dark:bg-green-950/30 border border-green-100 dark:border-green-900/40 rounded-[16px] p-3.5 sm:p-5 transition-transform hover:scale-[1.02] overflow-hidden">
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">
                                Pemasukan
                            </p>
                            <p className="text-sm sm:text-xl md:text-2xl font-extrabold text-[#52933e] whitespace-nowrap tracking-tight truncate">
                                +{formatRupiah(total_pemasukan)}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1 font-medium">Sebulan terakhir</p>
                        </div>
                        <div className="bg-[#fff8f6] dark:bg-red-950/30 border border-orange-50 dark:border-red-900/40 rounded-[16px] p-3.5 sm:p-5 transition-transform hover:scale-[1.02] overflow-hidden">
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">
                                Pengeluaran
                            </p>
                            <p className="text-sm sm:text-xl md:text-2xl font-extrabold text-[#d85c49] whitespace-nowrap tracking-tight truncate">
                                -{formatRupiah(total_pengeluaran)}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1 font-medium">Sebulan terakhir</p>
                        </div>
                    </div>
                    {/* AI Prediksi & Rekomendasi - Dark premium card */}
                    <div className="my-6 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
                        {/* Card Header - Dark premium */}
                        <div className="relative bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-t-[24px] px-5 py-4 overflow-hidden">
                            {/* Subtle glow blobs */}
                            <div className="absolute -top-6 -right-6 w-28 h-28 bg-[#61a94a]/20 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-4 left-10 w-20 h-20 bg-violet-500/10 rounded-full blur-2xl"></div>

                            <div className="relative flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#61a94a] to-[#4e8d3b] flex items-center justify-center shadow-lg shadow-green-900/30">
                                    <AiFillRobot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm leading-tight">AI Prediksi & Rekomendasi</h3>
                                    <p className="text-slate-400 text-xs mt-0.5">Berdasarkan pola transaksi bulan ini</p>
                                </div>
                            </div>
                        </div>

                        {/* Cards Container */}
                        <div className="bg-white dark:bg-slate-900 rounded-b-[24px] border border-t-0 border-slate-100 dark:border-slate-800 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)] overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80">
                            {/* Item 1 — Prediksi Pengeluaran */}
                            <div className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                                <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-wider mb-1">STATUS PENGELUARAN KEDEPAN</p>
                                    <p className="text-slate-800 dark:text-white font-bold text-base sm:text-lg leading-tight uppercase">
                                        {getStatusName()}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">Prediksi Pengeluaran 7 hari : {formatRupiah(aiLoading ? 0 : (aiData?.predicted_expense || 0))}</p>
                                </div>
                            </div>

                            {/* Item 2 — Rekomendasi Hemat */}
                            <div className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                                <div className="w-10 h-10 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900/50 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-black text-green-600 uppercase tracking-wider mb-1">REKOMENDASI HEMAT</p>
                                    <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
                                        {getCleanAdvice(aiData?.action_name, aiData?.advice)}
                                    </p>
                                    <div className="mt-2 flex items-center gap-1.5 bg-[#f2fbf4] dark:bg-green-950/30 px-3 py-1 rounded-full border border-green-100 dark:border-green-900/50 w-fit">
                                        <FiCheck className="w-3.5 h-3.5 text-[#52933e]" />
                                        <span className="text-xs font-bold text-[#52933e]">
                                            {getSavingsPerDay() > 0 ? `Hemat ${formatRupiah(getSavingsPerDay())}/hari` : 'Pengeluaran Sudah Ideal'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Item 3 — Prediksi Tabungan */}
                            <div className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                                        <polyline points="2 17 12 22 22 17"/>
                                        <polyline points="2 12 12 17 22 12"/>
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-wider mb-1">PREDIKSI TABUNGAN KEDEPAN</p>
                                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-1">
                                        Jika mengikuti rekomendasi, potensi hemat kamu yang akan datang adalah :
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                        <div className="flex flex-col bg-blue-50/50 dark:bg-blue-950/20 rounded-xl p-3 border border-blue-100/50 dark:border-blue-900/30">
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">7 Hari</span>
                                            <span className="text-lg sm:text-xl font-bold text-blue-500 dark:text-blue-400 leading-none truncate">+{formatRupiah(aiLoading ? 0 : (aiData?.predicted_savings?.for_7_days || 0))}</span>
                                        </div>
                                        <div className="flex flex-col bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl p-3 border border-indigo-100/50 dark:border-indigo-900/30">
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">30 Hari</span>
                                            <span className="text-lg sm:text-xl font-bold text-indigo-500 dark:text-indigo-400 leading-none truncate">+{formatRupiah(aiLoading ? 0 : (aiData?.predicted_savings?.for_30_days || 0))}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interactive AI Modules Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Card: Ur Bae Tips */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[24px] p-5 shadow-sm relative overflow-hidden flex items-center gap-4 transition-all duration-300 hover:scale-[1.02]">
                            <div className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 bg-slate-50 dark:bg-slate-800/40 p-1">
                                <img 
                                    src="/img/ur-bae-icon.png"
                                    alt="Ur Bae Agent" 
                                    className="w-full h-full object-contain drop-shadow-sm rounded-xl dark:brightness-110" 
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div style={{ display: 'none' }} className="w-full h-full items-center justify-center text-green-500 font-bold text-xl">
                                    🧠
                                </div>
                            </div>
                            <div className="flex-1 min-w-0 relative">
                                <div className="flex justify-between items-start mb-0.5">
                                    <span className="text-[10px] font-black text-[#61a94a] uppercase tracking-wider">
                                        Ur Bae Tips
                                    </span>
                                    <Link
                                        href="/ur-bae"
                                        className="text-xs font-bold text-[#61a94a] hover:text-[#4e8d3b] flex items-center gap-0.5 transition-colors absolute right-0 top-0"
                                    >
                                        Mulai <FiArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                                <h4 className="font-extrabold text-slate-800 dark:text-white text-base mb-1 pr-14">
                                    Aturan 24 Jam
                                </h4>
                                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-xl pr-2">
                                    Tahan checkout barang keinginan di Shopee. Tunggu 24 jam untuk melatih emosi belanja Anda.
                                </p>
                            </div>
                        </div>

                        {/* Card: AI Financial Time Machine */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[24px] p-5 shadow-sm relative overflow-hidden flex items-center gap-4 transition-all duration-300 hover:scale-[1.02]">
                            <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 flex items-center justify-center flex-shrink-0">
                                <FiClock className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1 min-w-0 relative">
                                <div className="flex justify-between items-start mb-0.5">
                                    <span className="text-[10px] font-black text-[#52933e] uppercase tracking-wider">
                                        Time Machine
                                    </span>
                                    <button
                                        onClick={() => setIsTimeMachineOpen(true)}
                                        className="text-xs font-bold text-[#61a94a] hover:text-[#4e8d3b] flex items-center gap-0.5 transition-colors absolute right-0 top-0"
                                    >
                                        Mulai <FiArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <h4 className="font-extrabold text-slate-800 dark:text-white text-base mb-1 pr-14">
                                    Simulasi "What If?"
                                </h4>
                                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-xl pr-2">
                                    Cek dampak pengeluaran hari ini terhadap masa depan keuanganmu sebelum membelinya.
                                </p>
                            </div>
                        </div>
                    </div>

                    <TimeMachineModal
                        isOpen={isTimeMachineOpen}
                        onClose={() => setIsTimeMachineOpen(false)}
                        balance={userBalance}
                        totalIncome={total_pemasukan}
                        totalExpense={total_pengeluaran}
                    />
                </div>

                {/* Bottom Section: Transaksi & Analisis */}
                <div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up"
                    style={{ animationDelay: "300ms" }}
                >
                    {/* Transaksi Terbaru */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[20px] p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 dark:border-slate-800/60 order-2 lg:order-1">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                                Transaksi Terbaru
                            </h3>
                            <Link
                                href="/history"
                                className="text-sm font-bold text-[#61a94a] hover:text-[#4e8d3b] flex items-center gap-1 transition-colors"
                            >
                                Lihat Semua <FiArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="flex flex-col gap-3">
                            {recent_transactions.length > 0 ? (
                                recent_transactions.map((trx) => {
                                    const isIncome = trx.type === 'Pemasukan';
                                    return (
                                        <div key={trx.id} className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-100/50 dark:border-slate-800/50 group">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center text-xl shadow-sm dark:shadow-none border group-hover:scale-105 transition-transform ${
                                                    isIncome 
                                                        ? 'bg-[#f2fbf4] text-[#52933e] border-green-100/50' 
                                                        : 'bg-[#fff8f6] text-[#d85c49] border-red-100/50'
                                                }`}>
                                                    {isIncome 
                                                        ? <FiArrowDownLeft className="w-5 h-5" /> 
                                                        : <FiArrowUpRight className="w-5 h-5" />
                                                    }
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 dark:text-white text-base">
                                                        {trx.title}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                        {trx.desc} &bull; {trx.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-bold ${isIncome ? 'text-[#52933e]' : 'text-[#d85c49]'}`}>
                                                    {isIncome ? '+' : ''}{formatRupiah(trx.amount)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                                        <FiClock className="w-7 h-7 text-slate-300" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Belum ada transaksi</p>
                                    <p className="text-xs text-slate-400 mt-1">Transaksi terbaru sebulan terakhir akan muncul di sini.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Analisis Keuangan */}
                    <div className="bg-white dark:bg-slate-900 rounded-[20px] p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 dark:border-slate-800/60 flex flex-col relative overflow-hidden order-1 lg:order-2">
                        {/* Decorative background for the card */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#f2fbf4] dark:bg-green-950/20 rounded-full blur-3xl -z-10 opacity-70"></div>

                        <div className="text-center mb-6 mt-1">
                            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">
                                Analisis Keuangan
                            </h3>
                            <p className="text-2xl font-extrabold text-[#52933e]">
                                {formatRupiah(total_pemasukan + total_pengeluaran)}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total arus kas bulan ini</p>
                        </div>

                        {/* Pie Chart Representation */}
                        <div className="relative w-52 h-52 mx-auto mb-8 flex-shrink-0">
                            {/* Dynamic CSS Donut Chart */}
                            <div
                                className="absolute inset-0 rounded-full shadow-md border-4 border-white/50 dark:border-slate-800/50"
                                style={{ background: conicGradient }}
                            ></div>

                            {/* SVG overlay for hover detection */}
                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90" onMouseLeave={() => setDonutHover(null)}>
                                {(() => {
                                    let cumPercent = 0;
                                    return chartCategories.map((cat, i) => {
                                        const offset = cumPercent;
                                        cumPercent += cat.percent;
                                        return (
                                            <circle
                                                key={i}
                                                cx="50" cy="50" r="37"
                                                fill="transparent"
                                                stroke="transparent"
                                                strokeWidth="26"
                                                strokeDasharray={`${cat.percent * 2.32} 232`}
                                                strokeDashoffset={`-${offset * 2.32}`}
                                                className="cursor-pointer"
                                                onMouseEnter={() => setDonutHover(cat)}
                                                onMouseLeave={() => setDonutHover(null)}
                                            />
                                        );
                                    });
                                })()}
                            </svg>

                            {/* Inner white circle for donut effect */}
                            <div className="absolute inset-[27%] bg-white dark:bg-slate-900 rounded-full shadow-inner flex items-center justify-center pointer-events-none">
                                <div className="text-center">
                                    {donutHover ? (
                                        <>
                                            <span className="block text-[10px] text-slate-500 dark:text-slate-400 leading-tight mb-0.5">{donutHover.name}</span>
                                            <span className="block font-bold text-sm text-slate-800 dark:text-white leading-tight">{formatRupiah(donutHover.amount)}</span>
                                            <span className="block font-bold text-xs leading-tight mt-0.5" style={{ color: donutHover.color }}>{donutHover.percent}%</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="block text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">{largestCat.name}</span>
                                            <span className="block font-bold text-2xl text-slate-700 dark:text-slate-200 leading-none">{largestCat.percent}%</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto">
                            {/* Dynamic Legend */}
                            <div className="space-y-2 mb-5">
                                {chartCategories.map((cat, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-[#fcfdfc] dark:bg-slate-800/50 p-2.5 sm:p-3 rounded-xl border border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors cursor-default"
                                        onMouseEnter={() => setDonutHover(cat)}
                                        onMouseLeave={() => setDonutHover(null)}
                                    >
                                        <div className="w-3.5 h-3.5 rounded-full shadow-sm dark:shadow-none flex-shrink-0" style={{ backgroundColor: cat.color }}></div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm text-slate-800 dark:text-white">{cat.name}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{formatRupiah(cat.amount)}</p>
                                        </div>
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{cat.percent}%</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                <a href="/insight" className="text-xs font-bold text-[#61a94a] hover:text-[#4e8d3b] flex items-center gap-1">
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

Dashboard.layout = (page) => <DashboardLayout children={page} />;
