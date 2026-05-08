<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Dashboard\UserController;
use Inertia\Inertia;

use App\Http\Controllers\OnboardingController;
use App\Http\Middleware\CheckProfileCompletion;
use App\Http\Controllers\Dashboard\RiwayatTransaksi;
<<<<<<< HEAD
use App\Http\Controllers\Dashboard\TransferController;
=======
>>>>>>> 1f443c22033d10ff0b6b1a7903eb8bd0a8b0201d
use App\Http\Controllers\Dashboard\ProfileController;
use App\Http\Controllers\Dashboard\InsightController;

Route::get('/', function () {
    return Inertia::render('Home/Home');
})->name('home');

<<<<<<< HEAD
// Webhook routes (harus di luar auth middleware)
Route::post('/webhook/xendit', [App\Http\Controllers\WebhookController::class, 'xendit'])->name('webhook.xendit');
// Test webhook route for development
Route::post('/webhook/test/{transactionId}', [App\Http\Controllers\WebhookController::class, 'testWebhook'])->name('webhook.test');
// API routes
Route::get('/api/topup/banks', [App\Http\Controllers\Dashboard\TopUpController::class, 'getBanks'])->name('api.topup.banks');
Route::post('/api/payment/confirm', [App\Http\Controllers\WebhookController::class, 'confirmPayment'])->name('api.payment.confirm');

=======
>>>>>>> 1f443c22033d10ff0b6b1a7903eb8bd0a8b0201d
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

<<<<<<< HEAD
        Route::get('/transfer', [App\Http\Controllers\Dashboard\TransferController::class, 'index'])->name('transfer.index');
        Route::post('/transfer', [App\Http\Controllers\Dashboard\TransferController::class, 'store'])->name('transfer.store');

        Route::get('/topup', [App\Http\Controllers\Dashboard\TopUpController::class, 'index'])->name('topup.index');
        Route::post('/topup', [App\Http\Controllers\Dashboard\TopUpController::class, 'store'])->name('topup.store');
        Route::get('/payment/qr/{id}', [App\Http\Controllers\Dashboard\TopUpController::class, 'showQR'])->name('payment.qr');

=======
>>>>>>> 1f443c22033d10ff0b6b1a7903eb8bd0a8b0201d
        Route::resource('profile', ProfileController::class);
        Route::resource('insight', InsightController::class);
    });

<<<<<<< HEAD
    // Success page should be accessible without profile completion check
    Route::get('/topup/success/{id}', [App\Http\Controllers\Dashboard\TopUpController::class, 'success'])->name('topup.success');
    Route::get('/transfer/success/{id}', [App\Http\Controllers\Dashboard\TransferController::class, 'success'])->name('transfer.success');

=======
>>>>>>> 1f443c22033d10ff0b6b1a7903eb8bd0a8b0201d
    Route::post('/logout', [UserController::class, 'logout'])->name('logout');
});