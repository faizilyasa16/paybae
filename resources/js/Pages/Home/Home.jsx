import React from "react";
import Navbar from "../Component/Navigation";

export default function Home() {
    return (
        <div>
            <Navbar />
            <main style={{padding: '20px', textAlign: 'center'}}>
                <h1 style={{color: '#22c55e', fontSize: '2rem', marginBottom: '1rem'}}>
                    Paybae - Home Page
                </h1>
                <p style={{fontSize: '1.1rem', marginBottom: '1rem'}}>
                    Selamat datang di aplikasi Paybae!
                </p>
                <p style={{color: '#666'}}>
                    Aplikasi pembayaran digital yang aman dan mudah.
                </p>
                <div style={{marginTop: '2rem'}}>
                    <a
                        href="/login"
                        style={{
                            display: 'inline-block',
                            padding: '10px 20px',
                            backgroundColor: '#22c55e',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '5px',
                            marginRight: '10px'
                        }}
                    >
                        Login
                    </a>
                    <a
                        href="/register"
                        style={{
                            display: 'inline-block',
                            padding: '10px 20px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '5px'
                        }}
                    >
                        Register
                    </a>
                </div>
            </main>
        </div>
    );
}