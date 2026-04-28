<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\UserProfile;

class OnboardingController extends Controller
{
    public function index()
    {
        // If user already has profile, redirect to dashboard
        if (auth()->user()->profile) {
            return redirect()->route('dashboard.index');
        }

        return Inertia::render('Auth/Onboarding');
    }

    public function store(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|max:20',
            'nik' => 'required|string|max:20|unique:user_profiles',
            'address' => 'required|string|max:500',
            'occupation' => 'required|string|max:100',
            'parent_name' => 'nullable|string|max:100',
            'parent_phone' => 'nullable|string|max:20',
        ]);

        $user = auth()->user();

        $user->profile()->create([
            'phone' => $request->phone,
            'nik' => $request->nik,
            'address' => $request->address,
            'occupation' => $request->occupation,
            'parent_name' => $request->parent_name,
            'parent_phone' => $request->parent_phone,
        ]);

        return redirect()->route('dashboard.index');
    }
}
