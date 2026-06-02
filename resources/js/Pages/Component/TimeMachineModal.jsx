import React, { useState } from 'react';
import { FiX, FiClock, FiArrowRight, FiAlertCircle, FiTrendingDown, FiLoader } from 'react-icons/fi';
import axios from 'axios';

export default function TimeMachineModal({ isOpen, onClose, balance = 0, totalIncome = 0, totalExpense = 0 }) {
    const [nominal, setNominal] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);

    if (!isOpen) return null;

    const handleClose = () => {
        setNominal('');
        setResult(null);
        setIsLoading(false);
        onClose();
    };

    const handleSimulate = async (e) => {
        e.preventDefault();
        if (!nominal || isNaN(nominal) || Number(nominal) <= 0) return;

        setIsLoading(true);
        setResult(null);

        try {
            const response = await axios.post('/api/simulate', {
                nominal: Number(nominal)
            });
            setResult(response.data);
        } catch (error) {
            console.error("Simulation error:", error);
            // Fallback client-side calculation if API error
            const simNominal = Number(nominal);
            const afterBalance = balance - simNominal;
            const income = totalIncome > 0 ? totalIncome : 3000000; 
            const savingsRateBefore = ((income - totalExpense) / income) * 100;
            const savingsRateAfter = ((income - (totalExpense + simNominal)) / income) * 100; 
            let warningText = "";
            let status = "";
            if (savingsRateAfter < 0) {
                warningText = "Transaksi ini sangat berbahaya! Pengeluaranmu akan melebihi total pendapatanmu.";
                status = "danger";
            } else if (savingsRateAfter < 10) {
                warningText = "Peringatan: Rasio tabunganmu akan berada di bawah batas aman (10%). Pertimbangkan kembali.";
                status = "warning";
            } else if (savingsRateAfter < savingsRateBefore - 10) {
                warningText = "Transaksi ini cukup besar dan akan memotong drastis target tabunganmu.";
                status = "warning";
            } else {
                warningText = "Pengeluaran ini masih dalam batas wajar, pastikan barang ini adalah kebutuhan yang bermanfaat.";
                status = "safe";
            }
            setResult({
                before: balance,
                after: afterBalance,
                savingsRateBefore: `${savingsRateBefore.toFixed(1)}%`,
                savingsRateAfter: `${savingsRateAfter.toFixed(1)}%`,
                warning: warningText,
                status: status
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/50 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl relative flex flex-col animate-fade-in-up max-h-[90vh]">
                <div className="flex justify-between items-center p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <FiClock className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Time Machine</h3>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 rounded-full transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 sm:p-6 pb-8 overflow-y-auto">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                        Masukkan harga barang yang ingin kamu beli hari ini. AI UrBae akan memprediksi dampaknya ke keuanganmu minggu depan.
                    </p>
                    <form onSubmit={handleSimulate} className="mb-6">
                        <div className="relative mb-4">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                            <input 
                                type="number" 
                                value={nominal}
                                onChange={(e) => {
                                    setNominal(e.target.value);
                                    setResult(null);
                                }}
                                placeholder="Misal: 150000"
                                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500/70 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#61a94a] focus:ring-1 focus:ring-[#61a94a] transition-all"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={isLoading || !nominal}
                            className="w-full bg-[#61a94a] hover:bg-[#4e8d3b] disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <><FiLoader className="w-5 h-5 animate-spin" /> Menganalisis Masa Depan...</>
                            ) : (
                                "Simulasikan Dampaknya"
                            )}
                        </button>
                    </form>
                    {result && (
                        <div className="animate-fade-in space-y-4">
                            <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800/50 flex items-center justify-between">
                                <div className="text-center w-[45%]">
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Jika Tidak Beli</p>
                                    <p className="text-base font-bold text-[#61a94a]">
                                        Rp {result.before.toLocaleString('id-ID')}
                                    </p>
                                </div>
                                <div className="text-slate-300 dark:text-slate-600">
                                    <FiArrowRight className="w-5 h-5" />
                                </div>
                                <div className="text-center w-[45%]">
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Jika Beli</p>
                                    <p className="text-base font-bold text-rose-500 flex items-center justify-center gap-1">
                                        <FiTrendingDown className="w-4 h-4" />
                                        Rp {result.after.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>

                            <div className={`flex gap-3 items-start p-4 rounded-2xl border ${
                                result.status === 'safe' 
                                    ? 'bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/20' 
                                    : result.status === 'warning'
                                        ? 'bg-orange-50 border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/20'
                                        : 'bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20'
                            }`}>
                                <FiAlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                                    result.status === 'safe' ? 'text-green-600' : result.status === 'warning' ? 'text-orange-500' : 'text-rose-500'
                                }`} />
                                <div className="text-sm">
                                    <strong className={`block mb-0.5 ${
                                        result.status === 'safe' ? 'text-green-700 dark:text-green-400' : result.status === 'warning' ? 'text-orange-700 dark:text-orange-400' : 'text-rose-700 dark:text-rose-400'
                                    }`}>Analisis UrBae:</strong>
                                    <p className={`leading-relaxed ${
                                        result.status === 'safe' ? 'text-green-600 dark:text-green-300/90' : result.status === 'warning' ? 'text-orange-600 dark:text-orange-300/90' : 'text-rose-600 dark:text-rose-300/90'
                                    }`}>
                                        {result.warning}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start bg-rose-50 dark:bg-rose-500/10 p-4 rounded-2xl border border-rose-100 dark:border-rose-500/20">
                                <FiTrendingDown className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <strong className="block text-rose-700 dark:text-rose-400 mb-0.5">Dampak Tabungan:</strong>
                                    <p className="text-rose-600 dark:text-rose-300/90 leading-relaxed">
                                        Rasio tabunganmu akan turun menjadi <span className="font-bold">{result.savingsRateAfter}</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
