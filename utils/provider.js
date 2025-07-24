/**
 * Provider-related helper functions
 */
const config = require('../config/env');
const helpers = require('./helpers');
const { faker } = require('@faker-js/faker');

/**
 * Navigate to the providers tab in settings
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function navigateToProviders(page) {
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByRole('menuitem', { name: 'User Settings' }).click();
  await page.getByRole('tab', { name: 'Providers' }).click();
}

/**
 * Generate random provider data using faker
 * @returns {Object} Random provider data
 */
function generateRandomProviderData() {
  // Generate random name components using faker
  const genderType = faker.helpers.arrayElement(['male', 'female']);
  const firstName = faker.person.firstName(genderType);
  const lastName = faker.person.lastName();
  
  // Generate random email that looks professional
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@ecarehealth.com`;
  
  // Fixed values for other fields
  return {
    firstName,
    lastName,
    email,
    providerType: 'MD',  // Fixed value
    role: 'Provider',    // Fixed value
    gender: 'Male'       // Fixed value
  };
}

/**
 * Add a new provider with the specified details
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} providerData - Provider details (optional, will use random data if not provided)
 * @returns {Object} The provider data that was added
 */
async function addProvider(page, providerData = {}) {
  // Generate random data for any missing fields
  const randomData = generateRandomProviderData();
  
  const {
    firstName = randomData.firstName,
    lastName = randomData.lastName,
    providerType = 'MD',           // Fixed value
    role = 'Provider',             // Fixed value
    gender = 'Male',               // Fixed value
    email = randomData.email
  } = providerData;

  // Click on Add Provider User button
  await page.getByRole('button', { name: 'Add Provider User' }).click();
  
  // Fill provider details
  await page.getByRole('textbox', { name: 'First Name *' }).click();
  await page.getByRole('textbox', { name: 'First Name *' }).fill(firstName);
  
  await page.getByRole('textbox', { name: 'Last Name *' }).click();
  await page.getByRole('textbox', { name: 'Last Name *' }).fill(lastName);
  
  // Select provider type - always MD
  await page.getByRole('combobox', { name: 'Provider Type' }).click();
  await page.getByRole('option', { name: 'MD' }).click();
  
  // Select role - always Provider
  await page.getByRole('combobox', { name: 'Role *' }).click();
  await page.getByRole('option', { name: 'Provider' }).click();
  
  // Select gender - always Male
  await page.getByRole('combobox', { name: 'Gender *' }).click();
  await page.getByRole('option', { name: 'Male', exact: true }).click();
  
  // Fill email and complete provider creation
  await page.getByRole('textbox', { name: 'Email *' }).click();
  await page.getByRole('textbox', { name: 'Email *' }).fill(email);
  
  // Save and wait for the save to complete
  await page.getByRole('button', { name: 'Save' }).click();
  
  // Wait for the provider details page to load after saving
  try {
    await page.waitForSelector(`text="${firstName} ${lastName}"`, { timeout: 10000 });
  } catch (error) {
    console.log('Provider details page did not load as expected after save');
  }
  
  // Return the provider data for assertions
  return {
    firstName,
    lastName,
    providerType,
    role,
    gender,
    email
  };
}

/**
 * Verify if a provider exists in the providers list
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} firstName - Provider first name
 * @param {string} lastName - Provider last name
 * @returns {Promise<boolean>} True if provider exists, false otherwise
 */
async function verifyProviderExists(page, firstName, lastName) {
  try {
    // Wait for the heading to be visible
    await page.waitForSelector(`text="${firstName} ${lastName}"`, { timeout: 5000 });
    return true;
  } catch (error) {
    console.log(`Provider heading "${firstName} ${lastName}" not found`);
    return false;
  }
}

module.exports = {
  navigateToProviders,
  addProvider,
  verifyProviderExists,
  generateRandomProviderData
}; 