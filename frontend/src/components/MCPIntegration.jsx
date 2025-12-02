import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

const MCPIntegration = () => {
  const [copiedConfig, setCopiedConfig] = useState(null);

  // Use existing environment variable + fixed API path with fallback
  const MCP_SERVER_URL = `${import.meta.env.VITE_WEBSITE_URL || window.location.origin}/api/mcp`;

  // Configuration for each client
  const configs = {
    claude: {
      name: 'Claude Desktop',
      icon: 'https://mintlify.s3.us-west-1.amazonaws.com/claude/logo/dark.svg',
      description: 'Direct MCP protocol support',
      copyValue: MCP_SERVER_URL, // Only copy URL for Claude
      config: {
        mcpServers: {
          gitroastmcp: {
            url: MCP_SERVER_URL
          }
        }
      },
      instructions: [
        'Open Claude Desktop app',
        'Go to Connectors',
        'Click "Add Custom Connector"',
        'Name: "Git Roast"',
        'Paste the URL from the button above',
        'Click "Add"',
        'Ask Claude to roast a repository!'
      ]
    },
    cursor: {
      name: 'Cursor',
      icon: 'https://www.cursor.com/brand/icon.svg',
      description: 'AI-powered code editor',
      copyValue: JSON.stringify({
        mcpServers: {
          gitroastmcp: {
            url: MCP_SERVER_URL
          }
        }
      }, null, 2),
      config: {
        mcpServers: {
          gitroastmcp: {
            url: MCP_SERVER_URL
          }
        }
      },
      instructions: [
        'Open Cursor settings',
        'Navigate to Tools → MCP',
        'Click "Add MCP Server"',
        'Paste the configuration from the button above',
        'The server will be activated automatically'
      ]
    },
    other: {
      name: 'Other MCP Clients',
      icon: '🔌',
      description: 'Generic MCP configuration',
      copyValue: JSON.stringify({
        mcpServers: {
          gitroastmcp: {
            url: MCP_SERVER_URL
          }
        }
      }, null, 2),
      config: {
        mcpServers: {
          gitroastmcp: {
            url: MCP_SERVER_URL
          }
        }
      },
      instructions: [
        'Open your MCP client\'s settings',
        'Navigate to the MCP servers section',
        'Add a new MCP server',
        'Paste the configuration from the button above',
        'Save and restart if required'
      ]
    }
  };

  const copyToClipboard = async (configKey) => {
    const client = configs[configKey];
    // Use copyValue if defined (for Claude Desktop URL-only), otherwise use JSON config
    const textToCopy = client.copyValue || JSON.stringify(client.config, null, 2);

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedConfig(configKey);
      setTimeout(() => setCopiedConfig(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);

      // Fallback for non-HTTPS or denied permissions
      try {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedConfig(configKey);
        setTimeout(() => setCopiedConfig(null), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy also failed:', fallbackErr);
      }
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-orange-900/20 via-red-900/20 to-purple-900/20 rounded-2xl p-8 border border-orange-500/20"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🔌</span>
          <h2 className="text-3xl font-bold text-orange-400">Available as MCP Server</h2>
        </div>

        <p className="text-gray-300 mb-8">
          Use Git Roast directly in Claude Desktop, Cursor, and other MCP-compatible AI tools.
          No API keys required - just copy the config and start roasting!
        </p>

        {/* Three Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(configs).map(([key, client]) => (
            <ConfigCard
              key={key}
              client={client}
              isCopied={copiedConfig === key}
              onCopy={() => copyToClipboard(key)}
            />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-black/30 rounded-lg border border-orange-500/10">
          <p className="text-sm text-gray-400">
            <strong className="text-orange-400">Need help?</strong> Check out the{' '}
            <a
              href="https://modelcontextprotocol.io/docs/develop/connect-remote-servers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 underline"
            >
              MCP Documentation
            </a>
            {' '}for detailed setup instructions.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

const ConfigCard = ({ client, isCopied, onCopy }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-black/40 rounded-xl p-6 border border-orange-500/20 hover:border-orange-500/40 transition-colors"
    >
      {/* Card Header */}
      <div className="flex items-center gap-3 mb-3">
        {client.icon.startsWith('http') ? (
          <img src={client.icon} alt={client.name} className="w-8 h-8" />
        ) : (
          <span className="text-3xl">{client.icon}</span>
        )}
        <div>
          <h3 className="text-xl font-bold text-white">{client.name}</h3>
          <p className="text-sm text-gray-400">{client.description}</p>
        </div>
      </div>

      {/* Copy Button */}
      <button
        onClick={onCopy}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
          isCopied
            ? 'bg-green-600 text-white'
            : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-500 hover:to-red-500'
        }`}
      >
        {isCopied ? (
          <>
            <Check className="w-5 h-5" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-5 h-5" />
            {client.copyValue && !client.copyValue.includes('{') ? 'Copy URL' : 'Copy Config'}
          </>
        )}
      </button>

      {/* Expandable Instructions */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mt-3 text-sm text-orange-400 hover:text-orange-300 transition-colors"
      >
        {isExpanded ? '▲ Hide Instructions' : '▼ Show Instructions'}
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 space-y-3"
        >
          {/* Instructions */}
          <div className="space-y-2">
            {client.instructions.map((instruction, idx) => (
              <div key={idx} className="flex gap-2 text-sm text-gray-300">
                <span className="text-orange-400 font-bold">{idx + 1}.</span>
                <span>{instruction}</span>
              </div>
            ))}
          </div>

          {/* Config Preview - only show for non-URL configs */}
          {client.copyValue && client.copyValue.includes('{') && (
            <div className="p-3 bg-black/50 rounded border border-orange-500/10">
              <p className="text-xs text-gray-400 mb-2">Configuration JSON:</p>
              <pre className="text-xs text-gray-300 overflow-x-auto">
                {client.copyValue}
              </pre>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default MCPIntegration;
