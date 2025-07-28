/**
 * eCareHealth API Testing Utilities
 * 
 * Common functions and helpers for API testing
 */

// Configuration object with environment settings
const API_CONFIG = {
  baseURL: 'https://stage-api.ecarehealth.com',
  tenantId: 'stage_aithinkitive',
  credentials: {
    username: 'rose.gomez@jourrapide.com',
    password: 'Pass@123'
  }
};

/**
 * Helper function to generate authentication headers
 * @param {string} token - Access token for authentication
 * @param {string} tenantId - Tenant ID to include in headers
 * @returns {Object} Headers object with auth token and common headers
 */
function getAuthHeaders(token, tenantId = API_CONFIG.tenantId) {
  return {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Content-Type': 'application/json',
    'Connection': 'keep-alive',
    'Origin': `https://${tenantId}.uat.provider.ecarehealth.com`,
    'Referer': `https://${tenantId}.uat.provider.ecarehealth.com/`,
    'X-TENANT-ID': tenantId,
    'Authorization': `Bearer ${token}`
  };
}

/**
 * Helper function to generate dates for future appointments
 * @param {number} daysFromNow - Number of days in the future
 * @param {number} hour - Hour of the day (0-23)
 * @param {number} minute - Minute of the hour (0-59)
 * @returns {string} ISO date string
 */
function getFutureDate(daysFromNow = 7, hour = 17, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

/**
 * Generate a unique identifier with timestamp
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Unique identifier
 */
function generateUniqueId(prefix = '') {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Parse JSON response safely
 * @param {Response} response - Playwright response object
 * @returns {Promise<Object>} Parsed JSON or error object
 */
async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch (error) {
    console.error('Error parsing JSON response:', error);
    return { 
      error: 'Failed to parse response',
      status: response.status(),
      statusText: response.statusText(),
      text: await response.text()
    };
  }
}

/**
 * Log response details for debugging
 * @param {Response} response - Playwright response object
 * @returns {Promise<void>}
 */
async function logResponseDetails(response) {
  console.log(`Status: ${response.status()} ${response.statusText()}`);
  console.log('Headers:', JSON.stringify(response.headers(), null, 2));
  
  try {
    const body = await response.json();
    console.log('Body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.log('Body (text):', await response.text());
  }
}

module.exports = {
  API_CONFIG,
  getAuthHeaders,
  getFutureDate,
  generateUniqueId,
  parseJsonResponse,
  logResponseDetails
}; 