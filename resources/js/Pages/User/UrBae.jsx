import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import DashboardLayout from "../Component/DashboardLayout";
import { 
    FiArrowLeft, 
    FiBookOpen, 
    FiCompass, 
    FiTrendingUp, 
    FiPercent, 
    FiChevronRight, 
    FiChevronLeft, 
    FiX, 
    FiCheckCircle,
    FiAward
} from "react-icons/fi";

const EDUCATIONAL_TOPICS = [
    {
        id: "24-hour-rule",
        category: "mindset",
        title: "Aturan 24 Jam (The 24-Hour Rule)",
        shortDesc: "Trik psikologis ampuh mencegah belanja impulsif atau checkout barang keinginan tidak penting.",
        emoji: "⏳",
        badge: "Mindset",
        slides: [
            {
                title: "Impulse Buying Malam Hari?",
                text: "Pernahkah kamu lapar mata melihat barang viral di keranjang Shopee/TikTok Shop di malam hari, checkout dengan cepat, lalu menyesal saat barangnya sampai?",
                imageEmoji: "🛒"
            },
            {
                title: "Gunakan Aturan 24 Jam",
                text: "Setiap melihat barang keinginan (wants) yang ingin kamu checkout, TAHAN dulu. Masukkan keranjang belanja, matikan aplikasi e-commerce, dan tunggu 24 jam sebelum membayarnya.",
                imageEmoji: "⏸️"
            },
            {
                title: "80% Keinginan Hilang!",
                text: "Setelah 24 jam berlalu, emosi impulsif kamu akan mereda. Faktanya, 80% orang akan lupa atau merasa tidak lagi membutuhkan barang tersebut. Selamat, kamu berhasil menyelamatkan uangmu!",
                imageEmoji: "🎉"
            },
            {
                title: "Aksi Nyata Hari Ini",
                text: "Mulai hari ini, setiap tergoda beli barang non-kebutuhan, katakan: 'Saya akan beli besok sore jika masih ingin'. Terapkan ini untuk melatih disiplin diri!",
                imageEmoji: "💪"
            }
        ]
    },
    {
        id: "fomo-vs-jomo",
        category: "mindset",
        title: "FOMO vs JOMO",
        shortDesc: "Bagaimana cara bangga menolak ajakan nongkrong mahal demi masa depan finansialmu.",
        emoji: "🧠",
        badge: "Psikologi",
        slides: [
            {
                title: "Jebakan FOMO",
                text: "FOMO (Fear of Missing Out) adalah ketakutan dianggap tidak eksis atau dikucilkan karena tidak ikut tren. Contoh: Ikut nongkrong Rp150.000 di cafe mahal hanya demi story Instagram.",
                imageEmoji: "📱"
            },
            {
                title: "Kenalkan JOMO",
                text: "JOMO (Joy of Missing Out) adalah rasa bangga dan damai saat kamu secara sadar menolak ajakan boros yang tidak mendesak demi memprioritaskan tujuan keuangan pribadimu.",
                imageEmoji: "🧘"
            },
            {
                title: "Menolak Dengan Sopan",
                text: "Menolak nongkrong bukan berarti memutus pertemanan. Kamu bisa berkata: 'Maaf ya guys, bulan ini aku lagi ada target tabungan ketat di PAYBAE nih, next time aku gabung ya!'",
                imageEmoji: "🤝"
            },
            {
                title: "Aksi Nyata Hari Ini",
                text: "Cobalah bersikap jujur tentang kondisi finansialmu kepada teman dekat. Teman sejati akan menghargai langkah disiplinmu untuk menabung.",
                imageEmoji: "✨"
            }
        ]
    },
    {
        id: "latte-factor",
        category: "mindset",
        title: "Misteri 'Bocor Halus' (Latte Factor)",
        shortDesc: "Mengungkap pengeluaran receh harian yang diam-diam menguras isi dompet digitalmu.",
        emoji: "☕",
        badge: "Kebiasaan",
        slides: [
            {
                title: "Apa itu Bocor Halus?",
                text: "Pengeluaran bernilai kecil yang dikeluarkan terus menerus tanpa terasa. Seperti biaya transfer antar bank Rp6.500, parkir Rp2.000, jajan boba Rp15.000, atau biaya admin bulanan.",
                imageEmoji: "💸"
            },
            {
                title: "Akumulasi Raksasa",
                text: "Beli kopi/boba Rp15.000 x 20 hari = Rp300.000. Biaya admin transfer Rp6.500 x 10 kali = Rp65.000. Total kebocoran harian sebulan sudah mencapai Rp365.000!",
                imageEmoji: "📈"
            },
            {
                title: "Cara Menambal Bocor Halus",
                text: "Gunakan fitur Transfer gratis PAYBAE, bawa air minum botol dari rumah, dan kurangi frekuensi jajan harian. Alihkan bocor halus ini menjadi saldo tabungan nyata.",
                imageEmoji: "🛡️"
            },
            {
                title: "Aksi Nyata Hari Ini",
                text: "Buka menu riwayat transaksi di PAYBAE, temukan pengeluaran di bawah Rp15.000, dan hitung berapa kali kamu membelanjakannya minggu ini. Kamu akan terkejut melihat angkanya!",
                imageEmoji: "🔍"
            }
        ]
    },
    {
        id: "budgeting-50-30-20",
        category: "budgeting",
        title: "Metode Anggaran 50/30/20",
        shortDesc: "Rumus paling sederhana membagi uang saku mingguan/bulanan agar tidak habis sebelum waktunya.",
        emoji: "📊",
        badge: "Budgeting",
        slides: [
            {
                title: "Alokasi Uang Saku",
                text: "Bingung bagaimana membagi uang saku agar cukup sebulan? Jangan gunakan metode tebak-tebak. Gunakan metode alokasi rasio emas 50/30/20.",
                imageEmoji: "📐"
            },
            {
                title: "Pembagian Sektor",
                text: "Bagi uang saku kamu menjadi 3 pos utama:\n- 50% Kebutuhan Pokok (ongkos, makan, kuota)\n- 30% Keinginan (hiburan, main, jajan)\n- 20% Tabungan/Investasi.",
                imageEmoji: "🍕"
            },
            {
                title: "Tabung di Awal!",
                text: "Kunci keberhasilan metode ini adalah: Pindahkan 20% jatah tabungan ke rekening tabungan SEGERA setelah kamu menerima uang saku. Jangan menabung dari uang sisa akhir bulan!",
                imageEmoji: "🔐"
            },
            {
                title: "Aksi Nyata Hari Ini",
                text: "Misal uang sakumu Rp1.000.000/bulan. Ambil Rp200.000 hari ini dan kunci di saldo tabungan. Jalani sisa hari dengan Rp800.000. Rasakan kenyamanannya!",
                imageEmoji: "🏦"
            }
        ]
    },
    {
        id: "sinking-fund",
        category: "budgeting",
        title: "Sinking Fund (Tabungan Wishlist)",
        shortDesc: "Cara asyik membeli barang idaman atau tiket konser tanpa mengganggu uang jajan pokok.",
        emoji: "🎯",
        badge: "Tabungan",
        slides: [
            {
                title: "Nabung untuk Keinginan",
                text: "Ingin beli sepatu baru seharga Rp600.000 tapi sungkan minta orang tua? Gunakan teknik Sinking Fund (Tabungan Terencana).",
                imageEmoji: "👟"
            },
            {
                title: "Pecah Menjadi Target Kecil",
                text: "Jangan menabung sekaligus. Bagi harga barang dengan tenggat waktu. Sepatu seharga Rp600.000 ingin dibeli 3 bulan lagi. Berarti cukup tabung Rp200.000/bulan.",
                imageEmoji: "🧩"
            },
            {
                title: "Sangat Ringan Harian",
                text: "Rp200.000 sebulan setara dengan menyisihkan Rp6.700 per hari! Sangat cocok dengan target hemat harian yang sering direkomendasikan AI PAYBAE.",
                imageEmoji: "💰"
            },
            {
                title: "Aksi Nyata Hari Ini",
                text: "Tuliskan 1 wishlist barang idamanmu. Tentukan harganya, bagi dengan sisa waktu, dan catat target harianmu di buku atau aplikasi PAYBAE.",
                imageEmoji: "🏷️"
            }
        ]
    },
    {
        id: "emergency-fund",
        category: "budgeting",
        title: "Dana Darurat Versi Pelajar",
        shortDesc: "Mengapa kamu butuh dana khusus untuk hal darurat tak terduga (ban bocor, HP rusak).",
        emoji: "🚨",
        badge: "Proteksi",
        slides: [
            {
                title: "Darurat di Usia Pelajar",
                text: "Dana darurat bukan cuma untuk orang dewasa yang berkeluarga. Pelajar juga sering mengalami musibah finansial tak terduga.",
                imageEmoji: "⚠️"
            },
            {
                title: "Contoh Kejadian Nyata",
                text: "Bayangkan tiba-tiba ban motor bocor saat berangkat sekolah, layar HP retak dan butuh servis cepat, atau iuran mendadak tugas kelompok. Meminjam uang teman tentu memalukan.",
                imageEmoji: "🔧"
            },
            {
                title: "Target Dana Darurat",
                text: "Kumpulkan dana darurat minimal Rp300.000 sampai Rp500.000. Simpan di saldo aman PAYBAE and berjanji jangan pernah menyentuhnya kecuali saat kondisi gawat darurat.",
                imageEmoji: "🛡️"
            },
            {
                title: "Aksi Nyata Hari Ini",
                text: "Mulailah menyisihkan uang kembalian Rp2.000 atau Rp5.000 setiap hari khusus ke dalam celengan/saldo khusus Dana Darurat.",
                imageEmoji: "🩹"
            }
        ]
    },
    {
        id: "promo-traps",
        category: "hacks",
        title: "Jebakan Promo & Paylater",
        shortDesc: "Bagaimana e-commerce memicu impulse buying dengan diskon semu dan cicilan instan.",
        emoji: "🏷️",
        badge: "Shopping Hack",
        slides: [
            {
                title: "Mitos 'Hemat' Diskon",
                text: "Jika melihat barang diskon 50% dari harga Rp100.000 menjadi Rp50.000, tapi sebenarnya kamu tidak butuh barang itu, kamu bukan menghemat Rp50.000. Kamu tetap membuang Rp50.000!",
                imageEmoji: "🎭"
            },
            {
                title: "Bahaya Paylater",
                text: "Fitur Paylater menawarkan kemudahan beli sekarang bayar nanti. Tapi ingat, Paylater mengenakan bunga tinggi dan denda telat bayar yang bisa merusak reputasi keuanganmu sejak muda.",
                imageEmoji: "💳"
            },
            {
                title: "Aturan Kelipatan 2",
                text: "Sebelum membeli barang non-kebutuhan, gunakan prinsip ini: Jika kamu tidak memiliki uang tunai 2 kali lipat dari harga barang tersebut di dompetmu, berarti kamu belum mampu membelinya.",
                imageEmoji: "⚖️"
            },
            {
                title: "Aksi Nyata Hari Ini",
                text: "Matikan push notification aplikasi belanja di HP-mu untuk menghindari bombardir flash sale atau promo cashback tengah malam.",
                imageEmoji: "📴"
            }
        ]
    },
    {
        id: "category-importance",
        category: "hacks",
        title: "Pentingnya Kategori Transaksi",
        shortDesc: "Cara membantu model AI PAYBAE agar memberikan rekomendasi yang sangat akurat.",
        emoji: "⚙️",
        badge: "Fitur AI",
        slides: [
            {
                title: "Bagaimana AI Membaca Data?",
                text: "Model AI LSTM PAYBAE membaca seluruh data transaksi yang kamu masukkan. AI mengamati total pengeluaran harian dan persentase belanja dibanding saldo aktifmu.",
                imageEmoji: "🤖"
            },
            {
                title: "Pentingnya Kategori Rapik",
                text: "Dengan memilih kategori transaksi yang benar (Makanan, Hiburan, Belanja, dll), kamu mempermudah AI memilah pengeluaran esensial vs pengeluaran sekadar gaya hidup.",
                imageEmoji: "📂"
            },
            {
                title: "Akurasi Prediksi Naik",
                text: "Catatan keuangan yang rapi dan diisi secara konsisten setiap hari akan menaikkan skor keyakinan (confidence score) model AI PAYBAE dalam merumuskan rem belanja harianmu.",
                imageEmoji: "📈"
            },
            {
                title: "Aksi Nyata Hari Ini",
                text: "Periksalah halaman riwayat transaksimu. Jika ada transaksi yang kategorinya belum sesuai, luangkan waktu 2 menit untuk memperbaruinya demi keakuratan AI!",
                imageEmoji: "✏️"
            }
        ]
    }
];

export default function UrBae() {
    const [activeTab, setActiveTab] = useState("all");
    const [currentTopic, setCurrentTopic] = useState(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [lessonCompleted, setLessonCompleted] = useState(false);
    const [completedTopics, setCompletedTopics] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("urbae_completed_topics");
            if (saved) return JSON.parse(saved);
        }
        return [];
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("urbae_completed_topics", JSON.stringify(completedTopics));
        }
    }, [completedTopics]);

    const filteredTopics = activeTab === "all" 
        ? EDUCATIONAL_TOPICS
        : EDUCATIONAL_TOPICS.filter(t => t.category === activeTab);

    const openSlideReader = (topic) => {
        setCurrentTopic(topic);
        setCurrentSlideIndex(0);
        setLessonCompleted(false);
    };

    const closeSlideReader = () => {
        setCurrentTopic(null);
    };

    const handleNextSlide = () => {
        if (currentSlideIndex < currentTopic.slides.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        } else {
            setLessonCompleted(true);
            if (!completedTopics.includes(currentTopic.id)) {
                setCompletedTopics(prev => [...prev, currentTopic.id]);
            }
        }
    };

    const handlePrevSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
            setLessonCompleted(false);
        }
    };
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 pb-12 transition-colors duration-300">
            <Head title="Ur Bae - Edukasi Finansial Pelajar" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                {/* Header Nav */}
                <div className="flex items-center gap-3 mb-6">
                    <Link
                        href="/dashboard"
                        className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <p className="text-xs font-semibold text-[#61a94a] uppercase tracking-wider">Edu-Finance Partner</p>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Ur Bae</h1>
                    </div>
                </div>

                {/* Banner Edukasi */}
                <div className="relative bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm 
                rounded-[24px] p-6 overflow-hidden shadow-lg border 
                border-slate-200 dark:border-slate-800 
                mb-8 transition-colors duration-300">
                    <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#61a94a]/15 dark:bg-[#61a94a]/30 rounded-full blur-3xl transition-colors duration-300"></div>
                    <div className="absolute -bottom-10 left-10 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl transition-colors duration-300"></div>
                    <div className="relative flex flex-col sm:flex-row items-center gap-6 z-10">
                        <div className="w-20 h-20 rounded-[20px] bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center shadow-sm shadow-[#61a94a]/5 dark:shadow-[#61a94a]/10 flex-shrink-0 transition-colors duration-300">
                            <img 
                                src="/img/ur-bae-icon.png"
                                alt="Ur Bae Agent" 
                                className="w-full h-full object-contain drop-shadow-sm rounded-[20px] dark:brightness-110" 
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div style={{ display: 'none' }} className="w-full h-full items-center justify-center text-green-500 font-bold text-3xl">
                                🧠
                            </div>
                        </div>
                        <div className="text-center sm:text-left flex-1">
                            <h2 className="text-lg font-bold mb-1.5 text-slate-900 dark:text-white transition-colors duration-300">
                                Kuasai Uangmu Sebelum Diatur Uang!
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl transition-colors duration-300">
                                Selamat datang di akademi finansial mini <strong className="text-green-700 dark:text-[#61a94a] font-semibold">Ur Bae</strong>. Di sini kamu bisa belajar dasar pengelolaan uang, psikologi belanja, dan hacks dompet digital lewat rangkuman sependek Instagram Stories.
                            </p>
                            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3 items-center">
                                <span className="inline-flex items-center gap-1.5 bg-white dark:bg-white/10 border border-slate-200 dark:border-transparent px-3 py-1.5 rounded-full text-xs font-bold text-[#61a94a] shadow-sm transition-colors duration-300">
                                    <FiAward className="w-3.5 h-3.5" />
                                    {completedTopics.length} / {EDUCATIONAL_TOPICS.length} Selesai
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl mb-8 overflow-x-auto whitespace-nowrap">
                    {[
                        { id: "all", label: "Semua Tips", icon: FiCompass },
                        { id: "mindset", label: "Mindset & Psikologi", icon: FiBookOpen },
                        { id: "budgeting", label: "Trik Budgeting", icon: FiTrendingUp },
                        { id: "hacks", label: "Hack Dompet Digital", icon: FiPercent }
                    ].map(tab => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                                    active 
                                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                }`}
                            >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTopics.map((topic) => {
                        const isRead = completedTopics.includes(topic.id);
                        return (
                            <div
                                key={topic.id}
                                onClick={() => openSlideReader(topic)}
                                className={`bg-white dark:bg-slate-800 border rounded-2xl p-5 shadow-sm hover:shadow-md hover:scale-[1.01] cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                                    isRead 
                                        ? "border-green-200 dark:border-green-900/40 bg-green-50/10" 
                                        : "border-slate-100 dark:border-slate-800/80"
                                }`}
                            >
                                {isRead && (
                                    <div className="absolute top-0 right-0 bg-[#61a94a] text-white px-3 py-1 rounded-bl-xl text-[10px] font-black tracking-wide flex items-center gap-1">
                                        <FiCheckCircle className="w-3 h-3" /> SELESAI
                                    </div>
                                )}

                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-2xl">{topic.emoji}</span>
                                        <span className="text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded">
                                            {topic.badge}
                                        </span>
                                    </div>
                                    <h3 className="font-extrabold text-slate-800 dark:text-white text-base mb-2">
                                        {topic.title}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
                                        {topic.shortDesc}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center border-t border-slate-50 dark:border-slate-700/50 pt-3 mt-2 text-xs">
                                    <span className="text-slate-400 dark:text-slate-500 font-medium">
                                        {topic.slides.length} slide tips
                                    </span>
                                    <span className="text-[#61a94a] font-bold flex items-center gap-1">
                                        {isRead ? "Baca Ulang" : "Mulai Baca"} <FiChevronRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {currentTopic && (
                <div className="fixed inset-0 bg-slate-950/50 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-colors duration-300">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-200 dark:border-slate-800/50 shadow-2xl relative flex flex-col justify-between min-h-[500px] max-h-[90vh] transition-colors duration-300">
                        <div className="absolute top-4 inset-x-5 flex gap-1.5 z-20">
                            {currentTopic.slides.map((_, i) => (
                                <div 
                                    key={i} 
                                    className="h-1 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
                                >
                                    <div 
                                        className="h-full bg-[#61a94a] rounded-full transition-all duration-300"
                                        style={{ 
                                            width: i < currentSlideIndex 
                                                ? "100%" 
                                                : i === currentSlideIndex 
                                                    ? lessonCompleted ? "100%" : "50%" 
                                                    : "0%" 
                                        }}
                                    ></div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute top-8 inset-x-5 flex justify-between items-center z-20">
                            <span className="text-[10px] font-black bg-slate-100 dark:bg-white/10 backdrop-blur-md text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {currentTopic.badge}
                            </span>
                            <button 
                                onClick={closeSlideReader}
                                className="p-1.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 backdrop-blur-md text-slate-800 dark:text-white rounded-full transition-colors"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center mt-10 text-slate-800 dark:text-white">
                            {!lessonCompleted ? (
                                <>
                                    <div className="w-28 h-28 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/50 rounded-[28px] flex items-center justify-center text-5xl mb-8 shadow-inner shadow-slate-200 dark:shadow-slate-950 animate-pulse transition-colors duration-300">
                                        {currentTopic.slides[currentSlideIndex].imageEmoji}
                                    </div>
                                    <h2 className="text-xl font-black mb-4 text-slate-950 dark:text-white tracking-tight">
                                        {currentTopic.slides[currentSlideIndex].title}
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-xs whitespace-pre-line">
                                        {currentTopic.slides[currentSlideIndex].text}
                                    </p>
                                </>
                            ) : (
                                <div className="animate-fade-in">
                                    <div className="w-24 h-24 bg-gradient-to-br from-[#61a94a] to-[#4e8d3b] rounded-full flex items-center justify-center text-5xl mb-6 mx-auto shadow-lg shadow-green-900/10 dark:shadow-green-950">
                                        🎓
                                    </div>
                                    <h2 className="text-2xl font-black mb-3 text-slate-950 dark:text-white tracking-tight">
                                        Tips Selesai!
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-xs mx-auto mb-8">
                                        Hebat! Kamu telah memahami konsep <strong className="text-green-700 dark:text-[#61a94a]">{currentTopic.title}</strong>. Kunci sukses keuangan adalah konsistensi mempraktikkannya.
                                    </p>
                                    <button 
                                        onClick={closeSlideReader}
                                        className="w-full bg-[#61a94a] hover:bg-[#4e8d3b] text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-colors text-sm"
                                    >
                                        Selesai & Keluar
                                    </button>
                                </div>
                            )}
                        </div>

                        {!lessonCompleted && (
                            <div className="p-6 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950/50 flex items-center justify-between gap-4 z-10 transition-colors duration-300">
                                <button
                                    onClick={handlePrevSlide}
                                    disabled={currentSlideIndex === 0}
                                    className={`flex items-center gap-1 py-2 px-3 text-xs font-bold rounded-xl transition-all ${
                                        currentSlideIndex === 0 
                                            ? "text-slate-300 cursor-not-allowed dark:text-slate-700" 
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
                                    }`}
                                >
                                    <FiChevronLeft className="w-4 h-4" /> Kembali
                                </button>

                                <span className="text-[11px] font-bold text-slate-500">
                                    {currentSlideIndex + 1} / {currentTopic.slides.length}
                                </span>

                                <button
                                    onClick={handleNextSlide}
                                    className="flex items-center gap-1 py-2.5 px-4 bg-[#61a94a] hover:bg-[#4e8d3b] text-white text-xs font-bold rounded-xl shadow transition-colors"
                                >
                                    {currentSlideIndex === currentTopic.slides.length - 1 ? "Selesai" : "Lanjut"} 
                                    <FiChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

UrBae.layout = (page) => <DashboardLayout children={page} />;
