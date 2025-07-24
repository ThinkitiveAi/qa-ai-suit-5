const { test, expect } = require('@playwright/test');
const env = require('../config/env');
const { generatePatientData } = require('../utils/patient');

test('Patient Registration - Mandatory Fields', async ({ page }) => {
  // Generate random patient data for this test
  const patientData = generatePatientData();
  console.log('Test with patient data:', patientData);
  
  // Navigate to login page
  await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/auth/login');
  
  // Fill login form
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('RubyVOlague@jourrapide.com');
  await page.getByRole('textbox', { name: '*********' }).click();
  await page.getByRole('textbox', { name: '*********' }).fill('Pass@123');
  
  // Click login button
  await page.getByRole('button', { name: 'Let\'s get Started' }).click();
  await page.waitForLoadState('networkidle');
  
  // Click on Create dropdown
  await page.getByText('Create').click();
  
  // Click on New Patient
  await page.getByText('New Patient', { exact: true }).click();
  
  // Click on Enter Patient Details
  await page.locator('div').filter({ hasText: /^Enter Patient Details$/ }).getByRole('img').click();
  
  // Click on Next button
  await page.getByRole('button', { name: 'Next' }).click();
  
  // Fill patient details with dynamic data
  await page.getByRole('textbox', { name: 'First Name *' }).click();
  await page.getByRole('textbox', { name: 'First Name *' }).fill(patientData.firstName);
  
  await page.getByRole('textbox', { name: 'Last Name *' }).click();
  await page.getByRole('textbox', { name: 'Last Name *' }).fill(patientData.lastName);
  
  // Select date of birth using calendar
  await page.locator('[id="Patient Details"]').getByRole('button', { name: 'Choose date' }).click();
  await page.getByRole('gridcell', { name: '1', exact: true }).click();
  
  // Select gender using improved selector
  await page.getByRole('combobox', { name: 'Gender *' }).click();
  await page.locator(`ul[role="listbox"] >> text="${patientData.gender}"`).click();
  
  // Fill contact info
  await page.getByRole('textbox', { name: 'Email *' }).click();
  await page.getByRole('textbox', { name: 'Email *' }).fill(patientData.email);
  
  await page.getByRole('textbox', { name: 'Mobile Number *' }).click();
  await page.getByRole('textbox', { name: 'Mobile Number *' }).fill(patientData.mobile);
  
  // Save patient
  await page.getByRole('button', { name: 'Save' }).click();
  
  // Wait for completion
  await page.waitForTimeout(5000);
  
  // Advanced validation - check that patient appears in the list with expected info
  await expect(
    page.getByRole('cell', { name: new RegExp(`${patientData.fullName} \\d+ yrs - ${patientData.genderType}`, 'i') })
  ).toBeVisible({ timeout: 10000 });
  
  console.log(`✅ Successfully registered "${patientData.fullName}" (${patientData.gender})`);
}); 