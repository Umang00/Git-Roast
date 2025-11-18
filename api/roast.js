import { analyzeGitHubRepo } from './githubAnalyzer.js';
import { generateRoast } from './roastEngine.js';

/**
 * Vercel Serverless Function for GitRoast
 * Analyzes GitHub repositories and generates roasts
 */
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { repoUrl, githubToken } = req.body;

    if (!repoUrl) {
      return res.status(400).json({
        error: 'Repository URL is required. Provide a GitHub URL or owner/repo format.'
      });
    }

    console.log(`Analyzing repository: ${repoUrl}`);

    // Analyze the GitHub repository
    const gitStats = await analyzeGitHubRepo(repoUrl, githubToken);

    // Generate roasts based on the analysis
    const roastData = generateRoast(gitStats);

    // Add repository info to response
    roastData.repository = gitStats.repositoryInfo;

    res.status(200).json(roastData);
  } catch (error) {
    console.error('Error analyzing repository:', error);

    res.status(500).json({
      error: error.message || 'Failed to analyze repository'
    });
  }
}
