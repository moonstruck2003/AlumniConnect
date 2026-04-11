#!/bin/bash
set -e

cd /var/www

# Create storage link
php artisan storage:link --force 2>/dev/null || true

# Cache everything
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force

# Create supervisor log dir
mkdir -p /var/log/supervisor

# Start Nginx + PHP-FPM
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
