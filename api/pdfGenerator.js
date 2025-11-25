import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

/**
 * PDF Generator for GitRoast Reports
 * Uses @react-pdf/renderer for server-side PDF generation
 * Creates professional, styled PDFs from roast data
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
    border: '2px solid #a855f7',
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
    gap: 15,
  },
  statCard: {
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 8,
    border: '1px solid #a855f7',
    width: '48%',
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
    border: '1px solid #ef4444',
    marginBottom: 12,
  },
  roastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  roastEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  roastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
    flex: 1,
  },
  roastContent: {
    fontSize: 12,
    color: '#d1d5db',
    lineHeight: 1.5,
  },
  severityDots: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 4,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
    border: '1px solid #10b981',
  },
  suggestionItem: {
    fontSize: 11,
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

// PDF Document Component
export const RoastPDF = ({ roastData }) => {
  const { repository, stats, grade, roasts, suggestions } = roastData;

  // Generate filename-friendly repo name
  const repoName = repository?.fullName || repository?.username || 'Unknown';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🔥 GitRoast Report 🔥</Text>
          <Text style={styles.subtitle}>{repoName}</Text>
          <Text style={styles.subtitle}>
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>

        {/* Grade Section */}
        <View style={styles.gradeSection}>
          <Text style={styles.gradeBadge}>{grade}</Text>
          <Text style={styles.gradeLabel}>Overall Grade</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📊 Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalCommits}</Text>
              <Text style={styles.statLabel}>Total Commits</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.lateNightCommits}</Text>
              <Text style={styles.statLabel}>Late Night Commits</Text>
              <Text style={styles.statSubtitle}>{stats.lateNightPercentage}%</Text>
            </View>
          </View>
        </View>

        {/* Roasts Section */}
        <View style={styles.roastsSection}>
          <Text style={styles.sectionTitle}>🔥 The Roasts</Text>
          {roasts && roasts.map((roast, index) => (
            <View key={index} style={styles.roastCard}>
              <View style={styles.roastHeader}>
                <Text style={styles.roastEmoji}>{roast.emoji}</Text>
                <Text style={styles.roastTitle}>{roast.title}</Text>
              </View>
              <Text style={styles.roastContent}>{roast.content}</Text>
              {roast.severity && (
                <View style={styles.severityDots}>
                  {[...Array(5)].map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.severityDot,
                        i < roast.severity ? styles.severityActive : styles.severityInactive
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Suggestions Section */}
        {suggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsSection}>
            <Text style={[styles.sectionTitle, { color: '#10b981' }]}>
              💡 Suggestions for Improvement
            </Text>
            {suggestions.map((suggestion, index) => (
              <Text key={index} style={styles.suggestionItem}>
                • {suggestion}
              </Text>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBold}>Made with 🔥 and absolutely no mercy</Text>
          <Text>Get your own roast at gitroast.com</Text>
        </View>
      </Page>
    </Document>
  );
};
