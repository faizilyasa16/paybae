<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class PinController extends Controller
{
    /**
     * Show the PIN setup view.
     */
    public function setup()
    {
        // If user already has a PIN, redirect to dashboard
        if (auth()->user()->pin) {
            return redirect()->route('dashboard.index');
        }

        // If user hasn't completed their profile, redirect to onboarding
        if (!auth()->user()->profile) {
            return redirect()->route('onboarding.index');
        }

        return Inertia::render('Auth/PinSetup');
    }

    /**
     * Store the newly created PIN.
     */
    public function store(Request $request)
    {
        $request->validate([
            'pin' => ['required', 'string', 'size:6', 'regex:/^[0-9]+$/'],
        ], [
            'pin.required' => 'PIN wajib diisi.',
            'pin.size' => 'PIN harus 6 digit angka.',
            'pin.regex' => 'PIN hanya boleh berisi angka.',
        ]);

        $user = auth()->user();
        
        $user->update([
            'pin' => Hash::make($request->pin),
        ]);

        // Auto verify the pin in current session after creation
        session(['pin_verified' => true]);

        return redirect()->route('dashboard.index');
    }

    /**
     * Show the PIN verification view.
     */
    public function verify()
    {
        if (session('pin_verified')) {
            return redirect()->route('dashboard.index');
        }

        return Inertia::render('Auth/PinVerify');
    }

    /**
     * Verify the entered PIN against the database.
     */
    public function verifyPost(Request $request)
    {
        $request->validate([
            'pin' => ['required', 'string', 'size:6'],
        ]);

        $user = auth()->user();

        if (Hash::check($request->pin, $user->pin)) {
            session(['pin_verified' => true]);
            return redirect()->route('dashboard.index');
        }

        return back()->withErrors(['pin' => 'PIN salah. Silakan coba lagi.']);
    }
}
