<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckProfileCompletion
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if ($user) {
            // Check Profile
            if (!$user->profile && !$request->routeIs('onboarding*')) {
                return redirect()->route('onboarding.index');
            }

            // Check PIN setup
            if ($user->profile && !$user->pin && !$request->routeIs('pin*') && !$request->routeIs('onboarding*') && !$request->routeIs('logout')) {
                return redirect()->route('pin.setup');
            }

            // Check PIN verification (for login session)
            if ($user->profile && $user->pin && !session('pin_verified') && !$request->routeIs('pin*') && !$request->routeIs('onboarding*') && !$request->routeIs('logout')) {
                return redirect()->route('pin.verify');
            }
        }

        return $next($request);
    }
}
