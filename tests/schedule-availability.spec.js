const { test, expect } = require('@playwright/test');
const { login } = require('../utils/auth');
const { addProvider, generateRandomProviderData } = require('../utils/provider');
const { navigateToAvailability, setProviderAvailability } = require('../utils/scheduling');

test('Schedule availability for a provider', async ({ page }) => {
  // Step 1: Login to the application
  await login(page);
  
  // Step 2: First create a new provider to use for scheduling
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByRole('menuitem', { name: 'User Settings' }).click();
  await page.getByRole('tab', { name: 'Providers' }).click();
  
  // Generate random provider data
  const randomProviderData = generateRandomProviderData();
  
  // Add new provider with random name and email
  const providerData = await addProvider(page, randomProviderData);
  console.log('Created provider for scheduling:', providerData);
  
  // Step 3: Navigate to Scheduling > Availability
  await navigateToAvailability(page);
  
  // Step 4: Set provider availability
  await setProviderAvailability(page, {
    providerFirstName: providerData.firstName,
    providerLastName: providerData.lastName,
    timeZone: 'Indian Standard Time',
    bookingWindow: '52 Week',
    startTime: '12:00 AM',
    endTime: ':45 PM (23 hrs 45 mins)',
    telehealth: true,
    appointmentType: 'New Patient Visit',
    duration: '15 minutes',
    scheduleNotice: '1 Hours Away'
  });
  
  console.log(`Successfully scheduled availability for provider: ${providerData.firstName} ${providerData.lastName}`);
}); 