import React from "react";
import { Head, useForm } from '@inertiajs/react';
import FormInput from "../Component/FormInput";
import FormTextArea from "../Component/FormTextArea";
import PrimaryButton from "../Component/PrimaryButton";

export default function Onboarding() {
    const { data, setData, post, processing, errors } = useForm({
        phone: '',
        nik: '',
        address: '',
        occupation: '',
        parent_name: '',
        parent_phone: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/onboarding');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
            <Head title="Lengkapi Profil - Paybae" />
            
            <div className="w-full max-w-2xl bg-white rounded-[24px] shadow-2xl shadow-green-600/10 overflow-hidden relative">
                {/* Decorative background blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10"></div>

                <div className="p-8 sm:p-12 relative z-10">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <img src="/img/paybae.png" alt="Paybae" className="h-10" />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Lengkapi Profil Anda</h1>
                        <p className="text-slate-500 font-medium">Satu langkah lagi menuju pengalaman finansial yang lebih baik.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* Wajib Diisi */}
                        <div>
                            <h3 className="text-sm font-bold text-green-600 uppercase tracking-wider mb-4 border-b pb-2">Data Pribadi (Wajib)</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <FormInput 
                                    label="Nomor Telepon"
                                    type="tel"
                                    placeholder="08123456789"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    error={errors.phone}
                                />
                                
                                <FormInput 
                                    label="NIK (KTP)"
                                    type="text"
                                    placeholder="16 Digit NIK"
                                    value={data.nik}
                                    onChange={e => setData('nik', e.target.value)}
                                    error={errors.nik}
                                />

                                <FormTextArea 
                                    label="Alamat Lengkap"
                                    placeholder="Jl. Contoh Raya No. 123..."
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    error={errors.address}
                                />

                                <div className="sm:col-span-2">
                                    <FormInput 
                                        label="Pekerjaan"
                                        type="text"
                                        placeholder="Karyawan Swasta, Mahasiswa, dll"
                                        value={data.occupation}
                                        onChange={e => setData('occupation', e.target.value)}
                                        error={errors.occupation}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Opsional */}
                        <div className="pt-2">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">Kontak Darurat / Orang Tua (Opsional)</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <FormInput 
                                    label="Nama Orang Tua / Wali"
                                    type="text"
                                    placeholder="Nama Lengkap"
                                    value={data.parent_name}
                                    onChange={e => setData('parent_name', e.target.value)}
                                    error={errors.parent_name}
                                />
                                
                                <FormInput 
                                    label="No. Telp Orang Tua / Wali"
                                    type="tel"
                                    placeholder="08123..."
                                    value={data.parent_phone}
                                    onChange={e => setData('parent_phone', e.target.value)}
                                    error={errors.parent_phone}
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan & Lanjutkan ke Dashboard'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
