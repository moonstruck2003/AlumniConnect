<?php

namespace App\Http\Middleware;

use App\Services\JwtService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticateJwt
{
    public function handle(Request $request, Closure $next)
    {
        $header = $request->header('Authorization');
        if (! $header || ! preg_match('/^Bearer\s+(.+)$/i', $header, $m)) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $token = $m[1];
        $user = JwtService::validate($token);
        if (! $user) {
            return response()->json(['message' => 'Invalid or expired token.'], 401);
        }

        Auth::setUser($user);

        return $next($request);
    }
}
