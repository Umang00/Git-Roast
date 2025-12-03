# 🚀 GitRoast Deployment Guide

Complete guide to deploy GitRoast and make it go viral!

## 📋 Deployment Overview

**Recommended Setup (GitRoast 3.0):**
- **All-in-One:** Vercel (free, fast, automatic deployments)
- **Frontend + Backend + AI:** Everything serverless on Vercel
- **No separate backend needed!** Uses Vercel Serverless Functions

**Why Vercel-only?**
- GitHub API integration (no local git needed)
- Google Gemini AI integration
- Serverless functions auto-scale
- One-click deployment
- 100% free for most usage
- Simpler setup and maintenance

**Alternative (Legacy):**
- **Frontend:** Vercel
- **Backend:** Railway or Render
- Only if you need custom backend logic

---

## 🚀 Vercel All-in-One Deployment (Recommended)

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR-USERNAME/gitroast)

1. Click the button above
2. Add environment variables:
   - `GEMINI_API_KEY` (get free at https://aistudio.google.com/app/apikey)
   - `GITHUB_TOKEN` (optional, for higher rate limits)
3. Deploy! 🎉

### Option 2: Deploy via GitHub (Manual)

1. **Push your code to GitHub**

2. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"

3. **Import Repository**
   - Select your GitRoast repository
   - Click "Import"

4. **Configure Build Settings** (Auto-detected)
   ```
   Framework Preset: Vite
   Build Command: cd frontend && npm install && npm run build
   Output Directory: frontend/dist
   Install Command: npm install
   ```

5. **Add Environment Variables** (Optional but Recommended)
   - Click "Environment Variables"
   - Add: `GEMINI_API_KEY` = your Gemini API key (for AI roasts)
   - Add: `GITHUB_TOKEN` = your GitHub token (for higher rate limits)

6. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live with frontend + API! 🎉

### Option 3: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from project root
vercel

# Deploy to production
vercel --prod

# Add environment variables
vercel env add GEMINI_API_KEY
vercel env add GITHUB_TOKEN
```

---

## ⚙️ Legacy: Separate Backend Deployment (Not Recommended)

> **Note**: The sections below describe the old split architecture. GitRoast 3.0 no longer requires a separate backend. Use the Vercel-only deployment above instead!

### Option A: Railway (Legacy - Not Needed)

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

## 🚀 Quick Deploy Checklist (GitRoast 3.0)

### Step 1: Deploy to Vercel
- [ ] Go to Vercel and import GitHub repository
- [ ] Configure build settings (auto-detected)
- [ ] Add environment variables:
  - [ ] `GEMINI_API_KEY` (optional, for AI roasts)
  - [ ] `GITHUB_TOKEN` (optional, for higher rate limits)
- [ ] Click Deploy
- [ ] Wait 2-3 minutes

### Step 2: Test Everything
- [ ] Open your Vercel URL
- [ ] Test: `/api/health` endpoint returns JSON
- [ ] Try analyzing `facebook/react`
- [ ] Try analyzing your own GitHub profile
- [ ] Check that AI roasts appear (if Gemini key added)
- [ ] Test the share button
- [ ] Verify on mobile
- [ ] Check streaming roast feature

### Step 3: Configure MCP (Optional)
- [ ] Get your Vercel deployment URL
- [ ] Configure Claude Desktop (see [MCP Setup Guide](MCP_SETUP.md))
- [ ] Test roasting repos from Claude

### Step 4: Go Viral!
- [ ] Share on Twitter with #GitRoast
- [ ] Post on Reddit (r/ProgrammerHumor, r/webdev)
- [ ] Submit to Product Hunt
- [ ] Message influencers
- [ ] Update README with live URL
- [ ] Share roasts of famous repos

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

## 💰 Cost Estimate (GitRoast 3.0)

**Free Tier (Perfect for Getting Started):**
- Vercel: 100% FREE
  - 100GB bandwidth
  - Unlimited serverless function invocations (fair use)
  - Automatic SSL
  - Global CDN
- Gemini AI: FREE tier (generous limits)
- GitHub API: FREE (60 req/hr without token, 5000 with token)
- **Total: $0/month** for moderate traffic

**If You Go Viral (100K+ visitors/month):**
- Vercel: Still FREE for most usage
  - May hit bandwidth limits on hobby tier
  - Can upgrade to Pro ($20/month) if needed
- Gemini AI: Still FREE for most usage
- GitHub API: FREE with token (5000 req/hr)
- **Total: $0-20/month** even with high traffic

**Compared to Old Architecture:**
- Old: $0-40/month (Vercel + Railway/Render)
- New: $0-20/month (Vercel only)
- **Savings: Up to $20/month + simpler deployment!**

---

## 🚀 All-Vercel Deployment - NOW AVAILABLE! ✅

**Good news!** GitRoast 3.0 is now fully Vercel-compatible!

### What's Been Implemented:

1. ✅ **Serverless functions in `api/` folder**
   - `api/roast.js` - Main roast endpoint
   - `api/roast-stream.js` - Streaming roast with SSE
   - `api/aiRoastGenerator.js` - Google Gemini AI integration
   - `api/githubAnalyzer.js` - GitHub API integration
   - `api/roastEngine.js` - Template-based fallback roasts
   - `api/mcp.ts` - MCP Server integration
   - `api/health.js` - Health check endpoint

2. ✅ **GitHub API analysis**
   - Users paste GitHub repo URLs or usernames
   - Fetches via GitHub API (@octokit/rest)
   - Analyzes commits, README, metadata remotely
   - No local file system needed
   - Supports both repos and profiles

3. ✅ **AI-Powered Roasts**
   - Google Gemini AI integration
   - Real-time streaming responses
   - Brutally savage and personalized
   - Falls back to templates if AI unavailable

**Everything works on Vercel!** Just deploy and go! 🎉

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

## 📝 Deployment Commands Summary (GitRoast 3.0)

```bash
# All-in-One Vercel Deployment
vercel --prod

# Or use GitHub auto-deploy:
git push origin main  # Auto-deploys on push!

# Add environment variables (optional):
vercel env add GEMINI_API_KEY production
vercel env add GITHUB_TOKEN production

# Test locally before deploying:
npm run dev  # Runs vercel dev
```

---

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## ✅ You're Ready to Deploy!

**Estimated time:** 5-10 minutes total (GitRoast 3.0)

The setup is:
1. Deploy to Vercel (3 min)
2. Add environment variables (optional, 2 min)
3. Test everything (3 min)
4. Go viral! (priceless 🔥)

**Much faster than the old 15-20 minute split deployment!**

Need help? Check the troubleshooting section or create an issue!

---

**Let's make GitRoast go VIRAL! 🚀🔥**

For detailed Vercel-specific deployment instructions, see [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
