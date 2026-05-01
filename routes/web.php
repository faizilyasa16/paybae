<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Dashboard\UserController;
use Inertia\Inertia;

use App\Http\Controllers\OnboardingController;
use App\Http\Middleware\CheckProfileCompletion;
use App\Http\Controllers\Dashboard\RiwayatTransaksi;
use App\Http\Controllers\Dashboard\ProfileController;
use App\Http\Controllers\Dashboard\InsightController;

Route::get('/', function () {
    return Inertia::render('Home/Home');
})->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'index'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);

    Route::get('/register', [RegisterController::class, 'index'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);

    Route::get('/forget-password', function () {
        return Inertia::render('Auth/Forget-Password');
    })->name('forget-password');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/onboarding', [OnboardingController::class, 'index'])->name('onboarding.index');
    Route::post('/onboarding', [OnboardingController::class, 'store'])->name('onboarding.store');

    Route::get('/pin/setup', [\App\Http\Controllers\Auth\PinController::class, 'setup'])->name('pin.setup');
    Route::post('/pin/setup', [\App\Http\Controllers\Auth\PinController::class, 'store'])->name('pin.store');

    Route::get('/pin/verify', [\App\Http\Controllers\Auth\PinController::class, 'verify'])->name('pin.verify');
    Route::post('/pin/verify', [\App\Http\Controllers\Auth\PinController::class, 'verifyPost'])->name('pin.verify.post');

    Route::middleware([CheckProfileCompletion::class])->group(function () {
        Route::resource('dashboard', UserController::class);
        Route::resource('history', RiwayatTransaksi::class);
        
        Route::get('/scan', function () {
            return Inertia::render('User/Scan');
        })->name('scan.index');

        Route::resource('profile', ProfileController::class);
        Route::resource('insight', InsightController::class);
    });

    Route::post('/logout', [UserController::class, 'logout'])->name('logout');
});