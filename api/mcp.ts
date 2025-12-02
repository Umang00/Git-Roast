import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { analyzeGitHubRepo, analyzeGitHubProfile, detectInputType } from './githubAnalyzer.js';
import { generateAIRoast } from './aiRoastGenerator.js';
import { generateRoast } from './roastEngine.js';

// Tool input schema with Zod validation
const RoastInputSchema = z.object({
  url: z.string().describe('GitHub repository URL (owner/repo) or username')
});

// Handler function (default export for Vercel)
export default async function handler(req, res) {
  // Only accept POST requests (MCP protocol requirement)
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  // Create fresh server instance for this request (stateless pattern)
  const server = new Server(
    { name: 'git-roast', version: '1.0.0' },
    { capabilities: { tools: {} } }
  );

  // Register the roast_repo tool - handler for tools/list
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [{
      name: 'roast_repo',
      description: 'Analyzes a GitHub repository or user profile and generates a brutal, funny roast based on commit history, patterns, and code quality',
      inputSchema: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'GitHub repository URL (e.g., "owner/repo" or "https://github.com/owner/repo") or GitHub username'
          }
        },
        required: ['url']
      }
    }]
  }));

  // Register tool call handler - handler for tools/call
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name !== 'roast_repo') {
      throw new Error(`Unknown tool: ${request.params.name}`);
    }

    try {
      // Validate input with Zod
      const input = RoastInputSchema.parse(request.params.arguments);

      // Detect input type and analyze
      const inputType = detectInputType(input.url);
      let gitStats;

      if (inputType.type === 'profile') {
        gitStats = await analyzeGitHubProfile(inputType.username);
      } else {
        gitStats = await analyzeGitHubRepo(`${inputType.owner}/${inputType.repo}`);
      }

      gitStats.analysisType = inputType.type;

      // Generate roast (AI with fallback to template-based)
      let roastData;
      try {
        roastData = await generateAIRoast(gitStats);
      } catch (aiError) {
        console.warn('AI roast failed, using template fallback:', aiError.message);
        roastData = generateRoast(gitStats);
      }

      // Format response for MCP
      const formattedRoast = formatRoastForMCP(roastData, gitStats);

      return {
        content: [{
          type: 'text',
          text: formattedRoast
        }]
      };
    } catch (error) {
      // Throw clean error messages for MCP client
      // SDK will convert to JSON-RPC error response automatically
      if (error.message.includes('not found')) {
        throw new Error('Repository or user not found. Check the URL/username and try again.');
      }
      if (error.message.includes('Rate limit')) {
        throw new Error('GitHub API rate limit exceeded. Try again later.');
      }
      throw new Error(`Failed to roast repository: ${error.message}`);
    }
  });

  // Create StreamableHTTP transport (stateless mode)
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined  // Critical: enables stateless mode
  });

  try {
    // Connect transport to server
    await server.connect(transport);

    // Handle the HTTP request (SDK processes JSON-RPC automatically)
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    // If transport/server initialization fails, send proper HTTP error
    // This ensures the client gets a response instead of a timeout
    console.error('MCP server error:', error);

    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message || 'Failed to process MCP request'
      });
    }
  }
}

// Format roast data as human-readable text for MCP clients
function formatRoastForMCP(roastData, gitStats) {
  const lines = [];

  lines.push(`# Git Roast Report`);
  lines.push('');

  // Repository/Profile info
  if (gitStats.repositoryInfo) {
    const info = gitStats.repositoryInfo;
    if (info.type === 'profile') {
      lines.push(`**Profile**: @${info.username}`);
      lines.push(`**Analyzed Repos**: ${info.analyzedRepos} of ${info.totalRepos}`);
    } else {
      lines.push(`**Repository**: ${info.fullName}`);
    }
  }

  lines.push('');
  lines.push(`## Grade: ${roastData.grade}`);
  lines.push(roastData.gradeDescription);
  lines.push('');

  // Stats summary
  lines.push('## Stats');
  lines.push(`- Total Commits: ${gitStats.totalCommits}`);
  lines.push(`- Late Night Commits: ${gitStats.lateNightCommits} (${gitStats.lateNightPercentage}%)`);
  lines.push(`- Weekend Commits: ${gitStats.weekendCommits} (${gitStats.weekendPercentage}%)`);
  lines.push('');

  // Roasts
  if (roastData.roasts && roastData.roasts.length > 0) {
    lines.push('## Roasts');
    roastData.roasts.forEach(roast => {
      lines.push('');
      lines.push(`### ${roast.emoji} ${roast.title}`);
      lines.push(roast.content);
    });
  }

  // Achievements
  if (roastData.achievements && roastData.achievements.length > 0) {
    lines.push('');
    lines.push('## Achievements (Dubious)');
    roastData.achievements.forEach(ach => {
      lines.push(`- ${ach.emoji} **${ach.title}**: ${ach.description}`);
    });
  }

  // Suggestions
  if (roastData.suggestions && roastData.suggestions.length > 0) {
    lines.push('');
    lines.push('## Suggestions (Brutally Honest)');
    roastData.suggestions.forEach(sug => {
      lines.push(`- ${sug}`);
    });
  }

  return lines.join('\n');
}
