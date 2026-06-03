import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '../Component/DashboardLayout';
import { FiArrowLeft, FiLock, FiCheckCircle } from 'react-icons/fi';
import PrimaryButton from '../Component/PrimaryButton';

export default function ProfileSecurity() {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        old_pin: '',
        new_pin: '',
        confirm_pin: ''
    });

    const handleChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 6); // Max 6 digit, angka saja
        setData(e.target.name, val);
        clearErrors(e.target.name);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/profile/security/pin', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                alert('PIN transaksi berhasil diperbarui.');
            },
        });
    };

    return (
        <div className="relative overflow-hidden min-h-full pb-20">
            <Head title="Keamanan Akun - Paybae" />

            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50 dark:bg-green-900/20 rounded-full blur-[100px] -z-10 -translate-y-1/2 translate-x-1/3"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 md:pt-10">
                <div className="flex items-center gap-4 mb-8 flex-wrap animate-fade-in-up">
                    <Link
                        href="/profile"
                        className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#52933e] hover:border-green-200 transition-all"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Keamanan Akun</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Jaga kerahasiaan dan keamanan PIN kamu.</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 dark:border-slate-800/60 p-5 sm:p-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/20 text-[#52933e] flex items-center justify-center flex-shrink-0">
                            <FiLock className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800 dark:text-white text-lg">Ubah PIN Transaksi</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gunakan PIN 6 digit yang sulit ditebak orang lain.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">PIN Lama</label>
                            <input
                                type="password"
                                name="old_pin"
                                value={data.old_pin}
                                onChange={handleChange}
                                placeholder="••••••"
                                className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-3 outline-none transition-all text-xl tracking-[0.5em] font-bold ${errors.old_pin ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700 focus:border-[#52933e] focus:ring-1 focus:ring-[#52933e] text-slate-800 dark:text-white'}`}
                            />
                            {errors.old_pin && <p className="text-red-500 text-xs mt-1.5">{errors.old_pin}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">PIN Baru</label>
                            <input
                                type="password"
                                name="new_pin"
                                value={data.new_pin}
                                onChange={handleChange}
                                placeholder="••••••"
                                className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-3 outline-none transition-all text-xl tracking-[0.5em] font-bold ${errors.new_pin ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700 focus:border-[#52933e] focus:ring-1 focus:ring-[#52933e] text-slate-800 dark:text-white'}`}
                            />
                            {errors.new_pin && <p className="text-red-500 text-xs mt-1.5">{errors.new_pin}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">Konfirmasi PIN Baru</label>
                            <input
                                type="password"
                                name="confirm_pin"
                                value={data.confirm_pin}
                                onChange={handleChange}
                                placeholder="••••••"
                                className={`w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-3 outline-none transition-all text-xl tracking-[0.5em] font-bold ${errors.confirm_pin ? 'border-red-400 focus:ring-1 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700 focus:border-[#52933e] focus:ring-1 focus:ring-[#52933e] text-slate-800 dark:text-white'}`}
                            />
                            {errors.confirm_pin && <p className="text-red-500 text-xs mt-1.5">{errors.confirm_pin}</p>}
                        </div>

                        <div className="pt-4 relative z-10">
                            <PrimaryButton type="submit" disabled={processing} className="w-full bg-[#52933e] hover:bg-[#437a32]">
                                <span className="flex items-center justify-center gap-2 font-bold text-[15px]">
                                    {processing ? (
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <>
                                            <FiCheckCircle className="w-5 h-5" />
                                            Simpan PIN Baru
                                        </>
                                    )}
                                </span>
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

ProfileSecurity.layout = page => <DashboardLayout children={page} />;