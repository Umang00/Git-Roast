# 🔥 GitRoast - Get Your Code Brutally Roasted by AI

<div align="center">

### **The viral web app that analyzes ANY GitHub repository and roasts coding habits with zero mercy** 💀

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![TailwindCSS](https://img.shields.io/badge/Styled%20with-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![GitHub API](https://img.shields.io/badge/GitHub-API-181717?style=for-the-badge&logo=github)](https://docs.github.com/en/rest)

**Analyze ANY public GitHub repo. Share your results. Go VIRAL! 🚀**

</div>

---

## 🆕 What's New in GitRoast 2.0

### ⚡ **Now 100% Vercel-Compatible!**

- ✨ **Analyze ANY GitHub Repository** - Just paste a GitHub URL!
- 🚀 **One-Click Deployment** - Deploy everything to Vercel in 5 minutes
- ⚡ **Serverless Functions** - No separate backend needed
- 🌍 **Roast Famous Repos** - Try `torvalds/linux`, `facebook/react`, `microsoft/vscode`
- 📈 **Higher Viral Potential** - Users can roast ANY public repository!

**Deploy Now:** [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - One-click setup guide!

---

## 🎯 What is GitRoast?

GitRoast is an **AI-powered web application** that:

- 🔍 **Analyzes ANY GitHub Repository** - Paste a URL or use `owner/repo` format
- 🔥 **Roasts Coding Habits** - Brutally honest, hilariously accurate feedback
- 📊 **Generates a Developer Report Card** - Get graded from A+ to F
- 🏆 **Awards Dubious Achievements** - "Night Owl Coder", "Bug Factory", etc.
- 📱 **Creates Shareable Results** - Perfect for Twitter, LinkedIn, Reddit
- 🌍 **Roast Famous Projects** - Try Linux, React, TensorFlow, or any public repo!

### Why GitRoast Will Go Viral:

✅ **Personal & Shareable** - Like Spotify Wrapped, but for your code sins
✅ **Hilarious Content** - Developers love self-deprecating humor
✅ **Beautiful UI** - Neon gradients, smooth animations, screenshot-worthy
✅ **Actually Useful** - Real insights hidden in the roasts
✅ **Social Media Ready** - Built-in sharing features

---

## 🎬 Features

### 🎨 Stunning Modern UI
- Gorgeous gradient animations and neon effects
- Smooth transitions with Framer Motion
- Confetti celebration on results
- Dark theme with cyberpunk aesthetics
- Fully responsive design

### 📈 Deep Git Analysis
- Total commits and contribution patterns
- Late-night coding detection (11 PM - 5 AM)
- Weekend warrior identification
- Commit message quality analysis
- Code change patterns
- Activity heatmaps by hour/day

### 🔥 Multi-Category Roasting
- **Night Owl Developer** - For those 3 AM commits
- **Weekend Warrior** - Working when you should be living
- **Bug Manufacturing Facility** - Too many "fix" commits
- **Commit Message Poet (NOT)** - "wip", "fix", "f"
- **The Eternal WIP** - Never finishing anything
- **Solo Dev Island** - One-person projects
- ...and many more!

### 🏆 Achievement System
Earn dubious achievements like:
- 🦉 **Vampire Coder** - X late night commits
- ⛓️ **Keyboard Prisoner** - X weekend commits
- 🏭 **Professional Bug Creator** - X fix commits
- 🎯 **Commit Spammer** - 1000+ commits

### 📊 Developer Report Card
Get graded on your git habits:
- **A+** - Legendary (or you're cheating)
- **A** - Pretty solid developer
- **B** - Participation trophy vibes
- **C** - Mediocre with a capital M
- **D** - Yikes, do better
- **F** - Crime scene level code

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- GitHub account (for optional higher rate limits)
- Vercel CLI installed: `npm i -g vercel`

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd gitroast

# Install dependencies
npm run install:all

# Start the development server (Vercel-powered)
npm run dev
```

The app will automatically open at **http://localhost:3000** with serverless API functions running seamlessly!

### Optional: GitHub Token for Higher Rate Limits

```bash
# Create .env file in root directory
echo "GITHUB_TOKEN=your_github_token_here" > .env

# Get a token at: https://github.com/settings/tokens
# No special permissions needed for public repos
# Increases rate limit from 60 to 5000 requests/hour
```

### Quick Test

1. Run `npm run dev` and open http://localhost:3000
2. Enter a GitHub repository URL:
   - Try: `facebook/react`
   - Or: `https://github.com/torvalds/linux`
   - Or: `microsoft/vscode`
   - Or just: `torvalds/linux` (shorthand works!)
3. Click "Roast My Code!" 🔥
4. Watch as the AI destroys coding habits
5. Share the results and go viral!

**Popular Repos to Roast:**
- `torvalds/linux` - The Linux kernel
- `facebook/react` - React library
- `tensorflow/tensorflow` - Google's ML framework
- `microsoft/vscode` - VS Code editor
- `YOUR-USERNAME/YOUR-REPO` - Your own projects!

### Legacy Mode (Separate Frontend/Backend)

If you need to run the old split architecture:

```bash
npm run dev:legacy
```

This runs frontend on :3000 and backend on :3001 separately.

---

## 📁 Project Structure

```
gitroast/
├── frontend/                   # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── App.jsx            # Main application component
│   │   ├── App.css            # Additional styles
│   │   ├── index.css          # TailwindCSS imports
│   │   └── main.jsx           # React entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── api/                        # Vercel Serverless Functions ⚡ (ACTIVE)
│   ├── roast.js               # Main roast API endpoint
│   ├── health.js              # Health check endpoint
│   ├── githubAnalyzer.js      # GitHub API integration
│   └── roastEngine.js         # AI roasting engine 🔥
│
├── backend/                    # Legacy Express backend (optional)
│   └── ...                    # Only needed for local git analysis
│
├── .env                        # Environment variables (create this!)
├── VERCEL_DEPLOYMENT.md       # One-click Vercel deployment guide
├── DEPLOYMENT.md              # Multi-platform deployment guide
├── vercel.json                # Vercel configuration
├── package.json               # Root package with scripts
└── README.md                  # You are here!
```

---

## 🎮 How to Use

### Analyze a Repository

**GitHub Repositories (Recommended):**
```bash
# Any of these formats work:
https://github.com/facebook/react
facebook/react
git@github.com:facebook/react.git
```

**Optional GitHub Token:**
- Without token: 60 requests/hour
- With token: 5,000 requests/hour
- Add to `.env`: `GITHUB_TOKEN=your_token_here`
- Get token at: https://github.com/settings/tokens (no permissions needed for public repos)

### Share Your Results

1. Get your roast and grade
2. Click "Share Your Grade"
3. Post on Twitter with #GitRoast
4. Watch the engagement roll in! 🚀

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Confetti** - Celebration effects
- **Lucide React** - Beautiful icons
- **Axios** - HTTP requests

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **simple-git** - Git operations
- **CORS** - Cross-origin support

---

## 🎨 Customization

### Add Your Own Roasts

Edit `api/roastEngine.js` to add custom roasting logic:

```javascript
if (stats.yourCustomPattern) {
  roasts.push({
    emoji: '🎯',
    title: 'Your Custom Roast',
    content: 'Your hilarious roast message here!',
    severity: 4
  });
}
```

### Customize the UI Theme

Edit `frontend/tailwind.config.js` to change colors:

```javascript
colors: {
  'neon-pink': '#ff006e',      // Your custom color
  'neon-blue': '#00f5ff',      // Your custom color
  'neon-purple': '#8b5cf6',    // Your custom color
}
```

---

## 📊 API Endpoints

### `POST /api/roast`
Analyze a GitHub repository and get roasted

**Request:**
```json
{
  "repoUrl": "facebook/react",
  "githubToken": "optional_token_for_higher_rate_limits"
}
```

**Response:**
```json
{
  "grade": "A",
  "gradeDescription": "Pretty solid developer",
  "stats": {
    "totalCommits": 15234,
    "lateNightCommits": 3421,
    "lateNightPercentage": 22,
    "avgCommitSize": 87,
    "authorCount": 1234
  },
  "roasts": [...],
  "achievements": [...],
  "suggestions": [...],
  "repository": {
    "owner": "facebook",
    "repo": "react",
    "fullName": "facebook/react"
  }
}
```

### `GET /api/health`
Check if the API is running

---

## 🚀 Deployment

### ⚡ Vercel One-Click Deploy (Easiest - NEW! 🎉)

**Deploy everything (frontend + backend) to Vercel in ONE CLICK!**

1. Click the button below
2. Connect your GitHub account
3. Deploy (takes ~3 minutes)
4. You're LIVE! 🚀

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR-USERNAME/gitroast)

**Features:**
- ✅ No separate backend hosting needed
- ✅ Serverless functions auto-configured
- ✅ 100% free with generous limits
- ✅ Auto-deploy on git push
- ✅ Global CDN included

**Total time:** ~5 minutes | **Cost:** $0/month

👉 **Full guide:** [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Complete Vercel setup instructions!

---

### 🔧 Alternative: Split Deployment (Vercel + Railway)

For local repository analysis (legacy):

**Frontend on Vercel**
1. Connect your GitHub repo to Vercel
2. Auto-detects Vite configuration
3. Deploy! 🚀

**Backend on Railway**
1. Connect repo, set root: `backend`
2. Auto-deploys with `npm start`
3. Update Vercel's `VITE_API_URL`

**Total time:** ~15 minutes | **Cost:** $0-5/month

👉 **Full guide:** [DEPLOYMENT.md](./DEPLOYMENT.md) - Multi-platform deployment options

---

## 🎯 Going Viral - Marketing Tips

1. **Create a Demo Video** - Show the roasting in action
2. **Share on Twitter** - Use hashtags #GitRoast #DevHumor #CodingLife
3. **Post on Reddit** - r/ProgrammerHumor, r/webdev, r/javascript
4. **LinkedIn** - Developers love sharing their grades
5. **Dev.to Article** - Write about building it
6. **Product Hunt** - Launch and get feedback
7. **Hacker News** - Show HN: GitRoast

### Sample Social Media Post
```
I just got ROASTED by GitRoast 🔥

My Developer Grade: C (ouch)

Apparently I'm a "Night Owl Developer" with "Bug Factory" tendencies 😂

42% of my commits are after 11 PM and I have 156 commits with just "fix" 💀

Try it yourself at [your-url]

#GitRoast #DevHumor #100DaysOfCode
```

---

## 🤝 Contributing

Want to make GitRoast even better?

1. Fork the repository
2. Create a feature branch
3. Add your roasts/features
4. Submit a PR
5. Get credited when this goes viral! 🚀

---

## 📝 License

MIT License - Feel free to use, modify, and share!

---

## 🌟 Star This Repo!

If GitRoast roasted you good, give it a ⭐ star!

**Made with 🔥 by an AI that loves roasting code**

*Remember: The roasts are all in good fun. Your code is probably fine. Probably.* 😉

---

## 📸 Screenshots

> *Add your screenshots here after running the app!*

---

## 🎉 Sample Roasts

**The Night Owl Developer**
"67% of your commits happen between 11 PM and 5 AM. Ever heard of sleep? Your code probably hasn't either."

**Bug Manufacturing Facility**
"234 commits contain the word 'fix'. You're not developing features, you're playing whack-a-mole with bugs."

**The Message Minimalist**
"Your shortest commit message was 'f'. Stunning. Brave. Completely useless."

---

<div align="center">

### Ready to Get Roasted? 🔥

**[Try GitRoast Now](#) | [Star on GitHub](#) | [Share Your Grade](#)**

*Your git history is waiting to roast you.*

</div>
