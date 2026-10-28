# 🚀 Free Deployment Guide for RideNLoad (DropTaxi & Goods Truck) Platform

Deploy the entire platform online **100% Free ($0)** with a live public URL to share with your client.

---

## 🌟 Method 1: 1-Click Unified Free Deployment on Render.com (Recommended - Simplest & $0)

With our unified setup, **one single free service** hosts both the Express REST API, Live WebSockets, and the React Frontend SPA.

### Step-by-Step Instructions:

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy DropTaxi & Goods Truck Admin Platform"
   git push origin main
   ```

2. **Sign up / Log in to [Render.com](https://render.com/)** (100% Free, no credit card required).

3. Click **"New +"** → **"Web Service"**.

4. Select **"Build and deploy from a Git repository"** and connect your GitHub repo `droptaxi_goodstruck`.

5. Configure the service settings:
   - **Name**: `droptaxi-admin` (or your choice)
   - **Region**: Singapore / Frankfurt / Oregon (any closest)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: **Free ($0/month)**

6. Scroll down to **"Environment Variables"** and add:
   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `MONGODB_URI` | `mongodb+srv://babupalani9598_db_user:Arivubabu%40143@cluster0.xdbp781.mongodb.net/ridenload?retryWrites=true&w=majority&appName=Cluster0` |
   | `JWT_SECRET` | `droptaxi_enterprise_secret_key_2026_super` |
   | `JWT_EXPIRES_IN` | `7d` |
   | `SIMULATION_ENABLED` | `true` |

7. Click **"Create Web Service"**.
   - Render will build and launch your service.
   - In 2–3 minutes, you will receive a public HTTPS URL (e.g. `https://droptaxi-admin.onrender.com`) to share with your client!

---

## ⚡ Method 2: Instant Public Tunnel (Show Client in 10 Seconds - $0)

If you want to demonstrate the live app to your client **right now** without pushing to GitHub or waiting for cloud builds:

1. Run the local production server:
   ```bash
   npm start
   ```

2. In another terminal, expose it with **localtunnel** or **ngrok** (free, no sign-up):
   ```bash
   npx localtunnel --port 5000
   ```
   Or with ngrok:
   ```bash
   npx ngrok http 5000
   ```

3. It will give you an instant public URL like `https://quick-taxi-demo.loca.lt` to share with your client immediately!

---

## 🌐 Method 3: Split Deployment (Vercel Frontend + Render Backend)

If you prefer Vercel's edge network for the frontend:

1. **Deploy Backend to Render.com**:
   - Follow Method 1, with Root Directory set to `server`.
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - You will get a backend URL (e.g. `https://droptaxi-api.onrender.com`).

2. **Deploy Frontend to [Vercel.com](https://vercel.com/)** (100% Free):
   - Import GitHub repository on Vercel.
   - Root Directory: `client`
   - Framework Preset: `Vite`
   - Add Environment Variables:
     - `VITE_API_BASE_URL`: `https://droptaxi-api.onrender.com/api`
     - `VITE_SOCKET_URL`: `https://droptaxi-api.onrender.com`
   - Click **Deploy**!

---

## 🔑 Demo Login Credentials for Your Client:

- **URL**: `https://your-deployed-url.onrender.com`
- **Super Admin Email**: `admin@droptaxi.com`
- **Password**: `SuperAdmin123!`
- **Operations Manager**: `dispatch@droptaxi.com` / `SuperAdmin123!`
- **Finance Auditor**: `finance@droptaxi.com` / `SuperAdmin123!`
