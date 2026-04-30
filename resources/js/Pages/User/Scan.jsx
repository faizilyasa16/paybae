import React, { useRef, useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { FiChevronLeft, FiImage, FiZap, FiX } from 'react-icons/fi';
import { BiScan } from 'react-icons/bi';
import QRModal from '../Component/QRModal';

export default function Scan() {
    const videoRef = useRef(null);
    const fileInputRef = useRef(null);
    const [hasCameraError, setHasCameraError] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);

    useEffect(() => {
        let stream = null;
        
        // Fungsi untuk menyalakan kamera
        const startCamera = async () => {
            try {
                // Minta izin kamera (utamakan kamera belakang/environment)
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });
                
                // Sambungkan stream ke elemen video
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Gagal mengakses kamera:", err);
                setHasCameraError(true);
            }
        };

        startCamera();

        // Cleanup: Pastikan kamera dimatikan saat pindah halaman (unmount)
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Handler ketika gambar dari galeri dipilih
    const handleGalleryChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Placeholder aksi ketika gambar dipilih
            alert(`Gambar "${file.name}" berhasil dipilih dari galeri! Sistem akan mendeteksi QR di gambar ini.`);
        }
    };

    return (
        <div className="relative w-full h-screen bg-slate-900 overflow-hidden flex flex-col font-sans">
            <Head title="Scan QRIS - Paybae" />

            {/* Hidden Input for Gallery Image Selection */}
            <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleGalleryChange} 
            />

            {/* Custom Animation for the Scanner Line */}
            <style>
                {`
                @keyframes scan {
                    0% { top: 0; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                `}
            </style>
            
            {/* Background Real Camera */}
            <div className="absolute inset-0 z-0 bg-[#121212]">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="absolute inset-0 w-full h-full object-cover"
                ></video>
                
                {hasCameraError ? (
                    <div className="absolute inset-0 flex items-center justify-center px-8 text-center text-white/50 text-sm font-medium">
                        Kamera tidak dapat diakses. Pastikan browser Anda memiliki izin untuk menggunakan kamera.
                    </div>
                ) : (
                    /* Sedikit gradasi gelap di atas dan bawah agar teks dan menu tetap terbaca jelas */
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"></div>
                )}
            </div>

            {/* Top Bar */}
            <div className="relative z-20 flex items-center justify-between p-6">
                <Link href="/dashboard" className="flex items-center gap-2 text-white hover:text-green-400 transition-colors">
                    <FiChevronLeft className="w-6 h-6" />
                    <span className="font-bold text-lg">Scan QRIS</span>
                </Link>
                
                {/* Top Right Green Button */}
                <button className="bg-[#52933e] text-white p-2 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
                    <BiScan className="w-5 h-5" />
                </button>
            </div>

            {/* Scanner Viewport (Tengah) */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
                <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-square rounded-xl overflow-visible">
                    
                    {/* Shadow overlay trick to darken outside area */}
                    <div className="absolute inset-0 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] pointer-events-none"></div>
                    
                    {/* Kotak Transparan Area Scan */}
                    <div className="absolute inset-0 bg-white/5 rounded-xl border border-white/10"></div>
                    
                    {/* Sudut-sudut warna orange (Siku) */}
                    <div className="absolute -top-0.5 -left-0.5 w-10 h-10 border-t-4 border-l-4 border-[#f08a38] rounded-tl-xl"></div>
                    <div className="absolute -top-0.5 -right-0.5 w-10 h-10 border-t-4 border-r-4 border-[#f08a38] rounded-tr-xl"></div>
                    <div className="absolute -bottom-0.5 -left-0.5 w-10 h-10 border-b-4 border-l-4 border-[#f08a38] rounded-bl-xl"></div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-10 h-10 border-b-4 border-r-4 border-[#f08a38] rounded-br-xl"></div>

                    {/* Garis Animasi Scanning */}
                    <div className="absolute left-0 w-full h-[2px] bg-[#f08a38] shadow-[0_0_12px_3px_rgba(240,138,56,0.6)] animate-scan z-20"></div>
                </div>

                <div className="mt-8 flex items-center gap-2 text-white font-medium z-20">
                    <span className="text-sm">Scan Kode</span>
                    <span className="font-extrabold italic text-lg tracking-tighter bg-white text-black px-1.5 rounded-sm">QRIS</span>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="relative z-20 p-8 pb-12 flex items-center justify-between max-w-md w-full mx-auto">
                {/* Tombol Flash */}
                <button className="flex flex-col items-center gap-2 text-white hover:text-green-400 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition-all">
                        <FiZap className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium">Flash</span>
                </button>

                {/* Tombol Tampilkan QR */}
                <button 
                    onClick={() => setShowQRModal(true)}
                    className="flex items-center gap-2 bg-black/60 hover:bg-black/80 border border-white/10 backdrop-blur-md px-6 py-3.5 rounded-full text-white transition-colors"
                >
                    <BiScan className="w-5 h-5" />
                    <span className="text-sm font-bold">Tampilkan QR</span>
                </button>

                {/* Tombol Galeri */}
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-2 text-white hover:text-green-400 transition-colors group"
                >
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition-all">
                        <FiImage className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium">Galeri</span>
                </button>
            </div>

            {/* QR Code Modal Overlay */}
            <QRModal 
                isOpen={showQRModal} 
                onClose={() => setShowQRModal(false)} 
            />
        </div>
    );
}
