# 👤 GitRoast - User Flow & Journey

## Table of Contents
- [User Journey Overview](#user-journey-overview)
- [Primary User Flow](#primary-user-flow)
- [Repository Analysis Flow](#repository-analysis-flow)
- [Profile Analysis Flow](#profile-analysis-flow)
- [Social Sharing Flow](#social-sharing-flow)
- [PDF Export Flow](#pdf-export-flow)
- [Error Handling Flow](#error-handling-flow)
- [User Personas](#user-personas)

---

## User Journey Overview

GitRoast provides a simple, engaging user experience centered around discovering insights about coding habits through humorous roasts.

### Core Journey Stages
```
1. Discovery
   └─> User finds GitRoast (social media, search, referral)

2. Landing
   └─> User sees homepage with prominent input field

3. Input
   └─> User enters GitHub repository URL or username

4. Processing
   └─> Watch real-time AI roast generation

5. Results
   └─> View grade, roasts, achievements, suggestions

6. Sharing
   └─> Share results on social media or download PDF

7. Viral Loop
   └─> Others see the share and try GitRoast
```

---

## Primary User Flow

### Happy Path (Repository Analysis)

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: LANDING PAGE                                            │
│                                                                 │
│  ┌──────────────────────────────────────────────┐              │
│  │  🔥 GitRoast                                 │              │
│  │  Get Your Code Brutally Roasted by AI       │              │
│  │                                              │              │
│  │  [GitHub Repository URL Input Field____]    │              │
│  │                                              │              │
│  │  💡 facebook/react, Umang00, or full URL    │              │
│  │                                              │              │
│  │  [🔥 Roast My Code!]                        │              │
│  └──────────────────────────────────────────────┘              │
│                                                                 │
│  User Actions:                                                  │
│  - Reads headline                                               │
│  - Sees examples (facebook/react, torvalds/linux)               │
│  - Enters repository URL                                        │
│  - Clicks "Roast My Code!" button                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: LOADING & STREAMING                                     │
│                                                                 │
│  ┌──────────────────────────────────────────────┐              │
│  │  ⚡ AI is Roasting Your Code...              │              │
│  │                                              │              │
│  │  You really thought 67% of commits           │              │
│  │  after 11 PM was healthy? Your             │              │
│  │  code probably has Stockholm                │              │
│  │  syndrome from all those late                │              │
│  │  night debugging sessions...▌                │              │
│  │                                              │              │
│  │  [Analyzing... 80%]                          │              │
│  └──────────────────────────────────────────────┘              │
│                                                                 │
│  User Experience:                                               │
│  - Button disabled (shows loading spinner)                      │
│  - Sees streaming text appear word-by-word                      │
│  - Animated cursor shows AI is "typing"                         │
│  - Progress indication                                          │
│  - Can see the roast building in real-time                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: RESULTS DISPLAY (with confetti 🎉)                      │
│                                                                 │
│  ┌──────────────────────────────────────────────┐              │
│  │  🏆 Your Developer Grade                     │              │
│  │                                              │              │
│  │           B  👍                              │              │
│  │                                              │              │
│  │  "Participation trophy vibes. You code,      │              │
│  │   but at what cost?"                         │              │
│  │                                              │              │
│  │  [Twitter] [LinkedIn] [Copy] [Download PDF]  │              │
│  └──────────────────────────────────────────────┘              │
│                                                                 │
│  ┌──────────────────────────────────────────────┐              │
│  │  📊 Statistics                               │              │
│  │  Total Commits: 342    Late Night: 89 (26%)  │              │
│  └──────────────────────────────────────────────┘              │
│                                                                 │
│  ┌──────────────────────────────────────────────┐              │
│  │  🔥 The Roasts                               │              │
│  │                                              │              │
│  │  🦉 Night Owl Developer [🔥🔥🔥○○]          │              │
│  │  26% of commits after 11 PM. Ever heard      │              │
│  │  of sleep? Your code probably hasn't...      │              │
│  │                                              │              │
│  │  🏭 Bug Manufacturing Plant [🔥🔥🔥🔥○]      │              │
│  │  67 commits contain "fix". You're not        │              │
│  │  developing features, you're playing         │              │
│  │  whack-a-mole with bugs.                     │              │
│  └──────────────────────────────────────────────┘              │
│                                                                 │
│  ┌──────────────────────────────────────────────┐              │
│  │  🏆 Dubious Achievements                     │              │
│  │  🦇 Vampire Coder - 89 late night commits    │              │
│  │  🏭 Bug Creator - 67 fix commits              │              │
│  └──────────────────────────────────────────────┘              │
│                                                                 │
│  ┌──────────────────────────────────────────────┐              │
│  │  ⚡ Suggestions for Improvement              │              │
│  │  • Try committing during daylight hours      │              │
│  │  • Write better commit messages              │              │
│  │  • Consider code review before pushing       │              │
│  └──────────────────────────────────────────────┘              │
│                                                                 │
│  User Actions:                                                  │
│  - Scrolls through results                                      │
│  - Laughs at roasts                                            │
│  - Takes screenshot                                            │
│  - Decides to share                                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: SHARING (Viral Loop)                                    │
│                                                                 │
│  User clicks one of:                                            │
│  - [Twitter]: Opens Twitter with pre-filled tweet               │
│  - [LinkedIn]: Copies text, opens LinkedIn                      │
│  - [Copy]: Copies to clipboard                                  │
│  - [Download PDF]: Generates and downloads PDF                  │
│                                                                 │
│  Share Message Example:                                         │
│  "🔥 Holy shit, I just got DESTROYED by AI!                     │
│                                                                 │
│   @MyUsername - Grade: B                                        │
│   Roast: '26% of commits after 11 PM. Ever heard of            │
│   sleep?...'                                                    │
│                                                                 │
│   I can't believe this is real 💀                              │
│                                                                 │
│   Get roasted: https://gitroast.app                            │
│   #GitRoast"                                                    │
│                                                                 │
│  Result:                                                        │
│  - Share posted to social media                                │
│  - Friends/followers see it                                    │
│  - They click link → New users discover GitRoast               │
│  - Viral loop continues                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Repository Analysis Flow

### Detailed Flow Diagram

```
USER INPUT: "facebook/react"
        ↓
┌────────────────────────┐
│ Frontend Validation    │
│ - Check if empty       │
│ - Parse URL format     │
│ - Extract owner/repo   │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ API Request (SSE)      │
│ POST /api/roast-stream │
│ {                      │
│   "repoUrl": "..."     │
│ }                      │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ GitHub API: Fetch Repo │
│ GET /repos/owner/repo  │
│                        │
│ Returns:               │
│ - Name, description    │
│ - Stars, forks         │
│ - Language             │
│ - Creation date        │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ GitHub API: Fetch      │
│ Commits (Paginated)    │
│                        │
│ Page 1: 100 commits    │
│ Page 2: 100 commits    │
│ Page 3: 100 commits    │
│ Page 4: 100 commits    │
│ Page 5: 100 commits    │
│                        │
│ Max 500 commits total  │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Statistical Analysis   │
│                        │
│ For each commit:       │
│ - Extract timestamp    │
│ - Parse commit message │
│ - Count file changes   │
│ - Identify author      │
│                        │
│ Calculate:             │
│ - Total commits        │
│ - Late night % (UTC)   │
│ - Weekend commits      │
│ - Fix commit count     │
│ - Unique authors       │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ AI Roast Generation    │
│ (Google Gemini)        │
│                        │
│ Build prompt with:     │
│ - Repo metadata        │
│ - Statistics           │
│ - Commit patterns      │
│                        │
│ Stream response:       │
│ "You" → " really" →    │
│ " thought" → ...       │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Grade Calculation      │
│                        │
│ Score = 100            │
│ - Late night penalty   │
│ - Weekend penalty      │
│ - Bug fix penalty      │
│ - Message quality      │
│ + Collaboration bonus  │
│                        │
│ Result: A+, A, B, C... │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Achievement Generation │
│                        │
│ Check thresholds:      │
│ - 100+ late commits?   │
│   → Vampire Coder 🦇   │
│ - 50+ weekend commits? │
│   → Keyboard Prisoner  │
│ - 1000+ commits?       │
│   → Commit Spammer 🎯  │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Frontend Display       │
│                        │
│ 1. Show confetti 🎉    │
│ 2. Animate grade       │
│ 3. Reveal roasts       │
│ 4. Show achievements   │
│ 5. Display suggestions │
│ 6. Enable sharing      │
└────────────────────────┘
```

### User Interactions During Analysis

**Timeline:**
```
T+0s:   User clicks "Roast My Code!"
        └─> Button shows loading spinner
        └─> Disable input field

T+1s:   GitHub API starts fetching data
        └─> No visible change yet

T+2s:   First SSE event: statistics
        └─> Still no visible change (stats cached)

T+3s:   AI starts generating roast
        └─> First words appear: "You really..."
        └─> Cursor blinks after text

T+5s:   AI continues streaming
        └─> Text grows: "You really thought 67% of..."
        └─> User can read roast as it generates

T+8s:   AI completes generation
        └─> Streaming stops
        └─> Loading ends

T+9s:   Results render with animations
        └─> Confetti explodes 🎉
        └─> Grade badge animates in
        └─> Roast cards fade in one by one

T+10s:  All results visible
        └─> User can scroll, share, download
```

---

## Profile Analysis Flow

### Triggered by Username Input

```
USER INPUT: "Umang00" (no slash)
        ↓
┌────────────────────────┐
│ Detect Profile Mode    │
│ No "/" in input        │
│ → analysisType='profile'│
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Fetch User Profile     │
│ GET /users/Umang00     │
│                        │
│ Returns:               │
│ - Username             │
│ - Bio, avatar          │
│ - Public repos count   │
│ - Followers/following  │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Fetch All Repos        │
│ GET /users/.../repos   │
│ ?sort=pushed           │
│ &per_page=100          │
│                        │
│ Returns list of repos  │
│ sorted by last push    │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Filter & Select Top 5  │
│                        │
│ Filter out:            │
│ - Forks (optional)     │
│ - Empty repos          │
│                        │
│ Select:                │
│ - 5 most active repos  │
│ - Based on push date   │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Multi-Repo Analysis    │
│                        │
│ For each of 5 repos:   │
│ ┌────────────────────┐ │
│ │ Fetch commits      │ │
│ │ (up to 500 each)   │ │
│ │                    │ │
│ │ Analyze patterns   │ │
│ │                    │ │
│ │ Aggregate stats    │ │
│ └────────────────────┘ │
│                        │
│ Total stats across all │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Profile-Specific UI    │
│                        │
│ Shows:                 │
│ - Username             │
│ - Total repos vs       │
│   analyzed repos       │
│ - Followers/following  │
│ - Top 5 repo names     │
│   with commit counts   │
│                        │
│ Then same roasts,      │
│ achievements as repo   │
└────────────────────────┘
```

### Profile UI Differences

**Additional Section:**
```
┌──────────────────────────────────────┐
│ 👤 Profile Analysis: @Umang00       │
│ Analyzed 5 of 42 repositories        │
│                                      │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│ │  42  │ │ 123  │ │  45  │ │ 1,234││
│ │Repos │ │Follw │ │Follw │ │Commit││
│ └──────┘ └──────┘ └──────┘ └──────┘│
│                                      │
│ Most Active Repositories:            │
│ • GitRoast (234 commits)             │
│ • Portfolio (156 commits)            │
│ • Blog (98 commits)                  │
│ • Utils (67 commits)                 │
│ • Scripts (45 commits)               │
└──────────────────────────────────────┘
```

---

## Social Sharing Flow

### Twitter Sharing

```
User clicks [Twitter] button
        ↓
┌────────────────────────┐
│ Generate Viral Message │
│                        │
│ 1. Find savage roast   │
│    (highest severity)  │
│                        │
│ 2. Build template:     │
│    "🔥 I got DESTROYED"│
│    "Grade: {grade}"    │
│    "Roast: {snippet}"  │
│    "Get roasted: {url}"│
│                        │
│ 3. Enforce 280 char    │
│    limit (truncate)    │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Open Twitter Intent    │
│                        │
│ URL:                   │
│ twitter.com/intent/    │
│ tweet?text={encoded}   │
│                        │
│ Opens in new tab       │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ User on Twitter        │
│                        │
│ Pre-filled tweet with: │
│ - Grade                │
│ - Savage roast         │
│ - Link to GitRoast     │
│ - #GitRoast hashtag    │
│                        │
│ User can:              │
│ - Edit text            │
│ - Add screenshot       │
│ - Post immediately     │
└────────────────────────┘
```

### LinkedIn Sharing

```
User clicks [LinkedIn] button
        ↓
┌────────────────────────┐
│ Generate Message       │
│ (Same as Twitter)      │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Copy to Clipboard      │
│                        │
│ navigator.clipboard    │
│ .writeText(message)    │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Show Success Toast     │
│                        │
│ "✅ Text copied!       │
│  Paste into LinkedIn"  │
│                        │
│ (Auto-dismiss: 3s)     │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Open LinkedIn          │
│                        │
│ linkedin.com/feed/     │
│                        │
│ Opens in new tab       │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ User on LinkedIn       │
│                        │
│ 1. Click "Start a post"│
│ 2. Paste text (Ctrl+V) │
│ 3. Optionally add      │
│    screenshot          │
│ 4. Post                │
└────────────────────────┘
```

### Copy to Clipboard

```
User clicks [Copy] button
        ↓
┌────────────────────────┐
│ Generate Message       │
│ (Same format)          │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Try Modern API         │
│                        │
│ navigator.clipboard    │
│ .writeText()           │
└───────────┬────────────┘
            │
            ├──Success──┐
            │           ↓
            │   ┌────────────────┐
            │   │ Show Checkmark │
            │   │ [✓ Copied!]    │
            │   │ (2s timeout)   │
            │   └────────────────┘
            │
            └──Failed──┐
                       ↓
            ┌────────────────────┐
            │ Fallback Method    │
            │                    │
            │ 1. Create textarea │
            │ 2. Set value       │
            │ 3. Select all      │
            │ 4. execCommand()   │
            │ 5. Remove textarea │
            └────────┬───────────┘
                     ↓
            ┌────────────────────┐
            │ Show Success or    │
            │ Error Message      │
            └────────────────────┘
```

---

## PDF Export Flow

### Download PDF Journey

```
User clicks [Download PDF] button
        ↓
┌────────────────────────┐
│ Button State Change    │
│                        │
│ [Downloading PDF...]   │
│ Button disabled        │
│ Spinner appears        │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Frontend: POST Request │
│ /api/generate-pdf      │
│                        │
│ Send entire roastData  │
│ - grade, roasts, stats │
│ - achievements, etc.   │
│                        │
│ responseType: 'blob'   │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Backend: PDF Generation│
│ (Server-side)          │
│                        │
│ 1. Validate input      │
│ 2. Strip markdown from │
│    all text fields     │
│ 3. Create React PDF    │
│    components          │
│ 4. Render to PDF bytes │
│ 5. Return binary data  │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Frontend: Receive Blob │
│                        │
│ 1. Create Blob URL     │
│ 2. Create <a> element  │
│ 3. Set href to blob    │
│ 4. Set download attr   │
│    "GitRoast-{repo}.pdf│
│ 5. Trigger click()     │
│ 6. Clean up blob URL   │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Browser: Download      │
│                        │
│ File downloads to      │
│ user's Downloads folder│
│                        │
│ Filename:              │
│ "GitRoast-facebook-    │
│  react.pdf"            │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Reset Button State     │
│                        │
│ [Download PDF] ✓       │
│ Button enabled again   │
│ Spinner removed        │
└────────────────────────┘
```

### PDF Error Handling

```
If PDF generation fails:
        ↓
┌────────────────────────┐
│ Show Error Toast       │
│                        │
│ "❌ Failed to generate │
│  PDF. Please try again"│
│                        │
│ (Auto-dismiss: 5s)     │
│ (Red background)       │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Reset Button           │
│ User can retry         │
└────────────────────────┘
```

---

## Error Handling Flow

### Network Error

```
User enters invalid repo
        ↓
┌────────────────────────┐
│ API Request            │
│ POST /api/roast-stream │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ GitHub API: 404        │
│ Repository not found   │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Error Response         │
│ data: {"type":"error", │
│  "error":"Repo not     │
│   found"}              │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Frontend: Display Error│
│                        │
│ ┌────────────────────┐ │
│ │ ⚠️ Error:          │ │
│ │ Failed to analyze. │ │
│ │ Make sure the      │ │
│ │ username/repo is   │ │
│ │ correct!           │ │
│ └────────────────────┘ │
│                        │
│ (Red background)       │
│ (Error icon)           │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ User Can:              │
│ - Fix input            │
│ - Try again            │
│ - Try different repo   │
└────────────────────────┘
```

### AI Failure → Template Fallback

```
Streaming fails
        ↓
┌────────────────────────┐
│ Try Regular Endpoint   │
│ POST /api/roast        │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ AI Generation Fails    │
│ (Timeout / API Error)  │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Automatic Fallback     │
│ Use Template Roasting  │
│                        │
│ - Same grade system    │
│ - Pre-written roasts   │
│ - Based on statistics  │
│                        │
│ (No streaming, instant)│
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Display Results        │
│ (User doesn't notice   │
│  AI failure)           │
└────────────────────────┘
```

### Rate Limit Handling

```
Too many requests
        ↓
┌────────────────────────┐
│ GitHub API: 429        │
│ Rate limit exceeded    │
└───────────┬────────────┘
            ↓
┌────────────────────────┐
│ Retry Logic            │
│ (Exponential Backoff)  │
│                        │
│ Wait: 2s → 4s → 8s     │
│ Max retries: 3         │
└───────────┬────────────┘
            │
            ├─Success─→ Continue
            │
            └─Failed──┐
                      ↓
            ┌────────────────────┐
            │ Error Message:     │
            │ "Rate limit hit.   │
            │  Try again later   │
            │  or add GitHub     │
            │  token for higher  │
            │  limits."          │
            └────────────────────┘
```

---

## User Personas

### Persona 1: The Curious Developer

**Name:** Alex, Software Engineer
**Age:** 26
**Goal:** Have fun, share with friends

**Journey:**
1. Sees GitRoast post on Twitter
2. Clicks link out of curiosity
3. Enters own GitHub username
4. Laughs at roasts
5. Screenshots and shares on social media
6. Friends try it → viral loop

**Pain Points:**
- Wants instant results
- May have slow internet
- Needs mobile-friendly UI

**How GitRoast Helps:**
- Streaming shows progress
- Mobile-responsive design
- Quick sharing buttons

---

### Persona 2: The Content Creator

**Name:** Sarah, Tech Blogger/YouTuber
**Age:** 30
**Goal:** Create engaging content

**Journey:**
1. Looking for interesting dev tools
2. Discovers GitRoast
3. Analyzes multiple famous repos (Linux, React, etc.)
4. Creates video/blog post about results
5. Downloads PDFs for comparison
6. Shares with large audience

**Pain Points:**
- Needs professional exports
- Wants to analyze multiple repos
- Requires consistent formatting

**How GitRoast Helps:**
- PDF export feature
- Professional-looking results
- Easy to screenshot/share

---

### Persona 3: The Team Lead

**Name:** Marcus, Engineering Manager
**Age:** 35
**Goal:** Team retrospective, lighthearted discussion

**Journey:**
1. Hears about GitRoast from team
2. Analyzes team's main repository
3. Uses results for fun team discussion
4. Identifies real patterns (too many late-night commits)
5. Implements better work-life balance

**Pain Points:**
- Needs meaningful insights
- Can't be just for fun
- Must respect team members

**How GitRoast Helps:**
- Real statistics behind roasts
- Constructive suggestions section
- Lighthearted but honest feedback

---

## Conversion Funnel

```
1000 Landing Page Visitors
    │
    ├─> 700 (70%) Read headline
    │
    ├─> 500 (50%) Enter repository URL
    │
    ├─> 400 (40%) Click "Roast My Code!"
    │
    ├─> 350 (35%) See complete results
    │
    ├─> 150 (15%) Share on social media
    │
    └─> 50 (5%) Download PDF

Key Metrics:
- Bounce rate: 30%
- Completion rate: 35%
- Share rate: 15% of completions
- Viral coefficient: ~1.5 (each share brings 1.5 new users)
```

---

## Mobile vs Desktop Flow

### Mobile Considerations

**Input:**
- Larger touch targets (48px min)
- Auto-capitalize disabled for URLs
- Autocomplete enabled

**Loading:**
- Fixed position for loading indicator
- Prevent scrolling during load

**Results:**
- Single column layout
- Larger fonts for readability
- Sticky share buttons

**Sharing:**
- Native share API on mobile
- Direct app integrations (Twitter/LinkedIn apps)

### Desktop Advantages

**Input:**
- Keyboard shortcuts (Enter to submit)
- Paste detection

**Results:**
- Two-column grid for stats/roasts
- Hover effects on cards
- Right-click to copy text

---

## Accessibility Flow

### Keyboard Navigation

```
Tab Order:
1. Input field
2. Analyze button
3. Share buttons (when results shown)
4. Roast cards (focusable)
5. PDF download button
```

### Screen Reader Support

**ARIA Labels:**
- `aria-label="GitHub repository URL input"`
- `aria-live="polite"` for streaming text
- `aria-describedby` for form hints

**Semantic HTML:**
- Proper heading hierarchy (h1 → h2 → h3)
- `<main>`, `<section>`, `<article>` tags
- Alt text for icons (decorative marked as such)

---

For implementation details, see [IMPLEMENTATION_LOGIC.md](./IMPLEMENTATION_LOGIC.md)
For architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md)
For deployment, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
