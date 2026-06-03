import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { FiChevronLeft, FiImage, FiZap, FiArrowRight, FiArrowLeft, FiInfo, FiSend } from 'react-icons/fi';
import { BiScan } from 'react-icons/bi';
import { BsShop } from 'react-icons/bs';
import jsQR from 'jsqr';
import QRModal from '../Component/QRModal';
import FormInput from '../Component/FormInput';
import PrimaryButton from '../Component/PrimaryButton';
import TransaksiBerhasil from '../Component/Transaksi/TransaksiBerhasil';
import TransaksiGagal from '../Component/Transaksi/TransaksiGagal';

const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(angka);

const EXPENSE_CATEGORIES = [
    { code: "Makanan & Minuman", label: "Makanan & Minuman", icon: "🍔" },
    { code: "Belanja", label: "Belanja", icon: "🛍️" },
    { code: "Tagihan", label: "Tagihan", icon: "🧾" },
    { code: "Hiburan", label: "Hiburan", icon: "🎬" },
    { code: "Transportasi", label: "Transportasi", icon: "🚗" },
    { code: "Edukasi", label: "Edukasi", icon: "🎓" },
    { code: "Kesehatan", label: "Kesehatan", icon: "🏥" },
    { code: "Lainnya", label: "Lainnya", icon: "💸" },
];

export default function ScanQR() {
    const { auth, balance } = usePage().props;
    const userBalance = balance ?? 0;

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const animationRef = useRef(null);

    const [hasCameraError, setCameraError] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [isFlashOn, setIsFlashOn] = useState(false);
    const [scanResult, setScanResult] = useState(null);

    // Transaction States
    const [step, setStep] = useState(1); // 1: Scan, 2: Detail Pembayaran, 3: PIN, 4: Sukses/Gagal
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Lainnya");
    const [note, setNote] = useState("");
    const [pin, setPin] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState(null); // 'success' or 'failed'

    const numAmount = parseInt(amount, 10) || 0;
    // Dummy merchant info extracted from QR or defaulted
    const merchantName = "Merchant QRIS";

    const validateQRIS = (data) => {
        // Simple mock validation for QRIS format
        return data.includes('000201') || data.toUpperCase().includes('QRIS');
    };

    const stopCamera = useCallback(() => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
    }, []);

    const startScanning = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: 'environment' },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false,
            });
            streamRef.current = stream;

            const video = videoRef.current;
            if (!video) return;
            video.srcObject = stream;
            video.setAttribute('playsinline', 'true');
            await video.play();

            await new Promise(resolve => {
                const check = () => {
                    if (video.videoWidth > 0) resolve();
                    else requestAnimationFrame(check);
                };
                check();
            });

            const vw = video.videoWidth;
            const vh = video.videoHeight;
            
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = vw;
                canvas.height = vh;
            }

            let detector = null;
            if ('BarcodeDetector' in window) {
                try {
                    detector = new BarcodeDetector({ formats: ['qr_code'] });
                } catch (e) {
                    console.warn('BarcodeDetector gagal init:', e);
                }
            }

            let busy = false;

            const tick = () => {
                if (busy) {
                    animationRef.current = requestAnimationFrame(tick);
                    return;
                }

                if (video.readyState >= video.HAVE_ENOUGH_DATA && step === 1) {
                    if (detector) {
                        busy = true;
                        detector.detect(video).then(barcodes => {
                            busy = false;
                            if (barcodes.length > 0) {
                                const data = barcodes[0].rawValue;
                                if (!validateQRIS(data)) {
                                    alert('Kode QR tidak sesuai');
                                    animationRef.current = requestAnimationFrame(tick);
                                    return;
                                }
                                setScanResult(data);
                                stopCamera();
                                setStep(2);
                                return;
                            }
                            animationRef.current = requestAnimationFrame(tick);
                        }).catch(() => {
                            busy = false;
                            animationRef.current = requestAnimationFrame(tick);
                        });
                        return;
                    }

                    if (canvas) {
                        const ctx = canvas.getContext('2d', { willReadFrequently: true });
                        ctx.drawImage(video, 0, 0, vw, vh);
                        const imageData = ctx.getImageData(0, 0, vw, vh);

                        const code = jsQR(imageData.data, imageData.width, imageData.height, {
                            inversionAttempts: 'attemptBoth',
                        });

                        if (code && code.data) {
                            if (!validateQRIS(code.data)) {
                                alert('Kode QR tidak sesuai');
                                animationRef.current = requestAnimationFrame(tick);
                                return;
                            }
                            setScanResult(code.data);
                            stopCamera();
                            setStep(2);
                            return;
                        }
                    }
                }

                if (step === 1) {
                    animationRef.current = requestAnimationFrame(tick);
                }
            };

            animationRef.current = requestAnimationFrame(tick);
        } catch (err) {
            console.error('❌ Kamera error:', err);
            setCameraError(true);
        }
    }, [stopCamera, step]);

    useEffect(() => {
        if (step === 1) {
            startScanning();
        }
        return () => stopCamera();
    }, [step, startScanning, stopCamera]);

    const handleGalleryChange = useCallback(async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const img = new Image();
            const url = URL.createObjectURL(file);
            await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
            const c = document.createElement('canvas');
            c.width = img.width; c.height = img.height;
            const x = c.getContext('2d');
            x.drawImage(img, 0, 0);
            const d = x.getImageData(0, 0, c.width, c.height);
            URL.revokeObjectURL(url);
            const code = jsQR(d.data, d.width, d.height, { inversionAttempts: 'attemptBoth' });
            
            if (code) {
                if (!validateQRIS(code.data)) {
                    alert('Kode QR tidak sesuai');
                } else {
                    stopCamera();
                    setScanResult(code.data);
                    setStep(2);
                }
            } else {
                alert('Tidak ditemukan QR Code di gambar.');
            }
        } catch { alert('Gagal memproses gambar.'); }
        e.target.value = '';
    }, [stopCamera]);

    const toggleFlash = useCallback(async () => {
        if (!streamRef.current) return alert('Kamera belum aktif.');
        const track = streamRef.current.getVideoTracks()[0];
        if (!track) return;
        try {
            const cap = track.getCapabilities();
            if (cap.torch) {
                const next = !isFlashOn;
                await track.applyConstraints({ advanced: [{ torch: next }] });
                setIsFlashOn(next);
            } else alert('Flash tidak didukung perangkat ini.');
        } catch (err) { console.error('Flash error:', err); }
    }, [isFlashOn]);

    // ─── Transaction Handlers ────────────────────────────────────────────────
    const handleNextToPin = (e) => {
        e.preventDefault();
        const errs = {};
        if (!amount || numAmount < 1) errs.amount = "Nominal tidak boleh kosong.";
        else if (numAmount > userBalance) errs.amount = "Saldo tidak mencukupi.";
        if (!category) errs.category = "Pilih kategori pengeluaran.";
        
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }
        setErrors({});
        setStep(3);
    };

    const handleConfirmPayment = async (e) => {
        e.preventDefault();
        if (!pin || pin.length !== 6) {
            setErrors({ pin: "PIN harus 6 digit." });
            return;
        }
        setErrors({});
        setLoading(true);

        try {
            const response = await window.axios.post('/scan/pay', {
                merchant_name: merchantName,
                amount: numAmount,
                description: note,
                pin: pin,
                category: category
            });
            
            setTransactionStatus('success');
            setLoading(false);
            setStep(4);
        } catch (error) {
            setLoading(false);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                setTransactionStatus(null);
            } else {
                setTransactionStatus('failed');
                setStep(4);
            }
        }
    };

    const handleReset = () => {
        setScanResult(null);
        setAmount("");
        setCategory("Lainnya");
        setNote("");
        setPin("");
        setTransactionStatus(null);
        setErrors({});
        setStep(1);
    };

    // ─── Render View ─────────────────────────────────────────────────────────

    // Kamera View (Step 1)
    if (step === 1) {
        return (
            <div className="relative w-full h-[100dvh] bg-black overflow-hidden flex flex-col font-sans">
                <Head title="Scan QR - Paybae" />
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleGalleryChange} />

                <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover z-0" muted playsInline />
                <canvas ref={canvasRef} style={{ position: 'fixed', top: '-9999px', left: '-9999px', pointerEvents: 'none' }} />

                {!hasCameraError && (
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none z-[1]" />
                )}

                {hasCameraError && (
                    <div className="absolute inset-0 flex items-center justify-center px-8 text-center text-white/50 text-sm font-medium z-10 bg-[#121212]">
                        Kamera tidak dapat diakses. Pastikan browser memiliki izin kamera.
                    </div>
                )}

                {!hasCameraError && (
                    <div className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none">
                        <div className="relative w-64 h-64">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-xl" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-xl" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-xl" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-xl" />
                            <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent" style={{ animation: 'scanLine 2.5s ease-in-out infinite' }} />
                            <p className="absolute -bottom-10 left-0 right-0 text-center text-white/70 text-sm font-medium">Arahkan kamera ke QRIS</p>
                        </div>
                    </div>
                )}

                <style>{`@keyframes scanLine { 0%,100%{top:8px} 50%{top:calc(100% - 8px)} }`}</style>

                <div className="relative z-20 flex items-center justify-between p-6">
                    <Link href="/dashboard" className="flex items-center gap-2 text-white hover:text-green-400 transition-colors">
                        <FiChevronLeft className="w-6 h-6" />
                        <span className="font-bold text-lg">Scan QR</span>
                    </Link>
                    <button className="bg-[#52933e] text-white p-2 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
                        <BiScan className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative z-10 flex-1 pointer-events-none" />

                <div className="relative z-20 p-8 pb-12 flex items-center justify-between max-w-md w-full mx-auto">
                    <button onClick={toggleFlash} className={`flex flex-col items-center gap-2 transition-colors group ${isFlashOn ? 'text-yellow-400' : 'text-white hover:text-green-400'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${isFlashOn ? 'bg-yellow-400/20 border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.4)]' : 'bg-white/10 border-white/10 group-hover:bg-white/20'}`}>
                            <FiZap className={`w-5 h-5 ${isFlashOn ? 'fill-yellow-400' : ''}`} />
                        </div>
                        <span className="text-xs font-medium">Flash</span>
                    </button>
                    <button onClick={() => setShowQRModal(true)} className="flex items-center gap-2 bg-black/60 hover:bg-black/80 border border-white/10 backdrop-blur-md px-6 py-3.5 rounded-full text-white transition-colors">
                        <BiScan className="w-5 h-5" />
                        <span className="text-sm font-bold">Tampilkan QR</span>
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 text-white hover:text-green-400 transition-colors group">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition-all">
                            <FiImage className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium">Galeri</span>
                    </button>
                </div>

                <QRModal isOpen={showQRModal} onClose={() => setShowQRModal(false)} />
            </div>
        );
    }

    // Formulir Pembayaran & Konfirmasi (Step 2, 3, 4)
    return (
        <div className="relative min-h-[100dvh] bg-slate-50 dark:bg-[#121212] overflow-y-auto flex flex-col font-sans pb-10">
            <Head title="Pembayaran QRIS - Paybae" />
            
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-50 dark:bg-green-900/20 rounded-full blur-[80px] -z-10 -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-50 dark:bg-green-900/20/60 rounded-full blur-[70px] -z-10 translate-y-1/3 -translate-x-1/3" />

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-6 md:pt-10 pb-10">
                <div className="max-w-2xl mx-auto w-full h-full flex flex-col">
                {step < 4 && (
                    <div className="mb-6 animate-fade-in-up flex items-center gap-3">
                        <button
                            onClick={() => {
                                if (step === 3) setStep(2);
                                else if (step === 2) handleReset();
                            }}
                            className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#52933e] hover:border-green-200 transition-all"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
                                {step === 2 ? 'Detail Pembayaran' : 'Konfirmasi PIN'}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-0.5">
                                {step === 2 ? 'Masukkan nominal pembayaran.' : 'Masukkan PIN untuk melanjutkan.'}
                            </p>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="bg-white dark:bg-slate-900 rounded-[20px] p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 dark:border-slate-800/60 animate-fade-in-up">
                        {/* Merchant Info */}
                        <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
                                <BsShop className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white text-lg">{merchantName}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">NMID: ID1234567890123</p>
                            </div>
                        </div>

                        <form onSubmit={handleNextToPin} className="space-y-5">
                            {/* Saldo Info */}
                            <div className="flex justify-between items-center px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
                                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Saldo Tersedia</span>
                                <span className="font-bold text-blue-800 dark:text-blue-300">{formatRupiah(userBalance)}</span>
                            </div>

                            {/* Nominal */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                                    Nominal Pembayaran <span className="text-red-500">*</span>
                                </label>
                                <div className={`flex items-center border-2 rounded-xl overflow-hidden transition-all bg-slate-50 dark:bg-slate-800 focus-within:bg-white dark:bg-slate-900 ${errors.amount ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus-within:border-[#52933e]"}`}>
                                    <span className="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-sm border-r border-slate-200 dark:border-slate-700 select-none">
                                        Rp
                                    </span>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="0"
                                        value={amount}
                                        onChange={(e) => {
                                            setAmount(e.target.value);
                                            setErrors((p) => ({ ...p, amount: undefined }));
                                        }}
                                        className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500/70 font-semibold text-base"
                                    />
                                </div>
                                {errors.amount && <p className="text-red-500 text-xs mt-1.5">{errors.amount}</p>}
                            </div>

                            {/* Pilih Kategori */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                    Kategori Pengeluaran <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {EXPENSE_CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.code}
                                            type="button"
                                            onClick={() => {
                                                setCategory(cat.code);
                                                setErrors((p) => ({ ...p, category: undefined }));
                                            }}
                                            className={`flex items-center sm:flex-col sm:justify-center gap-2.5 sm:gap-1.5 py-3 px-4 rounded-xl border-2 font-bold text-xs sm:text-xs transition-all ${
                                                category === cat.code
                                                    ? "border-[#52933e] bg-[#f2fbf4] text-[#52933e] shadow-sm dark:shadow-none shadow-green-200"
                                                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 hover:bg-white dark:hover:bg-slate-900"
                                            }`}
                                        >
                                            <span className="text-lg sm:text-xl">{cat.icon}</span>
                                            <span className="text-left sm:text-center leading-tight truncate w-full">{cat.label}</span>
                                        </button>
                                    ))}
                                </div>
                                {errors.category && <p className="text-red-500 text-xs mt-1.5">{errors.category}</p>}
                            </div>

                            <FormInput
                                label="Catatan"
                                type="text"
                                placeholder="Opsional"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />

                            <PrimaryButton type="submit" className="mt-4">
                                <span className="flex items-center justify-center">Lanjutkan <FiArrowRight className="ml-2 w-5 h-5" /></span>
                            </PrimaryButton>
                        </form>
                    </div>
                )}

                {step === 3 && (
                    <form onSubmit={handleConfirmPayment} className="animate-fade-in-up space-y-5">
                        <div className="bg-white dark:bg-slate-900 rounded-[20px] p-5 sm:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] border border-slate-100/60 dark:border-slate-800/60">
                            <h2 className="font-bold text-slate-800 dark:text-white text-lg mb-1">
                                Konfirmasi Pembayaran
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                                Masukkan PIN 6 digit akun Paybae kamu.
                            </p>

                            <div className="flex justify-between items-center mb-6 py-3 border-y border-slate-100 dark:border-slate-800">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Pembayaran</span>
                                <span className="font-extrabold text-lg text-[#52933e]">{formatRupiah(numAmount)}</span>
                            </div>

                            <div className={`flex items-center border-2 rounded-xl overflow-hidden transition-all bg-slate-50 dark:bg-slate-800 focus-within:bg-white dark:bg-slate-900 ${errors.pin ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus-within:border-[#52933e]"}`}>
                                <div className="flex items-center gap-2 px-4 py-3 border-r border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className={`w-2 h-2 rounded-full transition-all ${i < pin.length ? "bg-[#52933e]" : "bg-slate-300"}`} />
                                    ))}
                                </div>
                                <input
                                    type="password"
                                    maxLength={6}
                                    placeholder="••••••"
                                    value={pin}
                                    onChange={(e) => {
                                        setPin(e.target.value.replace(/\D/g, "").slice(0, 6));
                                        setErrors((p) => ({ ...p, pin: undefined }));
                                    }}
                                    className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-800 dark:text-white font-bold text-xl tracking-[0.5em] placeholder-slate-400 dark:placeholder-slate-500/70"
                                />
                            </div>
                            {errors.pin && <p className="text-red-500 text-xs mt-1.5">{errors.pin}</p>}

                            <div className="flex items-start gap-2.5 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 rounded-xl p-3 mt-6">
                                <FiInfo className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-orange-700 font-medium leading-relaxed">
                                    Saldo sebesar <span className="font-bold">{formatRupiah(numAmount)}</span> akan langsung didebit. Pastikan data merchant sudah benar.
                                </p>
                            </div>
                        </div>

                        <PrimaryButton disabled={loading} type="submit" className="w-full">
                            <span className="flex items-center justify-center gap-2">
                                {loading ? (
                                    <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                ) : <FiSend className="w-5 h-5" />}
                                {loading ? "Memproses..." : "Bayar Sekarang"}
                            </span>
                        </PrimaryButton>
                    </form>
                )}

                {step === 4 && transactionStatus === 'success' && (
                    <TransaksiBerhasil
                        title="Pembayaran Berhasil!"
                        description="Transaksi QRIS telah berhasil diproses."
                        amount={numAmount}
                        amountLabel="Total Pembayaran"
                        note={note}
                        details={[
                            {
                                label: "Merchant",
                                value: merchantName,
                                subValue: "NMID: ID1234567890123"
                            },
                            {
                                label: "Kategori",
                                value: category,
                            }
                        ]}
                        primaryText="Kembali ke Dashboard"
                        primaryHref="/dashboard"
                        secondaryText="Scan Lagi"
                        onSecondaryClick={handleReset}
                    />
                )}

                {step === 4 && transactionStatus === 'failed' && (
                    <TransaksiGagal
                        title="Pembayaran Gagal"
                        description="Transaksi QRIS tidak dapat diproses."
                        errorMessage="Sistem sedang mengalami gangguan. Silakan coba beberapa saat lagi."
                        primaryText="Scan Lagi"
                        onPrimaryClick={handleReset}
                        secondaryText="Kembali ke Dashboard"
                        secondaryHref="/dashboard"
                    />
                )}
                </div>
            </div>
        </div>
    );
}
