/**
 * Common utility functions for tests
 */

/**
 * General helper functions
 */

/**
 * Generate a random email address
 * @param {string} domain - Domain name for the email
 * @returns {string} Random email address
 */
function generateRandomEmail(domain = 'example.com') {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `test.${randomString}.${timestamp}@${domain}`;
}

/**
 * Generate a random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
function generateRandomString(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Wait for a specific duration
 * @param {number} ms - Duration in milliseconds
 * @returns {Promise<void>}
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format date to string
 * @param {Date} date - Date object
 * @returns {string}
 */
function formatDate(date = new Date()) {
  return date.toISOString().split('T')[0];
}

module.exports = {
  generateRandomEmail,
  generateRandomString,
  wait
}; 