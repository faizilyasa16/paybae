<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class RegisterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Auth/Register'); 
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'tanggal_lahir' => 'required|date|before:today',
            'password' => 'required|min:8|confirmed',
        ]);
        
        // Generate nomor rekening unik: 16 + 8 digit acak (total 10 angka)
        do {
            $no_rekening = '16' . mt_rand(10000000, 99999999);
        } while (\App\Models\User::where('no_rekening', $no_rekening)->exists());

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'tanggal_lahir' => $request->tanggal_lahir,
            'password' => $request->password,
            'no_rekening' => $no_rekening,
        ]);

        return redirect()->route('login');
    }
}
