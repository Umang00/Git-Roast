import Bottleneck from 'bottleneck';

/**
 * Retry Utilities with Exponential Backoff
 * Handles API rate limiting and transient failures gracefully
 */

/**
 * Bottleneck limiter for GitHub API
 * Configured for safe rate limiting:
 * - 60 requests per minute (reservoir refreshes every 60s)
 * - Max 10 concurrent requests
 * - Min 100ms between requests
 *
 * Note: GitHub's actual limits are:
 * - Without token: 60 req/hour
 * - With token: 5000 req/hour
 * Our conservative settings prevent bursting into rate limits.
 */
export const githubLimiter = new Bottleneck({
  minTime: 100, // Minimum 100ms between requests
  maxConcurrent: 10, // Max 10 concurrent requests
  reservoir: 60, // Start with 60 requests
  reservoirRefreshAmount: 60,
  reservoirRefreshInterval: 60 * 1000, // Refresh every minute
});

/**
 * Bottleneck limiter for Gemini API
 * Free tier: 15 RPM (requests per minute)
 * Uses reservoir-based rate limiting to avoid artificial delays on single requests
 */
export const geminiLimiter = new Bottleneck({
  maxConcurrent: 1, // One request at a time to avoid rate limit bursts
  reservoir: 15, // 15 requests available
  reservoirRefreshAmount: 15, // Refill to 15 requests
  reservoirRefreshInterval: 60 * 1000, // Every 60 seconds
});

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @returns {Promise} Result of the function
 */
export async function withRetry(fn, options = {}) {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 16000,
    backoffFactor = 2,
    retryOn = [429, 500, 502, 503, 504], // HTTP status codes to retry
    onRetry = null,
  } = options;

  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Check if we should retry
      const shouldRetry =
        attempt < maxRetries &&
        (retryOn.includes(error.status) ||
         retryOn.includes(error.response?.status) ||
         error.message?.includes('429') ||
         error.message?.includes('rate limit'));

      if (!shouldRetry) {
        throw error;
      }

      // Add jitter to prevent thundering herd (±25% of delay)
      const jitter = delay * 0.25 * (Math.random() - 0.5);
      const actualDelay = Math.round(delay + jitter);

      // Log retry attempt
      console.warn(
        `Attempt ${attempt + 1}/${maxRetries + 1} failed: ${error.message}. ` +
        `Retrying in ${actualDelay}ms...`
      );

      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(attempt, error, actualDelay);
      }

      // Wait before retrying
      await sleep(actualDelay);

      // Increase delay with exponential backoff
      delay = Math.min(delay * backoffFactor, maxDelay);
    }
  }
}

/**
 * Sleep utility
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after ms
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wrap GitHub API calls with rate limiting and retries
 * @param {Function} fn - GitHub API function
 * @returns {Promise} Result of the API call
 */
export async function withGitHubRetry(fn) {
  return githubLimiter.schedule(() =>
    withRetry(fn, {
      maxRetries: 3,
      initialDelay: 2000,
      retryOn: [403, 429, 500, 502, 503, 504], // Include 403 for rate limit
      onRetry: (attempt, error, delay) => {
        console.log(`GitHub API retry ${attempt + 1}: ${error.message}`);
      }
    })
  );
}

/**
 * Wrap Gemini API calls with rate limiting and retries
 * @param {Function} fn - Gemini API function
 * @returns {Promise} Result of the API call
 */
export async function withGeminiRetry(fn) {
  return geminiLimiter.schedule(() =>
    withRetry(fn, {
      maxRetries: 2, // Less retries for AI (fails faster)
      initialDelay: 4000,
      retryOn: [429, 500, 502, 503, 504],
      onRetry: (attempt, error, delay) => {
        console.log(`Gemini API retry ${attempt + 1}: ${error.message}`);
      }
    })
  );
}
