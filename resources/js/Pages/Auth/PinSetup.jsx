import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { FiDelete, FiLock, FiCheckCircle, FiChevronLeft } from 'react-icons/fi';

export default function PinSetup() {
    const [step, setStep] = useState(1); // 1: Create PIN, 2: Confirm PIN
    const [firstPin, setFirstPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        pin: '',
    });

    const currentPin = step === 1 ? firstPin : confirmPin;
    const pinLength = 6;

    const handleNumberClick = (num) => {
        setErrorMsg('');
        if (step === 1) {
            if (firstPin.length < pinLength) {
                const newPin = firstPin + num;
                setFirstPin(newPin);
                if (newPin.length === pinLength) {
                    setTimeout(() => setStep(2), 300);
                }
            }
        } else {
            if (confirmPin.length < pinLength) {
                const newPin = confirmPin + num;
                setConfirmPin(newPin);
                if (newPin.length === pinLength) {
                    verifyAndSubmit(firstPin, newPin);
                }
            }
        }
    };

    const handleDelete = () => {
        setErrorMsg('');
        if (step === 1) {
            setFirstPin(firstPin.slice(0, -1));
        } else {
            setConfirmPin(confirmPin.slice(0, -1));
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
            setConfirmPin('');
            setErrorMsg('');
        }
    };

    const verifyAndSubmit = (pin1, pin2) => {
        if (pin1 === pin2) {
            setData('pin', pin1);
        } else {
            setErrorMsg('PIN tidak cocok, silakan coba lagi.');
            setConfirmPin('');
        }
    };

    // Auto submit when data.pin is set
    useEffect(() => {
        if (data.pin.length === pinLength) {
            post('/pin/setup');
        }
    }, [data.pin]);

    // Handle physical keyboard input
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (processing) return;
            
            if (/^[0-9]$/.test(e.key)) {
                handleNumberClick(e.key);
            } else if (e.key === 'Backspace') {
                handleDelete();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [step, firstPin, confirmPin, processing]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans p-6">
            <Head title="Buat PIN Keamanan - Paybae" />

            <div className="w-full max-w-sm bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col h-[700px] max-h-screen relative">
                
                {/* Header */}
                <div className="p-6 pb-2 relative flex items-center justify-center">
                    {step === 2 && (
                        <button 
                            onClick={handleBack}
                            className="absolute left-6 top-6 p-2 rounded-full bg-slate-50 hover:bg-slate-100 transition-colors text-slate-600"
                        >
                            <FiChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                    <div className="w-12 h-12 bg-[#f2fbf4] rounded-2xl flex items-center justify-center text-[#52933e] mb-4 shadow-sm border border-green-100">
                        <FiLock className="w-6 h-6" />
                    </div>
                </div>
                
                <div className="text-center px-8 mb-8">
                    <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
                        {step === 1 ? 'Buat PIN Keamanan' : 'Konfirmasi PIN'}
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                        {step === 1 
                            ? 'Buat 6 digit PIN untuk mengamankan transaksi dan akun kamu.' 
                            : 'Masukkan kembali 6 digit PIN yang baru saja kamu buat.'}
                    </p>
                </div>

                {/* PIN Dots Display */}
                <div className="flex justify-center gap-4 mb-10">
                    {[...Array(pinLength)].map((_, i) => (
                        <div 
                            key={i}
                            className={`w-4 h-4 rounded-full transition-all duration-300 ${
                                i < currentPin.length 
                                ? 'bg-[#52933e] scale-110 shadow-[0_0_8px_rgba(82,147,62,0.4)]' 
                                : 'bg-slate-200'
                            }`}
                        />
                    ))}
                </div>

                {/* Error Message */}
                <div className="h-6 mb-4 text-center px-6">
                    {(errorMsg || errors.pin) && (
                        <p className="text-sm font-semibold text-red-500 animate-fade-in-up">
                            {errorMsg || errors.pin}
                        </p>
                    )}
                </div>

                {/* Keypad */}
                <div className="flex-1 bg-slate-50 rounded-t-[40px] p-8 pb-12 flex flex-col justify-end">
                    <div className="grid grid-cols-3 gap-y-6 gap-x-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <button
                                key={num}
                                onClick={() => handleNumberClick(num.toString())}
                                disabled={processing}
                                className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-2xl font-bold text-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:bg-slate-100 active:scale-90 transition-all border border-slate-100/50 disabled:opacity-50"
                            >
                                {num}
                            </button>
                        ))}
                        
                        {/* Empty button for layout */}
                        <div></div>
                        
                        <button
                            onClick={() => handleNumberClick('0')}
                            disabled={processing}
                            className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-2xl font-bold text-slate-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:bg-slate-100 active:scale-90 transition-all border border-slate-100/50 disabled:opacity-50"
                        >
                            0
                        </button>
                        
                        <button
                            onClick={handleDelete}
                            disabled={processing || currentPin.length === 0}
                            className="w-16 h-16 mx-auto bg-transparent rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200/50 active:scale-90 transition-all disabled:opacity-30"
                        >
                            <FiDelete className="w-7 h-7" />
                        </button>
                    </div>
                </div>
                
                {/* Loading Overlay */}
                {processing && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-3xl">
                        <div className="w-12 h-12 border-4 border-slate-200 border-t-[#52933e] rounded-full animate-spin mb-4"></div>
                        <p className="font-bold text-slate-700">Menyimpan PIN...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
