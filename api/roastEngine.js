/**
 * GitRoast Engine - Where code meets comedy 🔥
 * Generates hilarious roasts based on git repository analysis
 */

export function generateRoast(stats) {
  const roasts = [];
  const achievements = [];
  const suggestions = [];

  // Calculate grade
  const grade = calculateGrade(stats);

  // Generate roasts based on patterns
  if (stats.suspiciousPatterns.includes('night_owl')) {
    roasts.push({
      emoji: '🦉',
      title: 'The Night Owl Developer',
      content: `${stats.lateNightPercentage}% of your commits happen between 11 PM and 5 AM. Ever heard of sleep? Your code probably hasn't either. Those bugs aren't features, they're hallucinations from sleep deprivation.`,
      severity: 4
    });

    achievements.push({
      emoji: '🌙',
      title: 'Vampire Coder',
      description: `${stats.lateNightCommits} late night commits. Sunlight is your enemy.`
    });
  }

  if (stats.suspiciousPatterns.includes('no_life')) {
    roasts.push({
      emoji: '😰',
      title: 'Weekend Warrior (or Prisoner?)',
      content: `${stats.weekendPercentage}% of your commits are on weekends. Are you okay? Do you need help? Touch grass. See sunlight. Remember what human interaction feels like. Your friends miss you.`,
      severity: 5
    });

    achievements.push({
      emoji: '⛓️',
      title: 'Keyboard Prisoner',
      description: `${stats.weekendCommits} weekend commits. Freedom is a myth.`
    });
  }

  if (stats.suspiciousPatterns.includes('lazy_messages')) {
    roasts.push({
      emoji: '💩',
      title: 'The Commit Message Poet (NOT)',
      content: `You've blessed us with ${stats.singleCharMessages} commits with messages shorter than a tweet from 2006. "fix", "wip", "f" - Shakespeare could never. Future you is going to absolutely LOVE figuring out what these mean.`,
      severity: 4
    });

    suggestions.push('Write commit messages like you\'re explaining to your past self who has amnesia');
    suggestions.push('If your commit message is shorter than your variable names, you\'re doing it wrong');
  }

  if (stats.suspiciousPatterns.includes('bug_factory')) {
    roasts.push({
      emoji: '🐛',
      title: 'Bug Manufacturing Facility',
      content: `${stats.fixCommits} commits contain the word "fix". That's ${Math.round((stats.fixCommits / stats.totalCommits) * 100)}% of your commits just fixing your own mistakes. You're not developing features, you're playing whack-a-mole with bugs.`,
      severity: 5
    });

    achievements.push({
      emoji: '🏭',
      title: 'Professional Bug Creator',
      description: `${stats.fixCommits} fix commits. Job security through chaos.`
    });

    suggestions.push('Maybe try testing your code before committing? Just a wild thought.');
    suggestions.push('Write tests. I know, revolutionary concept.');
  }

  if (stats.suspiciousPatterns.includes('never_finishes')) {
    roasts.push({
      emoji: '🚧',
      title: 'The Eternal WIP',
      content: `${stats.wipCommits} "WIP" or "TODO" commits. Your code is a graveyard of good intentions. Finishing things is overrated anyway, right? Why complete one feature when you can half-finish ten?`,
      severity: 3
    });

    suggestions.push('Finish what you start. Your repo isn\'t a museum of abandoned dreams.');
  }

  // Commit message analysis
  if (stats.averageMessageLength < 20) {
    roasts.push({
      emoji: '📝',
      title: 'The Message Minimalist',
      content: `Your average commit message is ${stats.averageMessageLength} characters. War and Peace this is not. Your shortest message was "${stats.shortestMessage}". Stunning. Brave. Completely useless.`,
      severity: 3
    });
  }

  // Activity patterns
  const mostActiveHour = Object.entries(stats.commitsByHour).reduce((a, b) => b[1] > a[1] ? b : a);
  const mostActiveDay = Object.entries(stats.commitsByDayOfWeek).reduce((a, b) => b[1] > a[1] ? b : a);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  roasts.push({
    emoji: '⏰',
    title: 'Your Coding Schedule is... Interesting',
    content: `Your peak coding hour is ${formatHour(mostActiveHour[0])} on ${dayNames[mostActiveDay[0]]}. ${getScheduleRoast(parseInt(mostActiveHour[0]), parseInt(mostActiveDay[0]))}`,
    severity: 2
  });

  // Commit size
  if (stats.avgCommitSize > 500) {
    roasts.push({
      emoji: '📦',
      title: 'The Monolith Maker',
      content: `Your average commit changes ${stats.avgCommitSize} lines. Are you allergic to small, focused commits? Reviewing your PRs must be like reading War and Peace, but less interesting.`,
      severity: 3
    });

    suggestions.push('Commit early, commit often. Huge commits are the enemy of code review and your teammates\' sanity.');
  } else if (stats.avgCommitSize < 10 && stats.avgCommitSize > 0) {
    roasts.push({
      emoji: '🐭',
      title: 'Death by a Thousand Commits',
      content: `Average ${stats.avgCommitSize} lines per commit. You're version controlling like it's going out of style. Every semicolon gets its own commit, huh? Your git history reads like a shopping list.`,
      severity: 2
    });
  }

  // Total commits
  if (stats.totalCommits > 1000) {
    achievements.push({
      emoji: '🎯',
      title: 'Commit Spammer',
      description: `${stats.totalCommits} commits. The git log goes on forever.`
    });
  }

  // Multiple authors
  if (stats.authorCount === 1) {
    roasts.push({
      emoji: '🏝️',
      title: 'Solo Dev Island',
      content: `Only one contributor detected. Either you're a lone wolf genius, or nobody else wants to touch this code. Given the other roasts, I'm betting on the latter.`,
      severity: 2
    });

    achievements.push({
      emoji: '🦸',
      title: 'One Person Army',
      description: 'Solo developer. Impressive or concerning? Yes.'
    });
  }

  // Add some general suggestions
  if (suggestions.length === 0) {
    suggestions.push('Keep doing what you\'re doing, but maybe do it better?');
    suggestions.push('Consider reading "Clean Code" - then actually applying it');
  }

  suggestions.push('Remember: Git history is forever. Make it count.');
  suggestions.push('Your future self will either thank you or curse you. Choose wisely.');

  // Generate grade description
  const gradeDescriptions = {
    'A+': 'Absolutely legendary. You\'re either lying about your repo path or you\'re a coding deity.',
    'A': 'Pretty solid! Your git game is strong. Still got roasted though.',
    'B': 'Not bad, not great. You\'re the developer equivalent of a participation trophy.',
    'C': 'Mediocre with a capital M. You write code that technically works.',
    'D': 'Yikes. Your commits cry out in pain. Do better.',
    'F': 'Your git history is a crime scene. This code has violated the Geneva Conventions.',
  };

  return {
    grade: grade,
    gradeDescription: gradeDescriptions[grade],
    stats: {
      totalCommits: stats.totalCommits,
      lateNightCommits: stats.lateNightCommits,
      lateNightPercentage: stats.lateNightPercentage,
      weekendCommits: stats.weekendCommits,
      avgCommitSize: stats.avgCommitSize || 'N/A',
      authorCount: stats.authorCount,
    },
    roasts: roasts.length > 0 ? roasts : getDefaultRoasts(stats),
    achievements: achievements.length > 0 ? achievements : getDefaultAchievements(stats),
    suggestions: suggestions,
  };
}

function calculateGrade(stats) {
  let score = 100;

  // Deduct points for bad patterns
  if (stats.suspiciousPatterns.includes('night_owl')) score -= 10;
  if (stats.suspiciousPatterns.includes('no_life')) score -= 15;
  if (stats.suspiciousPatterns.includes('lazy_messages')) score -= 20;
  if (stats.suspiciousPatterns.includes('bug_factory')) score -= 25;
  if (stats.suspiciousPatterns.includes('never_finishes')) score -= 15;

  // Deduct for message quality
  if (stats.averageMessageLength < 20) score -= 10;
  if (stats.averageMessageLength < 10) score -= 10;

  // Deduct for commit size extremes
  if (stats.avgCommitSize > 500) score -= 10;
  if (stats.avgCommitSize < 10 && stats.avgCommitSize > 0) score -= 5;

  // Bonus for good commit count
  if (stats.totalCommits > 100 && stats.totalCommits < 10000) score += 5;

  // Convert score to grade
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

function formatHour(hour) {
  const h = parseInt(hour);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 || 12;
  return `${displayHour}:00 ${ampm}`;
}

function getScheduleRoast(hour, day) {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (hour >= 2 && hour < 6) {
    return 'Either you\'re incredibly dedicated or incredibly bad at time management. Sleep exists for a reason.';
  }
  if (hour >= 23 || hour < 2) {
    return 'Burning the midnight oil or just avoiding human interaction? Both are valid.';
  }
  if ((day === 0 || day === 6) && hour >= 10 && hour < 14) {
    return 'Weekend brunch? Nah, you\'re fixing that bug from Friday night. Living the dream!';
  }
  if (day >= 1 && day <= 5 && hour >= 9 && hour < 17) {
    return 'Look at you, coding during normal business hours like a functioning member of society!';
  }
  return 'Your schedule is as unique as your commit messages. Make of that what you will.';
}

function getDefaultRoasts(stats) {
  return [
    {
      emoji: '🎭',
      title: 'The Mysterious Developer',
      content: `${stats.totalCommits} commits of pure mystery. Your code is an enigma wrapped in a riddle, probably because your commit messages explain nothing.`,
      severity: 3
    },
    {
      emoji: '⚡',
      title: 'Code Velocity: Unknown',
      content: 'Your git history is so clean it\'s suspicious. Either you\'re amazing or you just started. Given you\'re here getting roasted, probably the latter.',
      severity: 2
    }
  ];
}

function getDefaultAchievements(stats) {
  return [
    {
      emoji: '🎖️',
      title: 'Git Participant',
      description: `You have ${stats.totalCommits} commits. That's... something.`
    }
  ];
}
