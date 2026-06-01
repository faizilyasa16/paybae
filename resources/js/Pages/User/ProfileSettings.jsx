import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '../Component/DashboardLayout';
import { FiArrowLeft, FiMoon, FiSun, FiBell, FiHelpCircle, FiFileText, FiShield, FiChevronRight } from 'react-icons/fi';

export default function ProfileSettings() {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const theme = localStorage.getItem('theme');
            return theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    const toggleDarkMode = () => {
        const newValue = !darkMode;
        setDarkMode(newValue);
        if (newValue) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };
    const [notifications, setNotifications] = useState(true);

    return (
        <div className="relative overflow-hidden min-h-full pb-20">
            <Head title="Pengaturan - Paybae" />

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
                        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Pengaturan</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Sesuaikan preferensi aplikasi kamu.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Preferences */}
                    <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 dark:border-slate-800/60 overflow-hidden animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <h2 className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">Preferensi</h2>
                        </div>
                        <div className="p-2">
                            <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center">
                                        {darkMode ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
                                    </div>
                                    <span className="font-bold text-slate-700 dark:text-slate-200">Mode Gelap</span>
                                </div>
                                <button 
                                    onClick={toggleDarkMode}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${darkMode ? 'bg-[#52933e]' : 'bg-slate-200'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white dark:bg-slate-900 shadow-sm dark:shadow-none transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-3 border-t border-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
                                        <FiBell className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-700 dark:text-slate-200 block">Notifikasi</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">Pemberitahuan transaksi</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setNotifications(!notifications)}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${notifications ? 'bg-[#52933e]' : 'bg-slate-200'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white dark:bg-slate-900 shadow-sm dark:shadow-none transform transition-transform duration-300 ${notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Support & About */}
                    <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 dark:border-slate-800/60 overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <h2 className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase tracking-wider">Bantuan & Info</h2>
                        </div>
                        <div className="p-2 flex flex-col">
                            <Link href="/faq" className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                                    <FiHelpCircle className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-slate-700 dark:text-slate-200 flex-1">Pusat Bantuan (FAQ)</span>
                                <FiChevronRight className="w-5 h-5 text-slate-400" />
                            </Link>
                            
                            <Link href="/terms" className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left border-t border-slate-50">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center">
                                    <FiFileText className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-slate-700 dark:text-slate-200 flex-1">Syarat & Ketentuan</span>
                                <FiChevronRight className="w-5 h-5 text-slate-400" />
                            </Link>

                            <Link href="/privacy" className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left border-t border-slate-50">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center">
                                    <FiShield className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-slate-700 dark:text-slate-200 flex-1">Kebijakan Privasi</span>
                                <FiChevronRight className="w-5 h-5 text-slate-400" />
                            </Link>
                        </div>
                    </div>

                    <div className="text-center py-4 text-slate-400 text-xs font-semibold animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        Paybae App Versi 1.0.0
                    </div>
                </div>
            </div>
        </div>
    );
}

ProfileSettings.layout = page => <DashboardLayout children={page} />;