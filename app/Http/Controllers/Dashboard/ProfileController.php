<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

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

    /**
     * Update user's PIN
     */
    public function updatePin(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'old_pin' => ['required', 'string', 'size:6'],
            'new_pin' => ['required', 'string', 'size:6', 'different:old_pin'],
            'confirm_pin' => ['required', 'string', 'same:new_pin'],
        ], [
            'old_pin.required' => 'PIN lama harus diisi.',
            'old_pin.size' => 'PIN lama harus 6 digit.',
            'new_pin.required' => 'PIN baru harus diisi.',
            'new_pin.size' => 'PIN baru harus 6 digit.',
            'new_pin.different' => 'PIN baru harus berbeda dengan PIN lama.',
            'confirm_pin.required' => 'Konfirmasi PIN harus diisi.',
            'confirm_pin.same' => 'Konfirmasi PIN tidak cocok.',
        ]);

        if (!Hash::check($request->old_pin, $user->pin)) {
            return back()->withErrors(['old_pin' => 'PIN lama yang Anda masukkan salah.']);
        }

        $user->pin = Hash::make($request->new_pin);
        $user->save();

        return redirect()->back()->with('success', 'PIN berhasil diubah!');
    }
}
