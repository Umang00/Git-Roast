import { renderToStream } from '@react-pdf/renderer';
import { createRoastPDF } from './pdfGenerator.js';

/**
 * API Endpoint: Generate PDF
 * Accepts roast data via POST and returns a PDF file
 * Uses @react-pdf/renderer for server-side PDF generation
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const roastData = req.body;

    // Comprehensive validation to match what the PDF renderer expects
    if (!roastData || typeof roastData !== 'object') {
      return res.status(400).json({
        error: 'Invalid request: roastData must be an object'
      });
    }

    if (!roastData.grade || typeof roastData.grade !== 'string') {
      return res.status(400).json({
        error: 'Invalid roast data: missing or invalid grade field'
      });
    }

    if (!roastData.roasts || !Array.isArray(roastData.roasts) || roastData.roasts.length === 0) {
      return res.status(400).json({
        error: 'Invalid roast data: roasts must be a non-empty array'
      });
    }

    if (!roastData.stats || typeof roastData.stats !== 'object') {
      return res.status(400).json({
        error: 'Invalid roast data: missing or invalid stats object'
      });
    }

    // Validate required stats fields
    if (typeof roastData.stats.totalCommits !== 'number' ||
        typeof roastData.stats.lateNightCommits !== 'number' ||
        typeof roastData.stats.lateNightPercentage !== 'number') {
      return res.status(400).json({
        error: 'Invalid roast data: stats must contain totalCommits, lateNightCommits, and lateNightPercentage'
      });
    }

    // Generate filename from repo/profile name
    const repoName = roastData.repository?.fullName || roastData.repository?.username || 'Report';
    const filename = `GitRoast-${repoName.replace('/', '-')}.pdf`;

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache');

    // Create PDF document and render to stream
    const pdfDocument = createRoastPDF(roastData);
    const pdfStream = await renderToStream(pdfDocument);

    // Handle stream events
    pdfStream.on('end', () => {
      console.log('PDF generated successfully:', filename);
    });

    pdfStream.on('error', (error) => {
      console.error('PDF stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Failed to generate PDF',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    });

    // Pipe the PDF stream to the response
    pdfStream.pipe(res);

  } catch (error) {
    console.error('Error in PDF generation endpoint:', error);

    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to generate PDF',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}
