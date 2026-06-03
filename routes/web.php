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
use App\Http\Controllers\TopUpController;
use App\Http\Controllers\TransferController;
use App\Http\Controllers\XenditWebhookController;

Route::get("/", function () {
    return Inertia::render("Home/Home");
})->name("home");

Route::get("/faq", function () {
    return Inertia::render("Home/FAQ");
})->name("faq");

Route::get("/tentang-kami", function () {
    return Inertia::render("Home/TentangKami");
})->name("tentang-kami");

Route::get("/privacy", function () {
    return Inertia::render("Home/Privacy");
})->name("privacy");

Route::middleware("guest")->group(function () {
    Route::get("/login", [LoginController::class, "index"])->name("login");
    Route::post("/login", [LoginController::class, "store"]);

    Route::get("/register", [RegisterController::class, "index"])->name(
        "register",
    );
    Route::post("/register", [RegisterController::class, "store"]);

    Route::get("/forget-password", function () {
        return Inertia::render("Auth/Forget-Password");
    })->name("forget-password");
});

Route::middleware(["auth"])->group(function () {
    Route::get("/onboarding", [OnboardingController::class, "index"])->name(
        "onboarding.index",
    );
    Route::post("/onboarding", [OnboardingController::class, "store"])->name(
        "onboarding.store",
    );

    Route::get("/pin/setup", [
        \App\Http\Controllers\Auth\PinController::class,
        "setup",
    ])->name("pin.setup");
    Route::post("/pin/setup", [
        \App\Http\Controllers\Auth\PinController::class,
        "store",
    ])->name("pin.store");

    Route::get("/pin/verify", [
        \App\Http\Controllers\Auth\PinController::class,
        "verify",
    ])->name("pin.verify");
    Route::post("/pin/verify", [
        \App\Http\Controllers\Auth\PinController::class,
        "verifyPost",
    ])->name("pin.verify.post");

    Route::middleware([CheckProfileCompletion::class])->group(function () {
        Route::resource("dashboard", UserController::class);
        Route::get('/api/recommend', [UserController::class, 'recommend'])->name('api.recommend');
        Route::get("/ur-bae", function () {
            return Inertia::render("User/UrBae");
        })->name("ur-bae");
        Route::post("/api/simulate", [UserController::class, "simulate"])->name("api.simulate");
        Route::resource("history", RiwayatTransaksi::class);

        Route::get("/scan", function () {
            $user = \Illuminate\Support\Facades\Auth::user();
            $wallet = \App\Models\Wallet::firstOrCreate(
                ['user_id' => $user->id],
                ['balance' => 0]
            );

            return Inertia::render("User/ScanQR", [
                'balance' => (float) $wallet->balance,
            ]);
        })->name("scan.index");
        
        Route::post("/scan/pay", [TransferController::class, "qrisPay"])->name("scan.pay");

        Route::get("/scan-struk", function () {
            return Inertia::render("User/ScanStruk");
        })->name("scan.struk");
        Route::post("/scan-struk", [TransferController::class, "storeStruk"])->name("scan.struk.store");

        Route::get("/profile", [ProfileController::class, "index"])->name("profile.index");
        Route::get("/profile/edit", [ProfileController::class, "edit"])->name("profile.edit");
        Route::post("/profile/edit", [ProfileController::class, "updateProfile"])->name("profile.update");
        Route::get("/profile/settings", [ProfileController::class, "settings"])->name("profile.settings");
        Route::get("/profile/security", [ProfileController::class, "security"])->name("profile.security");
        Route::post("/profile/security/pin", [ProfileController::class, "updatePin"])->name("profile.security.pin.update");
        Route::get("/terms", function () {
            return Inertia::render("User/Terms");
        })->name("terms");
        
        Route::resource("insight", InsightController::class);

        Route::get("/topup", [TopUpController::class, "index"])->name("topup.index");
        Route::post("/topup", [TopUpController::class, "store"])->name("topup.store");        
        Route::post("/topup/simulate", [TopUpController::class, "simulate"])->name("topup.simulate");        
        Route::get("/topup/{id}", [TopUpController::class, "show"])->name("topup.show");

        Route::get("/transfer", [TransferController::class, "index"])->name("transfer.index");
        Route::post("/transfer", [TransferController::class, "store"])->name("transfer.store");
        Route::get("/transfer/{id}", [TransferController::class, "show"])->name("transfer.show");
    });

    Route::post("/logout", [UserController::class, "logout"])->name("logout");
});

// Xendit Webhooks
Route::post("/xendit/callback/topup", [XenditWebhookController::class, "topUp"])->name("xendit.callback.topup");
Route::post("/xendit/callback/transfer", [XenditWebhookController::class, "transfer"])->name("xendit.callback.transfer");
