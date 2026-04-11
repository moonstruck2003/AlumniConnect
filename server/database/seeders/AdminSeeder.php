<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $username = env('INTERNAL_ADMIN_USERNAME', 'admin1');
        $password = env('INTERNAL_ADMIN_PASSWORD', 'admin#1');
        $email = $username . '@admin.com';

        \App\Models\User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'System Admin',
                'password' => \Illuminate\Support\Facades\Hash::make($password),
                'role' => 'admin',
                'is_verified' => true,
            ]
        );
    }
}
