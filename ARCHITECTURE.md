# 🏗️ GitRoast - Architecture & Technology Stack

## Table of Contents
- [System Overview](#system-overview)
- [Technology Stack](#technology-stack)
- [Architecture Diagram](#architecture-diagram)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Data Flow](#data-flow)
- [API Design](#api-design)
- [PDF Generation](#pdf-generation)
- [Deployment Architecture](#deployment-architecture)
- [Performance & Scalability](#performance--scalability)

---

## System Overview

GitRoast is a **serverless full-stack web application** that analyzes GitHub repositories and generates humorous roasts using AI. The application is built with a modern React frontend and Node.js serverless backend, deployed entirely on Vercel's edge network.

### Key Characteristics
- **Serverless:** No traditional backend servers
- **Real-time:** Streaming AI responses via Server-Sent Events
- **Scalable:** Auto-scales based on traffic
- **Fast:** Global CDN distribution
- **Cost-effective:** Pay-per-request pricing

---

## Technology Stack

### Frontend
```javascript
{
  "framework": "React 18.3",
  "buildTool": "Vite 6.4",
  "styling": "TailwindCSS 3.4",
  "animations": "Framer Motion 11.18",
  "http": "Axios 1.7",
  "icons": "Lucide React 0.468",
  "effects": "React Confetti 6.2",
  "analytics": "@vercel/analytics 1.4"
}
```

**Frontend Features:**
- Single Page Application (SPA)
- Component-based architecture
- Real-time streaming UI
- Responsive design (mobile-first)
- Animation-rich interactions
- Client-side routing

### Backend
```javascript
{
  "runtime": "Node.js 20+ (ESM)",
  "platform": "Vercel Serverless Functions",
  "ai": "Google Gemini 2.0 Flash (@google/generative-ai 0.21)",
  "github": "Octokit REST API (@octokit/rest 21.0)",
  "pdf": "@react-pdf/renderer 4.1",
  "rateLimiting": "Bottleneck 2.19",
  "streaming": "Server-Sent Events (SSE)",
  "cors": "cors 2.8"
}
```

**Backend Features:**
- Serverless API endpoints
- AI-powered content generation
- Real-time streaming responses
- PDF generation
- Rate limiting & retry logic
- GitHub API integration

### External APIs
```javascript
{
  "ai": "Google Gemini API (gemini-2.0-flash-exp)",
  "versionControl": "GitHub REST API v3",
  "analytics": "Vercel Analytics"
}
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   React Frontend (SPA)                               │  │
│  │   - UI Components                                    │  │
│  │   - State Management                                 │  │
│  │   - Streaming Client                                 │  │
│  │   - Markdown Renderer                                │  │
│  └────────────┬─────────────────────────────────────────┘  │
└───────────────┼─────────────────────────────────────────────┘
                │
                │ HTTPS / SSE
                ├──────────────────────────────────┐
                │                                   │
                ▼                                   ▼
    ┌───────────────────────┐         ┌───────────────────────┐
    │  Vercel Edge Network  │         │  Vercel Edge Network  │
    │  (Global CDN)         │         │  (Serverless Runtime) │
    │                       │         │                       │
    │  - Static Assets      │         │  - API Functions      │
    │  - HTML/CSS/JS        │         │  - Dynamic Routes     │
    │  - Caching            │         │  - Auto-scaling       │
    └───────────────────────┘         └───────────┬───────────┘
                                                   │
                    ┌──────────────────────────────┼──────────────────┐
                    │                              │                  │
                    ▼                              ▼                  ▼
        ┌────────────────────┐        ┌────────────────┐  ┌─────────────────┐
        │ /api/roast-stream  │        │ /api/roast     │  │ /api/health     │
        │                    │        │                │  │                 │
        │ - SSE Streaming    │        │ - Regular API  │  │ - Status        │
        │ - Real-time chunks │        │ - Fallback     │  │                 │
        └──────┬─────────────┘        └────────┬───────┘  └─────────────────┘
               │                               │
               │         ┌─────────────────────┴────────────────┐
               │         │                                      │
               ▼         ▼                                      ▼
    ┌──────────────────────────┐                  ┌──────────────────────┐
    │  aiRoastGenerator.js     │                  │  roastEngine.js      │
    │                          │                  │                      │
    │  - Gemini AI calls       │                  │  - Template roasts   │
    │  - Streaming support     │                  │  - Fallback logic    │
    │  - Retry logic           │                  │  - Grading system    │
    └───────────┬──────────────┘                  └──────────────────────┘
                │
                ▼
    ┌──────────────────────────┐
    │  githubAnalyzer.js       │
    │                          │
    │  - Fetch repo data       │
    │  - Parse commits         │
    │  - Calculate stats       │
    └────────────┬─────────────┘
                 │
                 ▼
    ┌──────────────────────────┐      ┌─────────────────────┐
    │  GitHub REST API         │      │ /api/generate-pdf   │
    │                          │      │                     │
    │  - Repository metadata   │      │ - PDF generation    │
    │  - Commit history        │      │ - Binary response   │
    │  - User profiles         │      └──────────┬──────────┘
    └──────────────────────────┘                 │
                                                 ▼
                                    ┌──────────────────────┐
                                    │  pdfGenerator.js     │
                                    │                      │
                                    │  - React PDF render  │
                                    │  - Strip markdown    │
                                    │  - Document layout   │
                                    └──────────────────────┘

    External Services:
    ┌──────────────────────────┐
    │  Google Gemini API       │
    │  (AI Generation)         │
    └──────────────────────────┘
```

---

## Frontend Architecture

### Component Structure

```
frontend/src/
├── App.jsx                 # Main application component
│   ├── Header              # Logo, title, developer credit
│   ├── InputSection        # Repo URL input & analyze button
│   ├── StreamingDisplay    # Real-time AI response
│   ├── ResultsSection      # Roast results display
│   │   ├── GradeCard       # Grade badge & share buttons
│   │   ├── ProfileInfo     # Profile analysis stats
│   │   ├── StatsGrid       # Commit statistics
│   │   ├── RoastCards      # Individual roasts
│   │   ├── Achievements    # Achievement badges
│   │   └── Suggestions     # Improvement tips
│   └── Footer              # Credits & links
│
├── App.css                 # Custom styles & animations
├── index.css               # TailwindCSS imports & global styles
└── main.jsx                # React entry point & root render
```

### State Management

**Local State (useState):**
```javascript
const [repoUrl, setRepoUrl] = useState('');            // User input
const [loading, setLoading] = useState(false);         // Loading state
const [streaming, setStreaming] = useState(false);     // Streaming state
const [streamText, setStreamText] = useState('');      // Streamed text
const [roastData, setRoastData] = useState(null);      // Final results
const [error, setError] = useState('');                // Error messages
const [showConfetti, setShowConfetti] = useState(false); // Celebration
const [copied, setCopied] = useState(false);           // Copy feedback
const [downloadingPDF, setDownloadingPDF] = useState(false); // PDF state
```

**No global state management** - All state is local to App.jsx

### Key Frontend Functions

#### 1. Analyze Repository
```javascript
async function analyzeRepo() {
  // 1. Validate input
  // 2. Try streaming endpoint with SSE
  // 3. Fall back to regular endpoint if streaming fails
  // 4. Update UI with results
  // 5. Show confetti celebration
}
```

#### 2. Streaming Handler
```javascript
async function handleStreaming(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  // Process Server-Sent Events
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Parse SSE format: "data: {...}\n\n"
    processSSEChunks(decoder.decode(value));
  }
}
```

#### 3. Markdown Parser
```javascript
function parseMarkdown(text) {
  // Convert markdown to React elements
  // Supports: **bold**, *italic*, `code`
  // Returns array of text nodes and styled components
}
```

#### 4. Social Sharing
```javascript
function generateViralMessage() {
  // Create Twitter-optimized message (280 char limit)
  // Include grade, savage roast snippet, website URL
  // Format for maximum engagement
}
```

### Styling Architecture

**TailwindCSS Configuration:**
```javascript
// tailwind.config.js
{
  colors: {
    'dark-bg': '#0a0a0f',
    'dark-card': '#1a1a2e',
    'neon-pink': '#ff006e',
    'neon-purple': '#8b5cf6',
    'neon-blue': '#00f5ff'
  },
  animations: {
    'gradient-x': 'gradient-x 3s ease infinite',
    'float': 'float 6s ease-in-out infinite'
  }
}
```

**Custom CSS:**
- Gradient text effects
- Neon glow effects
- Card shadows
- Animation keyframes

---

## Backend Architecture

### Serverless Function Structure

```
api/
├── roast-stream.js         # Primary endpoint (SSE streaming)
├── roast.js                # Fallback endpoint (regular HTTP)
├── generate-pdf.js         # PDF generation endpoint
├── health.js               # Health check endpoint
│
├── aiRoastGenerator.js     # AI integration layer
├── roastEngine.js          # Template-based roasting
├── githubAnalyzer.js       # GitHub API client
├── pdfGenerator.js         # PDF document generator
└── retryUtils.js           # Retry & rate limiting
```

### API Function Lifecycle

```
Request → Vercel Runtime → Function Cold Start (if needed)
    ↓
Parse Request Body
    ↓
Validate Input
    ↓
GitHub API Calls (with retry logic)
    ↓
Statistical Analysis
    ↓
AI Generation / Template Roasting
    ↓
Format Response
    ↓
Send Response (regular or streaming)
```

### Cold Start Optimization

**Strategies:**
1. **Minimal Dependencies:** Only import what's needed
2. **Code Splitting:** Separate AI and template logic
3. **Connection Pooling:** Reuse HTTP connections
4. **Caching:** Cache GitHub API responses when possible

**Typical Performance:**
- Cold start: 1-2 seconds
- Warm start: 200-500ms
- Streaming first chunk: 1-3 seconds

---

## Data Flow

### Repository Analysis Flow

```
1. User Input
   └─> "facebook/react"

2. Frontend Validation
   └─> Parse URL format
   └─> Extract owner/repo

3. API Request (SSE)
   POST /api/roast-stream
   {
     "repoUrl": "facebook/react",
     "githubToken": "optional"
   }

4. GitHub Data Fetching
   └─> GET /repos/facebook/react
   └─> GET /repos/facebook/react/commits?per_page=100&page=1
   └─> GET /repos/facebook/react/commits?per_page=100&page=2
   └─> ... (up to 5 pages)

5. Statistical Analysis
   └─> Calculate commit patterns
   └─> Analyze commit messages
   └─> Detect time patterns
   └─> Count contributors

6. AI Roast Generation
   └─> Build AI prompt with stats
   └─> Stream Gemini API response
   └─> Parse JSON from AI

7. Grading & Achievements
   └─> Calculate grade (A+ to F)
   └─> Generate achievements
   └─> Create suggestions

8. Streaming Response
   └─> data: {"type":"stats","data":{...}}
   └─> data: {"type":"chunk","text":"You"}
   └─> data: {"type":"chunk","text":" really"}
   └─> data: {"type":"complete","data":{...}}

9. Frontend Display
   └─> Render results with animations
   └─> Show confetti
   └─> Enable sharing
```

### Profile Analysis Flow

```
1. User Input
   └─> "Umang00" (no slash detected)

2. Profile Detection
   └─> analysisType = 'profile'

3. GitHub Profile Fetch
   └─> GET /users/Umang00
   └─> GET /users/Umang00/repos?sort=pushed&per_page=100

4. Repository Filtering
   └─> Sort by push date
   └─> Filter out forks (optional)
   └─> Select top 5 most active repos

5. Multi-Repo Analysis
   └─> For each top repo:
       └─> Fetch commits (up to 500)
       └─> Aggregate statistics

6. Continue with steps 5-9 from Repository Flow...
```

---

## API Design

### Endpoint: POST /api/roast-stream

**Primary endpoint with Server-Sent Events**

**Request:**
```json
{
  "repoUrl": "facebook/react",
  "githubToken": "ghp_optional_token"
}
```

**Response Headers:**
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

**Response Stream:**
```
data: {"type":"stats","data":{"totalCommits":15234,...}}

data: {"type":"chunk","text":"You"}

data: {"type":"chunk","text":" really"}

data: {"type":"chunk","text":" thought..."}

data: {"type":"complete","data":{roastData}}
```

### Endpoint: POST /api/roast

**Fallback endpoint (non-streaming)**

**Request:** Same as roast-stream

**Response:**
```json
{
  "grade": "B",
  "gradeDescription": "Participation trophy vibes...",
  "stats": {
    "totalCommits": 342,
    "lateNightCommits": 89,
    "lateNightPercentage": 26
  },
  "roasts": [
    {
      "emoji": "🦉",
      "title": "Night Owl Developer",
      "content": "26% of commits after 11 PM...",
      "severity": 3
    }
  ],
  "achievements": [...],
  "suggestions": [...],
  "repository": {...},
  "analysisType": "repo"
}
```

### Endpoint: POST /api/generate-pdf

**PDF export endpoint**

**Request:**
```json
{
  // Full roastData object from /api/roast response
  "grade": "B",
  "roasts": [...],
  // ... complete roast data
}
```

**Response:**
- Content-Type: application/pdf
- Binary PDF data
- Filename: GitRoast-{repoName}.pdf

### Endpoint: GET /api/health

**Health check endpoint**

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-25T10:30:00.000Z",
  "version": "3.0.0"
}
```

---

## PDF Generation

### Technology: @react-pdf/renderer

**Server-side PDF generation using React components**

### Architecture

```javascript
// PDF Generation Flow
Request with roastData
    ↓
pdfGenerator.js
    ↓
createRoastPDF(roastData)
    ↓
React.createElement (no JSX)
    ↓
@react-pdf/renderer
    ↓
PDF Binary Output
    ↓
Response (application/pdf)
```

### Key Features

1. **React-based:** Use React patterns for PDF layout
2. **No JSX:** Uses React.createElement to avoid Babel/transpilation in serverless
3. **Markdown Stripping:** Plain text only (no formatting in PDF)
4. **Styling:** StyleSheet API similar to React Native
5. **Emojis Removed:** Text-only for compatibility

### PDF Document Structure

```
┌─────────────────────────────────────┐
│ GitRoast Report Header              │
│ Repository Name                     │
│ Date                                │
├─────────────────────────────────────┤
│ Grade Badge (large font)            │
│ "Overall Grade"                     │
├─────────────────────────────────────┤
│ Statistics Section                  │
│ ┌──────────┐  ┌──────────┐         │
│ │  Total   │  │  Late    │         │
│ │ Commits  │  │  Night   │         │
│ └──────────┘  └──────────┘         │
├─────────────────────────────────────┤
│ The Roasts Section                  │
│ ┌───────────────────────────────┐  │
│ │ Roast Title                   │  │
│ │ Roast content text...         │  │
│ │ Severity: ●●●●○               │  │
│ └───────────────────────────────┘  │
│ (Multiple roast cards)              │
├─────────────────────────────────────┤
│ Suggestions for Improvement         │
│ • Suggestion 1                      │
│ • Suggestion 2                      │
├─────────────────────────────────────┤
│ Footer                              │
│ "Made with fire and no mercy"       │
│ Website URL                         │
└─────────────────────────────────────┘
```

---

## Deployment Architecture

### Vercel Platform

```
┌──────────────────────────────────────────────────┐
│              Vercel Platform                     │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │  Git Integration (GitHub)                  │ │
│  │  - Auto-deploy on push                     │ │
│  │  - Preview deployments for PRs             │ │
│  └────────────────────────────────────────────┘ │
│                      ↓                           │
│  ┌────────────────────────────────────────────┐ │
│  │  Build Process                             │ │
│  │  - npm install (root + frontend)           │ │
│  │  - vite build (frontend)                   │ │
│  │  - API functions compiled                  │ │
│  └────────────────────────────────────────────┘ │
│                      ↓                           │
│  ┌────────────────────────────────────────────┐ │
│  │  Edge Network Deployment                   │ │
│  │  ┌──────────────┐  ┌────────────────────┐ │ │
│  │  │ Static Assets│  │ Serverless Funcs   │ │ │
│  │  │ (frontend/)  │  │ (api/)             │ │ │
│  │  │ - CDN cached │  │ - Auto-scaling     │ │ │
│  │  └──────────────┘  └────────────────────┘ │ │
│  └────────────────────────────────────────────┘ │
│                      ↓                           │
│  ┌────────────────────────────────────────────┐ │
│  │  Global Distribution                       │ │
│  │  - 100+ edge locations                     │ │
│  │  - Automatic HTTPS                         │ │
│  │  - DDoS protection                         │ │
│  └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

### Environment Variables

**Required:**
```bash
GEMINI_API_KEY=your_api_key_here
```

**Optional:**
```bash
GITHUB_TOKEN=ghp_your_token        # Higher rate limits
WEBSITE_URL=https://your-app.com   # Share URLs
DEVELOPER_NAME=Your Name           # Credits
DEVELOPER_LINKEDIN=https://...     # Credits
DEVELOPER_WEBSITE=https://...      # Credits
DEVELOPER_EMAIL=email@example.com  # Credits
```

### Configuration Files

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/" }
  ],
  "functions": {
    "api/*.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

---

## Performance & Scalability

### Performance Metrics

**Target Performance:**
- **Time to First Byte (TTFB):** < 200ms
- **First Contentful Paint (FCP):** < 1s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Time to Interactive (TTI):** < 3s
- **API Response:** 2-5s (with AI), < 1s (templates)

### Optimization Strategies

#### 1. Frontend Optimizations
- **Code Splitting:** Vite automatic chunking
- **Tree Shaking:** Remove unused code
- **Minification:** CSS/JS compression
- **Image Optimization:** SVG icons only
- **Lazy Loading:** Results render on-demand

#### 2. Backend Optimizations
- **Connection Reuse:** Keep-alive HTTP connections
- **Parallel Requests:** Fetch commit pages concurrently
- **Caching:** GitHub API responses (future enhancement)
- **Streaming:** SSE reduces perceived latency
- **Pagination Limits:** Max 500 commits (balance accuracy vs speed)

#### 3. Rate Limiting
```javascript
// Bottleneck configuration
const limiter = new Bottleneck({
  minTime: 100,              // Min 100ms between requests
  maxConcurrent: 5,          // Max 5 concurrent requests
  reservoir: 100,            // 100 requests per interval
  reservoirRefreshAmount: 100,
  reservoirRefreshInterval: 60000  // Refresh every minute
});
```

#### 4. Error Recovery
- **Retry Logic:** Exponential backoff (2x each retry)
- **Fallbacks:** AI → Templates → Error message
- **Graceful Degradation:** Works without GitHub token
- **Timeout Handling:** 30s max function execution

### Scalability

**Horizontal Scaling:**
- Serverless functions auto-scale with traffic
- No manual scaling configuration needed
- Pay only for actual usage

**Limits:**
- **Free Tier:** 100GB-hours/month of execution time
- **Function Timeout:** 30s max (configurable up to 900s on paid plans)
- **Memory:** 1024 MB per function
- **Concurrent Executions:** 1000+ (automatic)

**Cost Estimation:**
```
Average request:
- Frontend: 0 cost (CDN)
- API call: ~200ms execution
- 10,000 requests/day = ~33 hours/month
- Well within free tier limits
```

---

## Security Architecture

### 1. API Key Security
- Stored in environment variables (server-side only)
- Never exposed to client
- Rotated regularly (recommended)

### 2. Input Validation
```javascript
// Sanitize repository URLs
function sanitizeRepoUrl(input) {
  // Remove dangerous characters
  // Validate format
  // Prevent injection attacks
}
```

### 3. Rate Limiting
- Bottleneck library prevents abuse
- GitHub token optional (lower limits without)
- Vercel DDoS protection included

### 4. CORS Configuration
```javascript
const corsOptions = {
  origin: process.env.WEBSITE_URL || '*',
  methods: ['GET', 'POST'],
  credentials: false
};
```

### 5. Data Privacy
- No persistent data storage
- No user tracking (except anonymous analytics)
- GitHub data fetched on-demand only
- No PII collected or stored

---

## Monitoring & Observability

### Vercel Analytics
- **Real User Monitoring (RUM)**
- **Core Web Vitals tracking**
- **Geographic distribution**
- **Error rate monitoring**

### Logging
```javascript
// Structured logging
console.log('[INFO]', { action: 'analyze', repo: 'facebook/react' });
console.error('[ERROR]', { error: err.message, stack: err.stack });
```

### Health Checks
- `/api/health` endpoint
- Uptime monitoring (external services)
- Alert on > 5% error rate

---

## Technology Decisions & Rationale

### Why React?
- **Large ecosystem:** Community support, libraries
- **Component reusability:** DRY principles
- **Virtual DOM:** Fast UI updates
- **Industry standard:** Easy to find developers

### Why Vite?
- **Fast HMR:** < 100ms hot reload
- **Modern tooling:** ESM-first, optimized builds
- **Simple config:** Minimal setup required
- **Better than CRA:** Faster, smaller bundles

### Why Vercel?
- **Serverless-first:** No infrastructure management
- **Git integration:** Auto-deploy on push
- **Global CDN:** Fast worldwide
- **Free tier:** Generous limits for small projects

### Why Gemini vs GPT?
- **Cost:** Lower per-token pricing
- **Speed:** Fast response times (especially Flash model)
- **Quality:** Comparable quality to GPT-3.5
- **Rate limits:** More generous free tier

### Why SSE vs WebSockets?
- **Simpler:** One-way communication is sufficient
- **HTTP-based:** Works through firewalls/proxies
- **Serverless-friendly:** No persistent connections needed
- **Fallback-friendly:** Degrades to regular HTTP easily

---

For implementation details, see [IMPLEMENTATION_LOGIC.md](./IMPLEMENTATION_LOGIC.md)
For user flow, see [USER_FLOW.md](./USER_FLOW.md)
For deployment guide, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
