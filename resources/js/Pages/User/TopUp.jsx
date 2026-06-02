import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    FiPlusSquare,
    FiCopy,
    FiCheck,
    FiClock,
    FiArrowLeft,
    FiInfo,
    FiRefreshCw,
} from "react-icons/fi";
import { BsBank } from "react-icons/bs";
import DashboardLayout from "../Component/DashboardLayout";
import PrimaryButton from "../Component/PrimaryButton";

const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(angka);

const BANKS = [
    {
        code: "BCA",
        label: "BCA",
        color: "text-blue-600",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-200",
    },
    {
        code: "BNI",
        label: "BNI",
        color: "text-orange-600",
        bg: "bg-orange-50 dark:bg-orange-900/20",
        border: "border-orange-200",
    },
    {
        code: "BRI",
        label: "BRI",
        color: "text-blue-700",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-200",
    },
    {
        code: "MANDIRI",
        label: "Mandiri",
        color: "text-yellow-700",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
    },
    {
        code: "PERMATA",
        label: "Permata",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
    },
    {
        code: "CIMB",
        label: "CIMB",
        color: "text-red-700",
        bg: "bg-red-50",
        border: "border-red-200",
    },
];

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000, 1000000, 2000000];

const statusStyle = {
    PAID:      { badge: "bg-green-100 text-green-700", dot: "bg-green-500", label: "Berhasil" },
    PENDING:   { badge: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-400", label: "Menunggu" },
    FAILED:    { badge: "bg-red-100 text-red-600", dot: "bg-red-500", label: "Gagal" },
    COMPLETED: { badge: "bg-green-100 text-green-700", dot: "bg-green-500", label: "Berhasil" },
};

export default function TopUp() {
    const { auth, balance, recent_topups = [] } = usePage().props;
    const user = auth?.user || { name: "Ahmad" };
    const userBalance = balance ?? 0;

    const INCOME_CATEGORIES = [
        { code: "Gaji", label: "Gaji", icon: "💼" },
        { code: "Investasi", label: "Investasi", icon: "📈" },
        { code: "Uang Saku", label: "Uang Saku", icon: "💵" },
        { code: "Lainnya", label: "Lainnya", icon: "💰" },
    ];

    const [selectedBank, setSelectedBank] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Lainnya");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showVA, setShowVA] = useState(false);
    const [copied, setCopied] = useState(false);
    const [vaNumber, setVaNumber] = useState("");

    const validate = () => {
        const e = {};
        if (!selectedBank) e.bank = "Pilih bank terlebih dahulu.";
        if (!category) e.category = "Pilih kategori pemasukan.";
        const num = parseInt(amount, 10);
        if (!amount || isNaN(num)) e.amount = "Masukkan nominal top up.";
        else if (num < 10000) e.amount = "Minimal top up Rp 10.000.";
        else if (num > 50000000) e.amount = "Maksimal top up Rp 50.000.000.";
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const e2 = validate();
        if (Object.keys(e2).length) {
            setErrors(e2);
            return;
        }
        setErrors({});
        setLoading(true);
        
        try {
            const response = await window.axios.post("/topup", {
                bank_code: selectedBank,
                amount: amount,
                category: category,
            }, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.data.success) {
                setVaNumber(response.data.topup.virtual_account_number);
                setLoading(false);
                setShowVA(true);
            }
        } catch (error) {
            setLoading(false);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert("Terjadi kesalahan sistem atau dari server Xendit. Mohon coba lagi.");
            }
        }
    };

    const [isSimulating, setIsSimulating] = useState(false);

    const handleCopyVA = () => {
        navigator.clipboard.writeText(vaNumber).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleSimulatePayment = async () => {
        setIsSimulating(true);
        try {
            const response = await window.axios.post('/topup/simulate', {
                bank_code: selectedBank,
                va_number: vaNumber,
                amount: amount
            });
            
            if (response.data.success) {
                alert('Tring! Simulasi Pembayaran VA berhasil. Saldo akan otomatis bertambah.');
                handleReset();
                // Optionally redirect to history page if you want
            }
        } catch (error) {
            alert('Gagal menyimulasikan: ' + (error.response?.data?.message || 'Error server'));
        } finally {
            setIsSimulating(false);
        }
    };

    const handleReset = () => {
        setShowVA(false);
        setSelectedBank("");
        setAmount("");
        setCategory("Lainnya");
        setErrors({});
    };

    return (
        <div className="relative overflow-hidden min-h-full">
            <Head title="Top Up - Paybae" />

            {/* Background blur blobs */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-50 dark:bg-green-900/20 rounded-full blur-[80px] -z-10 -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-50 dark:bg-green-900/20/60 rounded-full blur-[70px] -z-10 translate-y-1/3 -translate-x-1/3" />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 md:pt-10 pb-10">
                {/* Header */}
                <div className="mb-6 animate-fade-in-up flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#52933e] hover:border-green-200 transition-all"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
                            Top Up Saldo
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-0.5">
                            Isi saldo via Virtual Account bank pilihanmu.
                        </p>
                    </div>
                </div>

                {/* Card Saldo */}
                <div
                    className="bg-gradient-to-br from-[#80c868] via-[#61a94a] to-[#4e8d3b] rounded-[20px] p-5 text-white shadow-xl shadow-green-600/15 mb-6 animate-fade-in-up overflow-hidden relative"
                    style={{ animationDelay: "100ms" }}
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 dark:bg-slate-900/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-xs font-semibold uppercase tracking-wide mb-1">
                                Saldo Saat Ini
                            </p>
                            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                {formatRupiah(userBalance)}
                            </p>
                            <p className="text-white/70 text-xs mt-1 font-medium">
                                {user.no_rekening} • Paybae
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-white/15 dark:bg-slate-900/15 rounded-2xl flex items-center justify-center border border-white/20 dark:border-slate-800/20">
                            <BsBank className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                {/* VA Info (muncul setelah submit) */}
                {showVA ? (
                    <div
                        className="animate-fade-in-up"
                        style={{ animationDelay: "50ms" }}
                    >
                        {/* VA Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-[20px] p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 dark:border-slate-800/60 mb-6">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                    <FiCheck className="w-5 h-5 text-[#52933e]" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">
                                        Virtual Account Dibuat!
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                                        Segera lakukan pembayaran sebelum
                                        kadaluarsa.
                                    </p>
                                </div>
                            </div>

                            {/* VA Detail */}
                            <div className="bg-[#f8fffe] dark:bg-slate-800/50 border border-green-100 dark:border-slate-700 rounded-[16px] p-4 mb-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        Bank
                                    </span>
                                    <span className="font-bold text-slate-800 dark:text-white">
                                        {selectedBank}
                                    </span>
                                </div>
                                <div className="border-t border-slate-100 dark:border-slate-800" />
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        Kategori
                                    </span>
                                    <span className="font-bold text-slate-800 dark:text-white">
                                        {category}
                                    </span>
                                </div>
                                <div className="border-t border-slate-100 dark:border-slate-800" />
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        Nomor Virtual Account
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-800 dark:text-white text-sm tracking-wide">
                                            {vaNumber}
                                        </span>
                                        <button
                                            onClick={handleCopyVA}
                                            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full transition-all ${copied ? "bg-green-100 text-green-700" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600"}`}
                                        >
                                            {copied ? (
                                                <>
                                                    <FiCheck className="w-3 h-3" />{" "}
                                                    Tersalin
                                                </>
                                            ) : (
                                                <>
                                                    <FiCopy className="w-3 h-3" />{" "}
                                                    Salin
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="border-t border-slate-100 dark:border-slate-800" />
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        Nominal
                                    </span>
                                    <span className="font-bold text-[#52933e] text-base">
                                        {formatRupiah(parseInt(amount, 10))}
                                    </span>
                                </div>
                                <div className="border-t border-slate-100 dark:border-slate-800" />
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        Biaya Admin
                                    </span>
                                    <span className="font-bold text-slate-800 dark:text-white">
                                        Gratis
                                    </span>
                                </div>
                                <div className="border-t border-slate-100 dark:border-slate-800" />
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        Batas Waktu
                                    </span>
                                    <span className="font-bold text-orange-500 flex items-center gap-1.5">
                                        <FiClock className="w-3.5 h-3.5" /> 24
                                        jam dari sekarang
                                    </span>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 rounded-xl p-3.5 mb-5">
                                <FiInfo className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                                    Transfer{" "}
                                    <span className="font-bold">
                                        sesuai nominal persis
                                    </span>{" "}
                                    ke nomor VA di atas. Saldo akan masuk
                                    otomatis setelah pembayaran dikonfirmasi. VA
                                    aktif selama{" "}
                                    <span className="font-bold">24 jam</span>.
                                </p>
                            </div>

                            <button
                                onClick={handleSimulatePayment}
                                disabled={isSimulating}
                                className="w-full flex items-center justify-center gap-2 bg-[#52933e] text-white py-3.5 rounded-xl font-bold transition-all hover:bg-[#437a32] mb-3 disabled:opacity-75 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(82,147,62,0.25)]"
                            >
                                {isSimulating ? (
                                    <>
                                        <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <FiCheck className="w-5 h-5" /> 
                                        Simulasikan Pembayaran VA Ini
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleReset}
                                className="w-full flex items-center justify-center gap-2 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#52933e] hover:text-[#52933e] py-3.5 rounded-xl font-bold transition-all hover:bg-green-50 dark:hover:bg-green-900/20"
                            >
                                <FiRefreshCw className="w-4 h-4" /> Buat Top Up Baru
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Form Top Up */
                    <div
                        className="bg-white dark:bg-slate-900 rounded-[20px] p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 dark:border-slate-800/60 mb-6 animate-fade-in-up"
                        style={{ animationDelay: "200ms" }}
                    >
                        <h2 className="font-bold text-slate-800 dark:text-white text-lg mb-5">
                            Isi Detail Top Up
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Pilih Bank */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                    Pilih Bank{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                                    {BANKS.map((bank) => (
                                        <button
                                            key={bank.code}
                                            type="button"
                                            onClick={() => {
                                                setSelectedBank(bank.code);
                                                setErrors((p) => ({
                                                    ...p,
                                                    bank: undefined,
                                                }));
                                            }}
                                            className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border-2 font-bold text-xs transition-all ${
                                                selectedBank === bank.code
                                                    ? "border-[#52933e] bg-[#f2fbf4] text-[#52933e] shadow-sm dark:shadow-none shadow-green-200"
                                                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:bg-white dark:hover:bg-slate-900"
                                            }`}
                                        >
                                            <BsBank
                                                className={`w-5 h-5 ${selectedBank === bank.code ? "text-[#52933e]" : bank.color}`}
                                            />
                                            {bank.label}
                                        </button>
                                    ))}
                                </div>
                                {errors.bank && (
                                    <p className="text-red-500 text-xs mt-1.5">
                                        {errors.bank}
                                    </p>
                                )}
                            </div>

                            {/* Pilih Kategori */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                    Kategori Pemasukan <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {INCOME_CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.code}
                                            type="button"
                                            onClick={() => {
                                                setCategory(cat.code);
                                                setErrors((p) => ({
                                                    ...p,
                                                    category: undefined,
                                                }));
                                            }}
                                            className={`flex items-center gap-2 py-3 px-3 rounded-xl border-2 font-bold text-xs transition-all ${
                                                category === cat.code
                                                    ? "border-[#52933e] bg-[#f2fbf4] text-[#52933e] shadow-sm dark:shadow-none shadow-green-200"
                                                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:bg-white dark:hover:bg-slate-900"
                                            }`}
                                        >
                                            <span className="text-base">{cat.icon}</span>
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                                {errors.category && (
                                    <p className="text-red-500 text-xs mt-1.5">
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            {/* Input Nominal */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                                    Nominal Top Up{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div
                                    className={`flex items-center border-2 rounded-xl overflow-hidden transition-all bg-slate-50 dark:bg-slate-800 focus-within:bg-white dark:bg-slate-900 ${errors.amount ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus-within:border-[#52933e]"}`}
                                >
                                    <span className="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-sm border-r border-slate-200 dark:border-slate-700 select-none">
                                        Rp
                                    </span>
                                    <input
                                        type="number"
                                        min="10000"
                                        max="10000000"
                                        placeholder="0"
                                        value={amount}
                                        onChange={(e) => {
                                            setAmount(e.target.value);
                                            setErrors((p) => ({
                                                ...p,
                                                amount: undefined,
                                            }));
                                        }}
                                        className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500/70 font-semibold text-base"
                                    />
                                </div>
                                {errors.amount && (
                                    <p className="text-red-500 text-xs mt-1.5">
                                        {errors.amount}
                                    </p>
                                )}
                                {amount && !errors.amount && (
                                    <p className="text-xs text-slate-400 mt-1 font-medium">
                                        {formatRupiah(
                                            parseInt(amount, 10) || 0,
                                        )}
                                    </p>
                                )}
                            </div>

                            {/* Nominal Cepat */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                                    Nominal Cepat
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {QUICK_AMOUNTS.map((q) => (
                                        <button
                                            key={q}
                                            type="button"
                                            onClick={() => {
                                                setAmount(String(q));
                                                setErrors((p) => ({
                                                    ...p,
                                                    amount: undefined,
                                                }));
                                            }}
                                            className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                                                parseInt(amount, 10) === q
                                                    ? "border-[#52933e] bg-[#f2fbf4] text-[#52933e]"
                                                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 hover:bg-white dark:hover:bg-slate-900"
                                            }`}
                                        >
                                            {q >= 1000000
                                                ? `${q / 1000000} jt`
                                                : `${q / 1000} rb`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Estimasi Biaya */}
                            <div className="flex items-center justify-between bg-[#f2fbf4] dark:bg-green-950/30 border border-green-100 dark:border-green-900/40 rounded-xl px-4 py-3">
                                <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                                    Biaya Admin
                                </span>
                                <span className="font-bold text-[#52933e] text-sm">
                                    Gratis
                                </span>
                            </div>

                            <PrimaryButton disabled={loading} type="submit">
                                <span className="flex items-center justify-center gap-2">
                                    {loading ? (
                                        <svg
                                            className="animate-spin w-5 h-5 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8H4z"
                                            />
                                        </svg>
                                    ) : (
                                        <FiPlusSquare className="w-5 h-5" />
                                    )}
                                    {loading
                                        ? "Membuat Virtual Account..."
                                        : "Buat Virtual Account"}
                                </span>
                            </PrimaryButton>
                        </form>
                    </div>
                )}

                {/* Riwayat Top Up */}
                <div
                    className="bg-white dark:bg-slate-900 rounded-[20px] p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 dark:border-slate-800/60 animate-fade-in-up"
                    style={{ animationDelay: "300ms" }}
                >
                    <h2 className="font-bold text-slate-800 dark:text-white text-lg mb-4">
                        Riwayat Top Up
                    </h2>
                    <div className="flex flex-col gap-3">
                        {recent_topups.length > 0 ? (
                            recent_topups.map((item) => {
                                const s = statusStyle[item.status] || statusStyle['PENDING'];
                                const topupDate = new Date(item.created_at);
                                const formattedDate = topupDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + topupDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#f2fbf4] border border-green-100 rounded-[12px] flex items-center justify-center flex-shrink-0">
                                                <BsBank className="w-5 h-5 text-[#52933e]" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-white text-sm">
                                                    Top Up {item.bank_code}
                                                </p>
                                                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                                    VA: {item.virtual_account_number || '-'} • {formattedDate}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5">
                                            <p className="font-bold text-[#52933e] text-sm">
                                                +{formatRupiah(item.amount)}
                                            </p>
                                            <span
                                                className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.badge}`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${s.dot}`}
                                                />
                                                {s.label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                                    <BsBank className="w-6 h-6 text-slate-300" />
                                </div>
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Belum ada riwayat top up</p>
                                <p className="text-xs text-slate-400 mt-1">Top up terbaru akan muncul di sini.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

TopUp.layout = (page) => <DashboardLayout children={page} />;
