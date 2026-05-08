<<<<<<< HEAD
=======

>>>>>>> 1f443c22033d10ff0b6b1a7903eb8bd0a8b0201d
import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FiHome, FiClock, FiUser, FiSettings, FiGrid, FiCreditCard, FiLogOut, FiPieChart } from 'react-icons/fi';
import { BiScan } from 'react-icons/bi';

export default function DashboardLayout({ children }) {
    const { url, props } = usePage();
    const user = props.auth?.user || { name: 'User' };

    // Menu untuk Bottom Navbar (Mobile)
    const bottomNavItems = [
        { name: 'Home', href: '/dashboard', icon: FiHome },
        { name: 'Riwayat', href: '/history', icon: FiClock },
        { name: 'Scan', href: '/scan', icon: BiScan, isPrimary: true },
        { name: 'Insight', href: '/insight', icon: FiPieChart },
        { name: user.name, href: '/profile', icon: FiUser },
    ];

    // Menu untuk Sidebar (Desktop)
    const sidebarItems = [
        { name: 'Dashboard', href: '/dashboard', icon: FiGrid },
        { name: 'Riwayat Transaksi', href: '/history', icon: FiClock },
<<<<<<< HEAD
        { name: 'Transfer & Bayar', href: '/transfer', icon: BiScan },
=======
        { name: 'Transfer & Bayar', href: '/scan', icon: BiScan },
>>>>>>> 1f443c22033d10ff0b6b1a7903eb8bd0a8b0201d
        { name: 'Insight Akun', href: '/insight', icon: FiPieChart },
        { name: 'Profil Saya', href: '/profile', icon: FiUser },
    ];

    return (
        <div className="flex h-screen bg-[#fafaf9] font-sans overflow-hidden">
            {/* Sidebar untuk Desktop (Sembunyi di Mobile) */}
            <aside className="hidden md:flex md:w-64 md:flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] bg-white border-r border-slate-100 z-20">
                <div className="p-6 flex items-center gap-2">
                    <img src="/img/Paybae.png" alt="Paybae" className="w-auto h-15" />
                </div>
                
                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all ${
                                    isActive 
                                    ? 'bg-[#f2fbf4] text-[#52933e]' 
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-[#52933e]' : ''}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                
                <div className="p-4 border-t border-slate-100">
                    <Link href="/logout" method="post" as="button" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-red-500 hover:bg-red-50 w-full transition-all">
                        <FiLogOut className="w-5 h-5" />
                        Keluar
                    </Link>
                </div>
            </aside>

            {/* Konten Utama (Scrollable) */}
            <main className="flex-1 relative overflow-y-auto w-full">
                {/* Area konten, padding bottom lebih besar di mobile agar tidak tertutup bottom navbar */}
                <div className="pb-24 md:pb-8 relative min-h-full">
                    {children}
                </div>
            </main>

            {/* Bottom Navbar untuk Mobile (Sembunyi di Desktop) */}
            <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-200/60 flex justify-around items-end p-2 pb-3 md:hidden z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
                {bottomNavItems.map((item) => {
                    const isActive = url.startsWith(item.href);
                    
                    if (item.isPrimary) {
                        return (
                            <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center -mt-6 z-10">
                                <div className="w-14 h-14 bg-gradient-to-tr from-[#52933e] to-[#61a94a] rounded-full flex items-center justify-center shadow-lg shadow-green-600/30 text-white transform hover:scale-105 transition-transform border-4 border-[#fafaf9]">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-700 mt-1.5">{item.name}</span>
                            </Link>
                        )
                    }

                    return (
                        <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center p-2 min-w-[64px]">
                            {item.href === '/profile' ? (
                                <div className={`p-[2px] rounded-full transition-all ${isActive ? 'bg-[#52933e]' : 'bg-transparent'}`}>
                                    {user.profile?.profile_picture ? (
                                        <div className="w-7 h-7 rounded-full overflow-hidden border border-white bg-white flex-shrink-0">
                                            <img 
                                                src={`/storage/${user.profile.profile_picture}`} 
                                                alt={user.name} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center border border-white text-green-600 font-bold text-xs flex-shrink-0">
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-green-50' : ''}`}>
                                    <item.icon className={`w-6 h-6 ${isActive ? 'text-[#52933e]' : 'text-slate-400'}`} />
                                </div>
                            )}
                            <span className={`text-[10px] font-bold mt-1 ${isActive ? 'text-[#52933e]' : 'text-slate-500'}`}>
                                {item.name}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}