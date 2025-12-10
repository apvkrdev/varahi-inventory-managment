# Vercel Setup Guide - Step by Step

## 🚀 What is Vercel?

Vercel is a platform that automatically deploys and hosts your Next.js app. It's **free** and perfect for development/testing.

---

## 📋 Prerequisites

- GitHub account (you already have: `apvkrdev`)
- Your project pushed to GitHub

---

## ✅ Step 1: Create Vercel Account

1. **Go to**: https://vercel.com
2. **Click "Sign Up"** (top right)
3. **Choose "Continue with GitHub"**
4. **Authorize Vercel** to access your GitHub account
5. **You're logged in!** ✅

---

## 📦 Step 2: Import Your GitHub Project to Vercel

1. **Click "New Project"** (top right or main page)
2. **Under "Import Git Repository"**, click **"Import"**
3. **Search for**: `varahi-inventory-managment`
4. **Click on it** to select
5. **Click "Import"** button

---

## ⚙️ Step 3: Configure Project Settings

After importing, you'll see a configuration page:

### Framework Preset
- Should auto-detect: **Next.js** ✅
- If not, select it manually

### Root Directory
- Leave as: `.` (root)

### Build Command
- Should be: `next build` ✅

### Output Directory
- Should be: `.next` ✅

### Environment Variables
**Add these 3 variables:**

Click "Add" for each:

**Variable 1:**
```
Name: NEXTAUTH_URL
Value: https://varahi-inventory-managment.vercel.app
```

**Variable 2:**
```
Name: NEXTAUTH_SECRET
Value: (run this in terminal:)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Variable 3:**
```
Name: MONGODB_URI
Value: mongodb+srv://dev-user:password@cluster.mongodb.net/trading-inventory?retryWrites=true&w=majority
```

*(You'll get MongoDB_URI from MongoDB Atlas setup below)*

---

## 🗄️ Step 4: Set Up MongoDB Atlas (Free Database)

### 4.1 Create MongoDB Account

1. **Go to**: https://www.mongodb.com/cloud/atlas
2. **Click "Start Free"**
3. **Sign up with GitHub** (easiest)
4. **Verify email** if prompted
5. **You're in!** ✅

### 4.2 Create a Free Cluster

1. **Click "Create"** (or "Build a Database")
2. **Select "M0 Free"** tier
3. **Cloud Provider**: AWS
4. **Region**: Pick closest to you (e.g., `us-east-1`)
5. **Cluster Name**: `varahi-dev`
6. **Click "Create Cluster"**
7. **Wait 2-3 minutes** for cluster to initialize...

### 4.3 Create Database User

1. **Left sidebar** → **"Database Access"**
2. **Click "Add New Database User"**
3. **Fill form:**
   ```
   Username: dev-user
   Password: Dev123!@# (or generate)
   ```
4. **Keep defaults**, click **"Add User"**
5. **Wait for user to be created** ✅

### 4.4 Whitelist Vercel IP (Important!)

1. **Left sidebar** → **"Network Access"**
2. **Click "Add IP Address"**
3. **Click "Allow access from anywhere"** (for dev only)
   - OR add: `0.0.0.0/0`
4. **Click "Confirm"** ✅

### 4.5 Get Connection String

1. **Left sidebar** → **"Databases"**
2. **Click "Connect"** button
3. **Choose "Connect your application"**
4. **Copy the connection string**
   
   Example:
   ```
   mongodb+srv://dev-user:Dev123!@varahi-dev.mongodb.net/?retryWrites=true&w=majority
   ```

5. **Update the string:**
   - Replace `<password>` with your actual password
   - Add database name before `?`:
   ```
   mongodb+srv://dev-user:Dev123!@varahi-dev.mongodb.net/trading-inventory?retryWrites=true&w=majority
   ```

6. **Copy this** - you'll use it in Vercel

---

## 🔄 Step 5: Add MongoDB URI to Vercel

1. **Go back to Vercel** project page
2. **Settings** → **Environment Variables**
3. **Add new variable:**
   ```
   Name: MONGODB_URI
   Value: mongodb+srv://dev-user:Dev123!@varahi-dev.mongodb.net/trading-inventory?retryWrites=true&w=majority
   ```
4. **Click "Save"** ✅

---

## 🎯 Step 6: Deploy to Vercel

### Option A: Auto Deploy (Recommended)

1. **Go back to Vercel project**
2. **Click "Deploy"** button
3. **Wait 3-5 minutes** for build
4. **You'll get a live URL!** 🎉

### Option B: Deploy via Git Push

1. **Commit and push to GitHub:**
   ```powershell
   git add .
   git commit -m "Initial deploy to Vercel"
   git push origin develop
   ```

2. **Vercel auto-deploys** when you push
3. **Check Vercel dashboard** for deployment status
4. **Get live URL** when complete ✅

---

## ✅ Test Your Vercel Deployment

1. **Click the live URL** from Vercel dashboard
2. **You should see your app!** 🎉
3. **Try to register**:
   - Email: `test@example.com`
   - Password: `Test123!`
4. **Try to login** with those credentials
5. **Try creating a purchase** or sale

**If it works - you're ready for GitHub Actions!** ✅

---

## 📋 Get Your Vercel Tokens (For GitHub Actions)

Once your app is deployed on Vercel:

### Get VERCEL_TOKEN

1. **Go to**: https://vercel.com/account/tokens
2. **Click "Create"**
3. **Name**: `GitHub Actions`
4. **Scope**: `Full Account`
5. **Expiration**: `No expiration`
6. **Click "Create Token"**
7. **Copy the token** (looks like: `1234567890abcdef...`)

### Get VERCEL_ORG_ID

1. **Go to**: https://vercel.com/account/overview
2. **Look for "Org ID"** or **"Team ID"**
3. **Copy it** (usually your username or team name)

### Get VERCEL_PROJECT_ID_DEV

1. **Go to your Vercel project**
2. **Click "Settings"** (top right)
3. **Look for "Project ID"**
4. **Copy it**

---

## 🎉 Summary - What You Now Have

After completing these steps, you'll have:

✅ **Vercel Account** - Free hosting
✅ **Deployed App** - Live at vercel.com URL
✅ **MongoDB Database** - Free Atlas cluster
✅ **3 Vercel Tokens** - For GitHub Actions automation

---

## 🔗 Next Steps

Once you have all this, return to `GITHUB_DEPLOYMENT.md` and:

1. Add 6 GitHub Secrets to your repo
2. Push to `develop` branch
3. GitHub Actions automatically deploys on every push! 🚀

---

## 🆘 Troubleshooting

### "Build failed" on Vercel
- Check: Is `npm run build` working locally?
- Run locally: `npm run build`
- Fix any errors, then push again

### "Cannot connect to MongoDB"
- Check: Is `MONGODB_URI` correct in Vercel?
- Check: Is database user created in MongoDB Atlas?
- Check: Is IP whitelisted (0.0.0.0/0)?

### "NEXTAUTH_SECRET is missing"
- Check: Is `NEXTAUTH_SECRET` set in Vercel Environment Variables?
- Re-add it and redeploy

### Deployment stuck
- Refresh Vercel page
- Check: https://status.vercel.com for outages

---

## 📚 Resources

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Next.js on Vercel**: https://nextjs.org/learn/basics/deploying-nextjs-app/deploy

---

*Generated: December 10, 2025*
*Varahi Inventory Manager - Vercel Setup Guide*
