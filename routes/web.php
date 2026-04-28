<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Dashboard\UserController;
use Inertia\Inertia;

use App\Http\Controllers\OnboardingController;
use App\Http\Middleware\CheckProfileCompletion;

Route::get('/', function () {
    return Inertia::render('Welcome');
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

    Route::middleware([CheckProfileCompletion::class])->group(function () {
        Route::resource('dashboard', UserController::class);
    });
});