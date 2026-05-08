<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPinVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Pastikan user sudah login
        if (auth()->check()) {
            $user = auth()->user();
            
            // Jika user belum punya PIN, paksa ke halaman setup PIN (atau abaikan tergantung requirement)
            if (empty($user->pin)) {
                return redirect()->route('pin.setup');
            }

            // Jika session pin_verified belum diset ke true, lempar ke halaman verifikasi PIN
            if (!session('pin_verified')) {
                return redirect()->route('pin.verify');
            }
        }

        return $next($request);
    }
}
