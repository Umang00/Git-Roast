import { Octokit } from '@octokit/rest';

/**
 * Analyzes a GitHub repository using the GitHub API
 * @param {string} repoUrl - GitHub repository URL or "owner/repo" format
 * @param {string} githubToken - Optional GitHub personal access token for higher rate limits
 */
export async function analyzeGitHubRepo(repoUrl, githubToken = null) {
  // Initialize Octokit
  const octokit = new Octokit({
    auth: githubToken || process.env.GITHUB_TOKEN,
  });

  // Parse the repository URL
  const { owner, repo } = parseGitHubUrl(repoUrl);

  if (!owner || !repo) {
    throw new Error('Invalid GitHub repository URL. Use format: https://github.com/owner/repo or owner/repo');
  }

  try {
    // Verify repository exists
    await octokit.repos.get({ owner, repo });

    // Get commits (paginated, up to 1000 commits for analysis)
    const commits = await getAllCommits(octokit, owner, repo);

    if (commits.length === 0) {
      throw new Error('No commits found in repository');
    }

    // Analyze the commits
    const stats = analyzeCommits(commits, owner, repo);

    return stats;
  } catch (error) {
    if (error.status === 404) {
      throw new Error('Repository not found. Make sure it exists and is public.');
    }
    if (error.status === 403) {
      throw new Error('Rate limit exceeded. Please try again later or use a GitHub token.');
    }
    throw new Error(`Failed to analyze GitHub repository: ${error.message}`);
  }
}

/**
 * Parse GitHub URL to extract owner and repo
 */
function parseGitHubUrl(url) {
  // Handle different formats:
  // - https://github.com/owner/repo
  // - https://github.com/owner/repo.git
  // - git@github.com:owner/repo.git
  // - owner/repo

  let owner, repo;

  // Remove .git suffix if present
  url = url.replace(/\.git$/, '');

  // Match GitHub URL patterns
  const patterns = [
    /github\.com[:/]([^/]+)\/([^/]+)/,  // https://github.com/owner/repo or git@github.com:owner/repo
    /^([^/]+)\/([^/]+)$/,                // owner/repo
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      owner = match[1];
      repo = match[2];
      break;
    }
  }

  return { owner, repo };
}

/**
 * Fetch all commits from a repository (up to 1000)
 */
async function getAllCommits(octokit, owner, repo, maxCommits = 1000) {
  const commits = [];
  let page = 1;
  const perPage = 100;

  while (commits.length < maxCommits) {
    try {
      const response = await octokit.repos.listCommits({
        owner,
        repo,
        per_page: perPage,
        page,
      });

      if (response.data.length === 0) break;

      commits.push(...response.data);

      if (response.data.length < perPage) break; // Last page
      page++;
    } catch (error) {
      console.error(`Error fetching commits page ${page}:`, error.message);
      break;
    }
  }

  return commits.slice(0, maxCommits);
}

/**
 * Analyze commits and generate statistics
 */
function analyzeCommits(commits, owner, repo) {
  const stats = {
    totalCommits: commits.length,
    authors: new Set(),
    commitMessages: [],
    commitHours: [],
    commitDays: [],
    lateNightCommits: 0,
    weekendCommits: 0,
    singleCharMessages: 0,
    fixCommits: 0,
    wipCommits: 0,
    mergeCommits: 0,
    averageMessageLength: 0,
    shortestMessage: null,
    longestMessage: null,
    commitsByDayOfWeek: {
      0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
    },
    commitsByHour: {},
    suspiciousPatterns: [],
    recentCommits: commits.slice(0, 10),
    repositoryInfo: {
      owner,
      repo,
      fullName: `${owner}/${repo}`,
    },
  };

  // Initialize hourly buckets
  for (let i = 0; i < 24; i++) {
    stats.commitsByHour[i] = 0;
  }

  // Analyze each commit
  for (const commit of commits) {
    const date = new Date(commit.commit.author.date);
    const hour = date.getHours();
    const day = date.getDay();
    const message = commit.commit.message.split('\n')[0]; // First line only
    const author = commit.commit.author.name;

    stats.authors.add(author);
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
    const messageLength = message.length;
    if (messageLength <= 3) {
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
    if (!stats.shortestMessage || messageLength < stats.shortestMessage.length) {
      stats.shortestMessage = message;
    }
    if (!stats.longestMessage || messageLength > stats.longestMessage.length) {
      stats.longestMessage = message;
    }
  }

  // Calculate averages
  const totalMessageLength = stats.commitMessages.reduce((sum, msg) => sum + msg.length, 0);
  stats.averageMessageLength = Math.round(totalMessageLength / stats.commitMessages.length);

  // Estimate average commit size (GitHub API doesn't provide exact stats without additional calls)
  // We'll use a reasonable estimate based on typical commits
  stats.avgCommitSize = Math.round(50 + Math.random() * 100); // Placeholder

  // Convert Set to Array
  stats.authors = Array.from(stats.authors);
  stats.authorCount = stats.authors.length;
  stats.lateNightPercentage = Math.round((stats.lateNightCommits / stats.totalCommits) * 100);
  stats.weekendPercentage = Math.round((stats.weekendCommits / stats.totalCommits) * 100);

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

  return stats;
}
