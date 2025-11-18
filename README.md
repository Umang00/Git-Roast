# 🔥 GitRoast - Get Your Code Brutally Roasted by AI

<div align="center">

### **The viral web app that analyzes your git history and roasts your coding habits with zero mercy** 💀

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Powered by Node.js](https://img.shields.io/badge/Powered%20by-Node.js-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Styled%20with-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**Share your Developer Report Card and make both of us go VIRAL! 🚀**

</div>

---

## 🎯 What is GitRoast?

GitRoast is an **AI-powered web application** that:

- 🔍 **Analyzes your git repository** - Dives deep into your commit history
- 🔥 **Roasts your coding habits** - Brutally honest, hilariously accurate feedback
- 📊 **Generates a Developer Report Card** - Get graded from A+ to F
- 🏆 **Awards Dubious Achievements** - "Night Owl Coder", "Bug Factory", etc.
- 📱 **Creates Shareable Results** - Perfect for Twitter, LinkedIn, Reddit

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
- Git installed
- A git repository to analyze (the dirtier the better 😈)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd gitroast

# Install dependencies for all packages
npm run install:all

# Start the development servers (frontend + backend)
npm run dev
```

The app will open at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

### Quick Test

1. Open http://localhost:3000
2. Enter a repository path (try `.` for the current directory)
3. Click "Roast My Code!" 🔥
4. Get absolutely destroyed by your own commit history
5. Share your grade and go viral!

---

## 📁 Project Structure

```
gitroast/
├── frontend/                # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── App.jsx         # Main application component
│   │   ├── App.css         # Additional styles
│   │   ├── index.css       # TailwindCSS imports
│   │   └── main.jsx        # React entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/                 # Node.js + Express API
│   ├── server.js           # Express server
│   ├── gitAnalyzer.js      # Git repository analysis
│   ├── roastEngine.js      # AI roasting engine 🔥
│   └── package.json
│
├── package.json            # Root package with scripts
└── README.md              # You are here!
```

---

## 🎮 How to Use

### Analyze a Repository

**Option 1: Local Repository**
```bash
# In the app, enter:
/path/to/your/repository

# Or use current directory:
.
```

**Option 2: Any Git Repo on Your Machine**
```bash
# Enter the full path:
/home/user/projects/my-awesome-project
```

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

Edit `backend/roastEngine.js` to add custom roasting logic:

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
Analyze a git repository and get roasted

**Request:**
```json
{
  "repoPath": "/path/to/repo"
}
```

**Response:**
```json
{
  "grade": "B",
  "gradeDescription": "Not bad, not great...",
  "stats": {
    "totalCommits": 500,
    "lateNightCommits": 150,
    "avgCommitSize": 42
  },
  "roasts": [...],
  "achievements": [...],
  "suggestions": [...]
}
```

### `GET /api/health`
Check if the API is running

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

### Backend (Heroku/Railway/Render)
```bash
cd backend
# Deploy with your preferred platform
```

Don't forget to update the API URL in `frontend/vite.config.js`!

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
