import React from 'react';
import { Link } from '@inertiajs/react';
import { FiX, FiAlertCircle } from 'react-icons/fi';

export default function TransaksiGagal({
    title = "Transaksi Gagal!",
    description = "Terjadi kesalahan saat memproses transaksi.",
    errorMessage = "Mohon periksa kembali koneksi atau saldo Anda.",
    onPrimaryClick,
    primaryText = "Coba Lagi",
    primaryHref,
    onSecondaryClick,
    secondaryText = "Kembali ke Dashboard",
    secondaryHref = "/dashboard",
}) {
    return (
        <div className="animate-fade-in-up text-center py-4">
            {/* Ikon Gagal */}
            <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20" />
                <div className="relative w-28 h-28 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-xl shadow-red-600/30">
                    <FiX className="w-14 h-14 text-white stroke-[3]" />
                </div>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2">
                {title}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                {description}
            </p>

            {/* Kotak Error */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4 flex items-start gap-3 text-left mb-8">
                <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-bold text-red-800 dark:text-red-200">
                        Detail Kesalahan
                    </p>
                    <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-1 leading-relaxed">
                        {errorMessage}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {primaryHref ? (
                    <Link
                        href={primaryHref}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all"
                    >
                        {primaryText}
                    </Link>
                ) : (
                    <button
                        onClick={onPrimaryClick}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all"
                    >
                        {primaryText}
                    </button>
                )}
                
                {secondaryHref ? (
                    <Link
                        href={secondaryHref}
                        className="w-full border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center"
                    >
                        {secondaryText}
                    </Link>
                ) : (
                    <button
                        onClick={onSecondaryClick}
                        className="w-full border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center"
                    >
                        {secondaryText}
                    </button>
                )}
            </div>
        </div>
    );
}
