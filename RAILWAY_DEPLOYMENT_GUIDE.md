# Total Deployment Guide: Railway.app (Docker CI/CD)

Railway.app is a Platform-as-a-Service (PaaS) that natively supports Docker. Unlike GoogieHost (which requires manual FTP syncing), Railway links directly to your GitHub repository and automatically deploys your `Dockerfile` every time you push code.

This guide is split into two strict sections: **Continuous Integration (CI)** and **Continuous Deployment (CD)**.

---

## Part 1: Continuous Integration (CI) Guide

**Goal:** Ensure that every push to GitHub is automatically tested for quality (Syntax, Builds) before it is allowed to be deployed.

Since Railway handles the actual server deployment, our GitHub Actions will only act as a "Quality Gate."

### Step 1: Create the CI Workflow File
1. In your project, create or modify `.github/workflows/ci.yml`.
2. This workflow will not deploy code. Instead, it will run verification tests.

```yaml
name: CI Quality Gate (Laravel & React)

on:
  push:
    branches: [ "main", "dev" ]
  pull_request:
    branches: [ "main" ]

jobs:
  test-backend:
    name: Backend Check (PHP)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
      - name: Install Dependencies
        run: |
          cd server
          composer install --no-interaction --prefer-dist
      - name: Syntax Linting
        run: |
          cd server
          php artisan optimize:clear

  test-frontend:
    name: Frontend Check (React)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install & Build
        run: |
          cd client
          npm install
          npm run build
```

### Step 2: The CI Result
Once you push this file, GitHub will automatically run "Backend Check" and "Frontend Check" in the Actions tab. 
- If someone pushes broken code, the GitHub Action fails, giving a red ❌ warning you not to merge it.
- If it passes, you get a green ✅, meaning the code is stable.

---

## Part 2: Continuous Deployment (CD) Guide

**Goal:** Automatically deploy the stable code to the live internet using Railway.app's native Docker engine.

Railway requires very little configuration because it automatically detects your root `Dockerfile`.

### Step 1: Link Railway to GitHub (The Pipeline)
1. Go to [Railway.app](https://railway.app/) and create an account using your GitHub login.
2. Click **New Project** from your dashboard.
3. Select **Deploy from GitHub repo**.
4. Authorize Railway to view your repositories and select `AlumniConnect`.
5. Railway will immediately detect the `Dockerfile` in the root directory and attempt the first deployment automatically.

### Step 2: Provision a MySQL Database on Railway
Unlike GoogieHost where you create a database manually, Railway creates it virtually in one click.
1. In your new Railway Project dashboard, click **+ New** (top right edge).
2. Select **Database** -> **Add MySQL**.
3. Railway will spin up a professional, secured MySQL container right next to your application container!

### Step 3: Connect the Database (Environment Variables)
Your Laravel code needs to know how to talk to this new Railway MySQL server.
1. In Railway, click on your **MySQL** service container. Go to the **Variables** tab. You will see auto-generated credentials (like `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLHOST`).
2. Click back to your **App** service container (AlumniConnect).
3. Go to the **Variables** tab for your App.
4. Add the following Laravel variables, linking them to the MySQL instance:
   - `DB_CONNECTION` : `mysql`
   - `DB_HOST` : `${{ MySQL.MYSQLHOST }}` (Railway provides this smart reference dropdown)
   - `DB_PORT` : `${{ MySQL.MYSQLPORT }}`
   - `DB_DATABASE` : `${{ MySQL.MYSQLDATABASE }}`
   - `DB_USERNAME` : `${{ MySQL.MYSQLUSER }}`
   - `DB_PASSWORD` : `${{ MySQL.MYSQLPASSWORD }}`

### Step 4: Add Production Secrets
While still in the App **Variables** tab, add your manual secrets:
- `APP_ENV` : `production`
- `APP_KEY` : *(Paste the key from your local .env)*
- `GEMINI_API_KEY` : `AIzaSyByY5RqrMkqVFN753qLjK4UpfECXZmOKzY`
- `FRONTEND_URL` : *(Leave blank for a moment until Railway gives you a domain)*

### Step 5: Finalize Deployment & Get Your Web Address
Railway deploys automatically whenever you push code or change a variable.
1. Go to the **Settings** tab of your App service in Railway.
2. Under "Networking" or "Domains", click **Generate Domain**. Railway will give you a custom HTTPs URL (e.g., `alumniconnect-production.up.railway.app`).
3. Take that newly generated domain and paste it into the `FRONTEND_URL` in your Variables tab.

You are finished! Now, every time you push to the `main` branch:
1. **GitHub** checks the code (CI).
2. **Railway** downloads the code, builds the full Docker container, and launches it live (CD).
