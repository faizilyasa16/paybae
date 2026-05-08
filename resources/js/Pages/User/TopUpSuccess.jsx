import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { FiCheckCircle, FiArrowRight, FiHome } from 'react-icons/fi';
import DashboardLayout from '../Component/DashboardLayout';

export default function TopUpSuccess({ transaction, user }) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsAnimating(true);
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getPaymentMethodName = (method) => {
        const names = {
            'bank_transfer': 'Transfer Bank',
            'qris': 'QRIS',
            'gopay': 'GoPay',
            'ovo': 'OVO',
            'dana': 'DANA',
        };
        return names[method] || method;
    };

    const getBankName = (code) => {
        const banks = {
            'bca': 'BCA',
            'bni': 'BNI',
            'bri': 'BRI',
            'mandiri': 'Mandiri',
            'btn': 'BTN',
            'cimb': 'CIMB Niaga',
            'ocbc': 'OCBC NISP',
            'danamon': 'Danamon',
            'maybank': 'Maybank',
            'bukopin': 'Bukopin',
        };
        return banks[code] || code;
    };

    return (
        <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
            <Head title="Top Up Berhasil - Paybae" />

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-20 translate-y-1/4 -translate-x-1/4"></div>

            <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6 pt-10 md:pt-20 pb-10">
                {/* Success Icon */}
                <div className={`mb-8 flex justify-center transition-all duration-700 transform ${
                    isAnimating ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}>
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-6 shadow-2xl">
                            <FiCheckCircle className="w-16 h-16 text-white" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                <div className={`text-center mb-8 transition-all duration-700 transform ${
                    isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`} style={{ transitionDelay: '200ms' }}>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2">
                        Top Up Berhasil! 🎉
                    </h1>
                    <p className="text-slate-600 text-base sm:text-lg font-medium">
                        Saldo Anda telah ditambahkan
                    </p>
                </div>

                {/* Amount Card */}
                <div className={`bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6 transition-all duration-700 transform ${
                    isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`} style={{ transitionDelay: '300ms' }}>
                    <div className="text-center mb-6">
                        <p className="text-slate-600 text-sm font-medium mb-2">Jumlah Top Up</p>
                        <p className="text-4xl sm:text-5xl font-extrabold text-green-600">
                            {formatCurrency(transaction.amount)}
                        </p>
                    </div>

                    <div className="border-t border-b border-slate-200 py-4 mb-6 space-y-4">
                        {/* Payment Method */}
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600 text-sm font-medium">Metode Pembayaran</span>
                            <span className="text-slate-800 font-semibold">
                                {getPaymentMethodName(transaction.payment_method)}
                                {transaction.bank_code && (
                                    <span className="text-slate-600 font-normal ml-1">
                                        ({getBankName(transaction.bank_code)})
                                    </span>
                                )}
                            </span>
                        </div>

                        {/* Status */}
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600 text-sm font-medium">Status</span>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${transaction.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {transaction.status === 'success' ? 'Berhasil' : 'Menunggu Pembayaran'}
                            </span>
                        </div>

                        {/* Time */}
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600 text-sm font-medium">Waktu</span>
                            <span className="text-slate-800 font-medium">
                                {new Date(transaction.created_at).toLocaleString('id-ID', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                    </div>

                    {/* New Balance */}
                    <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-slate-600 text-xs sm:text-sm font-medium mb-1">Saldo Anda Sekarang</p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-green-600">
                            {formatCurrency(user.balance)}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={`space-y-3 transition-all duration-700 transform ${
                    isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`} style={{ transitionDelay: '400ms' }}>
                    <Link
                        href={route('history.index')}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <FiArrowRight className="w-5 h-5" />
                        Lihat Riwayat Transaksi
                    </Link>

                    <Link
                        href={route('dashboard.index')}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <FiHome className="w-5 h-5" />
                        Kembali ke Dashboard
                    </Link>
                </div>

                {/* Confetti Animation Info */}
                <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                    <p className="text-slate-500 text-sm">
                        ✨ Nikmati saldo baru Anda!
                    </p>
                </div>
            </div>

            {/* Floating Celebration Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-green-400 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${3 + Math.random() * 2}s infinite ease-in-out`,
                            animationDelay: `${i * 0.2}s`,
                            opacity: 0.2,
                        }}
                    ></div>
                ))}
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
        </div>
    );
}

TopUpSuccess.layout = page => <DashboardLayout children={page} />;
