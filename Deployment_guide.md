# Deployment Guide: Laravel + React on Railway (via GitHub Actions)

This guide documents the strict deployment pipeline for moving the AlumniConnect project from local development to production.

We chose **Option B (Docker natively on Railway)**. This is superior to `nixpacks.toml` because your project contains a React frontend (`client/`), and the local `Dockerfile` is already designed to perfectly compile React and move it into Laravel's public directory. Railway will automatically detect this `Dockerfile` and build it perfectly!

---

## Step 1: Prepare Your Project

Your project is heavily reliant on environment variables.

**1.1 — Ensure `.env.example` has placeholder variables defined.**
This acts as a template for what variables need to be present either in your GitHub CI test environment or your Railway deployment environment. Ensure it includes:
```env
APP_NAME=Laravel
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=
FRONTEND_URL=

DB_CONNECTION=mysql
DB_HOST=
DB_PORT=3306
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

GEMINI_API_KEY=
```

---

## Step 2: Set Up Railway.app Manually

**2.1 — Create an Empty Project:**
Go to [railway.app](https://railway.app), click **New Project**, and select **Empty Project**.

**2.2 — Add a Managed Database:**
Inside your project, click **+ New Service → Database → Add MySQL**.
Railway will spin up a secure instance and give you variables like `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, etc.

**2.3 — Add your App Service:**
Click **+ New Service → Empty Service** (Do not deploy directly from GitHub inside the Railway UI! We want GitHub Actions to control this). Name it `alumniconnect-app`.

**2.4 — Bind Environment Variables to the App Service:**
Click on your `alumniconnect-app` service → **Variables** tab. Add your production secrets and link the database dynamically using Railway's reference variables:
```
APP_NAME=AlumniConnect
APP_ENV=production
APP_KEY=         (Paste your local base64 key)
APP_DEBUG=false
APP_URL=         (Fill this in after generating a Railway Domain)
FRONTEND_URL=    (Fill this in after generating a Railway Domain)

DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

GEMINI_API_KEY=AIzaSyByY5RqrMkqVFN753qLjK4UpfECXZmOKzY
```

**2.5 — Get Your Credentials For GitHub Actions:**
1. **RAILWAY_TOKEN**: Go to Account Settings → Tokens → Create Token.
2. **SERVICE & PROJECT ID**: Go to your `alumniconnect-app` service → Settings. Copy the `Service ID` and `Project ID`.

---

## Step 3: Add GitHub Secrets

Open your GitHub repo in the browser. Go to **Settings → Secrets and variables → Actions → New repository secret**, and add:

| Secret Name | Value | Purpose |
|---|---|---|
| `RAILWAY_TOKEN` | (Your Token) | Allows the CI/CD pipeline to authenticate with your Railway account |
| `RAILWAY_SERVICE_ID` | (Service ID) | Tells the pipeline exactly which service to overwrite |
| `RAILWAY_PROJECT_ID` | (Project ID) | Identifies your specific workspace on Railway |

---

## Step 4: The Automated GitHub Workflow Explained

We will create `.github/workflows/deploy.yml`. It has two strictly enforced phases happening in the cloud:

### Job 1: The Test Phase (`test`)
When you push code to `main`, GitHub Actions spins up an Ubuntu server.
*   **Virtual DB**: It starts a temporary MySQL container just for testing.
*   **PHP Setup**: It installs PHP 8.4 (matching your requirements).
*   **Composer Install**: It securely downloads your backend dependencies.
*   **Environment Simulation**: It creates a fake `.env` file and points it to the temporary MySQL database.
*   **Artisan Tests**: It runs `php artisan migrate` and `php artisan test` to ensure your backend isn't broken.

> **If the test phase fails (Red ❌), the pipeline aborts. Broken code is blocked.**

### Job 2: The Deploy Phase (`deploy`)
If the test phase passes (Green ✅), GitHub proceeds to deployment.
*   **Requirement Check**: (`needs: test`) This strictly requires Job 1 to succeed.
*   **Railway CLI**: It downloads Railway's remote command-line tool.
*   **The Big Push**: It runs `railway up --detach`. This commands Railway to pull your code, find your `Dockerfile`, build your React frontend, package your Laravel backend, and launch it to the world.

---

## Your Daily Development Flow

1. Checkout `dev` branch.
2. Make your local changes and test them.
3. Once satisfied, create a Pull Request to merge `dev` into `main`.
4. The moment the PR is merged, GitHub automatically tests the code, builds the Docker container, and deploys it live on Railway!
