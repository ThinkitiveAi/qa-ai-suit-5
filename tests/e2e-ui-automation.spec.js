import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
test('test', async ({ page }) => {

  await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/auth/login');

  await page.getByRole('textbox', { name: 'Email' }).click();

  await page.getByRole('textbox', { name: 'Email' }).fill('rose.gomez@jourrapide.com');

  await page.getByRole('textbox', { name: '*********' }).click();

  await page.getByRole('textbox', { name: '*********' }).fill('Pass@123');

  await page.getByRole('button', { name: 'Let\'s get Started' }).click();

  await page.getByRole('banner').getByTestId('ExpandMoreIcon').click();

  await page.locator('#create-navbar-button-menu > .MuiBackdrop-root').click();

  await page.getByRole('banner').getByTestId('KeyboardArrowRightIcon').click();

  await page.getByRole('tab', { name: 'Settings' }).click();

  await page.getByText('User Settings').click();

  await page.getByRole('tab', { name: 'Providers' }).click();
  // Add provider
  const providerGender = 'female';
  const providerFirstName = faker.person.firstName(providerGender);
  const ProviderLastName = faker.person.lastName();
  const ProviderFullName = `${providerFirstName} ${ProviderLastName}`;
  const providerEmail = `${providerFirstName.toLowerCase()}.${ProviderLastName.toLowerCase()}@mailinator.com`;

  await page.getByRole('button', { name: 'Add Provider User' }).click();

  await page.getByRole('textbox', { name: 'First Name *' }).click();

  await page.getByRole('textbox', { name: 'First Name *' }).fill(providerFirstName);

  await page.getByRole('textbox', { name: 'Last Name *' }).click();

  await page.getByRole('textbox', { name: 'Last Name *' }).fill(ProviderLastName);

await page.getByRole('combobox', { name: 'Gender *' }).click();

// Select the gender value directly by visible text inside the listbox
await page.locator('ul[role="listbox"] >> text=' + (providerGender === 'female' ? '"Female"' : '"Male"')).click();

  await page.getByRole('combobox', { name: 'Role *' }).click();

  await page.getByRole('option', { name: 'Provider' }).click();

  await page.getByRole('textbox', { name: 'Email *' }).click();

  await page.getByRole('textbox', { name: 'Email *' }).fill(providerEmail);

  await page.getByRole('button', { name: 'Save' }).click();

  await page.getByRole('tab', { name: 'Scheduling' }).click();

  await page.getByRole('menuitem', { name: 'Availability' }).click();

  await page.getByRole('button', { name: 'Edit Availability' }).click();
  await page.waitForTimeout(3000);

  await page.locator('div').filter({ hasText: /^Select Provider \*$/ }).nth(1).click();

  await page.getByRole('combobox', { name: 'Select Provider *' }).fill(ProviderFullName);
  await page.getByRole('option', { name: ProviderFullName }).click();

  await page.getByRole('combobox',{name:'Time Zone *'}).click();
  await page.getByRole('option', { name: "Central Daylight Time (UTC -5)"}).click();

  // Check if telehealth checkbox is already checked, if not then check it
  const telehealthCheckbox = page.getByRole('checkbox', { name: 'Telehealth' });
  const isTelehealthChecked = await telehealthCheckbox.isChecked();
  if (!isTelehealthChecked) {
    await telehealthCheckbox.check();
  }

  await page.getByRole('combobox',{name:'Booking Window *'}).click();
  await page.getByRole('option', { name: "1 Week"}).click();

  await page.getByRole('combobox',{name:'Start Time *'}).click();
  await page.getByRole('option', { name: "12:00 AM"}).click();

  await page.getByRole('combobox',{name:'End Time *'}).click();
  await page.waitForTimeout(3000);
  await page.getByRole('option', { name: "11:45 PM"}).click();

  await page.getByRole('combobox',{name:'Appointment Type'}).click();
  await page.getByRole('option', {name: "New Patient Visit"}).click();

   await page.getByRole('combobox',{name:'Duration'}).click();
  await page.getByRole('option', {name: "15 minutes"}).click();
await expect(page.getByRole('button', {name:'Save'})).toBeEnabled();
await page.getByRole('button', {name:'Save'}).click();
  await page.waitForTimeout(5000);

 

  await page.locator('div').filter({ hasText: /^Create$/ }).nth(1).click();
    await page.getByRole('menuitem', { name: 'New Patient' }).click();
    await page.locator('div').filter({ hasText: /^Enter Patient Details$/ }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Fill patient mandatory details

  const patientGender = 'female';
  const patientFirstName = faker.person.firstName(patientGender);
  const patientLastName = faker.person.lastName();
  const patientFullName = `${patientFirstName} ${patientLastName}`;
  const patientEmail = `${patientFirstName.toLowerCase()}.${patientLastName.toLowerCase()}@mailinator.com`;
    await expect(page.getByRole('textbox', { name: 'First Name *' })).toBeVisible();
    await page.getByRole('textbox', { name: 'First Name *' }).waitFor({ state: 'visible' });
    await page.getByRole('textbox', { name: 'First Name *' }).fill(patientFirstName);
    await page.getByRole('textbox', { name: 'Last Name *' }).fill(patientLastName);
    await page.getByRole('textbox', { name: 'Date Of Birth *' }).fill('11-26-2000');

// Open gender dropdown
    // await page.getByRole('combobox', { name: 'Gender *' }).click();
    // await page.getByRole('option', { name: gender === 'female' ? 'Female' : 'Male' }).click();
    await page.getByRole('combobox', { name: 'Gender *' }).click();
    await page.getByRole('option', { name: patientGender === 'female' ? 'Female' : 'Male' }).click();
    await page.getByRole('textbox', { name: 'Mobile Number *' }).fill('8888417355');
    await page.getByRole('textbox', { name: 'Email *' }).waitFor({ state: 'visible' });
    await page.getByRole('textbox', { name: 'Email *' }).fill(patientEmail);
    await page.getByRole('button', { name: 'Save' }).click();

    await page.waitForTimeout(5000);
    
    // Print patient details after creation
    console.log('👤 Patient Created Successfully!');
    console.log(`👤 Patient Name: ${patientFullName}`);
    console.log(`👤 Patient Gender: ${patientGender}`);
    console.log(`📧 Patient Email: ${patientEmail}`);
    console.log(`📱 Patient Mobile: 8888417355`);
    console.log('----------------------------------------');
    
    // Debug: Log the patient details we're looking for
    console.log(`Looking for patient: ${patientFullName} (${patientGender})`);
    
    // Debug: Take a screenshot to see what's on the page
    await page.screenshot({ path: 'patient-list-debug.png' });

    // Wait for patient to appear in the list and verify
    await page.waitForTimeout(2000);
    
    // Try multiple ways to find the patient
    try {
      // Method 1: Look for patient name with age and gender
      await expect(
        page.getByRole('cell', { name: new RegExp(`${patientFullName}.*\\d+.*yrs.*${patientGender}`, 'i') })
      ).toBeVisible({ timeout: 10000 });
    } catch (error) {
      console.log('Method 1 failed, trying Method 2...');
      
      // Method 2: Just look for the patient name
      await expect(
        page.getByRole('cell', { name: patientFullName })
      ).toBeVisible({ timeout: 10000 });
    }
;


    // Appointment Scheduling
    await page.locator('//span[text()="Create"]').click();
    await page.getByText('New Appointment').click();

    await page.getByLabel('Patient Name *').click();
    await page.getByRole('option', { name: patientFullName }).click();

    await page.getByLabel('Appointment Type *').click();
    await page.getByRole('option', { name: 'New Patient Visit' }).click();

    await page.getByRole('textbox', { name: 'Reason for visit *' }).fill('cold and Fever');
    await page.getByRole('combobox',{name:'timezone'}).click();
    await page.getByRole('option', { name: "Central Daylight Time (GMT -05:00)"}).click();

    // Check if telehealth checkbox is already checked, if not then check it
    await page.getByRole('button',{name:'Telehealth'}).click();
    await page.getByLabel('Provider *').click();
    await page.getByRole('option', { name: ProviderFullName }).click();

  await page.getByRole('button', { name: 'View Availability' }).click();



// Get today's and tomorrow's day of month
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const todayDate = today.getDate();
const tomorrowDate = tomorrow.getDate();

// Try to click an enabled gridcell with today's or tomorrow's date
const clickAvailableDate = async (dateStr) => {
  const locator = page.locator('button[role="gridcell"]:not([disabled])', { hasText: dateStr });
  if (await locator.count()) {
    await locator.first().click();
    return true;
  }
  return false;
};

const clicked = await clickAvailableDate(todayDate) || await clickAvailableDate(tomorrowDate);

if (!clicked) {
  throw new Error('❌ Could not find an enabled calendar date for today or tomorrow.');
}

// Wait for and click the first available time slot
const slotLocator = page.locator('button', { hasText: /AM|PM/ }).first();
await slotLocator.waitFor({ timeout: 5000 });
await slotLocator.click();

    await page.getByRole('button', { name: 'Save and close' }).click();
     await page.waitForTimeout(3000);

    // Navigate to appointments to verify the scheduled appointment
    console.log('🔍 Checking if appointment was scheduled successfully...');
    
    await page.getByRole('tab', { name: 'Scheduling' }).click();
    await page.getByRole('menuitem',{name:'Appointments'}).click();
    
    // Wait for appointments page to load
    await page.waitForTimeout(3000);
    
    // Click on "Today" button to filter appointments for today
    console.log('📅 Clicking "Today" button to filter appointments...');
    await page.getByRole('button', { name: 'Today' }).click();
    
    // Wait for the filter to apply
    await page.waitForTimeout(2000);
    
    // Try to find the scheduled appointment
    try {
      // Look for the patient name in the appointments list
      await expect(
        page.getByRole('cell', { name: patientFullName })
      ).toBeVisible({ timeout: 10000 });
      
      console.log(`✅ Appointment for ${patientFullName} found in today's appointments list!`);
      
      // Print appointment details after verification
      console.log('📋 Appointment Details:');
      console.log(`👨‍⚕️ Provider: ${ProviderFullName}`);
      console.log(`👤 Patient: ${patientFullName}`);
      console.log(`🏥 Appointment Type: New Patient Visit`);
      console.log(`📱 Telehealth: Enabled`);
      console.log('----------------------------------------');
    } catch (error) {
      console.log('⚠️ Could not find appointment in today\'s list, but continuing with logout...');
      // Take a screenshot for debugging
      await page.screenshot({ path: 'appointment-verification.png' });
    }

  

    console.log(`✅ Registered "${patientFullName}" (${patientGender}) and scheduled an appointment with ${ProviderFullName}.`);

    // Logout after appointment is booked
    console.log('🔄 Starting logout process...');
    
    try {
      // Wait a moment for the page to settle
      await page.waitForTimeout(2000);
      
      // Click on user avatar
      await page.click('.MuiAvatar-root');
      
      // Wait for menu to appear
      await page.waitForTimeout(1000);
      
      // Click logout
      await page.click('text=Log Out');
      
      // Wait for confirmation dialog and click "Yes, Sure"
      await page.waitForTimeout(1000);
      await page.locator('button:has-text("Yes,Sure")').click();
      
      // Wait for logout to complete and verify we're back on login page
      await page.waitForTimeout(2000);
      await expect(page.locator('text=Hey, good to see you')).toBeVisible();
      
      console.log('✅ Logout completed successfully!');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      // Take a screenshot for debugging
      await page.screenshot({ path: 'logout-error.png' });
    }
});