<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('User/Profile');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the profile.
     */
    public function edit()
    {
        return Inertia::render('User/ProfileEdit');
    }

    /**
     * Show the settings page.
     */
    public function settings()
    {
        return Inertia::render('User/ProfileSettings');
    }

    /**
     * Show the security page.
     */
    public function security()
    {
        return Inertia::render('User/ProfileSecurity');
    }

    /**
     * Update profile (name, email, phone, avatar)
     */
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,'.$user->id,
            'no_hp' => 'nullable|string|max:20',
            'avatar' => 'nullable|image|max:2048',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->save();

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            
            if ($user->profile) {
                $user->profile->update(['profile_picture' => $path, 'phone' => $request->no_hp]);
            } else {
                $user->profile()->create(['profile_picture' => $path, 'phone' => $request->no_hp]);
            }
        } else {
            if ($user->profile) {
                $user->profile->update(['phone' => $request->no_hp]);
            } else {
                $user->profile()->create(['phone' => $request->no_hp]);
            }
        }

        return redirect()->back()->with('success', 'Profil berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
