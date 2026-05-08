import React from "react";
import { Head, Link } from "@inertiajs/react";
import { FiChevronLeft, FiCopy, FiCheckCircle, FiClock } from "react-icons/fi";
import DashboardLayout from "../Component/DashboardLayout";

export default function PaymentQR({ qrData }) {
    const [copied, setCopied] = React.useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(qrData.qr_string);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            window.location.reload();
        }, 30000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="relative overflow-hidden min-h-full">
            <Head title="Pembayaran QRIS - Paybae" />

            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50 rounded-full blur-[100px] -z-10 -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-50/80 rounded-full blur-[80px] -z-10 translate-y-1/3 -translate-x-1/3"></div>

            <div className="max-w-md mx-auto px-4 sm:px-6 pt-6 md:pt-10">
                {/* Header */}
                <div className="mb-6 animate-fade-in-up">
                    <Link
                        href={route('topup.index')}
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mb-4"
                    >
                        <FiChevronLeft className="w-4 h-4" />
                        Kembali ke Top Up
                    </Link>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FiCheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        Pembayaran QRIS
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm sm:text-base font-medium">
                        Scan QR code untuk menyelesaikan pembayaran
                    </p>
                </div>

                {/* Payment Status */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 animate-fade-in-up animation-delay-100">
                    <div className="flex items-center gap-3 mb-4">
                        <FiClock className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm font-medium text-slate-700">Menunggu Pembayaran</span>
                    </div>

                    <div className="text-center">
                        <div className="bg-slate-100 rounded-lg p-4 mb-4">
                            <img
                                src={`data:image/png;base64,${qrData.qr_string}`}
                                alt="QR Code"
                                className="w-48 h-48 mx-auto"
                            />
                        </div>

                        <p className="text-xs text-slate-500 mb-4">
                            Scan QR code di aplikasi e-wallet Anda
                        </p>

                        {/* Amount */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <p className="text-sm text-slate-600">Total Pembayaran</p>
                            <p className="text-2xl font-bold text-green-600">
                                Rp {new Intl.NumberFormat('id-ID').format(qrData.amount)}
                            </p>
                        </div>

                        {/* Copy QR String */}
                        <button
                            onClick={copyToClipboard}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            {copied ? (
                                <>
                                    <FiCheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-600">Tersalin!</span>
                                </>
                            ) : (
                                <>
                                    <FiCopy className="w-4 h-4 text-slate-600" />
                                    <span className="text-sm font-medium text-slate-600">Salin Kode QR</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in-up animation-delay-200">
                    <h3 className="font-semibold text-slate-800 mb-4">Cara Pembayaran:</h3>
                    <ol className="text-sm text-slate-600 space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">1</span>
                            <span>Buka aplikasi e-wallet (GoPay, OVO, DANA, dll)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">2</span>
                            <span>Pilih menu "Scan QR" atau "Pay"</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">3</span>
                            <span>Scan QR code di atas</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="bg-green-100 text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">4</span>
                            <span>Konfirmasi pembayaran</span>
                        </li>
                    </ol>
                </div>

            </div>
        </div>
    );
}

PaymentQR.layout = page => <DashboardLayout children={page} />;
