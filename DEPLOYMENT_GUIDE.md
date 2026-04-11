# Ultimate Deployment Guide: Docker + Vercel + GoogieHost + GitHub Actions

This guide completely covers how to take your development code and deploy it to a live production environment. We will utilize a modern hybrid architecture:
- **Docker** for local development and CI testing.
- **Vercel** for the React Frontend.
- **GoogieHost** for the Laravel Backend (MySQL).
- **GitHub Actions** for Continuous Integration & Deployment.

> [!WARNING]
> **The Docker Paradox**: GoogieHost is a *Shared Hosting* provider. Shared hosting panels (like cPanel/DirectAdmin) do **not** support running Docker containers directly. 
> Therefore, we will use Docker in the **CI Pipeline** to test the code, but we will deploy the raw PHP/React files to GoogieHost and Vercel.

---

## Stage 1: Setting up the Backend on GoogieHost

GoogieHost requires traditional file hosting, so we bypass Docker for the final deployment step here.

### 1. Database Setup
1. Log in to your GoogieHost cPanel.
2. Go to **MySQL Management**.
3. Create a new Database and User. Note down the credentials.

### 2. Getting FTP Credentials
GitHub Actions needs FTP credentials to sync your code to the server.
1. In GoogieHost cPanel, look for **FTP Accounts**.
2. Note down the **FTP Hostname**, **FTP Username**, and **FTP Password**.

---

## Stage 2: Connecting GitHub Actions (CI/CD Pipeline)

This is where **Docker** shines. Our GitHub Action will use Docker to verify the build before deploying anything.

### 1. Add Secrets to GitHub
1. Go to your GitHub repository > **Settings** > **Secrets and variables** > **Actions**.
2. Add the following secrets:
   - `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`
   - `DB_PASSWORD` (Your GoogieHost password)
   - `GEMINI_API_KEY`

### 2. Creating the Workflow File
We will create `.github/workflows/deploy.yml`. This script will function in two steps:
- **Step 1 (CI with Docker)**: Run a `docker build` using your `Dockerfile` to ensure the application compiles correctly without syntax errors.
- **Step 2 (CD via FTP)**: If the Docker build passes, the script extracts the `server/` files and uploads them to GoogieHost via FTP.

---

## Stage 3: Setting up the Frontend on Vercel

Vercel will manage the React frontend directly from GitHub.

1. Go to [vercel.com](https://vercel.com) and log in with GitHub.
2. Import the `AlumniConnect` repository.
3. Configure settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Environment Variables**: Add `VITE_BACKEND_ENDPOINT = https://alumniconnect.cu.ma/api`
4. Click **Deploy**.

---

## Stage 4: Crucial Application Configurations

### 1. Laravel CORS Configuration
Because Vercel runs on a different domain than GoogieHost, we must allow cross-origin requests.
- Ensure `server/config/cors.php` allows your new Vercel URL.

### 2. Live `.env` File Setup on GoogieHost
1. Open the GoogieHost **File Manager**.
2. Create an `.env` file in the root of your Laravel application.
3. Fill it with production details connecting to your GoogieHost MySQL database and containing your Gemini Key.
