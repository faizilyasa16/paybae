import React, { useState } from "react";
import { Link, usePage } from '@inertiajs/react';
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navigation() {
    const { url, props } = usePage();
    const { auth } = props;
    const isHome = url === '/';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Beranda', href: '/', section: null },
        { name: 'Fitur', href: '/#fitur', section: 'fitur' },
        { name: 'Cara Kerja', href: '/#cara-kerja', section: 'cara-kerja' },
        { name: 'Tentang Kami', href: '/#tentang-kami', section: 'tentang-kami' },
        { name: 'FAQ', href: '/#faq', section: 'faq' },
    ];

    const handleScrollTo = (e, sectionId) => {
        setIsMobileMenuOpen(false); // Close mobile menu when clicked
        if (isHome && sectionId) {
            e.preventDefault();
            const el = document.getElementById(sectionId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const handleBerandaClick = (e) => {
        setIsMobileMenuOpen(false); // Close mobile menu when clicked
        if (isHome) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="fixed top-6 w-full flex justify-center z-50 px-4 print:hidden">
            <nav className="flex items-center justify-between px-6 py-3 w-full max-w-[1200px] bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border border-white/40 dark:border-slate-800/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                
                {/* Logo Section */}
                <div className="flex items-center">
                    <Link href="/">
                        <img 
                            src="/img/paybae.png" 
                            alt="Logo Paybae" 
                            className="h-8 md:h-10 w-auto hover:scale-105 transition-transform duration-300 cursor-pointer drop-shadow-sm dark:shadow-none" 
                        />
                    </Link>
                </div>

                {/* Navigation Links - Desktop Only */}
                <div className="hidden lg:flex items-center gap-1 sm:gap-8">
                    {navItems.map((item) => {
                        const linkClass = `relative text-sm font-semibold px-3 py-2 rounded-full transition-colors group text-slate-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400`;

                        if (!item.section) {
                            return (
                                <Link key={item.name} href={item.href} className={linkClass} onClick={handleBerandaClick}>
                                    {item.name}
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-green-600 dark:bg-green-400 rounded-full transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
                                </Link>
                            );
                        }

                        if (isHome) {
                            return (
                                <a key={item.name} href={`#${item.section}`} className={linkClass} onClick={(e) => handleScrollTo(e, item.section)}>
                                    {item.name}
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-green-600 dark:bg-green-400 rounded-full transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
                                </a>
                            );
                        }

                        return (
                            <Link key={item.name} href={item.href} className={linkClass}>
                                {item.name}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-green-600 dark:bg-green-400 rounded-full transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
                            </Link>
                        );
                    })}
                </div>

                {/* CTA Button & Mobile Toggle */}
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
                            
                            <Link href="/register" className="hidden lg:inline-block bg-gradient-to-r from-green-600 to-lime-500 hover:from-green-700 hover:to-lime-600 text-white font-medium text-sm px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                                Daftar Sekarang
                            </Link>
                        </>
                    )}

                    {/* Hamburger Toggle */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                        className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-green-600 transition ml-2 focus:outline-none"
                    >
                        {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="absolute top-[70px] left-4 right-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl p-6 lg:hidden flex flex-col gap-4 origin-top animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col gap-2">
                        {navItems.map((item) => {
                            const mobileLinkClass = "block w-full text-left font-medium text-slate-700 dark:text-slate-200 hover:text-green-600 dark:hover:text-green-400 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-3 rounded-xl transition-all";
                            
                            if (!item.section) {
                                return (
                                    <Link key={item.name} href={item.href} className={mobileLinkClass} onClick={handleBerandaClick}>
                                        {item.name}
                                    </Link>
                                );
                            }

                            if (isHome) {
                                return (
                                    <a key={item.name} href={`#${item.section}`} className={mobileLinkClass} onClick={(e) => handleScrollTo(e, item.section)}>
                                        {item.name}
                                    </a>
                                );
                            }

                            return (
                                <Link key={item.name} href={item.href} className={mobileLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                    
                    {!auth?.user && (
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                            <Link href="/register" className="block w-full text-center bg-gradient-to-r from-green-600 to-lime-500 text-white font-semibold py-3 rounded-xl shadow-md">
                                Daftar Sekarang
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
