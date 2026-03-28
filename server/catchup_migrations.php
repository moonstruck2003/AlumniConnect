<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

// Create the migrations table if it doesn't exist yet
if (!Schema::hasTable('migrations')) {
    echo "Creating missing migrations tracking table...\n";
    Illuminate\Support\Facades\Artisan::call('migrate:install');
}

$migrationsToFake = [
    'users' => [
        '2014_10_12_000000_create_users_table'
    ],
    'password_resets' => [
        '2014_10_12_100000_create_password_resets_table'
    ],
    'failed_jobs' => [
        '2019_08_19_000000_create_failed_jobs_table'
    ],
    'personal_access_tokens' => [
        '2019_12_14_000001_create_personal_access_tokens_table'
    ],
    'job_postings' => [
        '2026_03_28_114213_create_job_postings_table'
    ],
    'mentorship_requests' => [
        '2026_03_28_093616_create_mentorship_requests_table'
    ],
    'messages' => [
        '2026_03_28_135450_create_messages_table'
    ]
];

// Special case for altering tables (add column migration)
if (Schema::hasTable('users') && Schema::hasColumn('users', 'is_accepting_mentees')) {
    $migName = '2026_03_28_103924_add_is_accepting_mentees_to_users_table';
    if (!DB::table('migrations')->where('migration', $migName)->exists()) {
        DB::table('migrations')->insert(['migration' => $migName, 'batch' => 1]);
        echo "Marked schema alteration ($migName) as migrated.\n";
    }
}

foreach ($migrationsToFake as $table => $migs) {
    if (Schema::hasTable($table)) {
        foreach ($migs as $migName) {
            $exists = DB::table('migrations')->where('migration', $migName)->exists();
            if (!$exists) {
                DB::table('migrations')->insert(['migration' => $migName, 'batch' => 1]);
                echo "Marked table $table migration ($migName) as migrated.\n";
            }
        }
    }
}

echo "Done catching up the migrations table!\n";
