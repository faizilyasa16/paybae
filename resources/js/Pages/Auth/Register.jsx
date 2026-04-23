import React from "react";
import { Link, Head, useForm } from '@inertiajs/react';
import {FcGoogle} from 'react-icons/fc';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        tanggal_lahir: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register'); 
    };

    return (
        <div className="relative min-h-screen font-sans text-gray-900 flex bg-white">
            <Head title="Login - Paybae" /> 
            {/* Logo (Kembali ke Beranda) - Absolute sama seperti Login */}
            <div className="absolute top-8 left-6 sm:left-12 lg:left-24 xl:left-32 z-50">
                <Link href="/">
                    <img src="/img/paybae.png" alt="Paybae" className="h-8 hover:scale-105 transition-transform" />
                </Link>
            </div>

            {/* Kolom Kiri - Area Form Register */}
            <div className="flex-1 flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-24 xl:px-32 z-10 bg-white shadow-2xl lg:shadow-none min-h-screen overflow-y-auto pt-24 lg:pt-16">
                
                <div className="w-full max-w-lg mx-auto">
                    {/* Header Text */}
                    <div className="mb-8 text-center animate-fade-in-up">
                        <h1 className="text-4xl font-extrabold text-slate-800 mb-3 tracking-snug">Buat Akun</h1>
                        <p className="text-slate-500">Daftarkan akun Paybae Anda untuk melanjutkan.</p>
                    </div>

                    {/* Form elements */}
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        
                        {/* Baris 1: Email/Username & Tanggal Lahir */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email / Username</label>
                                <input 
                                    type="text" 
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Masukkan email" 
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" 
                                />
                                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Tanggal Lahir</label>
                                <input 
                                    type="date" 
                                    name="tanggal_lahir"
                                    value={data.tanggal_lahir}
                                    onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white text-slate-700" 
                                />
                                {errors.tanggal_lahir && <div className="text-red-500 text-xs mt-1">{errors.tanggal_lahir}</div>}
                            </div>
                        </div>

                        {/* Baris 2: Password & Konfirmasi Password */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                                <input 
                                    type="password" 
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••" 
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" 
                                />
                                {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Konfirmasi Password</label>
                                <input 
                                    type="password" 
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••" 
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" 
                                />
                                {errors.password_confirmation && <div className="text-red-500 text-xs mt-1">{errors.password_confirmation}</div>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={processing}
                            className={`mt-4 w-full bg-gradient-to-r text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-green-500/30 transition-all duration-300 ${processing ? 'from-green-400 to-emerald-400 opacity-70 cursor-not-allowed' : 'from-green-600 to-emerald-500 hover:scale-[1.01] hover:shadow-green-500/50'}`}
                        >
                            {processing ? 'Mendaftar...' : 'Daftar'}
                        </button>
                    </form>

                    {/* Divider 'Atau' */}
                    <div className="flex items-center my-5">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">atau daftar dengan</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    {/* Google Login Button */}
                    <a href="#" className="block w-full">
                        <button className="flex items-center justify-center gap-3 w-full bg-white text-slate-700 font-semibold py-3.5 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                            <FcGoogle className="text-2xl" />
                            <span>Google</span>
                        </button>
                    </a>

                    {/* Footer Register Link */}
                    <p className="mt-6 text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
                        Sudah punya akun? <Link href="/login" className="text-green-600 font-semibold hover:underline">Login Sekarang</Link>
                    </p>
                </div>
            </div>

            {/* Kolom Kanan - Gambar Mockup & Dekorasi */}
            <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-green-500 to-emerald-700 items-center justify-center overflow-hidden min-h-screen sticky top-0">
                {/* Background Decor Elements */}
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-white/20 blur-3xl rounded-full"></div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-green-400/30 blur-3xl rounded-full"></div>

                <div className="relative z-10 flex flex-col items-center px-12">
                    <img 
                        src="/img/mockup-2.png" 
                        alt="Aplikasi Paybae" 
                        className="w-full max-w-[400px] xl:max-w-[500px] object-contain drop-shadow-2xl hover:-translate-y-3 transition-transform duration-700" 
                    />
                    
                    {/* Glassmorphism Testimonial / Features Card */}
                    <div className="mt-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-sm text-center shadow-2xl hover:bg-white/20 transition-colors duration-300">
                        <h3 className="text-white font-bold text-xl mb-2">Transaksi Instan & Aman</h3>
                        <p className="text-green-50 text-sm">Kelola semua pembayaran Anda dalam satu ketukan dengan aman dan nyaman tanpa hambatan.</p>
                    </div>
                </div>
            </div>

        </div>
    );
}