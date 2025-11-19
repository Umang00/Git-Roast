# 🚀 GitRoast Quick Start Guide (Vercel Edition)

## TL;DR - Get Running in 2 Minutes

```bash
# 1. Install dependencies
npm run install:all

# 2. (Optional) Add GitHub token for higher rate limits
echo "GITHUB_TOKEN=your_token_here" > .env

# 3. Run everything
npm run dev

# 4. Open http://localhost:3000 and roast some code! 🔥
```

---

## What Changed? (GitRoast 2.0)

### ✅ Now (Vercel Architecture)
- **One command**: `npm run dev`
- **One deployment**: Everything on Vercel
- **GitHub API**: Analyze ANY public repo
- **Serverless**: Auto-scaling, no backend management
- **Free**: 100% free to run and deploy

### ❌ Before (Split Architecture)
- Two commands: frontend + backend separately
- Two deployments: Vercel + Railway/Render
- Local only: Could only analyze repos on your machine
- Backend server: Manual scaling, port management
- $0-5/month: Backend hosting costs

---

## How It Works Now

```
User Input (GitHub URL)
    ↓
Frontend (Vite) → /api/roast
    ↓
Vercel Serverless Function (api/roast.js)
    ↓
GitHub API (via @octokit/rest)
    ↓
Roast Engine (api/roastEngine.js)
    ↓
JSON Response → Frontend displays results 🔥
```

**No Express server needed!** Everything runs through Vercel's serverless platform.

---

## Development Workflow

### Start Development
```bash
npm run dev
# Opens http://localhost:3000
# API routes automatically work at /api/*
```

### What's Running?
- **Vercel Dev**: Simulates Vercel's serverless environment locally
- **Frontend**: Vite dev server with hot reload
- **API Functions**: Automatically loaded from `/api/` folder
- **Environment**: Reads `.env` file automatically

### Test It
1. Enter: `facebook/react`
2. Click: "Roast My Code!"
3. Watch the magic happen ✨

---

## File Structure (What You Need to Know)

```
gitroast/
├── frontend/src/App.jsx          # React app (edit UI here)
├── api/roast.js                  # Main API endpoint
├── api/githubAnalyzer.js         # GitHub integration
├── api/roastEngine.js            # Roast generation logic
├── .env                          # Your GitHub token (create this!)
├── vercel.json                   # Deployment config
└── package.json                  # Scripts and dependencies
```

**Note**: The `/backend/` folder is legacy. You don't need it anymore unless you want to analyze local git repos!

---

## Environment Variables

Create `.env` in the root directory:

```env
# Optional but recommended
# Get yours at: https://github.com/settings/tokens
# No permissions needed for public repos!
GITHUB_TOKEN=ghp_your_token_here
```

### Why Add a Token?
- **Without token**: 60 API requests/hour (GitHub rate limit)
- **With token**: 5,000 API requests/hour
- **No special permissions needed** for public repositories

---

## Common Issues & Solutions

### Issue 1: "Repository path is required"
**Cause**: You're running the old backend instead of Vercel dev
**Solution**: Use `npm run dev` (not `npm run dev:legacy`)

### Issue 2: Port 3000 already in use
**Solution**:
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9
# Or use a different port
PORT=3001 npm run dev
```

### Issue 3: "Rate limit exceeded"
**Cause**: No GitHub token + too many requests
**Solution**: Add `GITHUB_TOKEN` to `.env` file

### Issue 4: Vercel CLI not found
**Solution**:
```bash
npm install -g vercel
```

---

## Available Scripts

| Command | What It Does |
|---------|--------------|
| `npm run dev` | **Start Vercel dev** (recommended) |
| `npm run dev:legacy` | Start old split architecture |
| `npm run install:all` | Install all dependencies |
| `npm run build` | Build for production |
| `npm start` | Same as `npm run dev` |

---

## Deployment (When Ready)

### Option 1: Vercel CLI
```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option 2: GitHub Integration
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Click "Deploy"
6. Done! 🎉

**Add your GitHub token in Vercel:**
1. Project Settings → Environment Variables
2. Add: `GITHUB_TOKEN` = `your_token`
3. Redeploy

---

## Testing the API Directly

### Using curl:
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test roast endpoint
curl -X POST http://localhost:3000/api/roast \
  -H "Content-Type: application/json" \
  -d '{"repoUrl": "facebook/react"}'
```

### Using browser DevTools:
```javascript
// Open console at http://localhost:3000
fetch('/api/roast', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ repoUrl: 'facebook/react' })
})
  .then(r => r.json())
  .then(console.log)
```

---

## Next Steps

1. ✅ Get it running locally
2. ✅ Test with different repos
3. ✅ Customize roasts in `api/roastEngine.js`
4. ✅ Deploy to Vercel
5. ✅ Share on social media
6. ✅ Go viral! 🚀

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **GitHub Token**: https://github.com/settings/tokens
- **Report Issues**: Open a GitHub issue

---

**You're now running GitRoast 2.0 - fully serverless, fully awesome! 🔥**
