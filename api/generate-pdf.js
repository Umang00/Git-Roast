import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import { RoastPDF } from './pdfGenerator.js';

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

    // Validate roast data
    if (!roastData || !roastData.grade || !roastData.roasts) {
      return res.status(400).json({
        error: 'Invalid roast data. Missing required fields: grade, roasts'
      });
    }

    // Generate filename from repo/profile name
    const repoName = roastData.repository?.fullName || roastData.repository?.username || 'Report';
    const filename = `GitRoast-${repoName.replace('/', '-')}.pdf`;

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Render PDF and stream to response
    const pdfStream = await renderToStream(<RoastPDF roastData={roastData} />);

    pdfStream.on('end', () => {
      console.log('PDF generated successfully:', filename);
    });

    pdfStream.on('error', (error) => {
      console.error('PDF generation error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to generate PDF' });
      }
    });

    pdfStream.pipe(res);

  } catch (error) {
    console.error('Error in PDF generation endpoint:', error);

    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to generate PDF',
        details: error.message
      });
    }
  }
}
