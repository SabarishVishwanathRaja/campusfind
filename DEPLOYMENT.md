# CampusFind — Production Cloud Deployment Guide

A beginner-friendly, click-by-click manual deployment guide for Windows users. Follow these steps in exact order to deploy your complete full-stack web application across **GitHub**, **Neon PostgreSQL**, **Cloudinary**, **Render**, and **Vercel**.

---

## Prerequisites
Before you start, create free accounts on:
1. **GitHub**: [https://github.com](https://github.com)
2. **Neon**: [https://neon.tech](https://neon.tech)
3. **Cloudinary**: [https://cloudinary.com](https://cloudinary.com)
4. **Render**: [https://render.com](https://render.com)
5. **Vercel**: [https://vercel.com](https://vercel.com)

---

## Step 1: Push Code to GitHub

Open **PowerShell** or **Command Prompt** on Windows and navigate to your project directory:

```powershell
cd d:\PROJECTS\CampusFind
```

1. Initialize git and configure the default branch:
   ```powershell
   git init -b main
   ```
2. Verify that `.gitignore` prevents secrets from being staged:
   ```powershell
   git status
   ```
   *(Ensure `.env` or `node_modules` are NOT staged).*
3. Stage all project files:
   ```powershell
   git add .
   ```
4. Commit your files:
   ```powershell
   git commit -m "Initial commit: CampusFind Cloud Lost & Found System"
   ```
5. Go to [https://github.com/new](https://github.com/new), name your repository `campusfind` (Public or Private), and click **Create repository**.
6. Link your local project to GitHub and push:
   ```powershell
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/campusfind.git
   git push -u origin main
   ```

---

## Step 2: Set Up Neon PostgreSQL Database

1. Log in to your dashboard at [https://console.neon.tech](https://console.neon.tech).
2. Click **Create Project**.
   - **Project name**: `campusfind-db`
   - **Postgres version**: `16` (or latest default)
   - **Region**: Choose the region closest to you or closest to US/Frankfurt.
   - Click **Create Project**.
3. Once created, you will see a connection dialog with your **Connection Details**:
   - Under **Connection string**, select **Node.js** or **psql**.
   - Copy the entire connection URL. It will look like:
     ```text
     postgresql://campusfind_owner:AbCdEf123456@ep-cool-fog-123456.us-east-2.aws.neon.tech/campusfind-db?sslmode=require
     ```
   - **Save this URL** — this is your `DATABASE_URL`.
6. **Initialize Tables and Seed Data** (Choose either method below):
   - **Method A (Fastest — 1-Click CLI)**:
     Update `DATABASE_URL` in `server/.env` with your copied Neon connection string, then run:
     ```powershell
     cd server
     npm run db:init
     ```
     This automatically executes `db/schema.sql` and `db/seed.sql`, verifies table counts, and displays the demo seed credentials.
   - **Method B (Neon Console SQL Editor)**:
     In the Neon sidebar, click **SQL Editor**. Copy and paste `db/schema.sql`, click **Run**, then copy and paste `db/seed.sql`, and click **Run**.
7. Click **Tables** in the Neon sidebar to confirm that `users`, `categories`, `items`, and `claims` are populated.

---

## Step 3: Set Up Cloudinary Media Storage

1. Log in to [https://console.cloudinary.com](https://console.cloudinary.com).
2. On your **Dashboard / Programmable Media**, locate your **API Keys & Credentials**:
   - **Cloud Name** (e.g. `dxy9zabc`)
   - **API Key** (e.g. `123456789012345`)
   - **API Secret** (click *Copy API Secret*, e.g. `aB_CdEfGhIjKlMnOpQrStUvWxYz`)
3. Save all three values securely — you will paste them into Render in the next step.

---

## Step 4: Deploy the Backend on Render

1. Log in to [https://dashboard.render.com](https://dashboard.render.com).
2. Click **New +** (top right) and select **Web Service**.
3. Select **Build and deploy from a Git repository**, click **Next**, and connect your GitHub account.
4. Locate and select your `campusfind` repository.
5. Fill in the service configuration:
   - **Name**: `campusfind-api`
   - **Region**: Same region as your Neon database if possible.
   - **Branch**: `main`
   - **Root Directory**: `server` *(Important: Type exactly `server`)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
6. Scroll down to **Environment Variables** and add each of these:
   | Key | Value |
   |---|---|
   | `PORT` | `5000` |
   | `DATABASE_URL` | *Paste your full Neon connection string from Step 2* |
   | `JWT_SECRET` | *Type a secure 32+ character random string (e.g. `campusfind_super_secure_production_key_2026`)* |
   | `CLIENT_URL` | `http://localhost:5173` *(We will update this with the real Vercel URL in Step 6)* |
   | `CLOUDINARY_CLOUD_NAME` | *Paste your Cloudinary Cloud Name from Step 3* |
   | `CLOUDINARY_API_KEY` | *Paste your Cloudinary API Key from Step 3* |
   | `CLOUDINARY_API_SECRET` | *Paste your Cloudinary API Secret from Step 3* |
7. Click **Deploy Web Service**.
8. Wait 2–3 minutes for the build and deployment to finish. When the log displays:
   ```text
   [CampusFind API] Server listening on port 5000
   ==> Your service is live at https://campusfind-api.onrender.com
   ```
9. Copy your live Render URL (e.g., `https://campusfind-api.onrender.com`).
10. Open a new browser tab and navigate to:
    ```text
    https://campusfind-api.onrender.com/api/health
    ```
    Confirm you see:
    ```json
    { "status": "ok", "db": "connected" }
    ```

---

## Step 5: Deploy the Frontend on Vercel

1. Log in to [https://vercel.com/dashboard](https://vercel.com/dashboard).
2. Click **Add New...** → **Project**.
3. Find your `campusfind` repository from GitHub and click **Import**.
4. In the **Configure Project** screen:
   - **Project Name**: `campusfind`
   - **Framework Preset**: `Vite` *(Vercel automatically detects this)*
   - **Root Directory**: Click **Edit**, select the `client` folder, and click **Continue**.
   - **Build Command**: `npm run build` *(default)*
   - **Output Directory**: `dist` *(default)*
5. Expand **Environment Variables**:
   - **Key**: `VITE_API_URL`
   - **Value**: *Paste your live Render URL from Step 4 (e.g. `https://campusfind-api.onrender.com`)*
     *(Important: Do NOT include a trailing slash!)*
   - Click **Add**.
6. Click **Deploy**.
7. Wait 45–60 seconds for the build to finish. Once you see the congratulations screen with confetti, click **Continue to Dashboard** and note your live Vercel URL (e.g., `https://campusfind.vercel.app`).

---

## Step 6: Connect CORS between Render and Vercel

Now that your frontend has a live production URL, allow it in Render's CORS configuration:

1. Return to the **Render Dashboard** ([https://dashboard.render.com](https://dashboard.render.com)).
2. Click on your `campusfind-api` Web Service.
3. Click **Environment** in the left sidebar.
4. Locate `CLIENT_URL` and update its value to your live Vercel URL:
   ```text
   https://campusfind.vercel.app
   ```
   *(Do NOT add a trailing slash)*.
5. Click **Save Changes**. Render will automatically trigger a zero-downtime redeployment.

---

## Step 7: Live Verification Checklist

Test the complete cloud loop from your live Vercel website:

- [ ] **1. Visit the Frontend**: Navigate to `https://campusfind.vercel.app`. The page loads without 404 or white screen.
- [ ] **2. Log in with Seed Admin**:
  - Email: `admin@campusfind.edu`
  - Password: `Admin@123`
  - Confirm the Admin Dashboard badge appears in the top navigation.
- [ ] **3. Register a New Student**:
  - Sign out, click **Register here**, and create an account with a new email.
  - Confirm registration succeeds and automatically logs you in.
- [ ] **4. Report an Item with Photo Upload**:
  - Click **Report Item**.
  - Choose `LOST` or `FOUND`, fill in title, location, category, and attach a photo (`.jpg` or `.png`).
  - Click **Publish Report**.
  - Confirm the item is created and redirects to the item detail page displaying your photo.
- [ ] **5. Verify Cloud Separation**:
  - Open your **Cloudinary Media Library**: Confirm the newly uploaded photo appears under the `campusfind` folder.
  - Open **Neon SQL Editor** and run `SELECT id, title, image_url, image_public_id FROM items WHERE id = (SELECT MAX(id) FROM items);`.
  - Confirm the database row stores only the Cloudinary URL and public ID string (no image binary is in PostgreSQL).
- [ ] **6. Submit an Ownership Claim**:
  - Sign in with another student account (`priya@student.edu` / `Student@123`).
  - Open the newly reported item and submit a claim message.
  - Confirm the claim status displays as `PENDING`.
- [ ] **7. Verify Transactional Claim Approval**:
  - Sign in as `admin@campusfind.edu`.
  - Go to **Admin Dashboard** → **Claims Verification**.
  - Click **Approve** on the pending claim.
  - Confirm the claim changes to `APPROVED` and the item status transitions to `CLAIMED`.

---

## Troubleshooting Guide

### 1. CORS Error in Browser Console (`Access-Control-Allow-Origin`)
- **Symptom**: Browser console displays `Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://campusfind-api.onrender.com...`
- **Fix**:
  1. Verify `CLIENT_URL` in your Render Environment variables matches your Vercel URL **exactly**, including `https://` and without any trailing slash (e.g. `https://campusfind.vercel.app`).
  2. Redeploy the Render service after changing the environment variable.

### 2. Render Free-Tier 50-Second Cold Start
- **Symptom**: The first API call or page load after a period of inactivity spins for ~50 seconds or displays a timeout.
- **Cause**: Render's free tier spins inactive web services down after 15 minutes of inactivity. The container takes 40–50 seconds to initialize Node.js and PostgreSQL connection pools.
- **Fix**: This is normal behavior on free cloud tiers. Wait 50 seconds for the container to wake up, or make an initial ping to `/api/health` before demonstrating.

### 3. Neon PostgreSQL Connection / SSL Error
- **Symptom**: `Error: self-signed certificate` or `SSL connection has been closed unexpectedly`.
- **Fix**: Ensure your Neon connection string contains `?sslmode=require`. CampusFind's `src/db.js` explicitly passes `{ rejectUnauthorized: false }` to the `pg.Pool` configuration, which satisfies Neon's serverless TLS proxy requirements.

### 4. 404 Error on Deep Link Refresh in Vercel
- **Symptom**: Refreshing a page like `/items/1` or `/report` returns Vercel's `404: NOT_FOUND`.
- **Cause**: Single-page applications require all routes to fallback to `/index.html`.
- **Fix**: Ensure `client/vercel.json` exists with the rewrite rule:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```

### 5. Frontend Environment Variable Missing (`undefined`)
- **Symptom**: API calls are made to `http://localhost:5000` even in production.
- **Cause**: In Vite, environment variables **must** start with `VITE_` to be exposed to client-side code.
- **Fix**: Ensure the variable name in Vercel is named exactly `VITE_API_URL`. Rebuild the project in Vercel after editing.

### 6. Multipart Form Upload Fails / Invalid Boundary
- **Symptom**: Cloudinary upload fails or server responds with `400 Bad Request: Unexpected field`.
- **Fix**: When sending `FormData` via `fetch()`, never manually set the `Content-Type: multipart/form-data` header. CampusFind's `client/src/api.js` (`apiUpload`) lets the browser set the boundary header automatically.
