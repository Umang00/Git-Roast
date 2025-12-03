import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

/**
 * PDF Generator for GitRoast Reports
 * Uses @react-pdf/renderer for server-side PDF generation
 * IMPORTANT: Uses React.createElement instead of JSX to avoid transpilation issues in Vercel serverless functions
 * NOTE: Emojis removed from PDF to prevent text rendering issues
 */

/**
 * Strip markdown syntax from text for PDF rendering
 * PDFs can't render markdown formatting like bold/italic, so we extract plain text
 * Removes: **, __, *, _, ` (markdown syntax)
 * @param {string} text - Text potentially containing markdown
 * @returns {string} Plain text without markdown syntax
 */
function stripMarkdown(text) {
  if (!text || typeof text !== 'string') return text || '';

  return text
    // Remove links: [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove bold: **text** or __text__
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    // Remove code blocks: ```text```
    .replace(/```[^`]*```/g, '')
    // Remove inline code: `text`
    .replace(/`([^`]+)`/g, '$1')
    // Remove italic: *text* or _text_ (process after bold to avoid conflicts)
    .replace(/\*((?!\s).*?(?<!\s))\*/g, '$1')
    .replace(/_((?!\s).*?(?<!\s))_/g, '$1')
    // Remove strikethrough: ~~text~~
    .replace(/~~(.*?)~~/g, '$1')
    // Remove headers: ## text -> text
    .replace(/^#{1,6}\s+(.+)$/gm, '$1');
}

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
  gradeDescription: {
    fontSize: 12,
    color: '#d1d5db',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  profileSection: {
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderStyle: 'solid',
    marginBottom: 20,
  },
  profileHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 10,
  },
  profileStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  profileStatCard: {
    backgroundColor: '#0a0a0f',
    padding: 10,
    borderRadius: 6,
    width: '48%',
    marginBottom: 8,
  },
  profileStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 3,
  },
  profileStatLabel: {
    fontSize: 10,
    color: '#9ca3af',
  },
  profileReposList: {
    marginTop: 10,
  },
  profileReposTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#9ca3af',
    marginBottom: 5,
  },
  profileRepo: {
    fontSize: 10,
    color: '#d1d5db',
    marginBottom: 3,
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
  roastTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 8,
  },
  roastContent: {
    fontSize: 11,
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
    marginRight: 4,
  },
  severityActive: {
    backgroundColor: '#ef4444',
  },
  severityInactive: {
    backgroundColor: '#4b5563',
  },
  achievementsSection: {
    marginTop: 20,
  },
  achievementCard: {
    backgroundColor: '#1a1a2e',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fbbf24',
    borderStyle: 'solid',
    marginBottom: 10,
    // Prevent page breaks inside achievement cards
    breakInside: 'avoid',
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 10,
    color: '#d1d5db',
    lineHeight: 1.4,
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
    fontSize: 10,
    color: '#d1d5db',
    marginBottom: 6,
    paddingLeft: 10,
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 12,
    color: '#6b7280',
  },
  footerBold: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: 'bold',
  },
});

// PDF Document Component using React.createElement (no JSX)
export function createRoastPDF(roastData) {
  const { repository, grade, gradeDescription, roasts, achievements, suggestions, analysisType } = roastData;

  // Get website URL from environment variable or use correct default
  const websiteUrl = process.env.WEBSITE_URL || 'https://git-roasts.vercel.app/';

  // Generate filename-friendly repo name with proper sanitization
  const repoName = repository?.fullName || repository?.username || 'Unknown';

  // Safe stats with fallbacks (validated in API but extra safety here)
  const stats = roastData.stats || { totalCommits: 0, lateNightCommits: 0, lateNightPercentage: 0 };

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },

      // Header (no emojis)
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, { style: styles.title }, 'GitRoast Report'),
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

      // Grade Section (with fallback)
      React.createElement(
        View,
        { style: styles.gradeSection },
        React.createElement(Text, { style: styles.gradeBadge }, grade || 'N/A'),
        React.createElement(Text, { style: styles.gradeLabel }, 'Overall Grade'),
        gradeDescription ? React.createElement(
          Text,
          { style: styles.gradeDescription },
          stripMarkdown(gradeDescription)
        ) : null
      ),

      // Profile Analysis Section (only for profile analysis, not repo)
      analysisType === 'profile' && repository ? React.createElement(
        View,
        { style: styles.profileSection },
        React.createElement(
          Text,
          { style: styles.profileHeader },
          `Profile Analysis: @${repository.username || 'User'}`
        ),
        React.createElement(
          Text,
          { style: { fontSize: 11, color: '#9ca3af', marginBottom: 10 } },
          `Analyzed ${repository.analyzedRepos || 0} of ${repository.totalRepos || 0} repositories`
        ),
        React.createElement(
          View,
          { style: styles.profileStatsGrid },
          React.createElement(
            View,
            { style: styles.profileStatCard },
            React.createElement(Text, { style: styles.profileStatValue }, String(repository.publicRepos || 0)),
            React.createElement(Text, { style: styles.profileStatLabel }, 'Public Repos')
          ),
          React.createElement(
            View,
            { style: styles.profileStatCard },
            React.createElement(Text, { style: styles.profileStatValue }, String(repository.followers || 0)),
            React.createElement(Text, { style: styles.profileStatLabel }, 'Followers')
          ),
          React.createElement(
            View,
            { style: styles.profileStatCard },
            React.createElement(Text, { style: styles.profileStatValue }, String(repository.following || 0)),
            React.createElement(Text, { style: styles.profileStatLabel }, 'Following')
          ),
          React.createElement(
            View,
            { style: styles.profileStatCard },
            React.createElement(Text, { style: styles.profileStatValue }, String(stats.totalCommits ?? 0)),
            React.createElement(Text, { style: styles.profileStatLabel }, 'Total Commits')
          )
        ),
        repository.topRepos && Array.isArray(repository.topRepos) && repository.topRepos.length > 0 ? React.createElement(
          View,
          { style: styles.profileReposList },
          React.createElement(Text, { style: styles.profileReposTitle }, 'Most Active Repositories:'),
          ...repository.topRepos.map((repo, idx) =>
            React.createElement(
              Text,
              { key: idx, style: styles.profileRepo },
              `${repo.name || 'Unknown'} (${repo.commits || 0} commits)`
            )
          )
        ) : null
      ) : null,

      // Stats Section (with defensive checks)
      React.createElement(
        View,
        { style: styles.statsSection },
        React.createElement(Text, { style: styles.sectionTitle }, 'Statistics'),
        React.createElement(
          View,
          { style: styles.statsGrid },
          React.createElement(
            View,
            { style: styles.statCard },
            React.createElement(Text, { style: styles.statValue }, String(stats.totalCommits ?? 0)),
            React.createElement(Text, { style: styles.statLabel }, 'Total Commits')
          ),
          React.createElement(
            View,
            { style: styles.statCard },
            React.createElement(Text, { style: styles.statValue }, String(stats.lateNightCommits ?? 0)),
            React.createElement(Text, { style: styles.statLabel }, 'Late Night Commits'),
            React.createElement(Text, { style: styles.statSubtitle }, `${stats.lateNightPercentage ?? 0}%`)
          )
        )
      ),

      // Roasts Section (no emojis)
      React.createElement(
        View,
        { style: styles.roastsSection },
        React.createElement(Text, { style: styles.sectionTitle }, 'The Roasts'),
        ...(roasts && Array.isArray(roasts) ? roasts.map((roast, index) =>
          React.createElement(
            View,
            { key: index, style: styles.roastCard },
            // Just title and content, no emoji display (strip markdown for PDF)
            React.createElement(Text, { style: styles.roastTitle }, stripMarkdown(roast.title || 'Untitled')),
            React.createElement(Text, { style: styles.roastContent }, stripMarkdown(roast.content || '')),
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

      // Achievements Section (no emoji, with type checking)
      achievements && Array.isArray(achievements) && achievements.length > 0 ? React.createElement(
        View,
        { style: styles.achievementsSection },
        React.createElement(
          Text,
          { style: [styles.sectionTitle, { color: '#fbbf24' }] },
          'Dubious Achievements Unlocked'
        ),
        ...achievements.map((achievement, index) =>
          React.createElement(
            View,
            { key: index, style: styles.achievementCard },
            React.createElement(
              Text,
              { style: styles.achievementTitle },
              stripMarkdown(achievement.title || 'Achievement')
            ),
            React.createElement(
              Text,
              { style: styles.achievementDescription },
              stripMarkdown(achievement.description || '')
            )
          )
        )
      ) : null,

      // Suggestions Section (no emoji, with type checking)
      suggestions && Array.isArray(suggestions) && suggestions.length > 0 ? React.createElement(
        View,
        { style: styles.suggestionsSection },
        React.createElement(
          Text,
          { style: [styles.sectionTitle, { color: '#10b981' }] },
          'Suggestions for Improvement'
        ),
        ...suggestions.map((suggestion, index) =>
          React.createElement(
            Text,
            { key: index, style: styles.suggestionItem },
            `• ${stripMarkdown(typeof suggestion === 'string' ? suggestion : String(suggestion || ''))}`
          )
        )
      ) : null,

      // Footer (no emoji)
      React.createElement(
        View,
        { style: styles.footer },
        React.createElement(Text, { style: styles.footerBold }, 'Made with fire and absolutely no mercy'),
        React.createElement(Text, null, `Get your own roast at ${websiteUrl}`)
      )
    )
  );
}
