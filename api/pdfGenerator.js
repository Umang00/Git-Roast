import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

/**
 * PDF Generator for GitRoast Reports
 * Uses @react-pdf/renderer for server-side PDF generation
 * IMPORTANT: Uses React.createElement instead of JSX to avoid transpilation issues in Vercel serverless functions
 */

// Define styles for PDF components
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#0a0a0f',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 5,
  },
  gradeSection: {
    backgroundColor: '#1a1a2e',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#a855f7',
    borderStyle: 'solid',
  },
  gradeBadge: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fbbf24',
    textAlign: 'center',
    marginBottom: 10,
  },
  gradeLabel: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
  statsSection: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a855f7',
    borderStyle: 'solid',
    width: '48%',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  statSubtitle: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
  },
  roastsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 15,
    textAlign: 'center',
  },
  roastCard: {
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
    borderStyle: 'solid',
    marginBottom: 12,
    // Prevent page breaks inside roast cards
    breakInside: 'avoid',
  },
  roastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  roastEmoji: {
    fontSize: 18, // Reduced from 24 to prevent overflow
    marginRight: 8,
    width: 24, // Fixed width to prevent overflow
  },
  roastTitle: {
    fontSize: 14, // Reduced from 16 to give more space
    fontWeight: 'bold',
    color: '#ef4444',
    flex: 1,
  },
  roastContent: {
    fontSize: 11, // Reduced from 12 for better fit
    color: '#d1d5db',
    lineHeight: 1.5,
  },
  severityDots: {
    flexDirection: 'row',
    marginTop: 8,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4, // Using margin instead of gap
  },
  severityActive: {
    backgroundColor: '#ef4444',
  },
  severityInactive: {
    backgroundColor: '#4b5563',
  },
  suggestionsSection: {
    marginTop: 20,
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10b981',
    borderStyle: 'solid',
    // Prevent page breaks inside suggestions
    breakInside: 'avoid',
  },
  suggestionItem: {
    fontSize: 10, // Reduced from 11
    color: '#d1d5db',
    marginBottom: 6,
    paddingLeft: 10,
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#6b7280',
  },
  footerBold: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: 'bold',
  },
});

// PDF Document Component using React.createElement (no JSX)
export function createRoastPDF(roastData) {
  const { repository, stats, grade, roasts, suggestions } = roastData;

  // Get website URL from environment variable or use correct default
  const websiteUrl = process.env.WEBSITE_URL || 'https://git-roasts.vercel.app/';

  // Generate filename-friendly repo name with proper sanitization
  const repoName = repository?.fullName || repository?.username || 'Unknown';

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },

      // Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, { style: styles.title }, '🔥 GitRoast Report 🔥'),
        React.createElement(Text, { style: styles.subtitle }, repoName),
        React.createElement(
          Text,
          { style: styles.subtitle },
          new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        )
      ),

      // Grade Section
      React.createElement(
        View,
        { style: styles.gradeSection },
        React.createElement(Text, { style: styles.gradeBadge }, grade),
        React.createElement(Text, { style: styles.gradeLabel }, 'Overall Grade')
      ),

      // Stats Section
      React.createElement(
        View,
        { style: styles.statsSection },
        React.createElement(Text, { style: styles.sectionTitle }, '📊 Statistics'),
        React.createElement(
          View,
          { style: styles.statsGrid },
          React.createElement(
            View,
            { style: styles.statCard },
            React.createElement(Text, { style: styles.statValue }, String(stats.totalCommits)),
            React.createElement(Text, { style: styles.statLabel }, 'Total Commits')
          ),
          React.createElement(
            View,
            { style: styles.statCard },
            React.createElement(Text, { style: styles.statValue }, String(stats.lateNightCommits)),
            React.createElement(Text, { style: styles.statLabel }, 'Late Night Commits'),
            React.createElement(Text, { style: styles.statSubtitle }, `${stats.lateNightPercentage}%`)
          )
        )
      ),

      // Roasts Section
      React.createElement(
        View,
        { style: styles.roastsSection },
        React.createElement(Text, { style: styles.sectionTitle }, '🔥 The Roasts'),
        ...(roasts && Array.isArray(roasts) ? roasts.map((roast, index) =>
          React.createElement(
            View,
            { key: index, style: styles.roastCard },
            React.createElement(
              View,
              { style: styles.roastHeader },
              React.createElement(Text, { style: styles.roastEmoji }, roast.emoji || '🔥'),
              React.createElement(Text, { style: styles.roastTitle }, roast.title || '')
            ),
            React.createElement(Text, { style: styles.roastContent }, roast.content || ''),
            roast.severity ? React.createElement(
              View,
              { style: styles.severityDots },
              ...[...Array(5)].map((_, i) =>
                React.createElement(View, {
                  key: i,
                  style: [
                    styles.severityDot,
                    i < roast.severity ? styles.severityActive : styles.severityInactive
                  ]
                })
              )
            ) : null
          )
        ) : [])
      ),

      // Suggestions Section
      suggestions && suggestions.length > 0 ? React.createElement(
        View,
        { style: styles.suggestionsSection },
        React.createElement(
          Text,
          { style: [styles.sectionTitle, { color: '#10b981' }] },
          '💡 Suggestions for Improvement'
        ),
        ...suggestions.map((suggestion, index) =>
          React.createElement(
            Text,
            { key: index, style: styles.suggestionItem },
            `• ${suggestion || ''}`
          )
        )
      ) : null,

      // Footer
      React.createElement(
        View,
        { style: styles.footer },
        React.createElement(Text, { style: styles.footerBold }, 'Made with 🔥 and absolutely no mercy'),
        React.createElement(Text, null, `Get your own roast at ${websiteUrl}`)
      )
    )
  );
}
