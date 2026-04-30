import React from 'react';

export default function TransactionItem({ icon: Icon, title, desc, date, amount, type, color, bg, border, amountClass = null }) {
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
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{desc}</p>
                    )}
                </div>
            </div>
            <div className="text-right flex-shrink-0">
                <p className={`font-bold ${finalAmountClass}`}>
                    {amount > 0 ? '+' : ''}{formatRupiah(amount).replace(',00', '')}
                </p>
            </div>
        </div>
    );
}
