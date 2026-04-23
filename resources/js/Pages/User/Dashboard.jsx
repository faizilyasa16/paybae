import React from "react";
import { Head } from "@inertiajs/react";
export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 xl:px-32 z-10 bg-white shadow-2xl lg:shadow-none">
                <div className="w-full max-w-md mx-auto">
                    <h1 className="text-4xl font-extrabold text-slate-800 mb-3 tracking-snug">Dashboard</h1>
                </div>
            </div>
        </>
    );
}