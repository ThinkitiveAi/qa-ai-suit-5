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

/**
 * Convert UTC time to IST (Indian Standard Time)
 * @param {string} utcTimeString - UTC time string (e.g., "10:30 AM", "2:45 PM")
 * @returns {string} IST time string
 */
function convertUTCToIST(utcTimeString) {
  try {
    // Parse the time string
    const timeMatch = utcTimeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!timeMatch) {
      return utcTimeString; // Return original if parsing fails
    }

    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const period = timeMatch[3].toUpperCase();

    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    // Create a date object for today with the UTC time
    const utcDate = new Date();
    utcDate.setUTCHours(hours, minutes, 0, 0);

    // Convert to IST (UTC + 5:30)
    const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));

    // Format back to 12-hour format
    let istHours = istDate.getUTCHours();
    const istMinutes = istDate.getUTCMinutes();
    const istPeriod = istHours >= 12 ? 'PM' : 'AM';

    if (istHours > 12) {
      istHours -= 12;
    } else if (istHours === 0) {
      istHours = 12;
    }

    return `${istHours}:${istMinutes.toString().padStart(2, '0')} ${istPeriod}`;
  } catch (error) {
    console.error('Error converting UTC to IST:', error);
    return utcTimeString; // Return original if conversion fails
  }
}

/**
 * Convert all time elements on the page from UTC to IST
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function convertPageTimesToIST(page) {
  try {
    // Wait for time slots to load
    await page.waitForTimeout(2000);

    // Execute JavaScript in the browser to convert all time elements
    await page.evaluate(() => {
      // Helper function to convert UTC to IST (same logic as above but in browser context)
      function convertUTCToIST(utcTimeString) {
        try {
          const timeMatch = utcTimeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
          if (!timeMatch) {
            return utcTimeString;
          }

          let hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const period = timeMatch[3].toUpperCase();

          if (period === 'PM' && hours !== 12) {
            hours += 12;
          } else if (period === 'AM' && hours === 12) {
            hours = 0;
          }

          const utcDate = new Date();
          utcDate.setUTCHours(hours, minutes, 0, 0);
          const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));

          let istHours = istDate.getUTCHours();
          const istMinutes = istDate.getUTCMinutes();
          const istPeriod = istHours >= 12 ? 'PM' : 'AM';

          if (istHours > 12) {
            istHours -= 12;
          } else if (istHours === 0) {
            istHours = 12;
          }

          return `${istHours}:${istMinutes.toString().padStart(2, '0')} ${istPeriod}`;
        } catch (error) {
          return utcTimeString;
        }
      }

      // Find all elements that contain time patterns (AM/PM)
      const timeElements = document.querySelectorAll('*');
      const timePattern = /\b(\d{1,2}):(\d{2})\s*(AM|PM)\b/gi;

      timeElements.forEach(element => {
        // Check if element has text content with time pattern
        if (element.textContent && timePattern.test(element.textContent)) {
          // Only process leaf nodes (elements without child elements containing text)
          if (element.children.length === 0 || 
              (element.children.length > 0 && !Array.from(element.children).some(child => timePattern.test(child.textContent)))) {
            
            const originalText = element.textContent;
            const convertedText = originalText.replace(/\b(\d{1,2}):(\d{2})\s*(AM|PM)\b/gi, (match) => {
              const converted = convertUTCToIST(match);
              return converted + ' IST';
            });
            
            if (originalText !== convertedText) {
              element.textContent = convertedText;
            }
          }
        }

        // Also check button text content specifically
        if (element.tagName === 'BUTTON' && element.textContent && timePattern.test(element.textContent)) {
          const originalText = element.textContent;
          const convertedText = originalText.replace(/\b(\d{1,2}):(\d{2})\s*(AM|PM)\b/gi, (match) => {
            const converted = convertUTCToIST(match);
            return converted + ' IST';
          });
          
          if (originalText !== convertedText) {
            element.textContent = convertedText;
          }
        }
      });
    });

    console.log('✅ Successfully converted UTC times to IST');
  } catch (error) {
    console.error('Error converting page times to IST:', error);
  }
}

module.exports = {
  generateRandomEmail,
  generateRandomString,
  wait,
  formatDate,
  convertUTCToIST,
  convertPageTimesToIST
}; 