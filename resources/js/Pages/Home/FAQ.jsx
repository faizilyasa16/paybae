import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Component/Navigation";

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const handlePrint = () => {
        window.print();
    };

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqData = [
        {
            number: "01",
            question: "Apa itu PAYBAE?",
            answer: (
                <p>
                    PAYBAE adalah gabungan dari fitur dompet digital dengan sistem analisis cerdas
                    yang dapat membantu kamu dalam mengontrol pengeluaran, 
                    mendapatkan prediksi keuangan, 
                    dan menerima rekomendasi hemat berkat teknologi Deep Learning.
                </p>
            )
        },
        {
            number: "02",
            question: "Bagaimana cara mengisi saldo (Top Up) di PAYBAE?",
            answer: (
                <p>
                    Klik menu <strong>Top Up</strong> di <strong>Dashboard</strong>. 
                    PAYBAE didukung oleh sistem pembayaran aman (Xendit), 
                    yang memungkinkan kamu mengisi saldo melalui Transfer Bank (Virtual Account),
                    dengan mengisi detail Top-Up: Pilih bank, nominal (Paybae juga menyediakan nominal cepat) dan mengklik Tombol <strong>buat VA</strong>.
                </p>
            )
        },
        {
            number: "03",
            question: "Apakah aman melakukan transaksi seperti Transfer dan QR Scan di PAYBAE?",
            answer: (
                <p>
                    Sangat aman. Setiap transaksi finansial yang keluar dari 
                    dompet digital PAYBAE (seperti Transfer antar pengguna atau pembayaran via QR Scan) 
                    wajib menggunakan verifikasi PIN keamanan. 
                    Kami menggunakan enkripsi standar industri untuk memastikan uang dan datamu terlindungi 
                    dari akses yang tidak sah.
                </p>
            )
        },
        {
            number: "04",
            question: "Bagaimana fitur AI Prediksi & Rekomendasi di PAYBAE bekerja?",
            answer: (
                <div className="space-y-2">
                    <p>
                        Sistem kami menggunakan arsitektur neural network{" "}
                        <strong>LSTM (Long Short-Term Memory)</strong>{" "}
                        dengan <strong>Temporal Attention Mechanism</strong>{" "}
                        yang terhubung dengan modul API Python (FastAPI).
                    </p>
                    <p>
                        Model ini membaca runutan pengeluaran harian kamu selama 7 hari terakhir, 
                        mengkalkulasi saldo, pendapatan bulanan, serta tingkat rasio tabungan. 
                        Atensi temporal kami secara cerdas 
                        mengidentifikasi hari-hari kritis di mana terjadi lonjakan transaksi abnormal, 
                        lalu memproyeksikan pengeluaran kamu untuk seminggu ke depan dan 
                        kemudian memberikan rekomendasi aksi hemat yang proporsional.
                    </p>
                </div>
            )
        },
        {
            number: "05",
            question: "Mengapa PAYBAE menggunakan LSTM?",
            answer: (
                <p>
                    Dengan LSTM + Attention, AI dapat mendeteksi pola temporal secara mulus (soft-boundary) 
                    dan mengenali tren peningkatan atau penurunan pengeluaran harian secara kontekstual. 
                    Ini memberikan saran penghematan yang jauh lebih stabil, realistis, dan presisi.
                </p>
            )
        },
        {
            number: "06",
            question: "Apa arti nilai \"Rekomendasi Hemat\" (Kurangi 20%, 10%, 5% atau Pertahankan)?",
            answer: (
                <p>
                    Rekomendasi ini adalah tingkat pengetatan anggaran yang disarankan AI. 
                    Jika pengeluaran harian kamu melebihi batas wajar dari rasio pemasukan kamu, 
                    AI akan mendeteksi status <strong>\"Boros\"</strong> dan menyarankan kamu memangkas 
                    pengeluaran harian sebesar <strong>20%, 10%, atau 5%</strong>. 
                    Jika kondisi keuangan kamu dinilai <strong>\"Normal\"</strong> dan <strong>\"Hemat\"</strong>, 
                    AI akan menyarankan <strong>\"Pertahankan Pengeluaran\"</strong> (Faktor Hemat 0%).
                </p>
            )
        },
        {
            number: "07",
            question: "Mengapa akun saya yang baru terdaftar memiliki prediksi Rp0?",
            answer: (
                <p>
                    PAYBAE menerapkan sistem <strong>Neutral Cold-Start</strong>. 
                    Jika akun Anda benar-benar baru dan belum memiliki riwayat transaksi pengeluaran sama sekali, 
                    AI secara otomatis menonaktifkan inferensi sementara untuk mencegah munculnya angka ramalan 
                    fiktif (halusinasi AI). 
                    Rekomendasi akan mulai aktif berhitung secara objektif setelah Anda mencatatkan transaksi 
                    pengeluaran pertama Anda.
                </p>
            )
        },
        {
            number: "08",
            question: "Apakah data transaksi keuangan saya dikirim ke pihak luar demi pengolahan AI?",
            answer: (
                <p>
                    <strong>Tidak.</strong> Seluruh data transaksi keuangan Anda diproses secara lokal pada server 
                    tertutup PAYBAE melalui API Python internal (port 8004). 
                    Kami tidak membagikan atau meneruskan data transaksi keuangan mentah Anda ke layanan AI publik pihak ketiga 
                    (seperti OpenAI atau Google) <strong>untuk menjamin keamanan privasi finansial Anda tetap 100% terjaga</strong>.
                </p>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
            <Head title="FAQ - Pertanyaan Umum PAYBAE" />            
            <Navbar />
            <div className="max-w-4xl mx-auto pt-32 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 print:mb-6">
                    <div className="inline-flex items-center justify-center p-3 bg-green-50 dark:bg-green-950/40 rounded-xl text-green-600 dark:text-green-400 mb-4 print:hidden shadow-sm">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-lime-500 sm:text-4xl tracking-tight">
                        Frequently Asked Questions (FAQ)
                    </h1>
                    <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Cari tahu bagaimana teknologi PAYBAE membantu kamu mengelola pengeluaran secara cerdas.
                    </p>
                    <button
                        onClick={handlePrint}
                        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm print:hidden transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Cetak / Unduh PDF FAQ
                    </button>
                </div>

                {/* FAQ Content Accordion list */}
                <div className="space-y-4">
                    {faqData.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div 
                                key={idx} 
                                className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
                            >
                                <button
                                    onClick={() => toggleAccordion(idx)}
                                    className="w-full text-left p-6 flex items-center justify-between gap-4 focus:outline-none print:pointer-events-none"
                                >
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-start gap-3">
                                        <span className="text-green-600 dark:text-green-400 font-extrabold">{faq.number}.</span>
                                        {faq.question}
                                    </h3>
                                    <span className={`text-slate-400 dark:text-slate-500 transition-transform duration-300 shrink-0 print:hidden ${isOpen ? 'rotate-180' : ''}`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </button>
                                <div 
                                    className={`transition-all duration-300 ease-in-out print:max-h-none print:border-t print:block ${
                                        isOpen 
                                            ? "max-h-[500px] border-t border-slate-100 dark:border-slate-700/50" 
                                            : "max-h-0 overflow-hidden"
                                    }`}
                                >
                                    <div className="p-6 text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 text-center print:hidden">
                    <Link
                        href="/"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-lg shadow-md text-white bg-gradient-to-r from-green-600 to-lime-500 hover:from-green-700 hover:to-lime-600 transition-all duration-200 hover:scale-[1.02]"
                    >
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}
