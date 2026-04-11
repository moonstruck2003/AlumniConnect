# Ultimate Deployment Guide: Vercel + GoogieHost + GitHub Actions

This guide completely covers how to take your development code and deploy it to a live production environment. We are using **Vercel** for the React Frontend, **GoogieHost** for the Laravel Backend (MySQL), and **GitHub Actions** for Continuous Deployment.

---

## Stage 1: Setting up the Backend on GoogieHost

GoogieHost is a shared hosting environment, which means the setup requires putting the correct files in the `public_html` directory.

### 1. Database Setup
1. Log in to your GoogieHost cPanel (DirectAdmin/cPanel).
2. Go to **MySQL Management** or **MySQL Databases**.
3. Create a new Database and a new Database User. 
4. Note down the **Database Name**, **Username**, and **Password**.
5. *Optional*: Export your local database (`alumniconnect_db`) using phpMyAdmin and import it into your GoogieHost database via their phpMyAdmin so you have initial data.

### 2. Getting FTP Credentials
GitHub Actions needs FTP credentials to automatically upload your code to GoogieHost.
1. In GoogieHost cPanel, look for **FTP Management** or **FTP Accounts**.
2. Find or create an FTP account pointing to the root (`public_html`) or `/` directory.
3. Note down the **FTP Hostname** (usually `ftp.alumniconnect.cu.ma` or the server IP), **FTP Username**, and **FTP Password**.

### 3. Server File Structure Preparation
Because shared hosting serves files from `public_html`, we have to adjust how Laravel starts.
When GitHub Actions uploads the code, it will upload the contents of the `server/` folder to the server. We will ensure the workflow puts Laravel's `public` directory contents directly inside GoogieHost's `public_html`.

---

## Stage 2: Connecting GitHub Actions (CI/CD Pipeline)

We will use GitHub Actions to automate uploading our Laravel backend to GoogieHost whenever we push code.

### 1. Add Secrets to GitHub
We must hide sensitive credentials from the public code.
1. Go to your GitHub repository in your web browser.
2. Click **Settings** > **Secrets and variables** > **Actions** > **New repository secret**.
3. Add the following secrets:
   - `FTP_SERVER`: (Your GoogieHost FTP address, e.g., `ftp.alumniconnect.cu.ma`)
   - `FTP_USERNAME`: (Your GoogieHost FTP username)
   - `FTP_PASSWORD`: (Your GoogieHost FTP password)

### 2. Creating the Workflow File
We will create a `.github/workflows/deploy.yml` file in your repository. This file will:
1. Trigger when you push to the `main` or `ai-features` branch.
2. Install PHP dependencies using `composer install`.
3. Use an FTP Sync Action to upload the `server/` files to GoogieHost.

---

## Stage 3: Setting up the Frontend on Vercel

Vercel is built specifically for frontend frameworks like React.

### 1. Create a Vercel Account & Import
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** > **Project**.
3. Select your `AlumniConnect` repository from GitHub.

### 2. Configure the Deployment Settings
Before clicking deploy, configure the build settings so Vercel knows where your React app is.
1. **Framework Preset**: Vite
2. **Root Directory**: Click "Edit" and type `client` (This tells Vercel your frontend isn't in the base folder, it's inside `client/`).
3. **Environment Variables**: Open the Environment Variables section and add:
   - Name: `VITE_BACKEND_ENDPOINT`
   - Value: `https://alumniconnect.cu.ma/api` (This tells the React frontend to talk to your live backend, not localhost).
4. Click **Deploy**. Vercel will now automatically build and host your frontend.

---

## Stage 4: Crucial Application Configurations

For the two separate servers (Vercel and GoogieHost) to talk to each other correctly, we need to adjust some code configurations.

### 1. Laravel CORS Configuration
Because Vercel runs on a different domain than GoogieHost, the browser will block requests unless Laravel allows them.
- We will update `server/config/cors.php` to ensure `allowed_origins` includes your new Vercel URL (e.g., `https://alumniconnect.vercel.app`).

### 2. Live `.env` File Setup on GoogieHost
Once the files are on GoogieHost, we need a production `.env` file there. Since `.env` files are ignored by git, you have to create this manually on the server.
1. Open the GoogieHost **File Manager**.
2. Create an `.env` file in the root of your Laravel application.
3. Fill it with production details:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://alumniconnect.cu.ma
   FRONTEND_URL=https://alumniconnect.vercel.app
   
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=your_googiehost_db_name
   DB_USERNAME=your_googiehost_db_user
   DB_PASSWORD=your_googiehost_db_password
   
   GEMINI_API_KEY=AIzaSyByY5RqrMkqVFN753qLjK4UpfECXZmOKzY
   # ... other keys
   ```

---

## Summary of the CI/CD Flow
1. **You push code to GitHub.**
2. **GitHub Actions** sees the push, runs Composer in the background, and uploads the backend updates to GoogieHost.
3. **Vercel** sees the push, runs `npm run build` on the `client/` folder, and updates the live website frontend.
4. The live site automatically runs with the newest code!
