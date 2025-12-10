# GitHub Deployment Guide - Varahi Inventory Manager

## 🚀 Deploy to Dev Stage via GitHub Actions

This guide walks you through setting up automated deployment to your dev environment whenever you push to the `develop` branch.

---

## 📋 Prerequisites

1. **GitHub Repository** - Project already on GitHub
2. **Vercel Account** - Free tier works fine
3. **MongoDB Atlas Account** - Free cluster for dev
4. **Environment Variables** - Configured in GitHub Secrets

---

## 🔧 Step-by-Step Setup

### Step 1: Set Up Vercel Account & Project

1. **Go to vercel.com** and sign up/login with GitHub
2. **Import your GitHub project**:
   - Click "New Project"
   - Select `apvkrdev/varahi-inventory-managment`
   - Framework: Next.js
   - Click "Import"

3. **Create dev project** (optional, for separate dev/prod):
   - In Vercel, create another project for dev
   - Or use "Preview Deployments" for dev

---

### Step 2: Set Up MongoDB Atlas (Free)

1. **Create MongoDB Atlas Account**:
   - Go to mongodb.com/cloud/atlas
   - Sign up with GitHub
   - Create a free M0 cluster

2. **Create Database**:
   - Cluster name: `varahi-dev` (for dev)
   - Create database: `trading-inventory`
   - Create collection: `users`, `purchases`, `sales`, `payments`

3. **Get Connection String**:
   - Click "Connect" button
   - Choose "Connect your application"
   - Copy connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/trading-inventory?retryWrites=true&w=majority`

4. **Create Database User**:
   - Go to Database Access
   - Click "Add New Database User"
   - Username: `dev-user`
   - Password: Generate strong password
   - Grant permissions: Read and Write to any database

---

### Step 3: Generate NextAuth Secret

Run this command locally to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save this value - you'll need it for GitHub Secrets.

---

### Step 4: Add GitHub Secrets

1. **Go to your GitHub repository**
2. **Settings → Secrets and variables → Actions**
3. **Add these secrets** (click "New repository secret"):

| Secret Name | Value | Example |
|-------------|-------|---------|
| `VERCEL_TOKEN` | Your Vercel API token | (see below) |
| `VERCEL_ORG_ID` | Your Vercel org/team ID | (see below) |
| `VERCEL_PROJECT_ID_DEV` | Dev project ID from Vercel | (see below) |
| `DEV_NEXTAUTH_URL` | Dev app URL | `https://varahi-dev.vercel.app` |
| `DEV_NEXTAUTH_SECRET` | Generated secret above | (the openssl output) |
| `DEV_MONGODB_URI` | MongoDB connection string | `mongodb+srv://dev-user:password@cluster.mongodb.net/trading-inventory?retryWrites=true&w=majority` |

#### Getting Vercel Tokens & IDs:

1. **VERCEL_TOKEN**:
   - Go to vercel.com/account/tokens
   - Click "Create"
   - Name: "GitHub Actions"
   - Scope: Full Account
   - Copy the token

2. **VERCEL_ORG_ID**:
   - Go to vercel.com/account/overview
   - Look for "Org ID" or "Team ID"
   - Copy it

3. **VERCEL_PROJECT_ID_DEV**:
   - Go to your project settings in Vercel
   - Settings → General
   - Copy "Project ID"

---

### Step 5: Update Workflow File (Already Done ✅)

The file `.github/workflows/deploy-dev.yml` has been created with:
- ✅ Node.js setup
- ✅ Dependency installation
- ✅ Linting check
- ✅ Build verification
- ✅ Vercel deployment
- ✅ Status notifications

---

## ✅ Test the Deployment

1. **Make a change** to any file in your project
2. **Commit and push** to the `develop` branch:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push origin develop
   ```

3. **Watch GitHub Actions**:
   - Go to your GitHub repo
   - Click "Actions" tab
   - See your workflow running
   - Wait for ✅ success

4. **Check Vercel**:
   - Go to vercel.com
   - Check deployment status
   - Once complete, click preview URL

---

## 🎯 Deployment Workflow

### Automatic Deployment
Every time you push to `develop` branch:
1. GitHub Actions workflow triggers
2. Installs dependencies
3. Runs linter checks
4. Builds the Next.js app
5. Deploys to Vercel dev environment
6. Shows deployment URL

### Manual Deployment (if needed)
1. Push a commit with message containing `[deploy]`
2. Or manually run workflow from Actions tab

---

## 🔄 Production Deployment (Future)

Once dev is working, create `deploy-prod.yml` for `main` branch:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      # Same as dev, but using:
      # - secrets.PROD_NEXTAUTH_URL
      # - secrets.PROD_NEXTAUTH_SECRET
      # - secrets.PROD_MONGODB_URI
      # - secrets.VERCEL_PROJECT_ID_PROD
```

---

## 🔐 Environment Variables Summary

### Development (.env.local for local testing)
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret
MONGODB_URI=mongodb+srv://dev-user:password@cluster.mongodb.net/trading-inventory
```

### GitHub Secrets (Dev Deployment)
```
DEV_NEXTAUTH_URL=https://varahi-dev.vercel.app
DEV_NEXTAUTH_SECRET=(same as above)
DEV_MONGODB_URI=(same MongoDB connection)
```

### GitHub Secrets (Vercel Access)
```
VERCEL_TOKEN=(from vercel.com/account/tokens)
VERCEL_ORG_ID=(your org/team ID)
VERCEL_PROJECT_ID_DEV=(from project settings)
```

---

## 🐛 Troubleshooting Deployments

### Build Fails with "Cannot find module"
**Fix**: Ensure all imports are correct
```bash
npm run build  # Test locally first
```

### MongoDB Connection Error
**Fix**: Check connection string format
- Username/password correct?
- IP whitelist includes Vercel IPs (add 0.0.0.0/0 for dev)
- Database name matches?

### NextAuth Error "NEXTAUTH_SECRET is missing"
**Fix**: Verify secret is set in GitHub Secrets
- Check spelling of secret name
- Make sure it's not empty

### Vercel Token Invalid
**Fix**: Generate new token
- Old token may have expired
- Regenerate from vercel.com/account/tokens

### Deployment stuck "Waiting for Docker..."
**Fix**: Usually resolves itself in 5-10 minutes
- Check Vercel status: status.vercel.com
- Try redeploying

---

## 📊 Monitoring Deployments

### GitHub Actions
- Go to "Actions" tab in your repo
- See workflow status for each push
- View detailed logs for failures

### Vercel Dashboard
- See all deployments
- Check build logs
- View analytics
- Check error logs

### Rollback if Needed
```bash
# Go back to previous commit
git revert <commit-hash>
git push origin develop

# Or go directly to Vercel and select previous deployment
```

---

## 🎉 Success Checklist

- ✅ Vercel account created
- ✅ Project imported to Vercel
- ✅ MongoDB Atlas cluster created
- ✅ GitHub Secrets configured (6 secrets)
- ✅ Workflow file in place
- ✅ First push to `develop` triggers workflow
- ✅ Deployment succeeds
- ✅ App loads at dev URL
- ✅ Can register and login
- ✅ Can create purchases/sales/payments

---

## 📚 Resources

- **Vercel Docs**: https://vercel.com/docs
- **GitHub Actions**: https://github.com/features/actions
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **NextAuth Deployment**: https://next-auth.js.org/deployment

---

## 💡 Next Steps

1. **Test Dev Deployment** - Follow "Test the Deployment" section
2. **Monitor Logs** - Watch GitHub Actions and Vercel dashboards
3. **Update Documentation** - Keep deployment docs current
4. **Set Up Production** - Once dev is stable, create prod workflow
5. **Configure Alerts** - Get notified on deployment failures

---

*Generated: December 10, 2025*
*Varahi Inventory Manager - GitHub Deployment Guide*
