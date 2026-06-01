import React, { useState } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import DashboardLayout from '../Component/DashboardLayout';
import { FiArrowLeft, FiCamera, FiSave, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import FormInput from '../Component/FormInput';
import PrimaryButton from '../Component/PrimaryButton';

export default function ProfileEdit() {
    const { auth } = usePage().props;
    const user = auth?.user || { name: 'Ahmad', email: 'ahmad@example.com' };

    const { data, setData, post, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        no_hp: user.profile?.phone || '',
        avatar: null,
    });

    const [avatarPreview, setAvatarPreview] = useState(
        user.profile?.profile_picture ? `/storage/${user.profile.profile_picture}` : null
    );

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/profile/edit', {
            forceFormData: true,
            onSuccess: () => {
                alert('Profil berhasil diperbarui!');
            }
        });
    };

    return (
        <div className="relative overflow-hidden min-h-full pb-20">
            <Head title="Profil Saya - Paybae" />

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
                        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Profil Saya</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Ubah informasi data diri dan foto profil kamu.</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 dark:border-slate-800/60 p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                                {avatarPreview ? (
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none relative">
                                        <img 
                                            src={avatarPreview} 
                                            alt={data.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-sm dark:shadow-none text-slate-400 font-extrabold text-4xl">
                                        {data.name ? data.name.charAt(0).toUpperCase() : 'A'}
                                    </div>
                                )}
                                <label className="absolute bottom-0 right-0 p-2 bg-[#52933e] rounded-full text-white cursor-pointer hover:bg-[#457c34] transition-colors border-2 border-white dark:border-slate-800 shadow-md">
                                    <FiCamera className="w-4 h-4" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                </label>
                            </div>
                            {errors.avatar && <p className="text-red-500 text-xs mt-2">{errors.avatar}</p>}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-2">
                                    <FiUser className="w-4 h-4 text-slate-400" />
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-[#52933e] focus:ring-1 focus:ring-[#52933e] text-slate-800 dark:text-white transition-all"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Masukkan nama lengkap"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-2">
                                    <FiPhone className="w-4 h-4 text-slate-400" />
                                    Nomor Handphone
                                </label>
                                <input
                                    type="tel"
                                    name="no_hp"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-[#52933e] focus:ring-1 focus:ring-[#52933e] text-slate-800 dark:text-white transition-all"
                                    value={data.no_hp}
                                    onChange={e => setData('no_hp', e.target.value)}
                                    placeholder="0812xxxxxx"
                                />
                                {errors.no_hp && <p className="text-red-500 text-xs mt-1">{errors.no_hp}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-2">
                                    <FiMail className="w-4 h-4 text-slate-400" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-[#52933e] focus:ring-1 focus:ring-[#52933e] text-slate-800 dark:text-white transition-all"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="nama@email.com"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="pt-4">
                            <PrimaryButton type="submit" disabled={processing} className="w-full bg-[#52933e] hover:bg-[#437a32] disabled:opacity-50">
                                <span className="flex items-center justify-center gap-2 font-bold text-[15px]">
                                    <FiSave className="w-5 h-5" />
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </span>
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

ProfileEdit.layout = page => <DashboardLayout children={page} />;