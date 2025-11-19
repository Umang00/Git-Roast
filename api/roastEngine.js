/**
 * GitRoast Engine - Where code meets comedy 🔥
 * Generates BRUTAL roasts based on git repository analysis
 * NO MERCY. NO HOLDING BACK.
 */

export function generateRoast(stats) {
  const roasts = [];
  const achievements = [];
  const suggestions = [];

  // Calculate grade
  const grade = calculateGrade(stats);

  // Generate SAVAGE roasts based on patterns
  if (stats.suspiciousPatterns.includes('night_owl')) {
    roasts.push({
      emoji: '🦉',
      title: 'Certified Nocturnal Disaster',
      content: `${stats.lateNightPercentage}% of your commits are between 11 PM and 5 AM. Are you okay? Seriously. This isn't dedication, this is a cry for help. Your code reeks of sleep deprivation and Monster Energy. Every 3 AM commit is probably introducing bugs that 9 AM you has to fix. You're not a night owl, you're a walking liability with a GitHub account.`,
      severity: 5
    });

    achievements.push({
      emoji: '🌙',
      title: 'Vampire Code Goblin',
      description: `${stats.lateNightCommits} commits made while the rest of humanity sleeps. Sunlight is your mortal enemy.`
    });

    suggestions.push('Get some fucking sleep. Your code quality drops 50% after midnight and it shows.');
    suggestions.push('Those energy drinks aren\'t a personality trait. They\'re a coping mechanism.');
  }

  if (stats.suspiciousPatterns.includes('no_life')) {
    roasts.push({
      emoji: '💀',
      title: 'Weekend Prisoner - Life Status: Nonexistent',
      content: `${stats.weekendPercentage}% weekend commits. ${stats.weekendCommits} times you chose code over literally anything else. While normal people are living their lives, you're here, alone with your bugs. Your family has forgotten your face. Your friends have moved on. But hey, at least your git commit streak is intact, right? RIGHT?! This is genuinely concerning.`,
      severity: 5
    });

    achievements.push({
      emoji: '⛓️',
      title: 'Stockholm Syndrome: Developer Edition',
      description: `${stats.weekendCommits} weekend commits. You've been held hostage by your IDE so long you forgot what freedom tastes like.`
    });

    suggestions.push('Touch grass. I\'m serious. Go outside. The sun won\'t kill you, I promise.');
    suggestions.push('Your commit streak isn\'t worth your mental health. Log off.');
  }

  if (stats.suspiciousPatterns.includes('lazy_messages')) {
    roasts.push({
      emoji: '💩',
      title: 'Commit Message War Criminal',
      content: `${stats.singleCharMessages} commits with messages under 3 characters. "fix", "wip", "f", "asdf" - WHAT THE FUCK DOES THIS MEAN?! You're not being efficient, you're being a selfish prick to everyone (including future you) who has to understand this garbage. Your commit messages read like a caveman discovered Git. This is unacceptable. Learn to communicate like a goddamn adult.`,
      severity: 5
    });

    suggestions.push('Write commit messages like your job depends on it. Because one day, it will.');
    suggestions.push('"fix" isn\'t a commit message. It\'s the sound your career makes when people review your code.');
    suggestions.push('If you can\'t explain what you did in 10 words, you probably fucked something up.');
  }

  if (stats.suspiciousPatterns.includes('bug_factory')) {
    roasts.push({
      emoji: '🏭',
      title: 'Industrial-Scale Bug Manufacturing Plant',
      content: `${stats.fixCommits} commits with "fix" in them. That's ${Math.round((stats.fixCommits / stats.totalCommits) * 100)}% of your entire git history just unfucking your own fuckups. You're not a developer, you're playing whack-a-mole with bugs of your own creation. Every feature you add breaks two more things. Your code is held together with duct tape, prayers, and increasingly desperate "fixes". You're the reason we can't have nice things.`,
      severity: 5
    });

    achievements.push({
      emoji: '🐛',
      title: 'Professional Chaos Agent',
      description: `${stats.fixCommits} fix commits. You create more problems than you solve. This is actually impressive in the worst way possible.`
    });

    suggestions.push('WRITE. TESTS. Yes, they take time. You know what takes more time? Fixing the same bug 47 times.');
    suggestions.push('Maybe Google "what is unit testing" before pushing to prod again.');
    suggestions.push('Your definition of "working code" is terrifying.');
  }

  if (stats.suspiciousPatterns.includes('never_finishes')) {
    roasts.push({
      emoji: '🚧',
      title: 'The Commitment-Phobe - Emotional Unavailability in Code Form',
      content: `${stats.wipCommits} "WIP", "TODO", or "work in progress" commits. Your entire codebase is an abandoned construction site. You start features like you start New Year's resolutions - with enthusiasm that dies within 48 hours. Every repo is a museum of half-baked ideas and broken promises. Finishing things would require actually seeing something through to completion, which is apparently beneath you. Are you scared of success or just aggressively incompetent?`,
      severity: 4
    });

    suggestions.push('Finish ONE thing. Just ONE. I believe in you. Barely.');
    suggestions.push('Your "TODO" comments are older than some junior developers.');
  }

  // Commit message analysis - SAVAGE MODE
  if (stats.averageMessageLength < 20) {
    const messageCrimes = [
      'Your commit messages have the vocabulary of a drunk toddler.',
      'Writing coherent sentences is FREE. Why are you so cheap?',
      'Even cavemen communicated better than this.',
      'Your messages make Trump tweets look like Shakespeare.'
    ];

    roasts.push({
      emoji: '📝',
      title: 'The Illiterate Developer',
      content: `Average commit message: ${stats.averageMessageLength} characters. Your shortest message was "${stats.shortestMessage}". Wow. Just... wow. ${messageCrimes[Math.floor(Math.random() * messageCrimes.length)]} Future devs will need an archaeologist and a priest to decipher your git history. This is weaponized incompetence.`,
      severity: 4
    });

    suggestions.push('Learn to use words. Full words. In complete sentences.');
  }

  // Activity patterns - GO HARDER
  const mostActiveHour = Object.entries(stats.commitsByHour).reduce((a, b) => b[1] > a[1] ? b : a);
  const mostActiveDay = Object.entries(stats.commitsByDayOfWeek).reduce((a, b) => b[1] > a[1] ? b : a);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  roasts.push({
    emoji: '⏰',
    title: 'Your Coding Schedule Screams "Red Flags"',
    content: `Peak activity: ${formatHour(mostActiveHour[0])} on ${dayNames[mostActiveDay[0]]}. ${getSavageScheduleRoast(parseInt(mostActiveHour[0]), parseInt(mostActiveDay[0]))}`,
    severity: 3
  });

  // Commit size - NO MERCY
  if (stats.avgCommitSize > 500) {
    roasts.push({
      emoji: '📦',
      title: 'The Atomic Bomb Committer',
      content: `${stats.avgCommitSize} lines per commit on average. What the actual fuck? Are you committing monthly? Do you not understand version control? Each of your commits is a war crime against code reviewers. "Oh let me just commit 2000 lines of mixed changes with no explanation" - that's you. That's what you sound like. Your PRs must be fucking HORRIFYING. Have you ever heard of incremental changes? Small, focused commits? Or are you just rawdogging git with zero fucks given?`,
      severity: 5
    });

    suggestions.push('Small commits. Learn what they are. Use them. Your reviewers are suffering.');
    suggestions.push('Breaking changes into atomic commits isn\'t optional. It\'s basic fucking hygiene.');
  } else if (stats.avgCommitSize < 10 && stats.avgCommitSize > 0) {
    roasts.push({
      emoji: '🐭',
      title: 'Commit Spam Artist - The Human DDOS Attack',
      content: `${stats.avgCommitSize} lines per commit. Are you okay? Do you commit after every keystroke? Your git log is UNREADABLE. Scrolling through your history is like reading a fucking grocery list. "Fixed typo", "Actually fixed typo", "Fixed the fix", "Reverted fix", "Fixed again". CONSOLIDATE YOUR CHANGES. This isn't version control, it's anxiety manifest in commits.`,
      severity: 4
    });

    suggestions.push('Commit when you finish a logical unit of work. Not every time you breathe.');
  }

  // Total commits
  if (stats.totalCommits > 1000) {
    achievements.push({
      emoji: '🎯',
      title: 'Commit Count Inflation Expert',
      description: `${stats.totalCommits} commits. Quality over quantity doesn't exist in your universe.`
    });
  }

  if (stats.totalCommits < 10) {
    roasts.push({
      emoji: '👶',
      title: 'Git Noob - Fresh Meat',
      content: `${stats.totalCommits} commits total. Are you new here or just scared? This repo has the energy of someone who read "Git for Dummies" once and gave up halfway. You're either a beginner (fair) or someone who makes 5000-line commits (war crime). Either way, this is embarrassing.`,
      severity: 3
    });
  }

  // Multiple authors
  if (stats.authorCount === 1) {
    roasts.push({
      emoji: '🏝️',
      title: 'Solo Dev Island - Population: You, And Your Bugs',
      content: `One contributor. You. Alone. Nobody wants to work with you, and after seeing this git history, I understand why. You're not a "lone wolf genius" - you're someone nobody else will collaborate with. This code has "bus factor of 1" written all over it. When you're gone, this project dies. Not because you're irreplaceable, but because nobody else wants to touch this disaster.`,
      severity: 4
    });

    achievements.push({
      emoji: '🦸',
      title: 'Rejected Collaboration Applications: All of Them',
      description: 'Solo developer. Your code is so special nobody else will touch it.'
    });
  }

  // README Analysis - SAVAGE MODE
  if (stats.readmeAnalysis) {
    if (!stats.readmeAnalysis.exists) {
      roasts.push({
        emoji: '📄',
        title: 'No README? Seriously?',
        content: `No README file detected. Are you fucking kidding me? This is like opening a restaurant with no menu. How is anyone supposed to use this garbage? "Just read the code" isn't an answer, it's an excuse for being lazy. Writing a README takes 10 minutes. You had time to commit ${stats.totalCommits} times but couldn't be bothered to write ONE README? This is a special kind of selfish.`,
        severity: 5
      });
      suggestions.push('Write a README. Any README. Literally anything is better than nothing.');
      suggestions.push('If you can\'t explain your project in a README, maybe it shouldn\'t exist.');
    } else if (stats.readmeAnalysis.quality === 'worthless' || stats.readmeAnalysis.quality === 'pathetic') {
      roasts.push({
        emoji: '📝',
        title: 'README: Technically Exists, Practically Useless',
        content: `Your README is ${stats.readmeAnalysis.wordCount} words. That's it. That's the whole thing. You have a README the way a desert has water - technically present, completely useless. This isn't documentation, it's a fucking Post-it note. No installation instructions, no usage examples, no nothing. Just... empty space where effort should be. Embarrassing.`,
        severity: 4
      });
      suggestions.push('Your README should explain WHAT, WHY, and HOW. Yours explains nothing.');
    } else if (stats.readmeAnalysis.quality === 'lazy' || stats.readmeAnalysis.quality === 'minimal') {
      const missing = [];
      if (!stats.readmeAnalysis.hasInstallSection) missing.push('installation');
      if (!stats.readmeAnalysis.hasUsageSection) missing.push('usage examples');
      if (!stats.readmeAnalysis.hasLicenseSection) missing.push('license');

      roasts.push({
        emoji: '📋',
        title: 'Half-Assed Documentation Expert',
        content: `Your README exists but it's bare minimum bullshit. ${stats.readmeAnalysis.wordCount} words of vague nonsense. Missing: ${missing.join(', ')}. ${stats.readmeAnalysis.codeBlockCount < 1 ? 'Zero code examples. ZERO.' : ''} This is the README equivalent of "it works on my machine." Put some fucking effort in.`,
        severity: 3
      });
      suggestions.push('Add installation instructions. People shouldn\'t have to guess.');
      suggestions.push('Usage examples aren\'t optional. They\'re mandatory.');
    }
  }

  // Repository Metadata Analysis - NO MERCY
  if (stats.repoMetadata) {
    if (stats.repoMetadata.nameQuality === 'placeholder_garbage') {
      roasts.push({
        emoji: '🗑️',
        title: 'Repo Name: Placeholder Trash',
        content: `Your repo is named "${stats.repoMetadata.name}". Really? REALLY?! "test", "temp", "untitled", "asdf" - these aren't names, they're cries for help. This screams "I meant to change this later and forgot." Professional developers name their repos properly. You named yours like you're making a throwaway folder. This is your public face on GitHub. Show some goddamn self-respect.`,
        severity: 4
      });
      suggestions.push('Rename your repo to something that doesn\'t sound like a placeholder.');
    }

    if (stats.repoMetadata.descriptionQuality === 'nonexistent') {
      roasts.push({
        emoji: '🏷️',
        title: 'Description: Error 404 Not Found',
        content: `No repository description. Nothing. Not even a single word explaining what this is. You couldn't take 30 seconds to write ONE SENTENCE about your project? This is maximum laziness. GitHub literally gives you a description field. It's right there. And you just... ignored it. Like documentation doesn't matter. Like other people don't exist. Incredible.`,
        severity: 4
      });
      suggestions.push('Add a repo description. One sentence. That\'s all we\'re asking.');
    } else if (stats.repoMetadata.descriptionQuality === 'pathetic' || stats.repoMetadata.descriptionQuality === 'lazy') {
      roasts.push({
        emoji: '💬',
        title: 'Repo Description: Aggressively Unhelpful',
        content: `Your repo description is "${stats.repoMetadata.description}". ${stats.repoMetadata.descriptionLength} characters of pure nothing. That's not a description, that's an afterthought. "A project" - WOW THANKS SO HELPFUL. "My code" - NO SHIT. Write a real description that actually tells people what this does. Be specific. Be useful. Be anything other than this.`,
        severity: 3
      });
      suggestions.push('Describe WHAT your project does and WHY it exists.');
    }

    if (!stats.repoMetadata.hasLicense && stats.totalCommits > 20) {
      roasts.push({
        emoji: '⚖️',
        title: 'No License - Legal Gray Area Specialist',
        content: `${stats.totalCommits} commits, zero license. You know what that means? Nobody can legally use your code. Congrats, you've created work nobody can touch. "But I want it to be open source!" - then ADD A FUCKING LICENSE. It takes 2 minutes. MIT, Apache, GPL, pick one. Your code is in legal limbo because you couldn't be bothered with basic open source hygiene.`,
        severity: 3
      });
      suggestions.push('Add a license. MIT is fine. Just pick something.');
    }

    if (!stats.repoMetadata.hasTopics || stats.repoMetadata.topicsCount === 0) {
      roasts.push({
        emoji: '🏷️',
        title: 'Zero Topics - SEO Failure',
        content: `No repository topics. None. GitHub lets you add topics so people can find your repo. You said "nah." This repo is invisible. Undiscoverable. You're basically coding in a dark room with the door locked. Nobody will ever find this. But hey, at least you tried. Wait, no you didn't.`,
        severity: 2
      });
      suggestions.push('Add topics/tags. Make your repo discoverable.');
    }

    if (stats.repoMetadata.stars === 0 && stats.totalCommits > 50) {
      achievements.push({
        emoji: '⭐',
        title: 'Zero Stars - Universally Ignored',
        description: `${stats.totalCommits} commits, 0 stars. Nobody cares. Not even your mom starred this.`
      });
    }

    if (stats.repoMetadata.isArchived) {
      achievements.push({
        emoji: '⚰️',
        title: 'Repository: Officially Dead',
        description: 'This repo is archived. It\'s a corpse. A monument to abandoned dreams.'
      });
    }
  }

  // Add BRUTAL suggestions
  if (suggestions.length === 0) {
    suggestions.push('Honestly? Just start over. This is beyond saving.');
    suggestions.push('Have you considered a career in something that doesn\'t involve computers?');
  }

  suggestions.push('Git history is permanent. Yours is permanently shameful.');
  suggestions.push('Every commit is a chance to be better. You\'re wasting those chances.');
  suggestions.push('Read "Clean Code" and actually apply it, not just tweet about it.');
  suggestions.push('Documentation isn\'t optional. Write it.');

  // Generate SAVAGE grade descriptions
  const gradeDescriptions = {
    'A+': 'Holy shit, you actually know what you\'re doing. This is rare. Suspiciously rare. Did you cheat?',
    'A': 'Pretty good! Not perfect, but you\'re not actively making the world worse. Still got roasted though.',
    'B': 'Mediocre. You\'re the developer equivalent of a participation trophy. Functional, but nobody\'s impressed.',
    'C': 'Yikes. Your code technically works, but so does a hammer as a screwdriver. This is painful to watch.',
    'D': 'Oof. Big oof. Your commits make senior devs cry. Do you need help? Serious question.',
    'F': 'Genuinely catastrophic. This code is a war crime. Your git history violates the Geneva Convention. Please stop.',
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

  // Deduct points HARD for bad patterns
  if (stats.suspiciousPatterns.includes('night_owl')) score -= 15;
  if (stats.suspiciousPatterns.includes('no_life')) score -= 20;
  if (stats.suspiciousPatterns.includes('lazy_messages')) score -= 25;
  if (stats.suspiciousPatterns.includes('bug_factory')) score -= 30;
  if (stats.suspiciousPatterns.includes('never_finishes')) score -= 20;

  // Deduct for message quality
  if (stats.averageMessageLength < 20) score -= 15;
  if (stats.averageMessageLength < 10) score -= 15;

  // Deduct for commit size extremes
  if (stats.avgCommitSize > 500) score -= 15;
  if (stats.avgCommitSize < 10 && stats.avgCommitSize > 0) score -= 10;

  // Deduct for low commit count (might be new or lazy)
  if (stats.totalCommits < 10) score -= 10;

  // Deduct for documentation failures
  if (stats.readmeAnalysis) {
    if (!stats.readmeAnalysis.exists) score -= 20; // No README is a sin
    else if (stats.readmeAnalysis.quality === 'worthless' || stats.readmeAnalysis.quality === 'pathetic') score -= 15;
    else if (stats.readmeAnalysis.quality === 'lazy' || stats.readmeAnalysis.quality === 'minimal') score -= 10;
  }

  // Deduct for repo metadata failures
  if (stats.repoMetadata) {
    if (stats.repoMetadata.nameQuality === 'placeholder_garbage') score -= 10;
    if (stats.repoMetadata.descriptionQuality === 'nonexistent') score -= 10;
    else if (stats.repoMetadata.descriptionQuality === 'pathetic' || stats.repoMetadata.descriptionQuality === 'lazy') score -= 5;
    if (!stats.repoMetadata.hasLicense && stats.totalCommits > 20) score -= 5;
    if (!stats.repoMetadata.hasTopics) score -= 3;
  }

  // Bonus for reasonable commit count
  if (stats.totalCommits > 50 && stats.totalCommits < 5000) score += 5;

  // Convert score to grade (harsher grading)
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  if (score >= 35) return 'D';
  return 'F';
}

function formatHour(hour) {
  const h = parseInt(hour);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 || 12;
  return `${displayHour}:00 ${ampm}`;
}

function getSavageScheduleRoast(hour, day) {
  if (hour >= 2 && hour < 6) {
    return 'What the fuck are you doing awake at this hour? This isn\'t productivity, it\'s self-destruction with a keyboard. Go. To. Bed.';
  }
  if (hour >= 23 || hour < 2) {
    return 'Midnight coding sessions aren\'t aesthetic, they\'re a sign you need better time management and possibly therapy.';
  }
  if ((day === 0 || day === 6) && hour >= 10 && hour < 14) {
    return 'It\'s the weekend. People are brunching. Socializing. Living. You\'re here. Debugging. Alone. Is this really the life you want?';
  }
  if (day >= 1 && day <= 5 && hour >= 9 && hour < 17) {
    return 'Wow, look at you coding during normal hours like an actual professional! This might be your only redeeming quality.';
  }
  if ((day === 0 || day === 6) && (hour < 9 || hour > 20)) {
    return 'Weekend + unreasonable hours = you\'ve given up on having a life. This is the saddest flex I\'ve ever seen.';
  }
  return 'Your coding schedule is as inconsistent as your commit messages. Which is to say: a complete fucking mess.';
}

function getDefaultRoasts(stats) {
  return [
    {
      emoji: '🎭',
      title: 'The Ghost Developer',
      content: `${stats.totalCommits} commits of absolutely nothing noteworthy. Your code is so bland it makes plain oatmeal look exciting. No patterns detected because you're too boring to even fuck up in interesting ways.`,
      severity: 3
    },
    {
      emoji: '⚡',
      title: 'Suspiciously Clean (Suspiciously Useless)',
      content: 'Your git history is so clean it\'s either fake or you just started. Either way, there\'s not enough here to properly roast you, which is somehow more pathetic than having a bad history.',
      severity: 2
    }
  ];
}

function getDefaultAchievements(stats) {
  return [
    {
      emoji: '🎖️',
      title: 'Git Participant Trophy',
      description: `${stats.totalCommits} commits. Congrats on doing the bare minimum.`
    }
  ];
}
