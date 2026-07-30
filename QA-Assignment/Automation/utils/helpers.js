/**
 * Test Automation Helper Utilities
 */

/**
 * Wait for element to be visible
 * @param {import('@playwright/test').Locator} locator
 * @param {number} [timeout=5000]
 */
export async function waitForElementVisible(locator, timeout = 5000) {
  await locator.waitFor({ state: 'visible', timeout });
}

/**
 * Wait for element to be hidden
 * @param {import('@playwright/test').Locator} locator
 * @param {number} [timeout=5000]
 */
export async function waitForElementHidden(locator, timeout = 5000) {
  await locator.waitFor({ state: 'hidden', timeout });
}

/**
 * Generate unique random email address
 * @returns {string}
 */
export function generateRandomEmail() {
  const timestamp = Date.now();
  return `qa_user_${timestamp}@webmind.ai`;
}

/**
 * Extract hostname/domain from URL string
 * @param {string} url
 * @returns {string}
 */
export function extractDomainFromUrl(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
