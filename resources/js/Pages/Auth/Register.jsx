import React from "react";
import { Link, Head, useForm } from '@inertiajs/react';
import {FcGoogle} from 'react-icons/fc';

import FormInput from "../Component/FormInput";
import PrimaryButton from "../Component/PrimaryButton";

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
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
                        
                        <FormInput 
                            label="Nama Lengkap"
                            type="text"
                            placeholder="Masukkan nama lengkap Anda"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            error={errors.name}
                        />

                        {/* Baris 1: Email/Username & Tanggal Lahir */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput 
                                label="Email / Username"
                                type="email"
                                placeholder="Masukkan email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                error={errors.email}
                            />
                            
                            <FormInput 
                                label="Tanggal Lahir"
                                type="date"
                                value={data.tanggal_lahir}
                                onChange={e => setData('tanggal_lahir', e.target.value)}
                                error={errors.tanggal_lahir}
                            />
                        </div>

                        {/* Baris 2: Password & Konfirmasi Password */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            <FormInput 
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                error={errors.password}
                            />

                            <FormInput 
                                label="Konfirmasi Password"
                                type="password"
                                placeholder="••••••••"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                error={errors.password_confirmation}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="mt-4">
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Mendaftar...' : 'Daftar'}
                            </PrimaryButton>
                        </div>
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