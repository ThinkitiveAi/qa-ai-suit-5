/**
 * Authentication helper functions
 */
const config = require('../config/env');

/**
 * Login to the application with provided credentials
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} email - User email
 * @param {string} password - User password
 */
async function login(page, email = config.username, password = config.password) {
  await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/auth/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: '*********' }).click();
  await page.getByRole('textbox', { name: '*********' }).fill(password);
  await page.getByRole('button', { name: 'Let\'s get Started' }).click();
  await page.getByRole('banner').getByTestId('KeyboardArrowRightIcon').click();
}

module.exports = {
  login
}; 