import { analyzeGitHubRepo, analyzeGitHubProfile, detectInputType } from './githubAnalyzer.js';
import { generateRoast } from './roastEngine.js';

/**
 * Vercel Serverless Function for GitRoast
 * Analyzes GitHub repositories or user profiles and generates roasts
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
        error: 'Repository URL or username is required. Provide a GitHub URL (owner/repo) or username.'
      });
    }

    // Detect if input is a username or repository URL
    const inputType = detectInputType(repoUrl);
    console.log(`Detected input type: ${inputType.type}`, inputType);

    let gitStats;

    if (inputType.type === 'profile') {
      console.log(`Analyzing profile: ${inputType.username}`);
      gitStats = await analyzeGitHubProfile(inputType.username, githubToken);
    } else {
      console.log(`Analyzing repository: ${inputType.owner}/${inputType.repo}`);
      gitStats = await analyzeGitHubRepo(`${inputType.owner}/${inputType.repo}`, githubToken);
    }

    // Generate roasts based on the analysis
    const roastData = generateRoast(gitStats);

    // Add repository/profile info to response
    roastData.repository = gitStats.repositoryInfo;
    roastData.analysisType = inputType.type;

    res.status(200).json(roastData);
  } catch (error) {
    console.error('Error analyzing:', error);

    res.status(500).json({
      error: error.message || 'Failed to analyze GitHub data'
    });
  }
}
