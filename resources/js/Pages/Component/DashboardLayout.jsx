import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FiHome, FiClock, FiUser, FiGrid, FiLogOut, FiPieChart, FiX, FiFileText } from 'react-icons/fi';
import { BiScan } from 'react-icons/bi';

export default function DashboardLayout({ children }) {
    const { url, props } = usePage();
    const user = props.auth?.user || { name: 'User' };
    
    // State untuk Modal Smart Hub
    const [isSmartHubOpen, setIsSmartHubOpen] = useState(false);

    // Menu untuk Bottom Navbar (Mobile)
    const bottomNavItems = [
        { name: 'Home', href: '/dashboard', icon: FiHome },
        { name: 'Riwayat', href: '/history', icon: FiClock },
        { name: 'Smart Hub', href: '/scan', icon: BiScan, isPrimary: true },
        { name: 'Insight', href: '/insight', icon: FiPieChart },
        { name: user.name, href: '/profile', icon: FiUser },
    ];

    // Menu untuk Sidebar (Desktop)
    const sidebarItems = [
        { name: 'Dashboard', href: '/dashboard', icon: FiGrid },
        { name: 'Riwayat Transaksi', href: '/history', icon: FiClock },
        { name: 'Smart Hub', href: '/scan', icon: BiScan },
        { name: 'Insight Akun', href: '/insight', icon: FiPieChart },
        { name: 'Profil Saya', href: '/profile', icon: FiUser },
    ];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const theme = localStorage.getItem('theme');
            if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, []);

    return (
        <div className="flex h-screen bg-[#fafaf9] dark:bg-slate-950 font-sans overflow-hidden">
            {/* Sidebar untuk Desktop (Sembunyi di Mobile) */}
            <aside className="hidden md:flex md:w-64 md:flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 z-20">
                <div className="p-6 flex items-center gap-2">
                    <img src="/img/paybae.png" alt="Paybae" className="w-auto h-15" />
                </div>
                
                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const isActive = url.startsWith(item.href) || (item.name === 'Smart Hub' && url.startsWith('/scan-struk'));
                        
                        if (item.name === 'Smart Hub') {
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => setIsSmartHubOpen(true)}
                                    className={`flex w-full items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all ${
                                        isActive 
                                        ? 'bg-[#f2fbf4] text-[#52933e]' 
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-[#52933e]' : ''}`} />
                                    {item.name}
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all ${
                                    isActive 
                                    ? 'bg-[#f2fbf4] text-[#52933e]' 
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-[#52933e]' : ''}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <Link href="/logout" method="post" as="button" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-500 hover:bg-red-50 w-full transition-all">
                        <FiLogOut className="w-5 h-5" />
                        Keluar
                    </Link>
                </div>
            </aside>

            {/* Konten Utama (Scrollable) */}
            <main className="flex-1 relative overflow-y-auto w-full">
                {/* Area konten, padding bottom lebih besar di mobile agar tidak tertutup bottom navbar */}
                <div className="pb-28 md:pb-8 relative min-h-full">
                    {children}
                </div>
            </main>

            {/* Bottom Navbar untuk Mobile (Sembunyi di Desktop) */}
            <div className="fixed bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 rounded-3xl flex justify-around items-end p-2 md:hidden z-50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                {bottomNavItems.map((item) => {
                    const isActive = url.startsWith(item.href) || (item.name === 'Smart Hub' && url.startsWith('/scan-struk'));
                    
                    if (item.isPrimary) {
                        return (
                            <button key={item.name} onClick={() => setIsSmartHubOpen(true)} className="flex flex-col items-center justify-center -mt-6 z-10">
                                <div className="w-14 h-14 bg-gradient-to-tr from-[#52933e] to-[#61a94a] rounded-full flex items-center justify-center shadow-lg shadow-green-600/30 text-white transform hover:scale-105 transition-transform border-4 border-[#fafaf9] dark:border-slate-950">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 mt-1.5">{item.name}</span>
                            </button>
                        )
                    }

                    return (
                        <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center p-2 min-w-[64px]">
                            {item.href === '/profile' ? (
                                <div className={`p-[2px] rounded-full transition-all ${isActive ? 'bg-[#52933e]' : 'bg-transparent'}`}>
                                    {user.profile?.profile_picture ? (
                                        <div className="w-7 h-7 rounded-full overflow-hidden border border-white dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0">
                                            <img 
                                                src={`/storage/${user.profile.profile_picture}`} 
                                                alt={user.name} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center border border-white dark:border-slate-800 text-green-600 font-bold text-xs flex-shrink-0">
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                                    <item.icon className={`w-6 h-6 ${isActive ? 'text-[#52933e]' : 'text-slate-400'}`} />
                                </div>
                            )}
                            <span className={`text-[10px] font-bold mt-1 ${isActive ? 'text-[#52933e]' : 'text-slate-500 dark:text-slate-400'}`}>
                                {item.name}
                            </span>
                        </Link>
                    )
                })}
            </div>

            {/* Smart Hub Modal / Bottom Sheet */}
            {isSmartHubOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsSmartHubOpen(false)}
                    ></div>
                    
                    {/* Modal Content */}
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-fade-in-up transform transition-all border border-slate-100 dark:border-slate-800">
                        
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">Smart Hub</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">Pilih aksi pindai yang diinginkan</p>
                            </div>
                            <button 
                                onClick={() => setIsSmartHubOpen(false)}
                                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* QRIS Scan */}
                            <Link 
                                href="/scan" 
                                onClick={() => setIsSmartHubOpen(false)}
                                className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-[#52933e] hover:bg-green-50/50 dark:hover:bg-green-900/20 transition-all group"
                            >
                                <div className="w-14 h-14 bg-white dark:bg-slate-800 shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#52933e] group-hover:text-white transition-all text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700">
                                    <BiScan className="w-7 h-7" />
                                </div>
                                <span className="font-bold text-slate-800 dark:text-white text-[15px]">Scan QR</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">Bayar / Transfer</span>
                            </Link>

                            {/* Struk Scan */}
                            <Link 
                                href="/scan-struk" 
                                onClick={() => setIsSmartHubOpen(false)}
                                className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group"
                            >
                                <div className="w-14 h-14 bg-white dark:bg-slate-800 shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700">
                                    <FiFileText className="w-7 h-7" />
                                </div>
                                <span className="font-bold text-slate-800 dark:text-white text-[15px]">Scan Struk</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">Catat Pengeluaran</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}