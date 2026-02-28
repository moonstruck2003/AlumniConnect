# JWT Setup

1. **Install PHP dependencies** (if not already done)
   ```bash
   composer update
   ```

2. **Generate JWT secret**
   ```bash
   php artisan jwt:secret
   ```
   This adds or updates `JWT_SECRET` in your `.env` file.

3. **Optional**: Adjust token TTL in `.env` (minutes; default 60)
   ```
   JWT_TTL=60
   ```

After that, the API will issue JWT tokens on `POST /api/login` and accept `Authorization: Bearer <token>` on protected routes (`/api/user`, `/api/logout`).
