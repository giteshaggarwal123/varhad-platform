# VARHAD PrEPARED - Deployment Guide

This guide covers **3 FREE deployment options** to get your application online!

## 🚀 Quick Deployment Options

### Option 1: Render (Recommended - Easiest & FREE)
**⭐ Best for: Full-stack apps with database**
- ✅ Free tier available
- ✅ Automatic MongoDB included
- ✅ SSL certificate included
- ✅ Easy deployment from GitHub

### Option 2: Railway (Alternative FREE option)
**⭐ Best for: Quick deployments**
- ✅ $5 free credit monthly
- ✅ Built-in MongoDB
- ✅ Auto-deploy from GitHub

### Option 3: Docker + Any Cloud Provider
**⭐ Best for: Self-hosting**
- ✅ Full control
- ✅ Works on any server
- ✅ Docker Compose included

---

## 🎯 OPTION 1: Deploy to Render (FREE - Recommended)

### Step 1: Prepare Your Code

1. Create a GitHub account at https://github.com if you don't have one

2. Create a new repository:
   - Go to https://github.com/new
   - Name: `varhad-platform`
   - Make it **Private** (to protect sensitive data)
   - Click **Create repository**

3. Initialize Git in your project:

```bash
cd C:\Users\gites\varhad-platform

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - VARHAD PrEPARED Platform"

# Connect to GitHub (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/varhad-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Render

1. Go to https://render.com and sign up (free account)

2. Click **New +** → **Web Service**

3. Connect your GitHub account and select `varhad-platform` repository

4. Configure the service:
   - **Name**: `varhad-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Select **Free**

5. Add Environment Variables (Click "Advanced"):
   ```
   NODE_ENV=production
   JWT_SECRET=your_super_secret_key_change_this_12345
   JWT_EXPIRE=7d
   PORT=5000
   ```

6. Click **Create Web Service**

### Step 3: Add MongoDB Database

1. In Render dashboard, click **New +** → **PostgreSQL** or use MongoDB Atlas

2. **For MongoDB Atlas (FREE)**:
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Create free cluster
   - Get connection string
   - Add to Render environment variables:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/varhad_prepared
     ```

### Step 4: Seed Database

Once deployed, open the Render Shell and run:
```bash
node server/seeds/seedData.js
```

### Step 5: Access Your App! 🎉

Your app will be live at: `https://varhad-api.onrender.com`

**Login with demo credentials:**
- Username: `aparna.b`, Password: `demo123` (Counsellor)
- Username: `admin`, Password: `demo123` (Admin)

---

## 🚂 OPTION 2: Deploy to Railway (FREE $5/month credit)

### Step 1: Push to GitHub (same as Option 1, Step 1)

### Step 2: Deploy to Railway

1. Go to https://railway.app and sign up

2. Click **New Project** → **Deploy from GitHub repo**

3. Select your `varhad-platform` repository

4. Railway will auto-detect and deploy!

5. Add MongoDB:
   - Click **New** → **Database** → **Add MongoDB**
   - Railway auto-connects it!

6. Add environment variables:
   - Click on your service → **Variables**
   - Add:
     ```
     NODE_ENV=production
     JWT_SECRET=your_secret_key
     JWT_EXPIRE=7d
     ```

7. Get your app URL from **Settings** → **Domains**

---

## 🐳 OPTION 3: Docker Deployment (Self-Host)

### For any VPS (DigitalOcean, AWS, Azure, Google Cloud)

1. Install Docker on your server:
```bash
# For Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

2. Clone your repository:
```bash
git clone https://github.com/YOUR-USERNAME/varhad-platform.git
cd varhad-platform
```

3. Start with Docker Compose:
```bash
docker-compose up -d
```

4. Access at: `http://your-server-ip:5000`

---

## 🌐 FREE MongoDB Hosting (If Not Using Railway/Render DB)

### MongoDB Atlas (Recommended - FREE)

1. Go to https://www.mongodb.com/cloud/atlas/register

2. Create a **FREE M0 cluster**:
   - Choose **AWS** or **Google Cloud**
   - Select closest region
   - Cluster Name: `varhad-cluster`

3. Create Database User:
   - Username: `varhad_admin`
   - Password: (generate secure password)

4. Whitelist IP: `0.0.0.0/0` (allow from anywhere)

5. Get Connection String:
   - Click **Connect** → **Connect your application**
   - Copy connection string:
     ```
     mongodb+srv://varhad_admin:<password>@varhad-cluster.xxxxx.mongodb.net/varhad_prepared
     ```

6. Add to your deployment environment variables as `MONGODB_URI`

---

## ⚡ Quick Deploy to Heroku (Alternative)

### One-Click Deploy Button

1. Create `app.json`:

```json
{
  "name": "VARHAD PrEPARED",
  "description": "HIV Prevention & PrEP Management System",
  "repository": "https://github.com/YOUR-USERNAME/varhad-platform",
  "env": {
    "NODE_ENV": {
      "value": "production"
    },
    "JWT_SECRET": {
      "generator": "secret"
    },
    "MONGODB_URI": {
      "description": "MongoDB connection string from Atlas"
    }
  },
  "addons": []
}
```

2. Deploy to Heroku:
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create varhad-platform

# Add MongoDB addon (or use Atlas)
heroku addons:create mongodb-atlas:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_key

# Deploy
git push heroku main

# Seed database
heroku run node server/seeds/seedData.js
```

---

## 🔒 Security Checklist Before Going Live

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Update MongoDB password
- [ ] Enable HTTPS/SSL (automatic on Render/Railway)
- [ ] Remove or disable demo user accounts
- [ ] Set strong passwords for production users
- [ ] Enable MongoDB authentication
- [ ] Set up backups
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up monitoring/logging

---

## 🎯 Recommended: Quick Start with Render (5 minutes)

**I recommend Render because:**
1. ✅ Completely FREE tier
2. ✅ Auto SSL certificates
3. ✅ Easy GitHub integration
4. ✅ Free MongoDB via Atlas integration
5. ✅ Auto-deploy on git push

**Steps:**
1. Push code to GitHub (2 min)
2. Connect to Render (1 min)
3. Add MongoDB Atlas (1 min)
4. Deploy! (1 min)

**Total time: ~5 minutes to have your app live!** 🚀

---

## 📱 After Deployment

### Test Your Live App:

1. **Login**: Use demo credentials
2. **Create Client**: Test client registration
3. **HIV Testing**: Record a test
4. **PrEP Initiation**: Initiate PrEP for a client
5. **Check Inventory**: Verify auto-update
6. **View Dashboard**: See stats

### Share Access:

Your app will be at:
- **Render**: `https://your-app-name.onrender.com`
- **Railway**: `https://your-app-name.up.railway.app`
- **Custom domain**: Available on paid plans

---

## 🆘 Troubleshooting

### App won't start?
- Check environment variables are set
- Verify MongoDB connection string
- Check build logs in deployment platform

### Database connection error?
- Whitelist IP `0.0.0.0/0` in MongoDB Atlas
- Check connection string format
- Verify database user credentials

### API calls failing?
- Update `CLIENT_URL` environment variable
- Check CORS settings in `server.js`

---

## 💰 Cost Comparison

| Platform | Free Tier | Limitations |
|----------|-----------|-------------|
| **Render** | ✅ Yes | Spins down after inactivity |
| **Railway** | ✅ $5/month credit | ~500 hours runtime |
| **Heroku** | ❌ No longer free | Paid only |
| **Vercel** | ✅ Yes | Frontend only (need separate backend) |

**Recommendation**: Use **Render** for free full-stack hosting! 🎉

---

Need help? Check the main README.md or deployment platform documentation!
