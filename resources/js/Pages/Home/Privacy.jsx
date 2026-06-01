import React from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Component/Navigation";

export default function Privacy() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
            <Head title="Kebijakan Privasi - PAYBAE" />
            <Navbar />

            {/* Ambient background glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-green-300/20 to-lime-300/20 dark:from-green-950/20 dark:to-lime-950/20 rounded-full blur-3xl -z-10 animate-pulse duration-[8s]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-lime-300/10 to-green-300/20 dark:from-lime-950/10 dark:to-green-950/20 rounded-full blur-3xl -z-10 animate-pulse duration-[10s]" />

            <div className="max-w-4xl mx-auto pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700/50 rounded-xl p-8 print:p-0 print:border-none print:shadow-none transition-colors">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-lime-500 mb-6 text-center tracking-tight">
                        Kebijakan Privasi PAYBAE
                    </h1>
                    <div className="text-center mb-8 print:hidden">
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-green-50 dark:hover:bg-green-950/20 hover:text-green-600 dark:hover:text-green-400 hover:border-green-200 dark:hover:border-green-800 shadow-sm transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Cetak / Unduh PDF Kebijakan Privasi
                        </button>
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-6 text-sm leading-relaxed">
                        <p>
                            Di PAYBAE, perlindungan dan privasi data finansial kamu adalah prioritas utama kami. 
                            Dokumen Kebijakan Privasi ini menjelaskan jenis data transaksi yang kami kumpulkan, 
                            mekanisme pengolahan AI lokal kami, serta komitmen kami untuk menjaga data kamu tetap aman.
                        </p>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700/50 pb-2">
                            1. Data Transaksi & Finansial yang Kami Proses
                        </h2>
                        <p>
                            Untuk menghasilkan prediksi pengeluaran 7 hari dan rekomendasi hemat yang akurat melalui 
                            AI, kami mengolah:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Data Transaksi:</strong> Nilai nominal pengeluaran harian dan tanggal transaksi.</li>
                            <li><strong>Informasi Rekening:</strong> Nilai saldo aktif dompet Paybae saat ini serta pemasukan bulanan terdaftar.</li>
                            <li><strong>Savings Rate:</strong> Rasio tabungan kamu yang dihitung secara matematis berdasarkan saldo dibanding pendapatan bulanan kamu.</li>
                        </ul>

                        <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700/50 pb-2">
                            2. Kebijakan Keamanan AI Lokal (Tanpa API Pihak Ketiga)
                        </h2>
                        <div className="bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-500 p-4 rounded-r-lg text-emerald-900 dark:text-emerald-300">
                            <strong>100% PROSES LOKAL & MANDIRI:</strong>
                            <p className="mt-1">
                                Kami tidak mengirimkan data transaksi, riwayat belanja, atau identitas pribadi 
                                kamu ke server AI luar/pihak ketiga (seperti OpenAI GPT, Google Gemini, dll). 
                            </p>
                            <p className="mt-2">
                                Semua proses pelatihan (training) dan penyimpulan (inference) 
                                model LSTM dilakukan di dalam server lokal internal PAYBAE sendiri 
                                (FastAPI di port 8004). Hal ini meminimalkan risiko kebocoran data finansial kamu 
                                di internet secara absolut.
                            </p>
                        </div>

                        <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700/50 pb-2">
                            3. Bagaimana Kami Menggunakan Informasi Kamu
                        </h2>
                        <p>
                            Informasi yang dikumpulkan digunakan semata-mata untuk kepentingan internal 
                            fungsionalitas PAYBAE:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Menghitung statistik pengeluaran mingguan/bulanan kamu pada dashboard.</li>
                            <li>Memberikan input sekuensial kepada model LSTM untuk memprediksi potensi 
                                keborosan pengeluaran kamu.</li>
                            <li>Menampilkan draf rekomendasi hemat harian yang dipersonalisasi.</li>
                            <li>Melacak status transaksi top-up saldo via Xendit Payment Gateway secara aman.</li>
                        </ul>

                        <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700/50 pb-2">
                            4. Enkripsi dan Penyimpanan Data
                        </h2>
                        <p>
                            Semua data keuangan dilindungi menggunakan enkripsi standar industri saat transit dan saat 
                            disimpan di database. Kami membatasi akses personel terhadap server database, memastikan hanya 
                            sistem internal PAYBAE yang berhak membaca transaksi sekuensial untuk kebutuhan penyajian 
                            rekomendasi.
                        </p>

                        <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700/50 pb-2">
                            5. Hak Pengguna Atas Data Keuangan
                        </h2>
                        <p>
                            Pengguna memiliki kendali penuh atas data mereka. Kamu berhak menghapus riwayat 
                            transaksi kamu atau meminta penutupan akun secara permanen, 
                            yang secara otomatis akan menghapus seluruh data masukan latih kamu dari 
                            sistem penyimpanan database PAYBAE.
                        </p>

                        <p className="mt-8 text-xs text-slate-400 dark:text-slate-500">
                            Terakhir diperbarui: 25 Mei 2026
                        </p>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 print:hidden">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all duration-200 hover:scale-[1.02]"
                        >
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
