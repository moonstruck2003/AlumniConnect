<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\JwtService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle login: validate credentials and return JWT token + user.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $credentials = $validator->validated();

        if (! Auth::guard('web')->attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        $user = Auth::user();
        $token = JwtService::issue($user);

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl', 60) * 60,
        ], 200);
    }

    /**
     * Logout: client should discard token; API just confirms.
     */
    public function destroy(Request $request)
    {
        return response()->json(['message' => 'Logged out successfully'], 200);
    }
}
