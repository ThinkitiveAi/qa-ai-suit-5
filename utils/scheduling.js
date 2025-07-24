/**
 * Scheduling-related helper functions
 */

/**
 * Navigate to the availability tab in scheduling
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function navigateToAvailability(page) {
  await page.getByRole('tab', { name: 'Scheduling' }).click();
  await page.getByText('Availability').click();
}

/**
 * Set provider availability
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} availabilityData - Availability details
 * @param {string} availabilityData.providerFirstName - Provider's first name
 * @param {string} availabilityData.providerLastName - Provider's last name
 * @param {string} availabilityData.timeZone - Time zone (default: 'Indian Standard Time')
 * @param {string} availabilityData.bookingWindow - Booking window (default: '52 Week')
 * @param {string} availabilityData.startTime - Start time (default: '12:00 AM')
 * @param {string} availabilityData.endTime - End time (default: ':45 PM (23 hrs 45 mins)')
 * @param {boolean} availabilityData.telehealth - Telehealth option (default: true)
 * @param {string} availabilityData.appointmentType - Appointment type (default: 'New Patient Visit')
 * @param {string} availabilityData.duration - Duration (default: '15 minutes')
 * @param {string} availabilityData.scheduleNotice - Schedule notice (default: '1 Hours Away')
 */
async function setProviderAvailability(page, availabilityData) {
  const {
    providerFirstName,
    providerLastName,
    timeZone = 'Indian Standard Time',
    bookingWindow = '52 Week',
    startTime = '12:00 AM',
    endTime = ':45 PM (23 hrs 45 mins)',
    telehealth = true,
    appointmentType = 'New Patient Visit',
    duration = '15 minutes',
    scheduleNotice = '1 Hours Away'
  } = availabilityData;

  // Click Edit Availability
  await page.getByRole('button', { name: 'Edit Availability' }).click();
  
  // Select the provider
  await page.getByRole('combobox', { name: 'Select Provider *' }).click();
  await page.getByRole('combobox', { name: 'Select Provider *' }).fill(providerFirstName.substring(0, 3).toLowerCase());
  await page.getByRole('option', { name: `${providerFirstName} ${providerLastName}` }).click();
  
  // Set time zone
  await page.getByRole('combobox', { name: 'Time Zone *' }).click();
  await page.getByRole('combobox', { name: 'Time Zone *' }).fill(timeZone.substring(0, 2).toLowerCase());
  await page.getByRole('option', { name: new RegExp(timeZone, 'i') }).click();
  
  // Set booking window
  await page.getByRole('combobox', { name: 'Booking Window *' }).click();
  await page.getByRole('option', { name: bookingWindow }).click();
  
  // Set start time
  await page.locator('form').filter({ hasText: 'Start Time *Start Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: startTime }).click();
  
  // Set end time
  await page.getByRole('combobox', { name: 'End Time *' }).click();
  await page.getByRole('option', { name: endTime }).click();
  
  // Set telehealth option
  if (telehealth) {
    await page.getByRole('checkbox', { name: 'Telehealth' }).check();
  } else {
    await page.getByRole('checkbox', { name: 'Telehealth' }).uncheck();
  }
  
  // Set appointment type
  await page.locator('form').filter({ hasText: 'Appointment TypeAppointment' }).getByLabel('Open').click();
  await page.getByRole('option', { name: appointmentType }).click();
  
  // Set duration
  await page.locator('form').filter({ hasText: 'DurationDuration' }).getByLabel('Open').click();
  await page.getByRole('option', { name: duration }).click();
  
  // Set schedule notice
  await page.locator('form').filter({ hasText: 'Schedule NoticeSchedule Notice' }).getByLabel('Open').click();
  await page.getByRole('option', { name: scheduleNotice }).click();
  
  // Save the availability
  await page.getByRole('button', { name: 'Save' }).click();
  
  // Wait for the save to complete
  try {
    await page.waitForSelector(/availability updated|saved successfully/i, { timeout: 10000 });
  } catch (error) {
    console.log('No success message found, but continuing');
  }
}

module.exports = {
  navigateToAvailability,
  setProviderAvailability
}; 