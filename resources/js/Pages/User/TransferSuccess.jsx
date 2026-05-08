import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { FiCheckCircle, FiArrowRight, FiHome } from 'react-icons/fi';
import DashboardLayout from '../Component/DashboardLayout';

export default function TransferSuccess({ transaction, user }) {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getBankName = (code) => {
        const banks = {
            bca: 'BCA',
            bni: 'BNI',
            bri: 'BRI',
            mandiri: 'Mandiri',
            btn: 'BTN',
            cimb: 'CIMB Niaga',
            ocbc: 'OCBC NISP',
            danamon: 'Danamon',
            maybank: 'Maybank',
            bukopin: 'Bukopin',
            syariah_mandiri: 'Mandiri Syariah',
        };
        return banks[code] || code;
    };

    return (
        <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
            <Head title="Transfer Berhasil - Paybae" />

            <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-20 translate-y-1/4 -translate-x-1/4"></div>

            <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-12">
                <div className={`text-center mb-10 transition-transform duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <div className="inline-flex p-5 rounded-full bg-green-500/10 text-green-600 mb-6">
                        <FiCheckCircle className="w-14 h-14" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">Transfer Berhasil!</h1>
                    <p className="text-slate-600 text-base sm:text-lg">Dana telah dikirim ke rekening tujuan. Periksa detail transfer di bawah ini.</p>
                </div>

                <div className={`bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-slate-200 transition-transform duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <div className="grid gap-5">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">Jumlah Transfer</span>
                            <span className="text-2xl font-bold text-slate-900">{formatCurrency(transaction.amount)}</span>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-2">Penerima</p>
                                <p className="text-slate-900 font-semibold">{transaction.recipient_name || '-'}</p>
                                <p className="text-slate-500 text-sm">{transaction.recipient_account || '-'}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-2">Bank Tujuan</p>
                                <p className="text-slate-900 font-semibold">{getBankName(transaction.recipient_bank)}</p>
                                <p className="text-slate-500 text-sm">Status: {transaction.status === 'success' ? 'Berhasil' : 'Menunggu'}</p>
                            </div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400 mb-2">Catatan</p>
                            <p className="text-slate-700 text-sm">{transaction.description || '-'}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <Link href={route('history.index')} className="block text-center rounded-2xl bg-green-600 hover:bg-green-700 text-white py-4 font-semibold transition">
                        Lihat Riwayat
                    </Link>
                    <Link href={route('dashboard.index')} className="block text-center rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 py-4 font-semibold transition">
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}

TransferSuccess.layout = page => <DashboardLayout children={page} />;
