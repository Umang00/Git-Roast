import { analyzeGitHubRepo, analyzeGitHubProfile, detectInputType } from './githubAnalyzer.js';
import { generateAIRoast } from './aiRoastGenerator.js';
import { generateRoast } from './roastEngine.js';

/**
 * Vercel Serverless Function for GitRoast
 * Analyzes GitHub repositories or user profiles and generates AI-powered roasts
 * Falls back to template-based roasts if AI fails
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

    // Add analysis type to stats
    gitStats.analysisType = inputType.type;

    // Try AI-powered roasts first, fall back to templates if it fails
    let roastData;
    try {
      console.log('Attempting AI-powered roast generation...');
      roastData = await generateAIRoast(gitStats);
      console.log('AI roast generated successfully');
    } catch (aiError) {
      console.warn('AI roast generation failed, falling back to templates:', aiError.message);
      roastData = generateRoast(gitStats);
    }

    // Add repository/profile info and stats to response
    roastData.repository = gitStats.repositoryInfo;
    roastData.analysisType = inputType.type;
    roastData.stats = {
      totalCommits: gitStats.totalCommits,
      lateNightCommits: gitStats.lateNightCommits,
      lateNightPercentage: gitStats.lateNightPercentage,
      avgCommitSize: gitStats.avgCommitSize,
    };

    res.status(200).json(roastData);
  } catch (error) {
    console.error('Error analyzing:', error);

    res.status(500).json({
      error: error.message || 'Failed to analyze GitHub data'
    });
  }
}
