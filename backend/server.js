import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeGitRepo } from './gitAnalyzer.js';
import { analyzeGitHubRepo } from '../api/githubAnalyzer.js';
import { generateRoast } from './roastEngine.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/roast', async (req, res) => {
  try {
    const { repoPath, repoUrl, githubToken } = req.body;

    // Accept either repoUrl (GitHub URL) or repoPath (local path)
    if (!repoPath && !repoUrl) {
      return res.status(400).json({
        error: 'Repository URL or path is required. Provide a GitHub URL (https://github.com/owner/repo) or local path.'
      });
    }

    let gitStats;

    // If repoUrl is provided, use GitHub API analyzer
    if (repoUrl) {
      console.log(`Analyzing GitHub repository: ${repoUrl}`);
      const token = githubToken || process.env.GITHUB_TOKEN;
      gitStats = await analyzeGitHubRepo(repoUrl, token);
    }
    // Otherwise, use local git analyzer
    else {
      console.log(`Analyzing local repository: ${repoPath}`);
      gitStats = await analyzeGitRepo(repoPath);
    }

    // Generate roasts based on the analysis
    const roastData = generateRoast(gitStats);

    res.json(roastData);
  } catch (error) {
    console.error('Error analyzing repository:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze repository'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GitRoast API is running! 🔥' });
});

app.listen(PORT, () => {
  console.log(`🔥 GitRoast API server running on port ${PORT}`);
});
