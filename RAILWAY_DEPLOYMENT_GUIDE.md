# The Master Deployment Guide: Railway.app (Docker + GitHub CI/CD)

**Purpose:** This document is the definitive reference for deploying AlumniConnect to the live internet. It is written to be detailed enough that someone with no prior DevOps experience can follow it step-by-step, and technical enough to be used during an academic viva presentation.

> **What is CI/CD?**
> - **CI (Continuous Integration):** Every time a developer pushes code, an automated robot tries to "break it." If it breaks, the code is rejected. If it passes, it's marked safe.
> - **CD (Continuous Deployment):** Every time safe code reaches the `main` branch, another robot automatically sends it to the live server so users always have the latest working version.

---

## 🏗️ Architecture Overview

```
Developer → pushes to [dev branch]
              ↓
         GitHub Actions (CI)
         - Install PHP dependencies
         - Verify Laravel works
         - Build React frontend
              ↓
         ✅ All Tests Pass?
              ↓
         Merge [dev] → [main] via Pull Request
              ↓
         Railway.app (CD)
         - Detects new code on [main]
         - Runs the Dockerfile (builds container)
         - Starts Apache + PHP + MySQL
         - Live site is updated automatically
```

---

## 🛑 Branch Strategy (MUST UNDERSTAND)

Before touching any cloud service, understand the two-branch rule:

| Branch | Purpose | Who deploys from here? |
|--------|----------|------------------------|
| `dev`  | Where you write and test features locally with `npm run dev` | Nobody. This is private. |
| `main` | The clean, stable, production-ready version | Railway.app automatically |

**The Golden Rule:** You NEVER push half-finished code to `main`. You write it in `dev`, test it, then merge it into `main` when it's perfect. Railway only watches `main`.

---

## 🛠️ PART 1: Continuous Integration (CI) — The Quality Gate

### What is this stage for?
Imagine your teammate pushes code that accidentally breaks the login system. Without CI, that broken code silently goes straight to the live server and real users start seeing errors. With CI, a robot catches that broken code **before** it ever reaches production.

### What we already have:
The file `.github/workflows/ci.yml` is already created and pushed to your repository. Here is what it does, explained line by line:

```yaml
name: CI Quality Gate (Laravel & React)
# ↑ This is just the display name you'll see in the GitHub Actions tab.

on:
  push:
    branches: [ "main", "dev" ]
  pull_request:
    branches: [ "main" ]
# ↑ This section tells GitHub WHEN to run this script.
#   It triggers on every push to 'main' or 'dev'.
#   It also triggers when someone creates a Pull Request targeting 'main'.
```

**Stage 1 — Backend Check:**
```yaml
  test-backend:
    runs-on: ubuntu-latest
    # ↑ GitHub spins up a brand new, clean virtual Linux computer for this.
    steps:
      - uses: actions/checkout@v3
      # ↑ Downloads your code from GitHub onto that virtual computer.

      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          extensions: mbstring, pdo_mysql, xml
      # ↑ Installs PHP version 8.2 with the exact extensions Laravel needs.
      #   pdo_mysql = database driver, mbstring = text encoding, xml = parsing.

      - name: Install Secure Dependencies
        run: cd server && composer install --no-interaction --prefer-dist --optimize-autoloader
      # ↑ Runs composer install — the PHP equivalent of `npm install`.
      #   --no-interaction = don't ask any questions, just do it.
      #   --prefer-dist = download zip files, not git clones (faster).
      #   --optimize-autoloader = build a faster class-loading map for production.

      - name: Verify Laravel Artisan
        run: cd server && cp .env.example .env && php artisan key:generate && php artisan optimize:clear
      # ↑ Copies the example .env, generates an application key, and clears caches.
      #   If ANY of these fail, it means your Laravel setup is broken.
```

**Stage 2 — Frontend Check:**
```yaml
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      # ↑ Installs Node.js version 18 (required for Vite and React).

      - name: Verify Npm Install & Vite Build
        run: cd client && npm install && npm run build
      # ↑ Installs all frontend packages and attempts a full production build.
      #   If your TypeScript has errors or imports are broken, this step fails.
```

### How to Watch It Run:
1. Go to `github.com/moonstruck2003/AlumniConnect`.
2. Click the **"Actions"** tab at the very top (between "Code" and "Projects").
3. You will see a row called **"CI Quality Gate (Laravel & React)"** with a yellow spinning circle.
4. Click it to watch the live logs stream in real-time.
5. Green ✅ = code is structurally sound. Red ❌ = something is broken with details.

---

## 🚀 PART 2: Continuous Deployment (CD) — Railway.app

### What is Railway doing that's different from GoogieHost?

| Feature | GoogieHost (Shared Hosting) | Railway.app (PaaS) |
|---------|------|---------|
| Docker Support | ❌ No | ✅ Yes, natively |
| Artisan commands | ❌ Not allowed | ✅ Runs during build |
| Database provisioning | Manual setup in cPanel | Automatic one-click |
| Auto-deploy on push | ❌ Needs FTP script | ✅ Built-in from GitHub |
| Free SSL | Manual | ✅ Auto-generated |
| Scaling | Limited | ✅ Auto-scaling |

Railway reads your `Dockerfile`, builds the entire Laravel + React environment inside a container, and starts it live. That's why your existing `Dockerfile` is such a valuable asset here.

---

### Step 1: Create a Railway Account and New Project

1. Go to **[railway.app](https://railway.app)** in your browser.
2. Click **"Login"** and select **"Login with GitHub."**
   > *Why GitHub login?* It gives Railway direct, secure access to read your repositories without needing to copy/paste code manually.
3. Once on your dashboard, click the **pink "+ New Project"** button in the top-right.
4. From the options, click **"Deploy from GitHub repo."**
5. A search box appears. Type `AlumniConnect` and click your repository when it appears.
6. Railway will ask which branch to track. **Select `main`.** This is critical — Railway should only deploy from `main`, never from `dev`.
7. Click **"Deploy Now."**

> ⚠️ **What happens now?** Railway immediately clones your `main` branch and starts reading the `Dockerfile` in your root directory. It will attempt to build the container. The first build might fail because database credentials don't exist yet — that's completely expected. We fix this in the next steps.

---

### Step 2: Provision a MySQL Database on Railway

Your Laravel backend needs a database. Railway can host the database right next to your app inside the same cloud environment, making it extremely fast (internal network, not public internet).

1. Locate your AlumniConnect box on the Railway project canvas.
2. Click the **"+ New"** button in the top-right corner of the canvas.
3. Select **"Database"** from the dropdown.
4. Select **"Add MySQL"** from the database options.

> **What just happened?** Railway spun up a fully managed, cloud-hosted MySQL 8 server. It automatically generated a secure random password, database name, and internal host address. Your app container and the database container are now on the same private network — communication between them is ultra-fast and does not go through the public internet.

---

### Step 3: Bind the Database to Your Laravel App (Environment Variables)

This is the most technically important step. Your Laravel application reads database credentials from environment variables (the `.env` file). We need to tell Railway to inject those Variables into your container's environment automatically.

**First, get the MySQL credentials:**
1. Click on the **purple MySQL box** on the Railway canvas.
2. Click the **"Variables"** tab in the panel that appears on the right.
3. You will see auto-generated values like `MYSQLHOST`, `MYSQLDATABASE`, `MYSQLPASSWORD`, `MYSQLPORT`, `MYSQLUSER`. **Do not copy these manually.** Railway has a smarter way.

**Now, bind them to your app:**
1. Click back on your **AlumniConnect app box** on the canvas.
2. Click the **"Variables"** tab.
3. Click **"New Variable"** and add each of the following:

| Variable Name | Value to Enter | Why |
|---|---|---|
| `DB_CONNECTION` | `mysql` | Tells Laravel to use the MySQL driver |
| `DB_HOST` | type `$` then select `${{MySQL.MYSQLHOST}}` | The internal IP address of the Railway MySQL server |
| `DB_PORT` | type `$` then select `${{MySQL.MYSQLPORT}}` | MySQL runs on port 3306 by default |
| `DB_DATABASE` | type `$` then select `${{MySQL.MYSQLDATABASE}}` | The name of the auto-generated database |
| `DB_USERNAME` | type `$` then select `${{MySQL.MYSQLUSER}}` | The database user |
| `DB_PASSWORD` | type `$` then select `${{MySQL.MYSQLPASSWORD}}` | The secure auto-generated password |

> **What is the `${{...}}` syntax?** It is Railway's built-in **Reference Variable** system. Instead of you manually copying the MySQL host IP (which might change), Railway automatically replaces `${{MySQL.MYSQLHOST}}` with the real value at runtime. It's smart, secure, and future-proof.

---

### Step 4: Inject Laravel's Production Secrets

Still in the **Variables** tab of your AlumniConnect app, add these manual values:

| Variable Name | Value |
|---|---|
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_URL` | Leave blank for now (fill in after Step 5) |
| `APP_KEY` | Copy the `base64:yin91sTYMLF5...` string from your local `server/.env` |
| `JWT_SECRET` | Copy the `JWT_SECRET` value from your local `server/.env` |
| `GEMINI_API_KEY` | `AIzaSyByY5RqrMkqVFN753qLjK4UpfECXZmOKzY` |
| `MAIL_USERNAME` | `admin.alumniconnect@gmail.com` |
| `MAIL_PASSWORD` | `zsatbbnpramykmzc` |
| `MAIL_HOST` | `smtp.gmail.com` |
| `MAIL_PORT` | `587` |
| `MAIL_ENCRYPTION` | `tls` |

> **Why `APP_DEBUG = false`?** In production, if debug is true and an error occurs, PHP will dump your entire `.env` file, database credentials, and server file paths to the public browser. Setting it to `false` hides this and only shows a clean "Server Error" page.

---

### Step 5: Generate Your Global HTTPS URL

1. Click on your **AlumniConnect app box** on the canvas.
2. Click the **"Settings"** tab.
3. Find the **"Networking"** section.
4. Click the **"Generate Domain"** button.
5. Railway will immediately give you a public URL like: `alumniconnect-production.up.railway.app`.
6. Copy that URL.
7. Go back to the **Variables** tab.
8. Set `APP_URL` = `https://alumniconnect-production.up.railway.app`.
9. Set `FRONTEND_URL` = `https://alumniconnect-production.up.railway.app` *(or your Vercel URL if the frontend is hosted separately)*.

> **Adding a variable triggers a redeploy.** Railway automatically rebuilds and restarts your container every time you change a variable. Watch the logs in the "Deployments" tab.

---

### Step 6: Run Your Database Migrations

Your database tables need to be created. Since we're in Docker, Railway handles this through the build process. If your `Dockerfile` doesn't already run `php artisan migrate`, you should verify it or run it manually once via the Railway shell.

1. In your AlumniConnect app, click the **"Shell"** tab (if available on your plan).
2. Run: `php artisan migrate --force`.
   > `--force` is required in production mode. Without it, Artisan refuses to run migrations to prevent accidental data loss.

---

## ⚡ Your Daily Workflow From Now On

```
Write code locally on [dev]
    ↓
git push origin dev
    ↓
GitHub Actions CI runs (tests Laravel + React build)
    ↓
✅ Green? Create a Pull Request: [dev] → [main]
    ↓
Merge the PR on GitHub
    ↓
Railway detects the [main] update
    ↓
Automatically rebuilds Docker container
    ↓
🌐 Live site updated — zero manual work!
```

---

## 🛠️ Troubleshooting Common Railway Issues

| Error | Cause | Fix |
|---|---|---|
| `Container failed to start` | Missing `APP_KEY` variable | Add `APP_KEY` in Variables tab |
| `SQLSTATE connection refused` | DB variables not bound correctly | Check `DB_HOST` uses the `${{MySQL...}}` reference |
| `404 on all API routes` | Apache `.htaccess` not routing correctly | Check the `Dockerfile` copies `.htaccess` |
| `CORS error in browser` | `FRONTEND_URL` not set in Variables | Add your deployment URL to `FRONTEND_URL` |
| `AI Chat not working` | Missing `GEMINI_API_KEY` | Add the Gemini key in Variables |
