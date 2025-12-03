# Git Roast MCP Server Setup Guide

## Overview

The Git Roast MCP (Model Context Protocol) Server exposes the "roast repository" functionality as a tool that can be used by MCP clients like Claude Desktop, Cursor, and other AI assistants. This allows you to analyze and roast GitHub repositories or entire GitHub profiles directly from AI conversations.

## What is MCP?

Model Context Protocol (MCP) is an open protocol that standardizes how applications provide context to LLMs. It allows AI assistants to access external tools and data sources in a secure, standardized way.

## Deployment

The MCP server is deployed as a Vercel Serverless Function at the `/api/mcp` endpoint.

**Production URL**: `https://your-app.vercel.app/api/mcp`

## Available Tool

### `roast_repo`

Analyzes a GitHub repository or user profile and generates a brutal, funny roast based on commit history, patterns, and code quality. Uses Google Gemini AI for personalized roasts with template-based fallback.

**Parameters:**
- `url` (string, required):
  - GitHub repository: `"owner/repo"` or `"https://github.com/owner/repo"`
  - GitHub profile: `"username"` (analyzes all public repos)

**Returns:**
A formatted markdown report containing:
- Repository/profile information
- Overall grade (A+ to F)
- Detailed statistics (commits, late night commits, weekend commits, etc.)
- Multiple AI-generated savage roasts targeting different aspects
- Dubious achievements unlocked
- Brutally honest suggestions for improvement

**Features:**
- 🤖 AI-powered roasts using Google Gemini (with template fallback)
- 📊 Profile-wide analysis (analyzes up to 20 repos per profile)
- 📈 Comprehensive commit pattern analysis
- 🔥 Unfiltered, savage humor (displayed verbatim to users)

## Claude Desktop Configuration

Claude Desktop supports remote HTTP MCP servers directly via URL configuration (no bridge needed!).

### Prerequisites

- Claude Desktop installed (version with HTTP transport support)
- Your Git Roast app deployed on Vercel

### Setup Instructions

1. **Get Your Deployment URL**:
   - Deploy your app to Vercel (see [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md))
   - Your MCP endpoint will be: `https://your-app.vercel.app/api/mcp`
   - Example: `https://git-roast.vercel.app/api/mcp`

2. **Configure Claude Desktop**:

   Open your Claude Desktop configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

3. **Add the Git Roast MCP Server**:

   ```json
   {
     "mcpServers": {
       "gitroast": {
         "url": "https://your-app.vercel.app/api/mcp"
       }
     }
   }
   ```

   **Important**: Replace `https://your-app.vercel.app` with your actual Vercel deployment URL.

   **Example Configuration**:
   ```json
   {
     "mcpServers": {
       "gitroast": {
         "url": "https://git-roast.vercel.app/api/mcp"
       }
     }
   }
   ```

   **That's it!** No `npx`, no bridge, just a direct URL connection.

4. **Restart Claude Desktop**

5. **Test the Connection**:

   In Claude Desktop, try asking:
   ```
   Can you roast the repository "facebook/react"?
   ```

   Claude should now be able to use the `roast_repo` tool to analyze the repository and provide you with a savage roast.

## Usage Examples

Once configured, you can ask Claude to roast repositories directly in your conversations:

### Roasting a Repository

**You**: Roast the repository "facebook/react"

**Claude**: *[Uses the `roast_repo` tool with URL "facebook/react" and displays the full AI-generated roast report with grade, stats, roasts, achievements, and suggestions]*

### Roasting a User Profile

**You**: Analyze and roast the GitHub profile of "torvalds"

**Claude**: *[Uses the `roast_repo` tool with URL "torvalds", analyzes all public repos, and displays an aggregate roast of the entire profile]*

### Full URL Format

**You**: What do you think about https://github.com/microsoft/vscode?

**Claude**: *[Parses the URL, uses the `roast_repo` tool, and displays the roast]*

### Natural Language

**You**: Can you roast my GitHub repo? It's called "myusername/my-awesome-project"

**Claude**: *[Understands the request and uses the tool to generate a roast]*

### Output Format

Claude will display the **complete, unfiltered roast** including:
- Overall grade (A+ to F)
- Detailed statistics
- Multiple savage roast sections
- Dubious achievements
- Brutally honest suggestions

The MCP server includes strict instructions to ensure Claude displays the entire roast verbatim without summarizing or softening the content.

## Technical Details

### Architecture

- **Transport**: StreamableHTTPServerTransport (stateless, one request → one response)
- **Server**: Fresh MCP Server instance per request (optimized for serverless)
- **Timeout**: 60 seconds maximum (Vercel Hobby tier limit)
- **Authentication**: Public access (no authentication required)
- **Validation**: Zod schema validation for all inputs
- **Error Handling**: JSON-RPC compliant error responses

### Implementation Flow

1. **Request Reception**: HTTP POST to `/api/mcp`
2. **Server Initialization**: Creates fresh MCP Server instance
3. **Tool Registration**: Registers `roast_repo` tool with schema
4. **Input Validation**: Validates parameters with Zod
5. **Input Detection**: Determines if input is repo or profile
6. **GitHub Analysis**: Fetches data via GitHub API (@octokit/rest)
7. **AI Roast Generation**:
   - Primary: Google Gemini AI for personalized roasts
   - Fallback: Template-based roasts if AI fails
8. **Response Formatting**: Converts to markdown with embedded AI instructions
9. **Cleanup**: Destroys server instance (prevents memory leaks)

### Stateless Design (Serverless-Optimized)

Each request:
- Creates fresh server and transport instances
- Processes the request completely
- Returns the response
- Destroys instances immediately
- No session state maintained

This design is **critical** for serverless environments where:
- Functions are ephemeral
- Cold starts are common
- Memory must be managed carefully
- No persistent connections exist

### AI Assistant Instructions

The MCP server includes **multi-layer instructions** to ensure AI assistants display roasts verbatim:

1. **Tool Description**: Contains `<CRITICAL_RULES_FOR_AI_ASSISTANTS>` section
2. **Response Formatting**: Embeds `<AI_ASSISTANT_RULES>` in output
3. **Explicit Requirements**: Lists forbidden behaviors (summarizing, softening, filtering)

This ensures users receive the **full, unfiltered, savage roast** they expect.

## Troubleshooting

### Claude Desktop doesn't see the tool

1. Verify the configuration file path is correct
2. Check that the JSON syntax is valid (no trailing commas, proper quotes)
3. Ensure you restarted Claude Desktop after configuration
4. Check the Claude Desktop logs for connection errors

### Rate limit errors

GitHub API has rate limits:
- **Unauthenticated**: 60 requests per hour
- **With token**: 5000 requests per hour

To use an authenticated token:
1. Create a GitHub Personal Access Token
2. Set the `GITHUB_TOKEN` environment variable in Vercel

### Timeout errors

If analyzing very large repositories or profiles:
- The server limits analysis to 1000 commits per repository
- For profiles, it analyzes a maximum of 20 repositories
- If timeouts persist, try analyzing smaller repositories or individual repos instead of profiles

## Development

### Local Testing

1. **Start the Vercel dev server**:
   ```bash
   npm run dev
   ```

2. **Test the endpoint**:
   The MCP server will be available at `http://localhost:3000/api/mcp`

3. **Use MCP Inspector** (optional):
   ```bash
   npx @modelcontextprotocol/inspector http://localhost:3000/api/mcp
   ```

### Deployment

The MCP server is automatically deployed with your Vercel application. Any changes to `api/mcp.ts` will be deployed on the next Vercel deployment.

## Security Considerations

- The MCP server is **publicly accessible** (no authentication)
- It only provides read-only access to public GitHub data
- No sensitive data is stored or logged
- All GitHub API calls respect rate limits
- Error messages are sanitized to avoid leaking sensitive information

## Support

For issues or questions:
- Check the [Vercel deployment logs](https://vercel.com/dashboard)
- Review the [MCP documentation](https://modelcontextprotocol.io)
- Open an issue on the Git Roast repository

## License

Same as the main Git Roast project (MIT License)
