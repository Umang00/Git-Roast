import { analyzeGitHubRepo, analyzeGitHubProfile, detectInputType } from './githubAnalyzer.js';
import { generateStreamingAIRoast } from './aiRoastGenerator.js';
import { generateRoast } from './roastEngine.js';

/**
 * Vercel Serverless Function for Streaming GitRoast
 * Streams AI-generated roasts with progressive reveal for better UX
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

    // Add analysis type
    gitStats.analysisType = inputType.type;

    // Set up Server-Sent Events (SSE) for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send initial stats
    res.write(`data: ${JSON.stringify({ type: 'stats', data: gitStats })}\n\n`);

    // Generate streaming AI roast
    let roastData;

    try {
      roastData = await generateStreamingAIRoast(gitStats, (chunk) => {
        // Send chunk to client
        res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`);
      });

      // Add repository/profile info to response
      roastData.repository = gitStats.repositoryInfo;
      roastData.analysisType = inputType.type;
      roastData.stats = {
        totalCommits: gitStats.totalCommits,
        lateNightCommits: gitStats.lateNightCommits,
        lateNightPercentage: gitStats.lateNightPercentage,
      };

      // Send final complete data
      res.write(`data: ${JSON.stringify({ type: 'complete', data: roastData })}\n\n`);
      res.end();
    } catch (aiError) {
      console.error('AI generation failed, falling back to template roasts:', aiError);

      // Fallback to template-based roasts if AI fails
      roastData = generateRoast(gitStats);
      roastData.repository = gitStats.repositoryInfo;
      roastData.analysisType = inputType.type;

      // Add fun fallback message as a roast
      roastData.roasts.unshift({
        emoji: '🤖',
        title: 'LLM Status Update',
        content: "Our LLM is out sick today, but who needs it? I've learned enough from roasting thousands of repos that I can handle this without AI. Your code is still getting destroyed, just the old-fashioned way.",
        severity: 1
      });

      res.write(`data: ${JSON.stringify({ type: 'fallback', data: roastData })}\n\n`);
      res.end();
    }
  } catch (error) {
    console.error('Error analyzing:', error);

    const errorData = {
      type: 'error',
      error: error.message || 'Failed to analyze GitHub data'
    };

    // Try to send error as SSE if headers not sent
    try {
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'text/event-stream');
      }
      res.write(`data: ${JSON.stringify(errorData)}\n\n`);
      res.end();
    } catch (writeError) {
      console.error('Failed to send error response:', writeError);
    }
  }
}
