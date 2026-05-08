<<<<<<< HEAD
import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function TransactionItem({ icon: Icon, title, desc, date, amount, type, color, bg, border, amountClass = null, id, status, payment_method }) {
    const [confirming, setConfirming] = useState(false);

=======
import React from 'react';

export default function TransactionItem({ icon: Icon, title, desc, date, amount, type, color, bg, border, amountClass = null }) {
>>>>>>> 1f443c22033d10ff0b6b1a7903eb8bd0a8b0201d
    // Format mata uang Rupiah
    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    // Tentukan warna amount jika tidak ada amountClass khusus yang dioper
    let finalAmountClass = amountClass;
    if (!finalAmountClass) {
        if (amount > 0) {
            finalAmountClass = 'text-[#52933e]';
        } else if (type === 'Pengeluaran') {
            finalAmountClass = 'text-[#d85c49]'; // default merah untuk pengeluaran di dashboard
        } else {
            finalAmountClass = 'text-slate-800'; // default hitam jika kurang spesifik
        }
    }

<<<<<<< HEAD
    const handleConfirmPayment = async () => {
        if (!confirm('Konfirmasi pembayaran sudah berhasil?')) return;

        setConfirming(true);
        router.post('/api/payment/confirm', {
            transaction_id: id,
        }, {
            onSuccess: () => {
                window.location.href = route('topup.success', id);
            },
            onFinish: () => {
                setConfirming(false);
            }
        });
    };

=======
>>>>>>> 1f443c22033d10ff0b6b1a7903eb8bd0a8b0201d
    return (
        <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-100/50 group">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-[14px] ${bg} ${color} flex items-center justify-center text-xl shadow-sm border ${border} group-hover:scale-105 transition-transform flex-shrink-0`}>
                    {Icon && <Icon />}
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 text-base">{title}</h4>
                    {date ? (
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                            <span className="truncate max-w-[90px] sm:max-w-none">{desc}</span>
                            <span className="text-slate-300 font-bold flex-shrink-0">&bull;</span>
                            <span className="whitespace-nowrap">{date}</span>
<<<<<<< HEAD
                            {status && (
                                <>
                                    <span className="text-slate-300 font-bold flex-shrink-0">&bull;</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                        status === 'success' ? 'bg-green-100 text-green-700' :
                                        status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {status === 'success' ? 'Berhasil' : status === 'pending' ? 'Pending' : 'Gagal'}
                                    </span>
                                </>
                            )}
=======
>>>>>>> 1f443c22033d10ff0b6b1a7903eb8bd0a8b0201d
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{desc}</p>
                    )}
                </div>
            </div>
<<<<<<< HEAD
            <div className="text-right flex-shrink-0 flex items-center gap-2">
                <p className={`font-bold ${finalAmountClass}`}>
                    {amount > 0 ? '+' : ''}{formatRupiah(amount).replace(',00', '')}
                </p>
                {status === 'pending' && (
                    <button
                        onClick={handleConfirmPayment}
                        disabled={confirming}
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 disabled:bg-slate-400 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                        {confirming ? 'Loading...' : 'Confirm'}
                    </button>
                )}
=======
            <div className="text-right flex-shrink-0">
                <p className={`font-bold ${finalAmountClass}`}>
                    {amount > 0 ? '+' : ''}{formatRupiah(amount).replace(',00', '')}
                </p>
>>>>>>> 1f443c22033d10ff0b6b1a7903eb8bd0a8b0201d
            </div>
        </div>
    );
}
