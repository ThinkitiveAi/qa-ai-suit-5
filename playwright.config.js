// @ts-check
const { defineConfig } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  timeout: 60 * 1000, // Increased timeout to 60 seconds
  expect: {
    timeout: 10000 // Increased expect timeout to 10 seconds
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1, // Added 1 retry for local runs
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }],
    ['list'], // Added list reporter for console output
    ['json', { outputFile: 'test-results/results.json' }], // Added JSON reporter
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Capture screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
    
    /* For API tests, set additional HTTP headers */
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    
    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        headless: false,
      },
    },
    /* Configure a dedicated project for API testing */
    {
      name: 'api',
      testMatch: '**\/api\/**\/*.spec.js',
      use: {
        /* API tests don't need a browser */
        headless: true,
        /* Specific API testing settings */
        baseURL: 'https://stage-api.ecarehealth.com',
      },
    },
  ],
}); 