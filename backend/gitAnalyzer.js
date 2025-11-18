import simpleGit from 'simple-git';
import { promises as fs } from 'fs';
import path from 'path';

export async function analyzeGitRepo(repoPath) {
  const git = simpleGit(repoPath);

  try {
    // Check if it's a git repository
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      throw new Error('Not a git repository');
    }

    // Get all commits
    const log = await git.log();
    const commits = log.all;

    if (commits.length === 0) {
      throw new Error('No commits found in repository');
    }

    // Analyze commits
    const stats = {
      totalCommits: commits.length,
      authors: new Set(),
      commitMessages: [],
      commitHours: [],
      commitDays: [],
      filesChanged: 0,
      lateNightCommits: 0,
      weekendCommits: 0,
      singleCharMessages: 0,
      fixCommits: 0,
      wipCommits: 0,
      mergeCommits: 0,
      commitSizes: [],
      averageMessageLength: 0,
      shortestMessage: null,
      longestMessage: null,
      commitsByDayOfWeek: {
        0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
      },
      commitsByHour: {},
      suspiciousPatterns: [],
      branches: [],
      recentCommits: commits.slice(0, 10),
    };

    // Initialize hourly buckets
    for (let i = 0; i < 24; i++) {
      stats.commitsByHour[i] = 0;
    }

    // Analyze each commit
    for (const commit of commits) {
      const date = new Date(commit.date);
      const hour = date.getHours();
      const day = date.getDay();
      const message = commit.message;

      stats.authors.add(commit.author_name);
      stats.commitMessages.push(message);
      stats.commitHours.push(hour);
      stats.commitDays.push(day);
      stats.commitsByHour[hour]++;
      stats.commitsByDayOfWeek[day]++;

      // Check for late night commits (11 PM to 5 AM)
      if (hour >= 23 || hour < 5) {
        stats.lateNightCommits++;
      }

      // Check for weekend commits
      if (day === 0 || day === 6) {
        stats.weekendCommits++;
      }

      // Analyze commit messages
      if (message.length <= 3) {
        stats.singleCharMessages++;
      }

      if (message.toLowerCase().includes('fix')) {
        stats.fixCommits++;
      }

      if (message.toLowerCase().match(/wip|work in progress|todo/)) {
        stats.wipCommits++;
      }

      if (message.toLowerCase().includes('merge')) {
        stats.mergeCommits++;
      }

      // Track message lengths
      if (!stats.shortestMessage || message.length < stats.shortestMessage.length) {
        stats.shortestMessage = message;
      }
      if (!stats.longestMessage || message.length > stats.longestMessage.length) {
        stats.longestMessage = message;
      }
    }

    // Calculate averages
    const totalMessageLength = stats.commitMessages.reduce((sum, msg) => sum + msg.length, 0);
    stats.averageMessageLength = Math.round(totalMessageLength / stats.commitMessages.length);

    // Get diff stats for recent commits
    try {
      const diffSummary = await git.diffSummary(['HEAD~10', 'HEAD']);
      stats.filesChanged = diffSummary.files.length;
      stats.avgCommitSize = Math.round((diffSummary.insertions + diffSummary.deletions) / 10);
    } catch (error) {
      stats.avgCommitSize = 0;
    }

    // Get branches
    try {
      const branchSummary = await git.branch();
      stats.branches = branchSummary.all;
    } catch (error) {
      stats.branches = [];
    }

    // Detect suspicious patterns
    if (stats.lateNightCommits / stats.totalCommits > 0.3) {
      stats.suspiciousPatterns.push('night_owl');
    }

    if (stats.weekendCommits / stats.totalCommits > 0.4) {
      stats.suspiciousPatterns.push('no_life');
    }

    if (stats.singleCharMessages / stats.totalCommits > 0.2) {
      stats.suspiciousPatterns.push('lazy_messages');
    }

    if (stats.fixCommits / stats.totalCommits > 0.3) {
      stats.suspiciousPatterns.push('bug_factory');
    }

    if (stats.wipCommits / stats.totalCommits > 0.15) {
      stats.suspiciousPatterns.push('never_finishes');
    }

    // Convert Set to Array for JSON serialization
    stats.authors = Array.from(stats.authors);
    stats.authorCount = stats.authors.length;
    stats.lateNightPercentage = Math.round((stats.lateNightCommits / stats.totalCommits) * 100);
    stats.weekendPercentage = Math.round((stats.weekendCommits / stats.totalCommits) * 100);

    return stats;
  } catch (error) {
    throw new Error(`Failed to analyze git repository: ${error.message}`);
  }
}
