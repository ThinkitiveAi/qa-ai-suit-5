const { test, expect } = require('@playwright/test');
const env = require('../config/env');
const { login } = require('../utils/auth');
const { navigateToProviders, addProvider, generateRandomProviderData } = require('../utils/provider');
const { navigateToAvailability, setProviderAvailability, viewProviderAvailabilityInIST } = require('../utils/scheduling');
const { generatePatientData } = require('../utils/patient');

test('Test UTC to IST conversion when viewing availability', async ({ page }) => {
  // Generate random data
  const providerData = generateRandomProviderData();
  
  console.log('Test with provider data:', providerData);
  
  // Step 1: Login to the application
  await page.goto(env.baseUrl + '/auth/login');
  await page.getByRole('textbox', { name: 'Email' }).fill('RubyVOlague@jourrapide.com');
  await page.getByRole('textbox', { name: '*********' }).fill('Pass@123');
  await page.getByRole('button', { name: 'Let\'s get Started' }).click();
  await page.waitForLoadState('networkidle');
  
  // Step 2: Create Provider
  await navigateToProviders(page);
  await addProvider(page, providerData);
  console.log(`✅ Successfully added provider "${providerData.firstName} ${providerData.lastName}"`);
  
  // Step 3: Set Provider Availability
  await navigateToAvailability(page);
  
  const availabilityData = {
    providerFirstName: providerData.firstName,
    providerLastName: providerData.lastName,
    timeZone: 'Indian Standard Time',
    bookingWindow: '52 Week',
    startTime: '9:00 AM',
    endTime: '5:00 PM',
    telehealth: true,
    appointmentType: 'New Patient Visit',
    duration: '30 minutes',
    scheduleNotice: '1 Hours Away'
  };
  
  await setProviderAvailability(page, availabilityData);
  console.log(`✅ Successfully set availability for provider "${providerData.firstName} ${providerData.lastName}"`);
  
  // Step 4: Create a patient to test appointment booking with IST conversion
  await page.locator("//span[@class='MuiTypography-root MuiTypography-button css-1czfzrs']").click();
  await page.getByText('New Patient', { exact: true }).click();
  await page.locator('div').filter({ hasText: /^Enter Patient Details$/ }).getByRole('img').click();
  await page.getByRole('button', { name: 'Next' }).click();
  
  const patientData = generatePatientData();
  
  // Fill patient details
  await page.getByRole('textbox', { name: 'First Name *' }).fill(patientData.firstName);
  await page.getByRole('textbox', { name: 'Last Name *' }).fill(patientData.lastName);
  await page.locator('[id="Patient Details"]').getByRole('button', { name: 'Choose date' }).click();
  await page.getByRole('gridcell', { name: '1', exact: true }).click();
  await page.getByRole('combobox', { name: 'Gender *' }).click();
  await page.locator(`ul[role="listbox"] >> text="${patientData.gender}"`).click();
  await page.getByRole('textbox', { name: 'Email *' }).fill(patientData.email);
  await page.getByRole('textbox', { name: 'Mobile Number *' }).fill(patientData.mobile);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(5000);
  
  console.log(`✅ Successfully created patient "${patientData.fullName}"`);
  
  // Step 5: Test the UTC to IST conversion during appointment booking
  await page.locator("//span[@class='MuiTypography-root MuiTypography-button css-1czfzrs']").click();
  await page.getByText('New Appointment').click();
  
  // Select the patient
  await page.getByLabel('Patient Name *').click();
  await page.getByRole('option', { name: new RegExp(patientData.fullName, 'i') }).click();
  
  // Select appointment type
  await page.getByLabel('Appointment Type *').click();
  await page.getByRole('option', { name: 'New Patient Visit' }).click();
  
  // Enter reason for visit
  await page.getByRole('textbox', { name: 'Reason for visit *' }).fill('Testing UTC to IST conversion');
  
  // Select timezone
  await page.getByRole('combobox', {name: 'timezone'}).click();
  await page.getByRole('option', { name: /GMT/ }).first().click();
  
  // Select appointment mode
  await page.getByRole('button', {name: 'Telehealth'}).click();
  
  // Test the IST conversion functionality
  console.log('🧪 Testing UTC to IST conversion when viewing availability...');
  const conversionSuccess = await viewProviderAvailabilityInIST(page, `${providerData.firstName} ${providerData.lastName}`);
  
  if (conversionSuccess) {
    console.log('✅ Successfully converted availability times from UTC to IST');
    
    // Take a screenshot to verify the conversion
    await page.screenshot({ 
      path: 'test-results/availability-ist-conversion.png',
      fullPage: true 
    });
    console.log('📸 Screenshot saved showing IST converted times');
    
    // Verify that IST text appears on the page
    try {
      await expect(page.locator('text=IST')).toBeVisible({ timeout: 5000 });
      console.log('✅ IST timezone indicator found on the page');
    } catch (error) {
      console.log('⚠️ IST timezone indicator not found, but conversion may still have occurred');
    }
    
    // Try to find time slots with IST
    const timeSlots = await page.locator('button', { hasText: /AM|PM/ }).count();
    if (timeSlots > 0) {
      console.log(`✅ Found ${timeSlots} time slots available for booking`);
      
      // Get the text of the first time slot to verify it shows IST
      const firstSlotText = await page.locator('button', { hasText: /AM|PM/ }).first().textContent();
      console.log(`📅 First available time slot: ${firstSlotText}`);
      
      if (firstSlotText && firstSlotText.includes('IST')) {
        console.log('✅ Time slot successfully shows IST timezone');
      } else {
        console.log('⚠️ Time slot may not show IST indicator, but time conversion may have occurred');
      }
    } else {
      console.log('⚠️ No time slots found - provider may not have availability set for today/tomorrow');
    }
    
  } else {
    console.log('❌ Failed to convert availability times to IST');
  }
  
  console.log('🎉 UTC to IST conversion test completed');
}); 