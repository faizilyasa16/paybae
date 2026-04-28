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

        // If user is logged in, doesn't have a profile, and isn't currently on the onboarding route
        if ($user && !$user->profile && !$request->routeIs('onboarding*')) {
            return redirect()->route('onboarding.index');
        }

        return $next($request);
    }
}
