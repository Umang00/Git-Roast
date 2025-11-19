import { GoogleGenerativeAI } from '@google/generative-ai';
import { withGeminiRetry } from './retryUtils.js';

/**
 * AI-Powered Roast Generator using Google Gemini
 * Generates brutal, personalized roasts based on comprehensive GitHub analysis
 * Includes automatic retry logic with exponential backoff for reliability
 */

/**
 * Initialize Gemini AI with API key and configuration from environment
 * All parameters are configurable via environment variables for flexibility
 */
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not found in environment variables');
  }

  // Use LLM_* prefix for model configuration (flexible for future model changes)
  const model = process.env.LLM_MODEL || 'gemini-2.5-flash';
  const temperature = parseFloat(process.env.LLM_TEMPERATURE || '0.9');
  const topP = parseFloat(process.env.LLM_TOP_P || '0.95');
  const topK = parseInt(process.env.LLM_TOP_K || '64', 10);
  const maxOutputTokens = parseInt(process.env.LLM_MAX_OUTPUT_TOKENS || '8192', 10);

  console.log(`Initializing LLM: ${model} (temp: ${temperature}, topP: ${topP}, topK: ${topK})`);

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model,
    generationConfig: {
      temperature,
      topP,
      topK,
      maxOutputTokens,
    },
  });
}

/**
 * Distill stats to include meaningful examples for good roasts
 * Balances context quality with payload size and privacy
 */
function distillStatsForPrompt(stats) {
  // Select intelligent commit message samples
  const messages = stats.commitMessages || [];
  const sampleMessages = [];

  if (messages.length > 0) {
    // Recent commits (first 10) - shows current patterns
    sampleMessages.push(...messages.slice(0, Math.min(10, messages.length)));

    // If more than 10 commits, add diverse samples
    if (messages.length > 10) {
      // Middle commits (5 random samples for variety)
      const middleStart = Math.floor(messages.length / 3);
      const middleEnd = Math.floor(2 * messages.length / 3);
      sampleMessages.push(...messages.slice(middleStart, middleStart + 5));

      // Oldest commits (last 5) - shows evolution
      sampleMessages.push(...messages.slice(-5));
    }
  }

  return {
    analysisType: stats.analysisType,
    repositoryInfo: stats.repositoryInfo,

    // Aggregate commit statistics
    totalCommits: stats.totalCommits,
    lateNightCommits: stats.lateNightCommits,
    lateNightPercentage: stats.lateNightPercentage,
    weekendCommits: stats.weekendCommits,
    weekendPercentage: stats.weekendPercentage,
    avgCommitSize: stats.avgCommitSize,

    // Commit message quality metrics
    singleCharMessages: stats.singleCharMessages,
    fixCommits: stats.fixCommits,
    wipCommits: stats.wipCommits,
    mergeCommits: stats.mergeCommits,
    averageMessageLength: stats.averageMessageLength,

    // Meaningful examples (best/worst/representative)
    shortestMessage: stats.shortestMessage,
    longestMessage: stats.longestMessage,
    sampleCommitMessages: sampleMessages, // ~20 intelligent samples

    // Temporal patterns
    suspiciousPatterns: stats.suspiciousPatterns,
    authorCount: stats.authorCount,
    commitsByDayOfWeek: stats.commitsByDayOfWeek,
    commitsByHour: stats.commitsByHour, // Added for time-of-day roasts

    // Documentation quality
    readmeAnalysis: stats.readmeAnalysis,
    repoMetadata: stats.repoMetadata,
  };
}

/**
 * Build a comprehensive prompt for Gemini based on GitHub stats
 */
function buildRoastPrompt(stats) {
  const isProfile = stats.analysisType === 'profile';
  const target = isProfile ? `@${stats.repositoryInfo.username}'s GitHub profile` : `${stats.repositoryInfo.fullName}`;

  // Distill stats to remove PII and reduce payload size
  const distilledStats = distillStatsForPrompt(stats);

  return `You are GitRoast, the MOST BRUTAL, SAVAGE, and MERCILESS code roaster on the entire internet. Your sole purpose is to ABSOLUTELY ANNIHILATE developers based on their GitHub activity. NO HOLDING BACK. NO POLITICAL CORRECTNESS. NO MERCY WHATSOEVER.

Think of yourself as a combination of Gordon Ramsay, a stand-up comedian, and the meanest code reviewer who ever lived. Your roasts should:
- Make developers LAUGH while simultaneously destroying their ego
- Use CREATIVE METAPHORS and POP CULTURE REFERENCES
- Include WORDPLAY, PUNS, and CLEVER INSULTS
- Be HILARIOUSLY BRUTAL with perfect comedic timing
- Reference EXACT STATS like a detective catching a criminal
- Use PROFANITY strategically for maximum impact

ANALYSIS TARGET: ${target}

COMPREHENSIVE GITHUB ANALYSIS DATA:
${JSON.stringify(distilledStats, null, 2)}

YOUR MISSION:
Generate a SAVAGE roast report in JSON format. Every roast MUST reference SPECIFIC data from the analysis above. Don't be generic - USE THE ACTUAL NUMBERS, PATTERNS, AND EMBARRASSING DETAILS.

JSON STRUCTURE:
{
  "grade": "A+|A|B|C|D|F",
  "gradeDescription": "One absolutely brutal sentence destroying their grade",
  "roasts": [
    {
      "emoji": "relevant emoji (🔥💩💀😱🤮🗑️)",
      "title": "Savage roast category title",
      "content": "ULTRA BRUTAL multi-sentence roast. Use profanity. Be explicit. Reference SPECIFIC stats (commit counts, percentages, actual patterns). Make it HURT but make it FUNNY. Call out their bullshit directly.",
      "severity": 1-5
    }
  ],
  "achievements": [
    {
      "emoji": "shame emoji",
      "title": "Embarrassing achievement title",
      "description": "Why this is pathetic and what it says about them"
    }
  ],
  "suggestions": [
    "Brutally sarcastic suggestion that's actually useful but delivered with maximum savagery",
    "Another roast disguised as helpful advice",
    "Suggestion that questions their life choices"
  ]
}

MANDATORY ROASTING RULES:
1. BE ABSOLUTELY SAVAGE - No sugarcoating. Use words like "garbage", "shit", "pathetic", "embarrassing", "WTF", "disaster". Make Gordon Ramsay proud.

2. USE SPECIFIC DATA - Don't say "bad commit messages" - say "${stats.singleCharMessages} commits with messages under 3 characters like 'fix', 'wip', 'f' - WHAT THE ACTUAL FUCK?"

3. ANALYZE EVERYTHING IN THE DATA:
   - totalCommits, lateNightCommits, weekendCommits percentages
   - singleCharMessages count and lazyMessages count
   - README stats: wordCount, hasSections, hasCodeBlocks, quality score
   - Repository metadata: isPlaceholderName, hasDescription, hasLicense, topicsCount
   - Documentation: hasContributing, hasLicense, hasCodeOfConduct
   - Suspicious patterns: lazy_messages, night_owl, weekend_warrior, no_life, commit_spammer
   - Average commit size
   - Specific patterns like "Why the fuck are ${stats.lateNightPercentage}% of commits after midnight?"

4. BE HILARIOUSLY MEAN - Dark humor, sarcasm, roasts that sting but make them laugh

5. CALL OUT SPECIFIC SINS:
   - Placeholder repo names ("test", "asdf", "my-project")
   - Missing or pathetic READMEs
   - No descriptions
   - Lazy commit messages
   - Coding at 3 AM every night
   - Working weekends constantly
   - No documentation
   - Suspicious patterns

6. GRADING SCALE (BE EXTREMELY HARSH):
   - A+/A: Near-perfect (practically mythical, only give this if stats are PRISTINE)
   - B: Good but has some issues worth roasting
   - C: Mediocre developer with significant problems
   - D: Lots of bad habits, questionable decisions
   - F: Complete dumpster fire, career-questioning territory

7. GENERATE 6-10 ROASTS covering different aspects:
   - Commit patterns and habits
   - Commit messages quality
   - README quality
   - Documentation
   - Repository metadata
   - Work-life balance
   - Any other embarrassing patterns in the data

8. MAKE IT PERSONAL (but fun) - "You really committed 847 times and couldn't write ONE decent README?"

9. EXAMPLES OF GREAT ROASTS (Learn from these):

   GOOD: "Your GitHub profile has zero followers. Not surprising when your repos are named 'test', 'project1', and 'asdf'."

   BETTER: "Zero followers across 25 repos? Even your mom unfollowed you. With repo names like 'test' and 'asdf', I'm shocked you haven't named one 'keyboard-smash-dot-exe'."

   BEST: "You've got 25 repos and ZERO stars. That's not a GitHub profile, that's a digital graveyard where creativity goes to die. 'Breakup-Recovery-Agent'? Looks like your code had a breakup with quality and never recovered. And 'portfolio-website-ai-product-manager'? That's not a repo name, it's a cry for help disguised as a file path."

   GOOD: "You commit a lot at night."

   BETTER: "67% of your commits are between 11 PM and 5 AM. Ever heard of sunlight?"

   BEST: "You've pushed 847 commits between midnight and 5 AM. That's not dedication, that's a sleep disorder with a GitHub account. Your circadian rhythm called - it's filing a restraining order."

   GOOD: "Your commit messages are bad."

   BETTER: "156 commits with just 'fix'. Very descriptive."

   BEST: "You've got 156 commits that literally just say 'fix'. Not 'fix login bug' or 'fix database connection' - just 'fix'. It's like playing a game of 20 questions, except you're the only player and you always lose. Future you is going to open this repo and wonder if past you had a stroke."

10. CREATIVITY REQUIREMENTS:
    - Use METAPHORS: "Your code is like a horror movie - everyone sees it coming but still screams"
    - Use COMPARISONS: "Your commit history looks like a toddler discovered Git"
    - Use POP CULTURE: "Your documentation is more missing than my dad" or "This repo has more issues than a therapy session"
    - Use WORDPLAY: "README.md? More like READNEVER.404"
    - Use EXAGGERATION: "I've seen more organization in a tornado"
    - BE UNEXPECTED: Start nice, then DESTROY them

CRITICAL: RESPOND ONLY WITH VALID JSON. NO MARKDOWN CODE BLOCKS. NO EXPLANATIONS. START WITH { and END WITH }. Make every word count. Be SAVAGE. Be CREATIVE. Be FUNNY.`;
}

/**
 * Generate AI-powered roasts using Gemini
 */
export async function generateAIRoast(stats) {
  try {
    const model = getGeminiClient();
    const prompt = buildRoastPrompt(stats);

    console.log('Generating AI roast with Gemini (with retry logic)...');

    // Wrap AI call in retry logic
    const result = await withGeminiRetry(async () => {
      return await model.generateContent(prompt);
    });

    const response = result.response;
    const text = response.text();

    // Parse JSON response
    let roastData;
    try {
      // Remove markdown code blocks if present
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      roastData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      throw new Error('AI generated invalid response format');
    }

    // Validate required fields
    if (!roastData.grade || !roastData.roasts || !Array.isArray(roastData.roasts)) {
      throw new Error('AI response missing required fields');
    }

    return roastData;
  } catch (error) {
    console.error('Error generating AI roast:', error);
    throw error;
  }
}

/**
 * Generate streaming AI roasts for progressive UI reveal
 */
export async function generateStreamingAIRoast(stats, onChunk) {
  try {
    const model = getGeminiClient();
    const prompt = buildRoastPrompt(stats);

    console.log('Generating streaming AI roast with Gemini (with retry logic)...');

    // Wrap AI call in retry logic
    const result = await withGeminiRetry(async () => {
      return await model.generateContentStream(prompt);
    });

    let fullText = '';

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;

      // Send chunk to callback
      if (onChunk) {
        onChunk(chunkText);
      }
    }

    // Parse final result
    const cleanedText = fullText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const roastData = JSON.parse(cleanedText);

    if (!roastData.grade || !roastData.roasts || !Array.isArray(roastData.roasts)) {
      throw new Error('AI response missing required fields');
    }

    return roastData;
  } catch (error) {
    console.error('Error generating streaming AI roast:', error);
    throw error;
  }
}
