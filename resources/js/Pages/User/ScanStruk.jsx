import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { FiChevronLeft, FiImage, FiZap, FiShoppingBag, FiFileText } from 'react-icons/fi';
import PrimaryButton from '../Component/PrimaryButton';

const SYSTEM_PROMPT = `Kamu adalah AI spesialis analisis struk belanja.
Ekstrak semua produk dari struk dan kategorikan ke dalam:
- Makanan & Minuman
- Kecantikan
- Perawatan Tubuh
- Perawatan Rumah
- Elektronik & Gadget
- Kesehatan & Apotek
- Fashion & Aksesoris
- Lainnya
Untuk pajak (tax, ppn, PB1, dan penyebutan lainnya) diekstrak juga untuk dikategorikan ke dalam kategori 'Lainnya'

Kembalikan HANYA JSON valid tanpa backtick:
{
  "store": "nama toko",
  "date": "tanggal",
  "total": "total belanja",
  "categories": [
    {
      "name": "nama kategori",
      "products": [
        { "name": "nama produk", "qty": "jumlah", "price": "harga" }
      ]
    }
  ]
}`;

export default function ScanStruk() {
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const [hasCameraError, setCameraError] = useState(false);
    const [isFlashOn, setIsFlashOn] = useState(false);
    
    // Step 1: Camera/Gallery, Step 2: Preview, Step 3: Result
    const [step, setStep] = useState(1);
    const [capturedImage, setCapturedImage] = useState(null);
    
    // New states for AI Analysis
    const [imageBase64, setImageBase64] = useState(null);
    const [imageMime, setImageMime] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
    }, []);

    const startCamera = useCallback(async () => {
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

        } catch (err) {
            console.error('❌ Kamera error:', err);
            setCameraError(true);
        }
    }, []);

    useEffect(() => {
        if (step === 1) {
            startCamera();
        }
        return () => stopCamera();
    }, [step, startCamera, stopCamera]);

    const handleGalleryChange = useCallback(async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            setImageMime(file.type);
            const reader = new FileReader();
            reader.onload = (ev) => {
                const dataUrl = ev.target.result;
                setCapturedImage(dataUrl);
                setImageBase64(dataUrl.split(",")[1]);
                stopCamera();
                setStep(2); // Pindah ke preview
            };
            reader.readAsDataURL(file);
        } catch { 
            alert('Gagal memproses gambar.'); 
        }
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

    const handleCapture = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(dataUrl);
        setImageBase64(dataUrl.split(",")[1]);
        setImageMime('image/jpeg');
        stopCamera();
        setStep(2);
    }, [stopCamera]);

    const [isSaving, setIsSaving] = useState(false);

    const handleSaveExpense = async () => {
        setIsSaving(true);
        // clean up total: "419.210" -> 419210
        const rawTotal = result.total || "0";
        const numericTotal = parseInt(rawTotal.toString().replace(/\D/g, ""), 10) || 0;

        // Get the category with most items, or default to Lainnya
        let mainCategory = "Lainnya";
        if (result.categories && result.categories.length > 0) {
            const maxCat = result.categories.reduce((prev, current) => 
                (prev.products.length > current.products.length) ? prev : current
            );
            mainCategory = maxCat.name;
        }

        try {
            const response = await window.axios.post('/scan-struk', {
                merchant_name: result.store || 'Toko Tidak Diketahui',
                amount: numericTotal,
                category: mainCategory,
                date: result.date
            });
            
            // Redirect to history
            window.location.href = '/history';
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan pengeluaran. Saldo mungkin tidak cukup.");
            setIsSaving(false);
        }
    };

    const handleProductChange = (catIndex, productIndex, field, value) => {
        const newCategories = [...result.categories];
        newCategories[catIndex].products[productIndex][field] = value;
        setResult({ ...result, categories: newCategories });
    };

    const handleRetake = () => {
        setCapturedImage(null);
        setImageBase64(null);
        setImageMime(null);
        setResult(null);
        setStep(1);
    };

    const analyzeReceipt = async () => {
        if (!imageBase64) return alert("Gambar belum ada!");
        setLoading(true);

        try {
            const parts = [
                { inline_data: { mime_type: imageMime, data: imageBase64 } },
                { text: SYSTEM_PROMPT }
            ];

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts }],
                        generationConfig: { responseMimeType: "application/json" },
                    }),
                }
            );

            if (!response.ok) {
                const errData = await response.json();
                if (response.status === 429) {
                    alert("Terlalu banyak request. Tunggu sebentar lalu coba lagi.");
                } else {
                    alert(`Error ${response.status}: ${errData?.error?.message || "Unknown error"}`);
                }
                setLoading(false);
                return;
            }

            const data = await response.json();
            const rawText = data.candidates[0].content.parts[0].text
                .replace(/```json|```/g, "")
                .trim();

            setResult(JSON.parse(rawText));
            setStep(3); // Pindah ke hasil
        } catch (err) {
            console.error("Error:", err);
            alert("Gagal menganalisis struk. Cek console untuk detail.");
        } finally {
            setLoading(false);
        }
    };

    // ─── Render View ─────────────────────────────────────────────────────────

    if (step === 1) {
        return (
            <div className="relative w-full h-[100dvh] bg-black overflow-hidden flex flex-col font-sans">
                <Head title="Scan Struk - Paybae" />
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleGalleryChange} />

                <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover z-0" muted playsInline />
                <canvas ref={canvasRef} className="hidden" />

                {!hasCameraError && (
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none z-[1]" />
                )}

                {hasCameraError && (
                    <div className="absolute inset-0 flex items-center justify-center px-8 text-center text-white/50 text-sm font-medium z-10 bg-[#121212]">
                        Kamera tidak dapat diakses. Pastikan browser memiliki izin kamera.
                    </div>
                )}

                {/* Header */}
                <div className="relative z-20 flex items-center justify-between p-6">
                    <Link href="/dashboard" className="flex items-center gap-2 text-white hover:text-green-400 transition-colors">
                        <FiChevronLeft className="w-6 h-6" />
                        <span className="font-bold text-lg">Scan Struk</span>
                    </Link>
                </div>

                <div className="relative z-10 flex-1 pointer-events-none" />

                {/* Camera Controls */}
                <div className="relative z-20 p-8 pb-12 flex items-center justify-between max-w-md w-full mx-auto">
                    {/* Flash Button */}
                    <button onClick={toggleFlash} className={`flex flex-col items-center gap-2 transition-colors group ${isFlashOn ? 'text-yellow-400' : 'text-white hover:text-green-400'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${isFlashOn ? 'bg-yellow-400/20 border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.4)]' : 'bg-white/10 border-white/10 group-hover:bg-white/20'}`}>
                            <FiZap className={`w-5 h-5 ${isFlashOn ? 'fill-yellow-400' : ''}`} />
                        </div>
                        <span className="text-xs font-medium">Flash</span>
                    </button>
                    
                    {/* Shutter Button (Jepret) */}
                    <button onClick={handleCapture} className="flex items-center justify-center w-20 h-20 rounded-full border-4 border-white/50 bg-white/20 hover:bg-white/40 transition-all backdrop-blur-sm group">
                        <div className="w-14 h-14 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] group-hover:scale-95 transition-transform" />
                    </button>

                    {/* Gallery Button */}
                    <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 text-white hover:text-green-400 transition-colors group">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition-all">
                            <FiImage className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium">Galeri</span>
                    </button>
                </div>
            </div>
        );
    }

    // Preview View (Step 2)
    if (step === 2) {
        return (
            <div className="relative w-full min-h-[100dvh] bg-slate-50 dark:bg-[#121212] overflow-y-auto flex flex-col font-sans pb-10">
                <Head title="Preview Struk - Paybae" />
                
                {/* Header */}
                <div className="relative z-20 flex items-center justify-between p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
                    <button onClick={handleRetake} className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-[#52933e] transition-colors">
                        <FiChevronLeft className="w-6 h-6" />
                        <span className="font-bold text-lg">Ambil Ulang</span>
                    </button>
                </div>

                {/* Image Preview Container */}
                <div className="flex-1 relative flex flex-col p-6 items-center z-10">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[20px] p-4 shadow-[0_2px_15px_-3px_rgba(6,81,237,0.1)] border border-slate-100 dark:border-slate-800 flex flex-col flex-1 h-full max-h-[60vh] justify-center overflow-hidden">
                        {capturedImage && (
                            <img 
                                src={capturedImage} 
                                alt="Struk preview" 
                                className="w-full h-full object-contain rounded-lg" 
                            />
                        )}
                    </div>

                    <div className="w-full max-w-md mt-6 bg-white dark:bg-slate-900 rounded-[20px] p-6 shadow-[0_2px_15px_-3px_rgba(6,81,237,0.1)] border border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Konfirmasi Gambar Struk</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            Pastikan gambar struk belanja terlihat jelas dan pencahayaan cukup agar dapat dibaca oleh AI.
                        </p>
                        <PrimaryButton 
                            className="w-full" 
                            onClick={analyzeReceipt} 
                            disabled={loading}
                        >
                            <span className="flex items-center justify-center gap-2">
                                {loading ? (
                                    <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                ) : <FiFileText className="w-5 h-5" />}
                                {loading ? "Sedang Membaca..." : "Proses Struk"}
                            </span>
                        </PrimaryButton>
                    </div>
                </div>
                
                {/* Background Blobs for aesthetics */}
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-green-50 dark:bg-green-900/20 rounded-full blur-[80px] z-0 -translate-y-1/2 translate-x-1/3 fixed" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-50 dark:bg-blue-900/20 rounded-full blur-[80px] z-0 translate-y-1/3 -translate-x-1/3 fixed" />
            </div>
        );
    }

    // Result View (Step 3)
    if (step === 3 && result) {
        return (
            <div className="relative w-full min-h-[100dvh] bg-slate-50 dark:bg-[#121212] flex flex-col overflow-y-auto font-sans pb-10">
                <Head title="Hasil Analisis Struk - Paybae" />
                
                {/* Header */}
                <div className="relative z-20 flex items-center justify-between p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0">
                    <button onClick={handleRetake} className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-[#52933e] transition-colors">
                        <FiChevronLeft className="w-6 h-6" />
                        <span className="font-bold text-lg">Scan Lagi</span>
                    </button>
                    <Link href="/dashboard" className="text-sm font-semibold text-[#52933e] hover:underline">Selesai</Link>
                </div>

                <div className="p-6 max-w-md mx-auto w-full relative z-10 flex-1 overflow-y-auto animate-fade-in-up">
                    <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 shadow-[0_2px_15px_-3px_rgba(6,81,237,0.1)] border border-slate-100 dark:border-slate-800 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-[#52933e] rounded-full flex items-center justify-center">
                                <FiShoppingBag className="w-5 h-5" />
                            </div>
                            <div className="flex-1 w-full">
                                <input 
                                    type="text" 
                                    value={result.store || ''} 
                                    onChange={(e) => setResult({...result, store: e.target.value})}
                                    placeholder="Nama Toko"
                                    className="w-full text-lg font-bold text-slate-800 dark:text-white leading-tight bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:border-[#52933e] focus:outline-none transition-colors px-1 py-0.5 rounded-none"
                                />
                                <input 
                                    type="text" 
                                    value={result.date || ''} 
                                    onChange={(e) => setResult({...result, date: e.target.value})}
                                    placeholder="Tanggal Transaksi"
                                    className="w-full text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:border-[#52933e] focus:outline-none transition-colors px-1 py-0.5 rounded-none"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center py-4 my-4 border-y border-slate-100 dark:border-slate-800 border-dashed">
                            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Total Belanja</span>
                            <div className="flex items-center w-1/2">
                                <span className="text-xl font-extrabold text-[#52933e] mr-1">Rp</span>
                                <input 
                                    type="text" 
                                    value={result.total ? result.total.toString().replace(/[^0-9.,]/g, '') : ''} 
                                    onChange={(e) => setResult({...result, total: e.target.value})}
                                    placeholder="0"
                                    className="w-full text-xl font-extrabold text-[#52933e] bg-transparent border-b border-dashed border-green-300 dark:border-green-800 focus:border-[#52933e] focus:outline-none transition-colors text-right px-1 py-0.5 rounded-none"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            {result.categories && result.categories.map((cat, idx) => (
                                <div key={idx} className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800/20">
                                    <div className="bg-white dark:bg-slate-800 px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
                                        <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{cat.name}</span>
                                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">{cat.products.length} Item</span>
                                    </div>
                                    <div className="px-4 py-2">
                                        {cat.products.map((p, i) => (
                                            <div key={i} className="flex justify-between items-center py-2 border-b border-slate-200/60 dark:border-slate-700/60 last:border-0 gap-2">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <div className="flex items-center text-xs font-bold text-[#52933e] bg-green-100 dark:bg-green-900/30 px-1 py-0.5 rounded h-fit">
                                                        <input 
                                                            type="text" 
                                                            value={p.qty} 
                                                            onChange={(e) => handleProductChange(idx, i, 'qty', e.target.value)}
                                                            className="bg-transparent border-none outline-none text-center w-5 p-0 text-[#52933e]"
                                                        />
                                                        <span>x</span>
                                                    </div>
                                                    <input 
                                                        type="text" 
                                                        value={p.name} 
                                                        onChange={(e) => handleProductChange(idx, i, 'name', e.target.value)}
                                                        className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-snug bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:border-[#52933e] focus:outline-none w-full px-1 py-0.5"
                                                    />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    value={p.price || ''} 
                                                    onChange={(e) => handleProductChange(idx, i, 'price', e.target.value)}
                                                    className="text-sm font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:border-[#52933e] focus:outline-none text-right w-20 px-1 py-0.5"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <PrimaryButton className="w-full" onClick={handleSaveExpense} disabled={isSaving}>
                        {isSaving ? "Menyimpan..." : "Simpan Pengeluaran"}
                    </PrimaryButton>
                </div>

                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-green-50 dark:bg-green-900/20 rounded-full blur-[80px] z-0 -translate-y-1/2 translate-x-1/3 fixed" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-50 dark:bg-blue-900/20 rounded-full blur-[80px] z-0 translate-y-1/3 -translate-x-1/3 fixed" />
            </div>
        );
    }
}
