import React from 'react';
import { Head } from '@inertiajs/react';
import Navigation from './Component/Navigation';
import Home from './Home/Home';

export default function Welcome(props) {
    return (
        <div className="relative min-h-screen bg-slate-50 font-sans text-gray-900 overflow-hidden">
            <Head title="Welcome to Paybae" />
            
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-100 blur-3xl opacity-50"></div>
                <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-100 blur-3xl opacity-50"></div>
            </div>

            <Navigation />

            <Home />

            
        </div>
    );
}
