<?php

namespace App\Services;

use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Log;

class JwtService
{
    public static function issue(User $user): string
    {
        $ttlMinutes = (int) config('jwt.ttl', 60);
        $now = time();
        $payload = [
            'iss' => config('app.url'),
            'iat' => $now,
            'exp' => $now + ($ttlMinutes * 60),
            'nbf' => $now,
            'sub' => $user->id,
            'jti' => bin2hex(random_bytes(16)),
        ];

        $key = config('jwt.secret');
        if (empty($key)) {
            throw new \RuntimeException('JWT_SECRET is not set. Run: php artisan jwt:secret');
        }

        return JWT::encode($payload, $key, config('jwt.algo', 'HS256'));
    }

    public static function validate(string $token): ?User
    {
        try {
            $key = config('jwt.secret');
            if (empty($key)) {
                return null;
            }
            $decoded = JWT::decode($token, new Key($key, config('jwt.algo', 'HS256')));
            $userId = $decoded->sub ?? null;
            if (! $userId) {
                return null;
            }

            return User::find($userId);
        } catch (\Throwable $e) {
            Log::debug('JWT validation failed: '.$e->getMessage());

            return null;
        }
    }
}
