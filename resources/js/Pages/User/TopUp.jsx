import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import {
    FiChevronLeft,
    FiCreditCard,
    FiSmartphone,
    FiDollarSign,
    FiCheckCircle,
    FiAlertCircle
} from "react-icons/fi";
import { BsBank, BsQrCode } from "react-icons/bs";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import DashboardLayout from "../Component/DashboardLayout";

export default function TopUp() {
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        payment_method: '',
        bank_code: '',
    });

    const [selectedMethod, setSelectedMethod] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const banks = [
        { code: 'bca', name: 'BCA' },
        { code: 'bni', name: 'BNI' },
        { code: 'bri', name: 'BRI' },
        { code: 'mandiri', name: 'Mandiri' },
        { code: 'btn', name: 'BTN' },
        { code: 'cimb', name: 'CIMB Niaga' },
        { code: 'ocbc', name: 'OCBC NISP' },
        { code: 'danamon', name: 'Danamon' },
        { code: 'maybank', name: 'Maybank' },
        { code: 'bukopin', name: 'Bukopin' },
        { code: 'syariah_mandiri', name: 'Mandiri Syariah' },
        { code: 'bpd_jawa_barat', name: 'BPD Jawa Barat' },
        { code: 'bpd_dki', name: 'BPD DKI' },
        { code: 'bpd_jawa_tengah', name: 'BPD Jawa Tengah' },
        { code: 'bpd_jawa_timur', name: 'BPD Jawa Timur' },
        { code: 'bpd_yogyakarta', name: 'BPD Yogyakarta' },
        { code: 'bpd_banten', name: 'BPD Banten' },
        { code: 'bpd_bali', name: 'BPD Bali' },
        { code: 'bpd_nusa_tenggara_barat', name: 'BPD NTB' },
        { code: 'bpd_nusa_tenggara_timur', name: 'BPD NTT' },
        { code: 'bpd_kalimantan_barat', name: 'BPD Kalimantan Barat' },
        { code: 'bpd_kalimantan_selatan', name: 'BPD Kalimantan Selatan' },
        { code: 'bpd_kalimantan_timur', name: 'BPD Kalimantan Timur' },
        { code: 'bpd_kalimantan_utara', name: 'BPD Kalimantan Utara' },
        { code: 'bpd_sulawesi_utara', name: 'BPD Sulawesi Utara' },
        { code: 'bpd_sulawesi_tenggara', name: 'BPD Sulawesi Tenggara' },
        { code: 'bpd_sulawesi_selatan', name: 'BPD Sulawesi Selatan' },
        { code: 'bpd_gorontalo', name: 'BPD Gorontalo' },
        { code: 'bpd_sulawesi_barat', name: 'BPD Sulawesi Barat' },
        { code: 'bpd_maluku', name: 'BPD Maluku' },
        { code: 'bpd_maluku_utara', name: 'BPD Maluku Utara' },
        { code: 'bpd_papua', name: 'BPD Papua' },
        { code: 'bpd_papua_barat', name: 'BPD Papua Barat' },
    ];

    const paymentMethods = [
        {
            id: 'bank_transfer',
            name: 'Transfer Bank',
            icon: BsBank,
            description: 'Transfer via ATM/Banking Online',
            color: 'bg-blue-500'
        },
        {
            id: 'qris',
            name: 'QRIS',
            icon: BsQrCode,
            description: 'Scan QR Code',
            color: 'bg-purple-500'
        },
        {
            id: 'gopay',
            name: 'GoPay',
            icon: FiSmartphone,
            description: 'E-wallet GoPay',
            color: 'bg-blue-600'
        },
        {
            id: 'ovo',
            name: 'OVO',
            icon: FiCreditCard,
            description: 'E-wallet OVO',
            color: 'bg-purple-600'
        },
        {
            id: 'dana',
            name: 'DANA',
            icon: RiMoneyDollarCircleLine,
            description: 'E-wallet DANA',
            color: 'bg-blue-700'
        }
    ];

    const quickAmounts = [50000, 100000, 200000, 500000, 1000000];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!data.amount || !data.payment_method) {
            return;
        }

        // Validate bank selection for bank transfer
        if (data.payment_method === 'bank_transfer' && !data.bank_code) {
            return;
        }

        setIsSubmitting(true);

        try {
            let endpoint = route('topup.store');
            if (endpoint.startsWith('http')) {
                endpoint = new URL(endpoint).pathname + new URL(endpoint).search;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({
                    amount: data.amount,
                    payment_method: data.payment_method,
                    bank_code: data.bank_code,
                }),
            });

            let result;
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                throw new Error(text || 'Unexpected response from server');
            }

            if (result.success) {
                // Handle different payment methods
                if (result.redirect_url) {
                    // For QRIS and e-wallet, redirect to external payment page
                    window.location.href = result.redirect_url;
                } else {
                    // For bank transfer, redirect to success page immediately
                    window.location.href = route('topup.success', result.transaction.id);
                }
            } else {
                console.error('Payment failed:', result.message);
                alert('Gagal membuat pembayaran: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat memproses pembayaran: ' + (error.message || 'Silakan coba lagi'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="relative overflow-hidden min-h-full">
            <Head title="Top Up Saldo - Paybae" />

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50 rounded-full blur-[100px] -z-10 -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-50/80 rounded-full blur-[80px] -z-10 translate-y-1/3 -translate-x-1/3"></div>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 md:pt-10">
                {/* Header */}
                <div className="mb-6 animate-fade-in-up">
                    <Link
                        href={route('dashboard.index')}
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mb-4"
                    >
                        <FiChevronLeft className="w-4 h-4" />
                        Kembali ke Dashboard
                    </Link>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FiDollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        Top Up Saldo
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm sm:text-base font-medium">
                        Tambah saldo Paybae Anda dengan mudah dan aman.
                    </p>
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fade-in-up">
                        <FiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div>
                            <p className="text-green-800 font-medium">Top up berhasil!</p>
                            <p className="text-green-600 text-sm">Saldo Anda telah ditambahkan ke akun.</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Amount Input */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in-up animation-delay-100">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Jumlah Top Up
                        </label>

                        <div className="relative mb-4">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-slate-500 font-medium">Rp</span>
                            </div>
                            <input
                                type="number"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-lg font-semibold"
                                placeholder="0"
                                min="10000"
                                max="10000000"
                            />
                        </div>

                        {errors.amount && (
                            <p className="text-red-600 text-sm flex items-center gap-1 mt-1">
                                <FiAlertCircle className="w-4 h-4" />
                                {errors.amount}
                            </p>
                        )}

                        {/* Quick Amount Buttons */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            {quickAmounts.map((amount) => (
                                <button
                                    key={amount}
                                    type="button"
                                    onClick={() => setData('amount', amount.toString())}
                                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
                                >
                                    {formatCurrency(amount)}
                                </button>
                            ))}
                        </div>

                        <p className="text-xs text-slate-500 mt-3">
                            Minimal top up: Rp 10.000 | Maksimal: Rp 10.000.000
                        </p>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in-up animation-delay-200">
                        <label className="block text-sm font-semibold text-slate-700 mb-4">
                            Metode Pembayaran
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {paymentMethods.map((method) => {
                                const IconComponent = method.icon;
                                return (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedMethod(method.id);
                                            setData('payment_method', method.id);
                                        }}
                                        className={`p-4 border-2 rounded-lg transition-all duration-200 text-left ${
                                            selectedMethod === method.id
                                                ? 'border-green-500 bg-green-50 shadow-sm'
                                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${method.color} text-white`}>
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">{method.name}</p>
                                                <p className="text-sm text-slate-500">{method.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {errors.payment_method && (
                            <p className="text-red-600 text-sm flex items-center gap-1 mt-3">
                                <FiAlertCircle className="w-4 h-4" />
                                {errors.payment_method}
                            </p>
                        )}
                    </div>

                    {/* Bank Selection for Bank Transfer */}
                    {data.payment_method === 'bank_transfer' && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in-up animation-delay-250">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                Pilih Bank
                            </label>

                            <select
                                value={data.bank_code}
                                onChange={(e) => setData('bank_code', e.target.value)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                            >
                                <option value="">Pilih Bank</option>
                                {banks.map((bank) => (
                                    <option key={bank.code} value={bank.code}>
                                        {bank.name}
                                    </option>
                                ))}
                            </select>

                            {errors.bank_code && (
                                <p className="text-red-600 text-sm flex items-center gap-1 mt-1">
                                    <FiAlertCircle className="w-4 h-4" />
                                    {errors.bank_code}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in-up animation-delay-300">
                        <button
                            type="submit"
                            disabled={isSubmitting || !data.amount || !data.payment_method || (data.payment_method === 'bank_transfer' && !data.bank_code)}
                            className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 disabled:shadow-none"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <FiCreditCard className="w-5 h-5" />
                                    Top Up Sekarang
                                </>
                            )}
                        </button>

                        {data.amount && data.payment_method && (
                            <div className="mt-4 p-4 bg-slate-50 rounded-lg border-l-4 border-green-500">
                                <p className="text-sm text-slate-600">
                                    <span className="font-semibold text-slate-800 block mb-2">Ringkasan:</span>
                                    Jumlah: <span className="font-semibold text-slate-800">{formatCurrency(data.amount)}</span>
                                </p>
                                <p className="text-sm text-slate-600 mt-2">
                                    Metode: <span className="font-semibold text-slate-800">{paymentMethods.find(m => m.id === data.payment_method)?.name}</span>
                                    {data.payment_method === 'bank_transfer' && data.bank_code && (
                                        <span> ({banks.find(b => b.code === data.bank_code)?.name})</span>
                                    )}
                                </p>
                                <p className="text-xs text-slate-500 mt-3">
                                    {data.payment_method === 'bank_transfer' && 'Anda akan menerima nomor rekening virtual untuk transfer'}
                                    {data.payment_method === 'qris' && 'Anda akan melihat QR Code untuk di-scan'}
                                    {['gopay', 'ovo', 'dana'].includes(data.payment_method) && 'Anda akan di-redirect ke aplikasi e-wallet'}
                                </p>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

TopUp.layout = page => <DashboardLayout children={page} />;
