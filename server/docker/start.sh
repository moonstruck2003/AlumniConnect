#!/bin/bash
set -e

cd /var/www

# Generate storage link if it doesn't exist
php artisan storage:link --force 2>/dev/null || true

# Cache config and routes for production speed
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force

# Create supervisor log dir
mkdir -p /var/log/supervisor

# Start all processes via supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
