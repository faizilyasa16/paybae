import React from "react";
import { Link, usePage } from '@inertiajs/react';

export default function Navigation() {
    const { url, props } = usePage();
    const { auth } = props;
    const isHome = url === '/';

    const navItems = [
        { name: 'Beranda', href: '/', section: null },
        { name: 'Fitur', href: '/#fitur', section: 'fitur' },
        { name: 'Cara Kerja', href: '/#cara-kerja', section: 'cara-kerja' },
        { name: 'Tentang Kami', href: '/#tentang-kami', section: 'tentang-kami' },
        { name: 'FAQ', href: '/#faq', section: 'faq' },
    ];

    const handleScrollTo = (e, sectionId) => {
        if (isHome && sectionId) {
            e.preventDefault();
            const el = document.getElementById(sectionId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        // If not on home page, the Link will navigate to / and then we handle scroll via hash
    };

    const handleBerandaClick = (e) => {
        if (isHome) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="fixed top-6 w-full flex justify-center z-50 px-4 print:hidden">
            <nav className="flex items-center justify-between px-8 py-3 w-full max-w-[1200px] bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border border-white/40 dark:border-slate-800/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                {/* Logo Section */}
                <div className="flex items-center">
                    <Link href="/">
                        <img 
                            src="/img/paybae.png" 
                            alt="Logo Paybae" 
                            className="h-10 w-auto hover:scale-105 transition-transform duration-300 cursor-pointer drop-shadow-sm dark:shadow-none" 
                        />
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-1 sm:gap-8">
                    {navItems.map((item) => {
                        const linkClass = `relative text-sm font-semibold px-3 py-2 rounded-full transition-colors group text-slate-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400`;

                        if (!item.section) {
                            // Beranda
                            return (
                                <Link 
                                    key={item.name} 
                                    href={item.href} 
                                    className={linkClass}
                                    onClick={handleBerandaClick}
                                >
                                    {item.name}
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-green-600 dark:bg-green-400 rounded-full transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
                                </Link>
                            );
                        }

                        if (isHome) {
                            // On home page, use anchor scroll
                            return (
                                <a 
                                    key={item.name} 
                                    href={`#${item.section}`}
                                    className={linkClass}
                                    onClick={(e) => handleScrollTo(e, item.section)}
                                >
                                    {item.name}
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-green-600 dark:bg-green-400 rounded-full transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
                                </a>
                            );
                        }

                        // On other pages, navigate to home with hash
                        return (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                className={linkClass}
                            >
                                {item.name}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-green-600 dark:bg-green-400 rounded-full transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
                            </Link>
                        );
                    })}
                </div>

                {/* CTA Button */}
                <div className="flex items-center gap-2">
                    {auth?.user ? (
                        <Link href="/dashboard" className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm px-4 py-2 rounded-full shadow-sm transition-all duration-300 group">
                            <div className="w-7 h-7 rounded-full overflow-hidden bg-green-100 dark:bg-green-900/50 flex items-center justify-center border border-green-200 dark:border-green-800">
                                {auth.user.profile_photo_path ? (
                                    <img src={`/storage/${auth.user.profile_photo_path}`} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase">{auth.user.name.charAt(0)}</span>
                                )}
                            </div>
                            <span className="hidden sm:inline-block max-w-[100px] truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                Dashboard
                            </span>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="bg-white dark:bg-slate-900 hover:text-green-600 dark:hover:text-green-400 text-slate-600 dark:text-slate-300 font-medium text-sm px-4 sm:px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 border border-slate-100 dark:border-slate-800">
                                Masuk
                            </Link>
                            
                            <Link href="/register" className="hidden sm:inline-block bg-gradient-to-r from-green-600 to-lime-500 hover:from-green-700 hover:to-lime-600 text-white font-medium text-sm px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                                Daftar Sekarang
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </div>
    );
}
