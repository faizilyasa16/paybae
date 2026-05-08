import React from "react";
import { Link } from '@inertiajs/react';

export default function Navigation() {
    return (
        <div className="fixed top-6 w-full flex justify-center z-50 px-4">
            <nav className="flex items-center justify-between px-8 py-3 w-full max-w-[1200px] bg-white/70 backdrop-blur-lg border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                {/* Logo Section */}
                <div className="flex items-center">
                    <img 
                        src="/img/paybae.png" 
                        alt="Logo Paybae" 
                        className="h-10 w-auto hover:scale-105 transition-transform duration-300 cursor-pointer drop-shadow-sm" 
                    />
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-1 sm:gap-8">
                    {['Beranda', 'Fitur', 'Cara Kerja', 'Tentang', 'FAQ'].map((item) => (
                        <a 
                            key={item} 
                            href="#" 
                            className="relative text-sm font-semibold text-gray-600 hover:text-blue-600 px-3 py-2 rounded-full transition-colors group"
                        >
                            {item}
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-blue-600 rounded-full transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
                        </a>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="flex items-center gap-2">
                    <Link href="/login" className="bg-white hover:from-green-700 hover:to-green-500 text-gray-600 font-medium text-sm px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                        Masuk
                    </Link>
                    
                    <Link href="/register" className="bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white font-medium text-sm px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                        Daftar Sekarang
                    </Link>
                </div>
            </nav>
        </div>
    );
}