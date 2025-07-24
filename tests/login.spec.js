const { test, expect } = require('@playwright/test');
const env = require('../config/env');

test('Login with valid credentials', async ({ page }) => {
  // Navigate to login page
  await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/auth/login');
  
  // Fill login form
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(env.username);
  await page.getByRole('textbox', { name: '*********' }).click();
  await page.getByRole('textbox', { name: '*********' }).fill(env.password);
  
  // Submit login form
  await page.getByRole('button', { name: 'Let\'s get Started' }).click();
  
  // Verify successful login
  await page.getByRole('banner').getByTestId('KeyboardArrowRightIcon').click();
  await expect(page.getByRole('tab', { name: 'Settings' })).toBeVisible();
  
  console.log('Successfully logged in with credentials:', {
    username: env.username,
    password: '********' // Masked for security
  });
}); 