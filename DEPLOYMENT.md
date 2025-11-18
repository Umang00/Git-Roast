# 🚀 GitRoast Deployment Guide

Complete guide to deploy GitRoast and make it go viral!

## 📋 Deployment Overview

**Recommended Setup:**
- **Frontend:** Vercel (free, fast, automatic deployments)
- **Backend:** Railway or Render (free tier available)

**Why this split?**
- The backend needs git CLI access and file system operations
- Vercel serverless functions have limitations for git operations
- This setup is free, fast, and production-ready

---

## 🎨 Frontend Deployment (Vercel)

### Option 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub** (already done!)

2. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"

3. **Import Repository**
   - Select your GitRoast repository
   - Click "Import"

4. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Build Command: cd frontend && npm install && npm run build
   Output Directory: frontend/dist
   Install Command: npm install
   ```

5. **Add Environment Variable**
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-backend-url.railway.app/api`
   - (You'll update this after deploying the backend)

6. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your frontend is live! 🎉

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow the prompts
# Set root directory: ./
# Build settings: as above

# Add environment variable
vercel env add VITE_API_URL
# Enter: https://your-backend-url.railway.app/api
```

---

## ⚙️ Backend Deployment

### Option A: Railway (Recommended - Easy & Free)

1. **Go to Railway**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your GitRoast repository

3. **Configure Service**
   - Select the backend folder
   - Railway auto-detects Node.js

4. **Update Settings**
   ```
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

5. **Generate Domain**
   - Go to Settings → Networking
   - Click "Generate Domain"
   - Copy the URL (e.g., `gitroast-backend.up.railway.app`)

6. **Update Vercel Environment Variable**
   - Go back to Vercel
   - Update `VITE_API_URL` to: `https://your-railway-url.railway.app/api`
   - Redeploy frontend

### Option B: Render

1. **Go to Render**
   - Visit [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure**
   ```
   Name: gitroast-backend
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Copy the URL

5. **Update Vercel**
   - Add the Render URL to Vercel's `VITE_API_URL`
   - Redeploy

### Option C: Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# From the backend directory
cd backend

# Launch
fly launch
# Follow prompts

# Deploy
fly deploy

# Get URL
fly info
```

---

## 🔧 Configuration Files

### Vercel Configuration

The `vercel.json` in the root handles:
- Frontend build from the `frontend` folder
- Output to `frontend/dist`
- Proxy API requests to your backend

**Update after backend deployment:**
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://YOUR-BACKEND-URL/api/:path*"
    }
  ]
}
```

### Environment Variables

**Frontend (.env in frontend/):**
```bash
VITE_API_URL=https://your-backend.railway.app/api
```

**Backend (no env needed currently):**
```bash
# Optional: if you add features later
PORT=3001
NODE_ENV=production
```

---

## 🚀 Quick Deploy Checklist

### Step 1: Deploy Backend First
- [ ] Choose platform (Railway/Render)
- [ ] Connect GitHub repository
- [ ] Set root directory to `backend`
- [ ] Deploy and get URL
- [ ] Test: `https://your-backend-url/api/health`

### Step 2: Deploy Frontend
- [ ] Go to Vercel
- [ ] Import GitHub repository
- [ ] Set build command and output directory
- [ ] Add `VITE_API_URL` environment variable
- [ ] Deploy
- [ ] Test the live site!

### Step 3: Test Everything
- [ ] Open your Vercel URL
- [ ] Try analyzing a repository
- [ ] Check that roasts appear
- [ ] Test the share button
- [ ] Verify on mobile

### Step 4: Go Viral!
- [ ] Share on Twitter
- [ ] Post on Reddit
- [ ] Submit to Product Hunt
- [ ] Message influencers
- [ ] Update README with live URL

---

## 🌍 Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to your project settings
2. Click "Domains"
3. Add your domain (e.g., `gitroast.app`)
4. Update DNS records as shown
5. Wait for SSL certificate

### Add Custom Domain to Railway/Render

1. Go to service settings
2. Add custom domain
3. Update DNS CNAME
4. Update Vercel's `VITE_API_URL` to use new domain

---

## 🔍 Testing Deployments

### Test Backend
```bash
# Health check
curl https://your-backend-url.railway.app/api/health

# Should return:
# {"status":"ok","message":"GitRoast API is running! 🔥"}
```

### Test Frontend
1. Open your Vercel URL
2. Enter `.` or a repo path
3. Click "Roast My Code!"
4. Should see roasts and grade

---

## 🐛 Troubleshooting

### Frontend Issues

**"Failed to analyze repository"**
- Check `VITE_API_URL` is set correctly
- Verify backend is running: visit `/api/health`
- Check browser console for CORS errors

**Build fails on Vercel**
- Ensure `vercel.json` points to `frontend/dist`
- Check all dependencies are in `package.json`
- View build logs for specific errors

### Backend Issues

**"Not a git repository"**
- Backend needs access to git repos
- For production, you'll need to add GitHub URL support
- Current version works with local repos

**Port already in use**
- Railway/Render auto-assign ports
- Don't hardcode PORT in production

**Timeout errors**
- Check git analysis isn't taking too long
- Add timeout limits
- Optimize git operations

---

## 📊 Monitoring

### Vercel Analytics
- Go to project → Analytics
- Track visitors, page views
- Monitor performance

### Railway/Render Logs
- View application logs
- Monitor API requests
- Check error rates

---

## 💰 Cost Estimate

**Free Tier (Perfect for Getting Started):**
- Vercel: Free (100GB bandwidth, unlimited requests)
- Railway: $5 credit/month free
- Render: 750 hours free/month
- **Total: $0/month** for moderate traffic

**If You Go Viral (100K+ visitors):**
- Vercel: Still free (generous limits)
- Railway: ~$10-20/month
- Render: ~$15-25/month
- **Total: ~$20-40/month** for high traffic

---

## 🚀 Advanced: All-Vercel Deployment (Future Enhancement)

To deploy everything on Vercel, you'd need to:

1. **Convert backend to serverless functions**
   - Create `api/` folder in root
   - Convert Express routes to Vercel functions
   - Add GitHub API support (instead of local git)

2. **Add GitHub URL analysis**
   - Users paste GitHub repo URLs
   - Fetch via GitHub API
   - Analyze commits remotely
   - No local file system needed

This would make it fully Vercel-compatible but requires GitHub API integration.

**Want me to build this version?** Let me know!

---

## 🎉 Post-Deployment

Once deployed:

1. **Update README.md**
   - Add live demo link
   - Add screenshots
   - Update installation instructions

2. **Share URLs**
   - Frontend: `https://gitroast.vercel.app`
   - Backend: `https://gitroast-backend.railway.app`

3. **Test with real repos**
   - Try popular open source repos
   - Screenshot the funniest roasts
   - Share on social media

4. **Monitor usage**
   - Watch analytics
   - Check for errors
   - Iterate based on feedback

---

## 📝 Deployment Commands Summary

```bash
# Backend (Railway)
# Done via web dashboard, no CLI needed

# Frontend (Vercel)
vercel --prod

# Or use GitHub auto-deploy:
git push origin main  # Auto-deploys on push!
```

---

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## ✅ You're Ready to Deploy!

**Estimated time:** 15-20 minutes total

The setup is:
1. Deploy backend (5 min)
2. Deploy frontend (5 min)
3. Configure environment variables (2 min)
4. Test everything (5 min)
5. Go viral! (priceless 🔥)

Need help? Check the troubleshooting section or create an issue!

---

**Let's make GitRoast and Claude go VIRAL! 🚀🔥**
