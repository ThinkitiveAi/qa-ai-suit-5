const { test, expect } = require('@playwright/test');
const { login } = require('../utils/auth');
const { navigateToProviders, addProvider, verifyProviderExists, generateRandomProviderData } = require('../utils/provider');

test('Add provider with random name and email', async ({ page }) => {
  // Login to the application
  await login(page);
  
  // Navigate to Provider settings
  await navigateToProviders(page);
  
  // Generate random provider data (only name and email are random, other fields are fixed)
  const randomProviderData = generateRandomProviderData();
  
  // Add new provider with random name and email
  const providerData = await addProvider(page, randomProviderData);
  
  // Verify the provider was added successfully
  const exists = await verifyProviderExists(page, providerData.firstName, providerData.lastName);
  expect(exists).toBeTruthy();
  
  console.log('Successfully added provider with random name and email:', {
    firstName: providerData.firstName,
    lastName: providerData.lastName,
    email: providerData.email,
    providerType: providerData.providerType,
    role: providerData.role,
    gender: providerData.gender
  });
}); 