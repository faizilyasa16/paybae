import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import DashboardLayout from '../Component/DashboardLayout';
import { FiUser, FiSettings, FiShield, FiLogOut, FiChevronRight } from 'react-icons/fi';

export default function Profile() {
    const { auth } = usePage().props;
    const user = auth?.user || { name: 'Ahmad', email: 'ahmad@example.com', no_hp: '081234567890' };

    const menuItems = [
        {
            title: 'Profil Saya',
            description: 'Ubah data diri dan foto profil',
            icon: FiUser,
            href: '/profile/edit',
            color: 'text-blue-500',
            bg: 'bg-blue-50',
            borderColor: 'border-blue-100'
        },
        {
            title: 'Pengaturan',
            description: 'Atur preferensi aplikasi',
            icon: FiSettings,
            href: '/settings',
            color: 'text-slate-500',
            bg: 'bg-slate-50',
            borderColor: 'border-slate-100'
        },
        {
            title: 'Keamanan Akun',
            description: 'Password, PIN, dan biometrik',
            icon: FiShield,
            href: '/security',
            color: 'text-[#52933e]',
            bg: 'bg-[#f2fbf4]',
            borderColor: 'border-green-100'
        }
    ];

    return (
        <div className="relative overflow-hidden min-h-full pb-20">
            <Head title="Profil - Paybae" />

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50 rounded-full blur-[100px] -z-10 -translate-y-1/2 translate-x-1/3"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 md:pt-10">
                {/* Header Profile Section */}
                <div className="flex flex-col items-center mb-8 animate-fade-in-up">
                    <div className="relative mb-4">
                        {user.profile?.profile_picture ? (
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                <img 
                                    src={`/storage/${user.profile.profile_picture}`} 
                                    alt={user.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#61a94a] to-[#80c868] flex items-center justify-center border-4 border-white shadow-lg text-white font-extrabold text-4xl">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                        )}
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-800">{user.name}</h1>
                    <p className="text-slate-500 font-medium">{user.no_hp || user.email || 'ahmad@paybae.id'}</p>
                    <div className="mt-3 px-3 py-1 bg-green-50 text-[#52933e] rounded-full text-xs font-bold border border-green-100">
                        Member Premium
                    </div>
                </div>

                {/* Vertical Navigation */}
                <div className="bg-white rounded-[24px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 overflow-hidden animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <div className="p-2 flex flex-col gap-1">
                        {menuItems.map((item, index) => (
                            <Link 
                                key={index} 
                                href={item.href}
                                className="flex items-center gap-4 p-4 rounded-[16px] hover:bg-slate-50 transition-colors group"
                            >
                                <div className={`w-12 h-12 rounded-2xl ${item.bg} border ${item.borderColor} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                                    <item.icon className={`w-6 h-6 ${item.color}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800 text-base">{item.title}</h3>
                                    <p className="text-sm text-slate-500">{item.description}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                                    <FiChevronRight className="w-5 h-5" />
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="border-t border-slate-100 mx-4 my-2"></div>

                    <div className="p-2">
                        <Link 
                            href="/logout" 
                            method="post" 
                            as="button"
                            className="w-full flex items-center gap-4 p-4 rounded-[16px] hover:bg-red-50 transition-colors group cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                <FiLogOut className="w-6 h-6 text-red-500" />
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-bold text-red-600 text-base">Keluar</h3>
                                <p className="text-sm text-red-400">Akhiri sesi Anda saat ini</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

Profile.layout = page => <DashboardLayout children={page} />;