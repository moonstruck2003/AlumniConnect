# The Master Deployment Guide: Railway.app (Docker + GitHub CI/CD)

This is the exhaustive, step-by-step guide for deploying **AlumniConnect**. It uses a highly professional architecture: **GitHub Actions** for testing (Continuous Integration), and **Railway.app** for native Docker hosting and automated rollouts (Continuous Deployment).

---

## 🛑 Prerequisites: The Branch Pipeline

Before doing anything on the cloud, your codebase must flow correctly. We use the **2-Branch System**:
*   **`dev` Branch**: Where you write code locally (`npm run dev`) and test new features.
*   **`main` Branch**: The sacred branch. **Railway will only deploy code from this branch.** You only push code to `main` when `dev` is 100% bug-free.

---

## 🛠️ PART 1: Continuous Integration (CI) Quality Gate

We want to strictly prevent broken code from ever reaching Railway. We do this by creating a GitHub Action that acts as an automated "Quality Gate."

### Step 1: Create the CI File
1. In your project root, ensure you have the directory: `.github/workflows/`.
2. Inside that directory, create a file named `ci.yml`.
3. Paste the following highly detailed script into `ci.yml`:

```yaml
name: CI Quality Gate (Laravel & React)

# This tells GitHub to run this script ONLY when code is pushed to main or dev
on:
  push:
    branches: [ "main", "dev" ]
  pull_request:
    branches: [ "main" ]

jobs:
  # ------ STAGE 1: VERIFY THE LARAVEL BACKEND ------
  test-backend:
    name: Backend Check (PHP 8.2)
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Setup PHP Environment
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          extensions: mbstring, pdo_mysql, xml

      - name: Install Secure Dependencies
        run: |
          cd server
          composer install --no-interaction --prefer-dist --optimize-autoloader

      - name: Verify Laravel Artisan
        run: |
          cd server
          cp .env.example .env
          php artisan key:generate
          php artisan optimize:clear

  # ------ STAGE 2: VERIFY THE REACT FRONTEND ------
  test-frontend:
    name: Frontend Check (React 18)
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Setup Node.js Environment
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Verify Npm Install & Vite Build
        run: |
          cd client
          npm install
          npm run build
```

### Step 2: Push and Observe
1. Push this file to your `dev` branch.
2. Go to **GitHub.com** -> Your **AlumniConnect Repository** -> Click the **Actions** tab at the very top.
3. You will see a yellow spinning circle watching your Backend and Frontend install. 
4. If it finishes with a Green ✅, it means your code is structurally sound and ready for deployment.

---

## 🚀 PART 2: Continuous Deployment (CD) on Railway.app

Unlike shared hosting, Railway is a complete PaaS (Platform as a Service). It natively runs the exact `Dockerfile` we created, which starts Apache, runs PHP 8.2, installs NPM, builds React, and moves it to Laravel's public folder automatically.

### Step 1: Create the Railway Project
1. Go to **[Railway.app](https://railway.app/)** and click **Dashboard** (Log in with GitHub if asked).
2. Click the pink **"+ New Project"** button.
3. Click **"Deploy from GitHub repo"**.
4. In the search bar, type `AlumniConnect` and select it.
5. A popup will ask you what branch, leave it as `main`. 
6. Click the **Deploy Now** button. 
*(Railway immediately starts downloading your GitHub code and reading your `Dockerfile`!)*

### Step 2: Spin up the MySQL Server
Railway provisions a sterile database natively on their cloud.
1. While staring at your Railway canvas (which shows your new AlumniConnect block), click the **"+ New"** button located at the top right of the canvas.
2. Click **Database** -> **Add MySQL**.
3. Railway will instantly place a new purple box labeled "MySQL" right next to your app.

### Step 3: Wire the App to the Database (Environment Binder)
Our Laravel app currently tries to connect to `127.0.0.1` locally, which will fail on Railway. We must bind them.
1. Click on the purple **MySQL** box on the Railway canvas.
2. Click the **Variables** tab at the top. You will see system-generated passwords and hosts.
3. Now, click on your **AlumniConnect** app box on the canvas.
4. Go to the **Variables** tab for the app.
5. Click **New Variable** and add these exactly by using Railway's autofill reference tool:
   - **VARIABLE NAME**: `DB_CONNECTION` | **VALUE**: `mysql`
   - **VARIABLE NAME**: `DB_HOST` | **VALUE**: Type `$`, then pick `${{ MySQL.MYSQLHOST }}` from the dropdown.
   - **VARIABLE NAME**: `DB_PORT` | **VALUE**: Type `$`, then pick `${{ MySQL.MYSQLPORT }}`.
   - **VARIABLE NAME**: `DB_DATABASE` | **VALUE**: Type `$`, pick `${{ MySQL.MYSQLDATABASE }}`.
   - **VARIABLE NAME**: `DB_USERNAME` | **VALUE**: Type `$`, pick `${{ MySQL.MYSQLUSER }}`.
   - **VARIABLE NAME**: `DB_PASSWORD` | **VALUE**: Type `$`, pick `${{ MySQL.MYSQLPASSWORD }}`.

### Step 4: Inject Laravel Security Secrets
While still in the Variables tab of the AlumniConnect app box, manually type in your system secrets:
1. `APP_ENV` = `production`
2. `APP_DEBUG` = `false`
3. `APP_KEY` = *(Copy the `base64:...` string from your local computer's `.env` file)*
4. `GEMINI_API_KEY` = `AIzaSyByY5RqrMkqVFN753qLjK4UpfECXZmOKzY`

### Step 5: Launch to the Public Web!
Because you added variables, Railway will forcefully restart your Docker container. Let's give it a public URL!
1. Click your **AlumniConnect** app box on the canvas.
2. Click the **Settings** tab.
3. Scroll down slightly to the **Networking** section.
4. Click the **Generate Domain** button.
5. Railway will give you a free, permanent, SSL-secured URL (e.g., `alumniconnect-production.up.railway.app`).

### Step 6: Fix the Frontend URL Tracking
Now that you have a public URL, your React app needs to know it!
1. Copy the URL Railway just gave you.
2. Go back to the **Variables** tab.
3. Add a new variable: `FRONTEND_URL` and paste the URL as the value (Make sure to include `https://`).
4. Railway will rebuild the container one final time.

---

## ⚡ The Grand Finale: How the Routine Works Now

You are fully deployed. Here is your daily professional routine:
1. You build a new feature locally and push it to your `dev` branch.
2. The GitHub **CI Action** runs and verifies it works. Railway ignores this push, keeping the live site safe.
3. You go to GitHub and click **Pull Request** to merge `dev` into `main`.
4. The moment `main` is updated, **Railway (CD)** instantly builds the Dockerfile, pulling in the new code and launching it live to the internet!
