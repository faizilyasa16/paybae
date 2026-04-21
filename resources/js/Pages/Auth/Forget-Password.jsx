import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function ForgetPassword() {
    return (
        <div className="relative min-h-screen font-sans text-gray-900 overflow-hidden flex bg-white">
            <Head title="Lupa Password - Paybae" />
            
            {/* Logo (Kembali ke Beranda) */}
            <div className="absolute top-8 left-6 sm:left-12 lg:left-24 xl:left-32 z-50">
                <Link href="/">
                    <img src="/img/paybae.png" alt="Paybae" className="h-8 hover:scale-105 transition-transform" />
                </Link>
            </div>

            {/* Kolom Kiri - Area Form Lupa Password */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 xl:px-32 z-10 bg-white shadow-2xl lg:shadow-none">
                
                <div className="w-full max-w-md mx-auto">
                    {/* Header Text */}
                    <div className="mb-10 text-center animate-fade-in-up">
                        <h1 className="text-4xl font-extrabold text-slate-800 mb-3 tracking-snug">Lupa Password?</h1>
                        <p className="text-slate-500">Jangan khawatir, masukkan email Anda yang terdaftar dan kami akan mengirimkan tautan reset password.</p>
                    </div>

                    {/* Form elements */}
                    <form action="#" className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Akun Paybae</label>
                            <input 
                                type="email" 
                                placeholder="Masukkan email Anda" 
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white" 
                            />
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className="mt-4 w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-green-500/30 hover:scale-[1.01] hover:shadow-green-500/50 transition-all duration-300"
                        >
                            Kirim Tautan Reset
                        </button>
                    </form>

                    {/* Footer Nav Link */}
                    <p className="mt-8 text-center text-sm text-slate-500 border-t border-slate-100 pt-8">
                        Ingat password Anda? <Link href="/login" className="text-green-600 font-semibold hover:underline">Kembali ke Login</Link>
                    </p>
                </div>
            </div>

            {/* Kolom Kanan - Gambar Mockup & Dekorasi */}
            <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-green-500 to-emerald-700 items-center justify-center overflow-hidden">
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
                        <h3 className="text-white font-bold text-xl mb-2">Akses Cepat Pulih</h3>
                        <p className="text-green-50 text-sm">Sistem kami terenkripsi dengan aman. Dapatkan kembali akses akun Anda secara instan.</p>
                    </div>
                </div>
            </div>

        </div>
    );
}