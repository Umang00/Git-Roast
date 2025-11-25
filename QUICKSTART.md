# 🚀 GitRoast Quick Start Guide (AI-Powered Edition)

## TL;DR - Get Running in 2 Minutes

```bash
# 1. Install dependencies
npm run install:all

# 2. (RECOMMENDED) Add Gemini API key for AI-powered roasts
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env

# 3. (Optional) Add GitHub token for higher rate limits
echo "GITHUB_TOKEN=your_github_token_here" >> .env

# 4. Run everything
npm run dev

# 5. Open http://localhost:3000 and get BRUTALLY roasted! 🔥
```

**Get FREE Gemini API Key:** https://aistudio.google.com/app/apikey

---

## What's New? (GitRoast 3.0)

### 🤖 Now (AI-Powered + Vercel Architecture)
- **AI-Powered Roasts**: Google Gemini generates dynamic, savage roasts
- **Streaming Responses**: Watch roasts being generated in real-time
- **Social Sharing**: Twitter, LinkedIn, clipboard - one click
- **Profile Analysis**: Roast entire GitHub profiles
- **One command**: `npm run dev`
- **One deployment**: Everything on Vercel
- **GitHub API**: Analyze ANY public repo or profile
- **Serverless**: Auto-scaling, no backend management
- **Free**: Gemini + Vercel free tiers

### ❌ Before (GitRoast 3.0 - Template-Based)
- Template roasts only (generic)
- No streaming
- Basic share button
- Single repo only
- Still needed Vercel + serverless
- $0/month

---

## How It Works Now

```
User Input (GitHub URL or username)
    ↓
Frontend (Vite) → /api/roast-stream (SSE) or /api/roast (fallback)
    ↓
Vercel Serverless Function
    ↓
GitHub API (via @octokit/rest) → Analyze commits, README, metadata
    ↓
Google Gemini AI → Generate brutal, personalized roasts
    ↓     ↓ (fallback if AI fails)
    ↓     Template Roasts (api/roastEngine.js)
    ↓
Streaming Response → Frontend displays AI roasts in real-time 🔥
```

**No Express server needed!** Everything runs through Vercel's serverless platform + Google Gemini AI.

---

## Development Workflow

### Start Development
```bash
npm run dev
# Runs vercel dev
# Opens http://localhost:3000
# API routes automatically work at /api/*
```

### What's Running?
- **Vercel Dev**: Full stack - Simulates Vercel's serverless environment locally
- **Frontend**: Vite dev server with hot reload
- **API Functions**: Automatically loaded from `/api/` folder with retry logic
- **Environment**: Reads `.env` file automatically
- **LLM**: Google Gemini AI (gemini-2.5-flash) with configurable parameters

### Test It
1. Enter: `facebook/react`
2. Click: "Roast My Code!"
3. Watch the magic happen ✨

---

## File Structure (What You Need to Know)

```
gitroast/
├── frontend/src/App.jsx          # React app (edit UI here)
├── api/roast.js                  # Main API endpoint (AI + fallback)
├── api/roast-stream.js           # Streaming API with SSE
├── api/aiRoastGenerator.js       # Gemini AI integration
├── api/retryUtils.js             # Retry logic with bottleneck
├── api/githubAnalyzer.js         # GitHub integration
├── api/roastEngine.js            # Template roasts (fallback)
├── .env                          # API keys (create this!)
├── vercel.json                   # Deployment config
└── package.json                  # Scripts and dependencies (type: module)
```

---

## Environment Variables

Create `.env` in the root directory:

```env
# RECOMMENDED - Get FREE key at: https://aistudio.google.com/app/apikey
# Enables AI-powered roasts (falls back to templates without it)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional but recommended for higher rate limits
# Get yours at: https://github.com/settings/tokens
# No permissions needed for public repos!
GITHUB_TOKEN=ghp_your_token_here
```

### Why Add Gemini API Key?
- **Without key**: Uses template-based roasts (still funny!)
- **With key**: AI-generated, personalized, SAVAGE roasts
- **FREE**: Google provides generous free tier
- **Better**: References specific stats and patterns

### Why Add GitHub Token?
- **Without token**: 60 API requests/hour (GitHub rate limit)
- **With token**: 5,000 API requests/hour
- **No special permissions needed** for public repositories

---

## Common Issues & Solutions

### Issue 1: "Repository path is required"
**Cause**: Using frontend-only mode
**Solution**: Use `npm run dev` (vercel dev) instead of `npm run dev:frontend`

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
| `npm run dev` | **Start Vercel dev** (full stack - recommended) |
| `npm run dev:frontend` | Start frontend only (Vite) |
| `npm run install:all` | Install all dependencies |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
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

**You're now running GitRoast 3.0 - AI-powered, streaming, and SAVAGE! 🔥**
