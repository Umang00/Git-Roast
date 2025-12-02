# Git Roast MCP Server Setup Guide

## Overview

The Git Roast MCP (Model Context Protocol) Server exposes the "roast repository" functionality as a tool that can be used by MCP clients like Claude Desktop. This allows you to analyze and roast GitHub repositories directly from AI assistants.

## What is MCP?

Model Context Protocol (MCP) is an open protocol that standardizes how applications provide context to LLMs. It allows AI assistants to access external tools and data sources in a secure, standardized way.

## Deployment

The MCP server is deployed as a Vercel Serverless Function at the `/api/mcp` endpoint.

**Production URL**: `https://your-app.vercel.app/api/mcp`

## Available Tool

### `roast_repo`

Analyzes a GitHub repository or user profile and generates a brutal, funny roast based on commit history, patterns, and code quality.

**Parameters:**
- `url` (string, required): GitHub repository URL (e.g., "owner/repo" or "https://github.com/owner/repo") or GitHub username

**Returns:**
A formatted markdown report containing:
- Repository/profile information
- Overall grade (A+ to F)
- Detailed statistics (commits, late night commits, weekend commits, etc.)
- Multiple savage roasts targeting different aspects
- Dubious achievements
- Brutally honest suggestions for improvement

## Claude Desktop Configuration

Claude Desktop cannot directly connect to remote HTTP MCP servers. You need to use a "bridge" command that creates a local proxy.

### Setup Instructions

1. **Install the MCP CLI** (if not already installed):
   ```bash
   npm install -g @modelcontextprotocol/cli
   ```

2. **Configure Claude Desktop**:

   Open your Claude Desktop configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

3. **Add the Git Roast MCP Server**:

   ```json
   {
     "mcpServers": {
       "gitroast": {
         "command": "npx",
         "args": [
           "-y",
           "@modelcontextprotocol/cli",
           "client",
           "https://your-app.vercel.app/api/mcp"
         ]
       }
     }
   }
   ```

   **Important**: Replace `https://your-app.vercel.app` with your actual Vercel deployment URL.

4. **Restart Claude Desktop**

5. **Test the Connection**:

   In Claude Desktop, try asking:
   ```
   Can you roast the repository "octocat/Hello-World"?
   ```

   Claude should now be able to use the `roast_repo` tool to analyze the repository and provide you with a savage roast.

## Usage Examples

### Roasting a Repository

```
Roast the repository "facebook/react"
```

Claude will call the `roast_repo` tool with the URL "facebook/react" and return a comprehensive roast report.

### Roasting a User Profile

```
Analyze and roast the GitHub profile of "torvalds"
```

Claude will analyze all public repositories from the user's profile and generate an aggregate roast.

### Full URL

```
What do you think about https://github.com/microsoft/vscode?
```

Claude can parse full GitHub URLs and roast them accordingly.

## Technical Details

### Architecture

- **Transport**: Streamable HTTP (stateless, one request → one response)
- **Timeout**: 60 seconds maximum (Vercel Hobby tier limit)
- **Authentication**: Public access (no authentication required)
- **Validation**: Zod schema validation for all inputs
- **Error Handling**: Clean error messages returned as JSON-RPC errors

### Implementation

The MCP server:
1. Receives JSON-RPC formatted requests via HTTP POST
2. Validates tool calls and parameters using Zod schemas
3. Reuses existing roast logic from the web application
4. Returns formatted markdown responses
5. Falls back to template-based roasts if AI roast generation fails

### Stateless Design

Each request:
- Creates a fresh server and transport instance
- Processes the request
- Returns the response
- Destroys the instances (prevents memory leaks)

This design is optimized for serverless environments where functions are ephemeral.

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
