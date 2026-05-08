import React from "react";
<<<<<<< HEAD
import Navbar from "../Component/Navigation";

export default function Home() {
    return (
        <div>
            <Navbar />
            <main style={{padding: '20px', textAlign: 'center'}}>
                <h1 style={{color: '#22c55e', fontSize: '2rem', marginBottom: '1rem'}}>
                    Paybae - Home Page
                </h1>
                <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}>
                    Selamat datang di aplikasi Paybae!
                </p>
                <p style={{color: '#666'}}>
                    Aplikasi pembayaran digital yang aman dan mudah.
                </p>
                <div style={{marginTop: '2rem'}}>
                    <a
                        href="/login"
                        style={{
                            display: 'inline-block',
                            padding: '10px 20px',
                            backgroundColor: '#22c55e',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '5px',
                            marginRight: '10px'
                        }}
                    >
                        Login
                    </a>
                    <a
                        href="/register"
                        style={{
                            display: 'inline-block',
                            padding: '10px 20px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '5px'
                        }}
                    >
                        Register
                    </a>
                </div>
            </main>
        </div>
=======
import {FaPlay, FaShieldAlt, FaLock, FaCheckCircle} from "react-icons/fa";
import Navbar from "../Component/Navigation";
export default function Home() {
    return (
    
        <>
        <Navbar />
        <main className="flex flex-col lg:flex-row items-center justify-between min-h-screen px-6 lg:px-20 pt-32 pb-20 z-10 relative max-w-7xl mx-auto w-full gap-12">
            
            {/* LEFT COLUMN: Text Content */}
            <div className="flex-1 flex flex-col items-start text-left mt-10 lg:mt-0">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-8 border border-green-200/50 shadow-sm hover:shadow-md transition-shadow cursor-default animate-fade-in-up">
                    Kelola Keuanganmu, Hidup Lebih Tenang
                </div>
                
                {/* Main Headline */}
                <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-slate-800 leading-tight drop-shadow-sm">
                    Atur Keuangan, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                        Capai Tujuanmu
                    </span>
                </h1>
                
                {/* Subheadline */}
                <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-lg leading-relaxed">
                    Platform pembayaran digital masa depan yang memberi Anda kendali penuh atas keuangan bisnis dan personal. Transaksi selesai dalam hitungan detik.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold text-lg shadow-lg shadow-green-500/30 hover:scale-[1.02] hover:shadow-green-500/50 transition-all duration-300">
                        Mulai Sekarang
                    </button>
                    <a href="#" className="flex items-center gap-3 text-slate-700 hover:text-green-600 transition">
                        
                        {/* ICON BULAT */}
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
                            <FaPlay className="text-sm ml-[2px]" />
                        </span>

                        {/* TEXT */}
                        <span className="font-semibold">
                            Pelajari Cara Kerja
                        </span>

                    </a>
                </div>
                
                {/* Stats / Social Proof */}
                <div className="pt-8 border-t border-slate-200/60 w-full flex flex-row items-center gap-4 lg:gap-8 flex-wrap">
                    <div className="flex items-center gap-3">
                        <FaShieldAlt className="text-lg text-green-600" />
                        <p className="text-sm font-medium text-slate-600">Aman & Terpercaya</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <FaLock className="text-lg text-green-600" />
                        <p className="text-sm font-medium text-slate-600">100% Terlindungi</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <FaCheckCircle className="text-lg text-green-600" />
                        <p className="text-sm font-medium text-slate-600">Gratis Digunakan</p>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Image Mockup */}
            <div className="flex-1 flex justify-center lg:justify-end relative w-full lg:w-auto mt-16 lg:mt-0">
                {/* Background glow around the image */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-green-200 to-emerald-100 rounded-full blur-3xl opacity-60 -z-10"></div>
                
                {/* Generated Image */}
                <img 
                    src="/img/mockup-2.png" 
                    alt="Review Dashboard Aplikasi" 
                    className="w-full max-w-[320px] lg:max-w-md xl:max-w-lg object-contain drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500" 
                />
            </div>
            
        </main>
        </>
>>>>>>> 1f443c22033d10ff0b6b1a7903eb8bd0a8b0201d
    );
}