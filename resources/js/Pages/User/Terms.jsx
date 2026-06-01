import React from "react";
import { Head, Link } from "@inertiajs/react";
import DashboardLayout from "../Component/DashboardLayout";
import { FiArrowLeft, FiPrinter, FiAlertTriangle, FiShield, FiCpu, FiDatabase, FiRefreshCw } from "react-icons/fi";

export default function Terms() {
    const handlePrint = () => {
        window.print();
    };

    const sections = [
        {
            id: 1,
            icon: <FiCpu className="w-5 h-5" />,
            iconBg: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500",
            title: "Deskripsi Layanan AI PAYBAE",
            content: (
                <p>
                    PAYBAE menyediakan manajemen keuangan otomatis berbasis{" "}
                    <em>Artificial Intelligence</em> (AI) dengan arsitektur{" "}
                    <strong>Long Short-Term Memory (LSTM) dengan Temporal Attention Mechanism</strong>.
                    Sistem AI kami melakukan analisis deret waktu (<em>time-series</em>) terhadap
                    catatan transaksi pengeluaran harian, rasio pendapatan, dan saldo dompet kamu
                    untuk memproyeksikan pengeluaran 7 hari ke depan serta menyarankan pemangkasan
                    anggaran hemat (5%, 10%, 20% atau 0%).
                </p>
            ),
        },
        {
            id: 2,
            icon: <FiAlertTriangle className="w-5 h-5" />,
            iconBg: "bg-amber-50 dark:bg-amber-900/20 text-amber-500",
            title: "Batasan Tanggung Jawab & Disclaimer Layanan AI",
            content: (
                <div className="space-y-3">
                    <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 rounded-r-xl text-amber-900 dark:text-amber-300">
                        <p className="font-bold text-sm mb-2">⚠ DISCLAIMER KEUANGAN</p>
                        <p className="text-sm">
                            Seluruh prediksi pengeluaran, saran persentase hemat harian, dan
                            proyeksi potensi tabungan yang ditampilkan oleh AI PAYBAE adalah{" "}
                            <strong>hasil kalkulasi probabilitas matematis berbasis data historis.</strong>
                        </p>
                    </div>
                    <p>
                        PAYBAE tidak bertanggung jawab atas keputusan alokasi dana, kekurangan
                        saldo, atau kerugian finansial pribadi yang timbul akibat kepatuhan atau
                        ketidakpatuhan pengguna terhadap saran/proyeksi sistem AI ini.
                    </p>
                </div>
            ),
        },
        {
            id: 3,
            icon: <FiShield className="w-5 h-5" />,
            iconBg: "bg-green-50 dark:bg-green-900/20 text-[#52933e]",
            title: "Kewajiban & Keabsahan Data Pengguna",
            content: (
                <div className="space-y-3">
                    <p>
                        Akurasi prediksi dan ketepatan saran penghematan AI sangat bergantung pada
                        kebenaran data transaksi yang kamu inputkan. Pengguna diwajibkan untuk:
                    </p>
                    <ul className="space-y-2">
                        {[
                            "Mencatatkan transaksi pengeluaran dan pemasukan secara berkala dan jujur.",
                            "Menghindari manipulasi data transaksi fiktif yang dapat merusak pola latih model AI.",
                            "Menjaga kerahasiaan kredensial login akun dan PIN transaksi dompet Paybae secara pribadi.",
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                                <span className="mt-1 w-5 h-5 rounded-full bg-[#52933e]/10 text-[#52933e] flex items-center justify-center flex-shrink-0 text-xs font-bold">
                                    {i + 1}
                                </span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ),
        },
        {
            id: 4,
            icon: <FiDatabase className="w-5 h-5" />,
            iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-500",
            title: "Ketersediaan Layanan Inferensi AI",
            content: (
                <p>
                    Layanan API rekomendasi AI berjalan pada port internal sistem (port 8004) secara
                    terus-menerus. Kami berusaha menjaga agar layanan ini selalu aktif. Namun, kami
                    berhak menangguhkan akses API sementara waktu demi kebutuhan pemeliharaan server,
                    pembaruan model, atau migrasi infrastruktur tanpa pemberitahuan tertulis terlebih
                    dahulu.
                </p>
            ),
        },
        {
            id: 5,
            icon: <FiRefreshCw className="w-5 h-5" />,
            iconBg: "bg-purple-50 dark:bg-purple-900/20 text-purple-500",
            title: "Perubahan Syarat dan Ketentuan",
            content: (
                <p>
                    PAYBAE berhak untuk mengubah draf syarat dan ketentuan ini kapan saja. Perubahan
                    ketentuan baru akan diumumkan melalui aplikasi. Melanjutkan penggunaan layanan
                    PAYBAE setelah adanya pembaruan berarti kamu menyetujui versi syarat dan
                    ketentuan yang baru.
                </p>
            ),
        },
    ];

    return (
        <div className="relative overflow-hidden min-h-full pb-20">
            <Head title="Syarat dan Ketentuan - PAYBAE" />

            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-[100px] -z-10 -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-50 dark:bg-green-900/10 rounded-full blur-[100px] -z-10 translate-y-1/3 -translate-x-1/3" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 md:pt-10">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8 flex-wrap animate-fade-in-up">
                    <Link
                        href="/profile/settings"
                        className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#52933e] hover:border-green-200 transition-all"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">
                            Syarat & Ketentuan
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                            Harap baca sebelum menggunakan layanan PAYBAE.
                        </p>
                    </div>
                    {/* Print button — desktop */}
                    <button
                        onClick={handlePrint}
                        className="ml-auto hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 text-sm font-semibold rounded-xl text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors print:hidden"
                    >
                        <FiPrinter className="w-4 h-4" />
                        Cetak / PDF
                    </button>
                </div>

                {/* Intro Card */}
                <div
                    className="bg-gradient-to-br from-indigo-600 to-indigo-500 dark:from-indigo-700 dark:to-indigo-600 rounded-[24px] p-6 mb-5 text-white animate-fade-in-up shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30"
                    style={{ animationDelay: "50ms" }}
                >
                    <p className="text-sm leading-relaxed opacity-90">
                        Selamat datang di <strong>PAYBAE</strong>. Dengan mengakses dan menggunakan
                        layanan PAYBAE, kamu dianggap telah membaca, memahami, dan menyetujui
                        seluruh syarat dan ketentuan penggunaan yang tertera di bawah ini.
                    </p>
                    <p className="mt-3 text-xs opacity-60 font-medium">
                        Terakhir diperbarui: 25 Mei 2026
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-4">
                    {sections.map((section, idx) => (
                        <div
                            key={section.id}
                            className="bg-white dark:bg-slate-900 rounded-[24px] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 dark:border-slate-800/60 overflow-hidden animate-fade-in-up"
                            style={{ animationDelay: `${(idx + 1) * 80}ms` }}
                        >
                            {/* Section header */}
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${section.iconBg}`}>
                                    {section.icon}
                                </div>
                                <h2 className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                                    <span className="text-slate-400 dark:text-slate-500 font-semibold mr-1.5">
                                        {String(section.id).padStart(2, "0")}.
                                    </span>
                                    {section.title}
                                </h2>
                            </div>

                            {/* Section body */}
                            <div className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                {section.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer actions */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        © 2026 PAYBAE. Semua hak dilindungi.
                    </p>
                    {/* Print button — mobile */}
                    <button
                        onClick={handlePrint}
                        className="sm:hidden w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-sm font-semibold rounded-xl text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-colors print:hidden"
                    >
                        <FiPrinter className="w-4 h-4" />
                        Cetak / Unduh PDF
                    </button>
                </div>

                <div className="mt-2 mb-2 text-center text-slate-400 text-xs font-semibold animate-fade-in-up" style={{ animationDelay: "550ms" }}>
                    Paybae App Versi 1.0.0
                </div>
            </div>
        </div>
    );
}

Terms.layout = (page) => <DashboardLayout children={page} />;
