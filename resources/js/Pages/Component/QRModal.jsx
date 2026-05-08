import React from 'react';
import { FiX } from 'react-icons/fi';
import { BiScan } from 'react-icons/bi';

export default function QRModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-[24px] p-8 max-w-sm w-full flex flex-col items-center relative shadow-2xl animate-fade-in-up">
                {/* Tombol Close */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 rounded-full transition-colors"
                >
                    <FiX className="w-5 h-5" />
                </button>
                
                <h3 className="font-extrabold text-2xl text-slate-800 mb-1">QRIS Paybae</h3>
                <p className="text-sm text-slate-500 font-medium mb-6 text-center">
                    Tunjukkan kode ini ke pemindai untuk menerima pembayaran.
                </p>
                
                <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm mb-6">
                    {/* Dummy QR Code Image */}
                    <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=Paybae-Dummy-QR-Code" 
                        alt="QRIS Dummy" 
                        className="w-48 h-48 rounded-lg" 
                    />
                </div>
                
                <div className="flex items-center gap-2 bg-[#f2fbf4] px-4 py-2.5 rounded-xl border border-green-100 text-[#52933e] font-bold w-full justify-center">
                    <BiScan className="w-5 h-5" />
                    <span>Siap di-scan</span>
                </div>
            </div>
        </div>
    );
}
