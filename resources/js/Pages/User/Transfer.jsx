import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    FiSend,
    FiArrowRight,
    FiArrowLeft,
    FiCheck,
    FiClock,
    FiInfo,
    FiUser,
    FiHash,
} from "react-icons/fi";
import { BsBank } from "react-icons/bs";
import DashboardLayout from "../Component/DashboardLayout";
import PrimaryButton from "../Component/PrimaryButton";
import FormInput from "../Component/FormInput";
import TransaksiBerhasil from "../Component/Transaksi/TransaksiBerhasil";

const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(angka);

const BANKS = [
    { code: "BCA", label: "BCA", color: "text-blue-600" },
    { code: "BNI", label: "BNI", color: "text-orange-600" },
    { code: "BRI", label: "BRI", color: "text-blue-700" },
    { code: "MANDIRI", label: "Mandiri", color: "text-yellow-700" },
    { code: "CIMB", label: "CIMB", color: "text-red-700" },
    { code: "PERMATA", label: "Permata", color: "text-red-600" },
];

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000, 1000000, 2000000];
const ADMIN_FEE = 2500;

const statusStyle = {
    PAID:      { badge: "bg-green-100 text-green-700", dot: "bg-green-500", label: "Berhasil" },
    PENDING:   { badge: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-400", label: "Menunggu" },
    FAILED:    { badge: "bg-red-100 text-red-600", dot: "bg-red-500", label: "Gagal" },
    COMPLETED: { badge: "bg-green-100 text-green-700", dot: "bg-green-500", label: "Berhasil" },
};

export default function Transfer() {
    const { auth, balance, recent_transfers = [] } = usePage().props;
    const user = auth?.user || { name: "Ahmad" };
    // Default balance to 0 if not provided
    const userBalance = balance ?? 0;

    const EXPENSE_CATEGORIES = [
        { code: "Makanan & Minuman", label: "Makanan & Minuman", icon: "🍔" },
        { code: "Belanja", label: "Belanja", icon: "🛍️" },
        { code: "Tagihan", label: "Tagihan", icon: "🧾" },
        { code: "Hiburan", label: "Hiburan", icon: "🎬" },
        { code: "Transportasi", label: "Transportasi", icon: "🚗" },
        { code: "Edukasi", label: "Edukasi", icon: "🎓" },
        { code: "Kesehatan", label: "Kesehatan", icon: "🏥" },
        { code: "Lainnya", label: "Lainnya", icon: "💸" },
    ];

    const [step, setStep] = useState(1);
    const [selectedBank, setSelectedBank] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Lainnya");
    const [note, setNote] = useState("");
    const [pin, setPin] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const numAmount = parseInt(amount, 10) || 0;
    const total = numAmount + ADMIN_FEE;

    // ─── Validasi Step 1 ──────────────────────────────────────────────────────
    const validateStep1 = () => {
        const e = {};
        if (!selectedBank) e.bank = "Pilih bank tujuan terlebih dahulu.";
        if (!accountNumber || accountNumber.length < 10)
            e.accountNumber = "Nomor rekening minimal 10 digit.";
        if (!accountName.trim())
            e.accountName = "Nama penerima tidak boleh kosong.";
        if (!amount || numAmount < 10000)
            e.amount = "Nominal minimal Rp 10.000.";
        else if (numAmount > userBalance) e.amount = "Saldo tidak mencukupi.";
        if (!category) e.category = "Pilih kategori pengeluaran.";
        return e;
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        const e2 = validateStep1();
        if (Object.keys(e2).length) {
            setErrors(e2);
            return;
        }
        setErrors({});
        setStep(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ─── Validasi Step 2 ──────────────────────────────────────────────────────
    const handleConfirm = async (e) => {
        e.preventDefault();
        const e2 = {};
        if (!pin || pin.length !== 6) e2.pin = "PIN harus 6 digit.";
        if (Object.keys(e2).length) {
            setErrors(e2);
            return;
        }
        setErrors({});
        setLoading(true);
        
        try {
            const response = await window.axios.post("/transfer", {
                bank_code: selectedBank,
                account_number: accountNumber,
                account_holder_name: accountName,
                amount: amount,
                description: note,
                pin: pin,
                category: category
            });
            
            setLoading(false);
            setStep(3);
        } catch (error) {
            setLoading(false);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Terjadi kesalahan sistem.");
            }
        }
    };

    const handleReset = () => {
        setStep(1);
        setSelectedBank("");
        setAccountNumber("");
        setAccountName("");
        setAmount("");
        setCategory("Lainnya");
        setNote("");
        setPin("");
        setErrors({});
    };

    // ─── Step Indicator ───────────────────────────────────────────────────────
    const StepDot = ({ n, label }) => (
        <div className="flex flex-col items-center gap-1">
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                    step > n
                        ? "bg-[#52933e] border-[#52933e] text-white"
                        : step === n
                          ? "bg-white dark:bg-slate-900 border-[#52933e] text-[#52933e]"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400"
                }`}
            >
                {step > n ? <FiCheck className="w-4 h-4" /> : n}
            </div>
            <span
                className={`text-[10px] font-bold ${step >= n ? "text-[#52933e]" : "text-slate-400"}`}
            >
                {label}
            </span>
        </div>
    );

    return (
        <div className="relative overflow-hidden min-h-full">
            <Head title="Transfer Dana - Paybae" />

            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-50 dark:bg-green-900/20 rounded-full blur-[80px] -z-10 -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-50 dark:bg-green-900/20/60 rounded-full blur-[70px] -z-10 translate-y-1/3 -translate-x-1/3" />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 md:pt-10 pb-10">
                {/* Header */}
                <div className="mb-6 animate-fade-in-up flex items-center gap-3">
                    {step === 1 ? (
                        <Link
                            href="/dashboard"
                            className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#52933e] hover:border-green-200 transition-all"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                        </Link>
                    ) : step === 2 ? (
                        <button
                            onClick={() => {
                                setStep(1);
                                setErrors({});
                            }}
                            className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#52933e] hover:border-green-200 transition-all"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                        </button>
                    ) : null}
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
                            Transfer Dana
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-0.5">
                            Kirim uang ke rekening bank manapun.
                        </p>
                    </div>
                </div>

                {/* Step Indicator (hanya muncul di step 1 & 2) */}
                {step !== 3 && (
                    <div
                        className="bg-white dark:bg-slate-900 rounded-[16px] p-4 border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none mb-6 animate-fade-in-up"
                        style={{ animationDelay: "80ms" }}
                    >
                        <div className="flex items-center justify-center gap-0">
                            <StepDot n={1} label="Data" />
                            <div
                                className={`h-0.5 w-12 sm:w-20 mx-1 rounded-full transition-all ${step > 1 ? "bg-[#52933e]" : "bg-slate-200"}`}
                            />
                            <StepDot n={2} label="Konfirmasi" />
                            <div
                                className={`h-0.5 w-12 sm:w-20 mx-1 rounded-full transition-all ${step > 2 ? "bg-[#52933e]" : "bg-slate-200"}`}
                            />
                            <StepDot n={3} label="Selesai" />
                        </div>
                    </div>
                )}

                {/* Card Saldo */}
                {step !== 3 && (
                    <div
                        className="bg-gradient-to-br from-[#80c868] via-[#61a94a] to-[#4e8d3b] rounded-[20px] p-5 text-white shadow-xl shadow-green-600/15 mb-6 animate-fade-in-up overflow-hidden relative"
                        style={{ animationDelay: "100ms" }}
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 dark:bg-slate-900/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-xs font-semibold uppercase tracking-wide mb-1">
                                    Saldo Tersedia
                                </p>
                                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                    {formatRupiah(userBalance)}
                                </p>
                                <p className="text-white/70 text-xs mt-1 font-medium">
                                    {user.no_rekening} • Paybae
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-white/15 dark:bg-slate-900/15 rounded-2xl flex items-center justify-center border border-white/20 dark:border-slate-800/20">
                                <FiSend className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════
                    STEP 1 — Isi Data Transfer
                ═══════════════════════════════════════════════════════════ */}
                {step === 1 && (
                    <div
                        className="bg-white dark:bg-slate-900 rounded-[20px] p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 dark:border-slate-800/60 mb-6 animate-fade-in-up"
                        style={{ animationDelay: "200ms" }}
                    >
                        <h2 className="font-bold text-slate-800 dark:text-white text-lg mb-5">
                            Detail Transfer
                        </h2>

                        <form onSubmit={handleNextStep} className="space-y-5">
                            {/* Pilih Bank */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                    Bank Tujuan{" "}
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
                                    Kategori Pengeluaran <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {EXPENSE_CATEGORIES.map((cat) => (
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

                            {/* No. Rekening */}
                            <FormInput
                                label="Nomor Rekening Tujuan"
                                type="text"
                                placeholder="Contoh: 1234567890"
                                value={accountNumber}
                                onChange={(e) => {
                                    setAccountNumber(
                                        e.target.value.replace(/\D/g, ""),
                                    );
                                    setErrors((p) => ({
                                        ...p,
                                        accountNumber: undefined,
                                    }));
                                }}
                                error={errors.accountNumber}
                                required
                            />

                            {/* Nama Penerima */}
                            <FormInput
                                label="Nama Penerima"
                                type="text"
                                placeholder="Nama sesuai buku rekening"
                                value={accountName}
                                onChange={(e) => {
                                    setAccountName(e.target.value);
                                    setErrors((p) => ({
                                        ...p,
                                        accountName: undefined,
                                    }));
                                }}
                                error={errors.accountName}
                                required
                            />

                            {/* Nominal */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                                    Nominal Transfer{" "}
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
                                        {formatRupiah(numAmount)}
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
                                                numAmount === q
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

                            {/* Catatan */}
                            <FormInput
                                label="Catatan / Berita Transfer"
                                type="text"
                                placeholder="Opsional, misal: Bayar utang"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />

                            {/* Estimasi Biaya */}
                            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                        Biaya Admin
                                    </span>
                                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                                        {formatRupiah(ADMIN_FEE)}
                                    </span>
                                </div>
                                {numAmount > 0 && (
                                    <>
                                        <div className="border-t border-slate-200 dark:border-slate-700" />
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600 dark:text-slate-300 font-semibold">
                                                Total Didebit
                                            </span>
                                            <span className="font-extrabold text-slate-800 dark:text-white text-sm">
                                                {formatRupiah(total)}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <PrimaryButton type="submit">
                                <span className="flex items-center justify-center gap-2">
                                    Lanjut ke Konfirmasi{" "}
                                    <FiArrowRight className="w-5 h-5" />
                                </span>
                            </PrimaryButton>
                        </form>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════
                    STEP 2 — Konfirmasi & PIN
                ═══════════════════════════════════════════════════════════ */}
                {step === 2 && (
                    <div
                        className="animate-fade-in-up"
                        style={{ animationDelay: "100ms" }}
                    >
                        {/* Ringkasan */}
                        <div className="bg-white dark:bg-slate-900 rounded-[20px] p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 dark:border-slate-800/60 mb-5">
                            <h2 className="font-bold text-slate-800 dark:text-white text-lg mb-4">
                                Ringkasan Transfer
                            </h2>

                            <div className="space-y-0 divide-y divide-slate-100 rounded-[14px] border border-slate-100 dark:border-slate-800 overflow-hidden">
                                {[
                                    {
                                        label: "Bank Tujuan",
                                        value: selectedBank,
                                        icon: (
                                            <BsBank className="w-4 h-4 text-slate-400" />
                                        ),
                                    },
                                    {
                                        label: "No. Rekening",
                                        value: accountNumber,
                                        icon: (
                                            <FiHash className="w-4 h-4 text-slate-400" />
                                        ),
                                    },
                                    {
                                        label: "Nama Penerima",
                                        value: accountName,
                                        icon: (
                                            <FiUser className="w-4 h-4 text-slate-400" />
                                        ),
                                    },
                                    {
                                        label: "Nominal",
                                        value: formatRupiah(numAmount),
                                        icon: null,
                                        valueClass:
                                            "font-extrabold text-slate-800 dark:text-white text-base",
                                    },
                                    {
                                        label: "Biaya Admin",
                                        value: formatRupiah(ADMIN_FEE),
                                        icon: null,
                                    },
                                    {
                                        label: "Catatan",
                                        value: note || "-",
                                        icon: null,
                                    },
                                    {
                                        label: "Kategori",
                                        value: category,
                                        icon: null,
                                    },
                                 ].map(({ label, value, icon, valueClass }) => (
                                     <div
                                         key={label}
                                         className="flex items-center justify-between px-4 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors"
                                     >
                                         <div className="flex items-center gap-2.5">
                                             {icon}
                                             <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                 {label}
                                             </span>
                                         </div>
                                         <span
                                             className={
                                                 valueClass ||
                                                 "font-bold text-slate-800 dark:text-white text-sm"
                                             }
                                         >
                                             {value}
                                         </span>
                                     </div>
                                 ))}
 
                                 {/* Total Baris Terpisah */}
                                 <div className="flex items-center justify-between px-4 py-4 bg-[#f2fbf4]">
                                     <span className="text-sm font-bold text-[#52933e]">
                                         Total Didebit
                                     </span>
                                     <span className="font-extrabold text-[#52933e] text-lg">
                                         {formatRupiah(total)}
                                     </span>
                                 </div>
                             </div>
                         </div>
 
                         {/* Input PIN */}
                         <form onSubmit={handleConfirm}>
                             <div className="bg-white dark:bg-slate-900 rounded-[20px] p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 dark:border-slate-800/60 mb-5">
                                 <h2 className="font-bold text-slate-800 dark:text-white text-lg mb-1">
                                     Masukkan PIN
                                 </h2>
                                 <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                                     Konfirmasi dengan PIN 6 digit akun Paybae
                                     kamu.
                                 </p>
 
                                 <div
                                     className={`flex items-center border-2 rounded-xl overflow-hidden transition-all bg-slate-50 dark:bg-slate-800 focus-within:bg-white dark:bg-slate-900 ${errors.pin ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus-within:border-[#52933e]"}`}
                                 >
                                     <div className="flex items-center gap-2 px-4 py-3 border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                                         {[...Array(6)].map((_, i) => (
                                             <div
                                                 key={i}
                                                 className={`w-2 h-2 rounded-full transition-all ${i < pin.length ? "bg-[#52933e]" : "bg-slate-300"}`}
                                             />
                                         ))}
                                     </div>
                                     <input
                                         type="password"
                                         maxLength={6}
                                         placeholder="••••••"
                                         value={pin}
                                         onChange={(e) => {
                                             setPin(
                                                 e.target.value
                                                     .replace(/\D/g, "")
                                                     .slice(0, 6),
                                             );
                                             setErrors((p) => ({
                                                 ...p,
                                                 pin: undefined,
                                             }));
                                         }}
                                         className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-800 dark:text-white font-bold text-xl tracking-[0.5em] placeholder-slate-400 dark:placeholder-slate-500/70"
                                     />
                                 </div>
                                 {errors.pin && (
                                     <p className="text-red-500 text-xs mt-1.5">
                                         {errors.pin}
                                     </p>
                                 )}
 
                                 {/* Info */}
                                 <div className="flex items-start gap-2.5 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 rounded-xl p-3 mt-4">
                                     <FiInfo className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                     <p className="text-xs text-orange-700 font-medium leading-relaxed">
                                         Saldo sebesar{" "}
                                         <span className="font-bold">
                                             {formatRupiah(total)}
                                         </span>{" "}
                                         akan langsung didebit setelah
                                         konfirmasi. Pastikan data sudah benar.
                                     </p>
                                 </div>
                             </div>
 
                             {/* Tombol Aksi */}
                             <div className="space-y-3">
                                 <PrimaryButton
                                     disabled={loading}
                                     type="submit"
                                     className="bg-gradient-to-r from-[#52933e] to-[#3d7030]"
                                 >
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
                                             <FiSend className="w-5 h-5" />
                                         )}
                                         {loading
                                             ? "Memproses Transfer..."
                                             : "Konfirmasi Transfer"}
                                     </span>
                                 </PrimaryButton>
 
                                 <button
                                     type="button"
                                     onClick={() => {
                                         setStep(1);
                                         setErrors({});
                                     }}
                                     className="w-full border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                 >
                                     <FiArrowLeft className="w-4 h-4" /> Kembali
                                     Edit
                                 </button>
                             </div>
                         </form>
                     </div>
                 )}
 
                 {/* ═══════════════════════════════════════════════════════════
                     STEP 3 — Sukses
                 ═══════════════════════════════════════════════════════════ */}
                 {step === 3 && (
                     <TransaksiBerhasil
                         title="Transfer Berhasil!"
                         description="Dana telah dikirim ke rekening tujuan."
                         amount={numAmount}
                         amountLabel="Jumlah Ditransfer"
                         note={note}
                         details={[
                             {
                                 label: "Kepada",
                                 value: accountName,
                                 subValue: `${selectedBank} • ${accountNumber}`,
                             },
                             {
                                 label: "Kategori",
                                 value: category,
                             }
                         ]}
                         primaryText="Kembali ke Dashboard"
                         primaryHref="/dashboard"
                         secondaryText="Transfer Lagi"
                         onSecondaryClick={handleReset}
                     />
                 )}

                {/* Riwayat Transfer (hanya di step 1) */}
                {step === 1 && (
                    <div
                        className="bg-white dark:bg-slate-900 rounded-[20px] p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 dark:border-slate-800/60 animate-fade-in-up"
                        style={{ animationDelay: "350ms" }}
                    >
                        <h2 className="font-bold text-slate-800 dark:text-white text-lg mb-4">
                            Riwayat Transfer
                        </h2>
                        <div className="flex flex-col gap-3">
                            {recent_transfers.length > 0 ? (
                                recent_transfers.map((item) => {
                                    const s = statusStyle[item.status] || statusStyle['PENDING'];
                                    const trfDate = new Date(item.created_at);
                                    const formattedDate = trfDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + trfDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100/50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[#fff8f6] border border-red-100 rounded-[12px] flex items-center justify-center flex-shrink-0">
                                                    <FiSend className="w-4 h-4 text-[#d85c49]" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-white text-sm">
                                                        {item.account_holder_name}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                                        {item.bank_code} \u2022 {item.account_number} \u2022 {formattedDate}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1.5">
                                                <p className="font-bold text-[#d85c49] text-sm">
                                                    -{formatRupiah(parseFloat(item.amount) + parseFloat(item.fee || 0))}
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
                                        <FiSend className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Belum ada riwayat transfer</p>
                                    <p className="text-xs text-slate-400 mt-1">Transfer terbaru akan muncul di sini.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

Transfer.layout = (page) => <DashboardLayout children={page} />;
