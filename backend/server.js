import express from 'express';
import cors from 'cors';
import { analyzeGitRepo } from './gitAnalyzer.js';
import { generateRoast } from './roastEngine.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/roast', async (req, res) => {
  try {
    const { repoPath } = req.body;

    if (!repoPath) {
      return res.status(400).json({ error: 'Repository path is required' });
    }

    console.log(`Analyzing repository: ${repoPath}`);

    // Analyze the git repository
    const gitStats = await analyzeGitRepo(repoPath);

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
