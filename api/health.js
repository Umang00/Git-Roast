/**
 * Health check endpoint for GitRoast API
 */
export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'GitRoast API is running! 🔥',
    version: '2.0.0',
    mode: 'serverless',
    timestamp: new Date().toISOString()
  });
}
