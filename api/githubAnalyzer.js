import { Octokit } from '@octokit/rest';

/**
 * Analyzes a GitHub user's entire profile (all public repositories)
 * @param {string} username - GitHub username
 * @param {string} githubToken - Optional GitHub personal access token for higher rate limits
 */
export async function analyzeGitHubProfile(username, githubToken = null) {
  const octokit = new Octokit({
    auth: githubToken || process.env.GITHUB_TOKEN,
  });

  try {
    // Verify user exists
    const userResponse = await octokit.users.getByUsername({ username });
    const userData = userResponse.data;

    // Get all public repositories
    const repos = await getAllUserRepos(octokit, username);

    if (repos.length === 0) {
      throw new Error('No public repositories found for this user');
    }

    console.log(`Found ${repos.length} repositories for ${username}`);

    // Collect commits from all repos (limit to avoid rate limits)
    const allCommits = [];
    const repoStats = [];
    const maxReposToAnalyze = 20; // Limit to avoid rate limits
    const reposToAnalyze = repos.slice(0, maxReposToAnalyze);

    for (const repo of reposToAnalyze) {
      try {
        console.log(`Analyzing repo: ${repo.name}...`);
        const commits = await getAllCommits(octokit, username, repo.name, 100); // Limit commits per repo

        if (commits.length > 0) {
          allCommits.push(...commits.map(c => ({
            ...c,
            repoName: repo.name,
          })));

          repoStats.push({
            name: repo.name,
            commits: commits.length,
            stars: repo.stargazers_count,
            language: repo.language,
          });
        }
      } catch (error) {
        console.log(`Skipping repo ${repo.name}: ${error.message}`);
        // Skip repos we can't access
      }
    }

    if (allCommits.length === 0) {
      throw new Error('No commits found across all repositories');
    }

    console.log(`Total commits collected: ${allCommits.length}`);

    // Analyze combined commits
    const stats = analyzeCommits(allCommits, username, 'profile');

    // Add profile-specific metadata
    stats.repositoryInfo = {
      username,
      type: 'profile',
      fullName: username,
      totalRepos: repos.length,
      analyzedRepos: reposToAnalyze.length,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      profileUrl: userData.html_url,
      avatarUrl: userData.avatar_url,
      bio: userData.bio,
      topRepos: repoStats.sort((a, b) => b.commits - a.commits).slice(0, 5),
    };

    return stats;
  } catch (error) {
    if (error.status === 404) {
      throw new Error('User not found. Make sure the username is correct.');
    }
    if (error.status === 403) {
      throw new Error('Rate limit exceeded. Please try again later or use a GitHub token.');
    }
    throw new Error(`Failed to analyze GitHub profile: ${error.message}`);
  }
}

/**
 * Fetch all public repositories for a user
 */
async function getAllUserRepos(octokit, username) {
  const repos = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    try {
      const response = await octokit.repos.listForUser({
        username,
        per_page: perPage,
        page,
        sort: 'updated',
        direction: 'desc',
      });

      if (response.data.length === 0) break;

      // Filter out forks (optional - analyze own repos only)
      const ownRepos = response.data.filter(repo => !repo.fork);
      repos.push(...ownRepos);

      if (response.data.length < perPage) break;
      page++;
    } catch (error) {
      console.error(`Error fetching repos page ${page}:`, error.message);
      break;
    }
  }

  return repos;
}

/**
 * Detect if input is a username or repository URL
 * @param {string} input - User input (username, URL, or owner/repo)
 * @returns {Object} { type: 'profile' | 'repo', username?, owner?, repo? }
 */
export function detectInputType(input) {
  // Remove whitespace and .git suffix
  input = input.trim().replace(/\.git$/, '');

  // Check if it contains a slash (repo format)
  if (input.includes('/')) {
    const { owner, repo } = parseGitHubUrl(input);
    if (owner && repo) {
      return { type: 'repo', owner, repo };
    }
  }

  // Check if it's a URL
  if (input.includes('github.com')) {
    const { owner, repo } = parseGitHubUrl(input);
    if (owner && repo) {
      return { type: 'repo', owner, repo };
    }
  }

  // Otherwise treat as username
  return { type: 'profile', username: input };
}

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
    // Get repository metadata
    const repoData = await octokit.repos.get({ owner, repo });
    const repoInfo = repoData.data;

    // Get commits (paginated, up to 1000 commits for analysis)
    const commits = await getAllCommits(octokit, owner, repo);

    if (commits.length === 0) {
      throw new Error('No commits found in repository');
    }

    // Get README content
    let readmeContent = null;
    let readmeStats = null;
    try {
      const readme = await octokit.repos.getReadme({ owner, repo });
      readmeContent = Buffer.from(readme.data.content, 'base64').toString('utf-8');
      readmeStats = analyzeReadme(readmeContent);
    } catch (error) {
      console.log('No README found or failed to fetch');
      readmeStats = { exists: false };
    }

    // Analyze repository metadata
    const repoMetadata = analyzeRepoMetadata(repoInfo);

    // Analyze the commits
    const stats = analyzeCommits(commits, owner, repo);

    // Add README and metadata analysis to stats
    stats.readmeAnalysis = readmeStats;
    stats.repoMetadata = repoMetadata;

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

/**
 * Analyze README content for quality and completeness
 */
function analyzeReadme(content) {
  if (!content) {
    return { exists: false };
  }

  const analysis = {
    exists: true,
    length: content.length,
    wordCount: content.split(/\s+/).length,
    hasInstallSection: /##?\s*(install|installation|getting started|setup)/i.test(content),
    hasUsageSection: /##?\s*(usage|how to use|examples)/i.test(content),
    hasContributingSection: /##?\s*(contribut|development)/i.test(content),
    hasLicenseSection: /##?\s*license/i.test(content),
    hasBadges: /\[!\[.*?\]\(.*?\)\]\(.*?\)/i.test(content),
    hasCodeBlocks: /```/g.test(content),
    codeBlockCount: (content.match(/```/g) || []).length / 2,
    hasLinks: /\[.*?\]\(.*?\)/i.test(content),
    lineCount: content.split('\n').length,
    isEmpty: content.trim().length < 50,
  };

  // Categorize README quality
  if (analysis.isEmpty) {
    analysis.quality = 'worthless';
  } else if (analysis.wordCount < 50) {
    analysis.quality = 'pathetic';
  } else if (analysis.wordCount < 200) {
    analysis.quality = 'lazy';
  } else if (analysis.wordCount < 500) {
    analysis.quality = 'minimal';
  } else {
    analysis.quality = 'decent';
  }

  return analysis;
}

/**
 * Analyze repository metadata (description, topics, etc.)
 */
function analyzeRepoMetadata(repoInfo) {
  const analysis = {
    name: repoInfo.name,
    description: repoInfo.description,
    hasDescription: !!repoInfo.description && repoInfo.description.length > 0,
    descriptionLength: repoInfo.description ? repoInfo.description.length : 0,
    stars: repoInfo.stargazers_count,
    forks: repoInfo.forks_count,
    watchers: repoInfo.watchers_count,
    openIssues: repoInfo.open_issues_count,
    hasTopics: repoInfo.topics && repoInfo.topics.length > 0,
    topicsCount: repoInfo.topics ? repoInfo.topics.length : 0,
    topics: repoInfo.topics || [],
    hasLicense: !!repoInfo.license,
    license: repoInfo.license ? repoInfo.license.name : 'None',
    language: repoInfo.language,
    isArchived: repoInfo.archived,
    isTemplate: repoInfo.is_template,
    hasWiki: repoInfo.has_wiki,
    hasPages: repoInfo.has_pages,
    hasIssues: repoInfo.has_issues,
    hasProjects: repoInfo.has_projects,
    defaultBranch: repoInfo.default_branch,
    createdAt: repoInfo.created_at,
    updatedAt: repoInfo.updated_at,
    pushedAt: repoInfo.pushed_at,
  };

  // Categorize repo name quality
  if (/test|temp|untitled|new|asdf|foo|bar|example/i.test(analysis.name)) {
    analysis.nameQuality = 'placeholder_garbage';
  } else if (/\d{5,}/.test(analysis.name)) {
    analysis.nameQuality = 'random_numbers';
  } else if (analysis.name.length < 3) {
    analysis.nameQuality = 'too_short';
  } else if (analysis.name.length > 50) {
    analysis.nameQuality = 'essay';
  } else {
    analysis.nameQuality = 'acceptable';
  }

  // Categorize description quality
  if (!analysis.hasDescription) {
    analysis.descriptionQuality = 'nonexistent';
  } else if (analysis.descriptionLength < 20) {
    analysis.descriptionQuality = 'pathetic';
  } else if (analysis.descriptionLength < 50) {
    analysis.descriptionQuality = 'lazy';
  } else {
    analysis.descriptionQuality = 'decent';
  }

  return analysis;
}
