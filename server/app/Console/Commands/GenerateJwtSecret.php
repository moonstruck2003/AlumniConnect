<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GenerateJwtSecret extends Command
{
    protected $signature = 'jwt:secret';
    protected $description = 'Set the JWT secret in .env';

    public function handle()
    {
        $key = Str::random(64);
        $path = base_path('.env');

        if (! file_exists($path)) {
            $this->error('.env file not found.');
            return 1;
        }

        $content = file_get_contents($path);
        if (strpos($content, 'JWT_SECRET=') !== false) {
            $content = preg_replace('/JWT_SECRET=.*/', 'JWT_SECRET='.$key, $content);
        } else {
            $content .= "\nJWT_SECRET={$key}\n";
        }

        file_put_contents($path, $content);
        $this->info('JWT_SECRET has been set in .env');

        return 0;
    }
}
