import React from 'react';
import { Link } from '@inertiajs/react';
import { FiCheck, FiClock } from 'react-icons/fi';

const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(angka);

export default function TransaksiBerhasil({
    title = "Transaksi Berhasil!",
    description = "Dana telah dikirim ke tujuan.",
    details = [], // { label, value, subValue }
    amount = 0,
    amountLabel = "Jumlah Ditransfer",
    note = "",
    onPrimaryClick,
    primaryText = "Kembali ke Dashboard",
    primaryHref = "/dashboard",
    onSecondaryClick,
    secondaryText = "Transaksi Lagi",
}) {
    return (
        <div className="animate-fade-in-up text-center py-4">
            {/* Ikon Sukses */}
            <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
                <div className="relative w-28 h-28 bg-gradient-to-br from-[#80c868] to-[#4e8d3b] rounded-full flex items-center justify-center shadow-xl shadow-green-600/30">
                    <FiCheck className="w-14 h-14 text-white stroke-[3]" />
                </div>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2">
                {title}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                {description}
            </p>

            {/* Ringkasan Singkat */}
            <div className="bg-white dark:bg-slate-900 rounded-[20px] p-5 border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none text-left mb-8 space-y-3">
                {details.map((detail, idx) => (
                    <React.Fragment key={idx}>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                {detail.label}
                            </span>
                            <div className="text-right">
                                <p className="font-bold text-slate-800 dark:text-white text-sm">
                                    {detail.value}
                                </p>
                                {detail.subValue && (
                                    <p className="text-xs text-slate-400">
                                        {detail.subValue}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="border-t border-slate-100 dark:border-slate-800" />
                    </React.Fragment>
                ))}

                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {amountLabel}
                    </span>
                    <span className="font-extrabold text-[#52933e] text-base">
                        {formatRupiah(amount)}
                    </span>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800" />
                <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Waktu
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center gap-1.5">
                        <FiClock className="w-3.5 h-3.5 text-slate-400" />
                        Baru saja
                    </span>
                </div>
                {note && (
                    <>
                        <div className="border-t border-slate-100 dark:border-slate-800" />
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                Catatan
                            </span>
                            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                                {note}
                            </span>
                        </div>
                    </>
                )}
            </div>

            <div className="space-y-3">
                {primaryHref ? (
                    <Link
                        href={primaryHref}
                        className="w-full bg-gradient-to-r from-[#61a94a] to-[#4e8d3b] text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all"
                    >
                        {primaryText}
                    </Link>
                ) : (
                    <button
                        onClick={onPrimaryClick}
                        className="w-full bg-gradient-to-r from-[#61a94a] to-[#4e8d3b] text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all"
                    >
                        {primaryText}
                    </button>
                )}
                {onSecondaryClick && (
                    <button
                        onClick={onSecondaryClick}
                        className="w-full border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#52933e] hover:text-[#52933e] hover:bg-green-50 dark:hover:bg-green-900/20 py-3.5 rounded-xl font-bold transition-all"
                    >
                        {secondaryText}
                    </button>
                )}
            </div>
        </div>
    );
}
