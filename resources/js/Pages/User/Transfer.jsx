import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { FiChevronLeft, FiSend, FiAlertCircle } from 'react-icons/fi';
import DashboardLayout from '../Component/DashboardLayout';

export default function Transfer() {
    const [form, setForm] = useState({
        recipient_name: '',
        recipient_account: '',
        recipient_bank: '',
        amount: '',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const banks = [
        { code: 'bca', name: 'BCA' },
        { code: 'bni', name: 'BNI' },
        { code: 'bri', name: 'BRI' },
        { code: 'mandiri', name: 'Mandiri' },
        { code: 'btn', name: 'BTN' },
        { code: 'cimb', name: 'CIMB Niaga' },
        { code: 'ocbc', name: 'OCBC NISP' },
        { code: 'danamon', name: 'Danamon' },
        { code: 'maybank', name: 'Maybank' },
        { code: 'bukopin', name: 'Bukopin' },
        { code: 'syariah_mandiri', name: 'Mandiri Syariah' },
        { code: 'bpd_jawa_barat', name: 'BPD Jawa Barat' },
        { code: 'bpd_dki', name: 'BPD DKI' },
        { code: 'bpd_jawa_tengah', name: 'BPD Jawa Tengah' },
        { code: 'bpd_jawa_timur', name: 'BPD Jawa Timur' },
        { code: 'bpd_yogyakarta', name: 'BPD Yogyakarta' },
        { code: 'bpd_banten', name: 'BPD Banten' },
        { code: 'bpd_bali', name: 'BPD Bali' },
        { code: 'bpd_nusa_tenggara_barat', name: 'BPD NTB' },
        { code: 'bpd_nusa_tenggara_timur', name: 'BPD NTT' },
        { code: 'bpd_kalimantan_barat', name: 'BPD Kalimantan Barat' },
        { code: 'bpd_kalimantan_selatan', name: 'BPD Kalimantan Selatan' },
        { code: 'bpd_kalimantan_timur', name: 'BPD Kalimantan Timur' },
        { code: 'bpd_kalimantan_utara', name: 'BPD Kalimantan Utara' },
        { code: 'bpd_sulawesi_utara', name: 'BPD Sulawesi Utara' },
        { code: 'bpd_sulawesi_tenggara', name: 'BPD Sulawesi Tenggara' },
        { code: 'bpd_sulawesi_selatan', name: 'BPD Sulawesi Selatan' },
        { code: 'bpd_gorontalo', name: 'BPD Gorontalo' },
        { code: 'bpd_sulawesi_barat', name: 'BPD Sulawesi Barat' },
        { code: 'bpd_maluku', name: 'BPD Maluku' },
        { code: 'bpd_maluku_utara', name: 'BPD Maluku Utara' },
        { code: 'bpd_papua', name: 'BPD Papua' },
        { code: 'bpd_papua_barat', name: 'BPD Papua Barat' },
    ];

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage(null);
        setError(null);
        setIsSubmitting(true);

        try {
            let endpoint = route('transfer.store');
            if (endpoint.startsWith('http')) {
                endpoint = new URL(endpoint).pathname + new URL(endpoint).search;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (data.success) {
                if (data.redirect_url) {
                    window.location.href = data.redirect_url;
                    return;
                }

                setMessage(data.message || 'Transfer berhasil dikirim.');
                setForm({
                    recipient_name: '',
                    recipient_account: '',
                    recipient_bank: '',
                    amount: '',
                    description: '',
                });
            } else {
                setError(data.message || 'Gagal melakukan transfer.');
            }
        } catch (err) {
            setError(err.message || 'Terjadi kesalahan sistem.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative overflow-hidden min-h-full">
            <Head title="Transfer Dana - Paybae" />

            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50 rounded-full blur-[100px] -z-10 -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-50/80 rounded-full blur-[80px] -z-10 translate-y-1/3 -translate-x-1/3"></div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 md:pt-10">
                <div className="mb-6 animate-fade-in-up">
                    <Link
                        href={route('dashboard.index')}
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mb-4"
                    >
                        <FiChevronLeft className="w-4 h-4" />
                        Kembali ke Dashboard
                    </Link>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FiSend className="w-6 h-6 text-green-600" />
                        </div>
                        Transfer Dana
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm sm:text-base font-medium">
                        Kirim dana ke rekening bank tujuan dengan cepat dan aman.
                    </p>
                </div>

                {(message || error) && (
                    <div className={`mb-6 p-4 rounded-lg border ${message ? 'bg-green-50 border-green-200 text-green-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                        <div className="flex items-start gap-3">
                            <FiAlertCircle className={`w-5 h-5 ${message ? 'text-green-600' : 'text-rose-600'}`} />
                            <div>
                                <p className="font-semibold">{message ? 'Sukses' : 'Kesalahan'}</p>
                                <p className="text-sm mt-1">{message || error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in-up animation-delay-100">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Detil Transfer
                        </label>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700">Nama Penerima</span>
                                <input
                                    type="text"
                                    value={form.recipient_name}
                                    onChange={(e) => handleChange('recipient_name', e.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none"
                                    placeholder="Nama penerima"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-slate-700">Nomor Rekening</span>
                                <input
                                    type="text"
                                    value={form.recipient_account}
                                    onChange={(e) => handleChange('recipient_account', e.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none"
                                    placeholder="Contoh: 1234567890"
                                    required
                                />
                            </label>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 mt-4">
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700">Bank Tujuan</span>
                                <select
                                    value={form.recipient_bank}
                                    onChange={(e) => handleChange('recipient_bank', e.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none"
                                    required
                                >
                                    <option value="">Pilih bank</option>
                                    {banks.map((bank) => (
                                        <option key={bank.code} value={bank.code}>{bank.name}</option>
                                    ))}
                                </select>
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-slate-700">Jumlah Transfer</span>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                        Rp
                                    </div>
                                    <input
                                        type="number"
                                        value={form.amount}
                                        onChange={(e) => handleChange('amount', e.target.value)}
                                        className="mt-2 w-full pl-12 rounded-2xl border border-slate-200 px-4 py-3 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none"
                                        placeholder="10000"
                                        min="10000"
                                        required
                                    />
                                </div>
                            </label>
                        </div>

                        <label className="block mt-4">
                            <span className="text-sm font-medium text-slate-700">Catatan / Deskripsi</span>
                            <textarea
                                value={form.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none"
                                rows="4"
                                placeholder="Contoh: Kiriman untuk biaya belanja"
                            />
                        </label>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in-up animation-delay-200">
                        <p className="text-sm font-semibold text-slate-700">Ringkasan Transfer</p>
                        <div className="mt-4 grid gap-3 text-slate-700">
                            <div className="flex justify-between text-sm">
                                <span>Nama penerima</span>
                                <span>{form.recipient_name || '-'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Rekening</span>
                                <span>{form.recipient_account || '-'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Bank tujuan</span>
                                <span>{banks.find((bank) => bank.code === form.recipient_bank)?.name || '-'}</span>
                            </div>
                            <div className="flex justify-between text-sm font-semibold text-slate-900">
                                <span>Jumlah</span>
                                <span>{form.amount ? formatCurrency(Number(form.amount)) : '-'}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !form.recipient_name || !form.recipient_account || !form.recipient_bank || !form.amount}
                        className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Memproses...' : 'Kirim Transfer'}
                    </button>
                </form>
            </div>
        </div>
    );
}

Transfer.layout = page => <DashboardLayout children={page} />;
