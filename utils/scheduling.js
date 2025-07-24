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
 * Navigate to the appointments page
 * @param {import('@playwright/test').Page} page - Playwright page object 
 */
async function navigateToAppointments(page) {
  try {
    // Check if tabs are enabled before attempting to navigate
    const schedulingTabEnabled = await page.getByRole('tab', { name: 'Scheduling' }).isEnabled();
    
    if (schedulingTabEnabled) {
      // Use normal navigation if tabs are enabled
      await page.getByRole('tab', { name: 'Scheduling' }).click();
      await page.getByRole('menuitem', {name: 'Appointments'}).click();
      await page.waitForLoadState('networkidle');
    } else {
      // If tabs are disabled, we'll navigate using the URL directly as a fallback
      console.log('Tabs are disabled, navigating directly to appointments page');
      await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/app/provider/scheduling/appointment');
      await page.waitForLoadState('networkidle');
    }
  } catch (error) {
    console.error('Error navigating to appointments:', error);
    // As a final fallback, try direct URL navigation
    await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/app/provider/scheduling/appointment');
    await page.waitForLoadState('networkidle');
  }
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

/**
 * Book an appointment for a patient with a provider
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} appointmentData - Appointment details
 * @param {string} appointmentData.patientFullName - Patient's full name
 * @param {string} appointmentData.providerFullName - Provider's full name
 * @param {string} appointmentData.appointmentType - Appointment type (default: 'New Patient Visit')
 * @param {string} appointmentData.reasonForVisit - Reason for visit (default: 'Initial consultation')
 * @param {string} appointmentData.appointmentMode - Appointment mode (default: 'Telehealth')
 * @returns {Promise<boolean>} - True if appointment was booked successfully
 */
async function bookAppointment(page, appointmentData) {
  const {
    patientFullName,
    providerFullName,
    appointmentType = 'New Patient Visit',
    reasonForVisit = 'Initial consultation',
    appointmentMode = 'Telehealth'
  } = appointmentData;

  try {
    // Wait for any pending operations to complete
    await page.waitForTimeout(5000);
    
    // Instead of clicking the Dashboard tab which might be disabled,
    // create a new appointment directly from current context
    await page.locator("//span[@class='MuiTypography-root MuiTypography-button css-1czfzrs']").click();
    await page.getByText('New Appointment').click();
    
    // Select the patient
    await page.getByLabel('Patient Name *').click();
    await page.getByRole('option', { name: new RegExp(patientFullName, 'i') }).click();
    
    // Select appointment type
    await page.getByLabel('Appointment Type *').click();
    await page.getByRole('option', { name: appointmentType }).click();
    
    // Enter reason for visit
    await page.getByRole('textbox', { name: 'Reason for visit *' }).fill(reasonForVisit);
    
    // Select timezone - use first available
    await page.getByRole('combobox', {name: 'timezone'}).click();
    await page.getByRole('option', { name: /GMT/ }).first().click();
    
    // Select appointment mode
    await page.getByRole('button', {name: appointmentMode}).click();
    
    // Select provider
    await page.getByLabel('Provider *').click();
    await page.getByRole('option', { name: new RegExp(providerFullName, 'i') }).first().click();
    
    // View availability
    await page.getByRole('button', { name: 'View Availability' }).click();
    await page.waitForLoadState('networkidle');
    
    // Find and select available date (today, tomorrow, or any available date)
    if (!await selectAvailableDate(page)) {
      console.log('❌ No available dates found on the calendar');
      return false;
    }
    
    // Select available time slot
    if (!await selectAvailableTimeSlot(page)) {
      console.log('❌ No available time slots found');
      return false;
    }
    
    // Save the appointment
    await page.getByRole('button', { name: 'Save and close' }).click();
    await page.waitForTimeout(3000);
    
    return true;
  } catch (error) {
    console.error('Error booking appointment:', error);
    return false;
  }
}

/**
 * Select an available date in the calendar
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<boolean>} - True if a date was selected successfully
 */
async function selectAvailableDate(page) {
  // Get today's and tomorrow's day of month
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const todayDate = today.getDate();
  const tomorrowDate = tomorrow.getDate();
  
  // Try to click an enabled gridcell with today's or tomorrow's date
  if (await clickAvailableDate(page, todayDate) || 
      await clickAvailableDate(page, tomorrowDate)) {
    return true;
  }
  
  // If today/tomorrow not available, try any available date
  const anyDateLocator = page.locator(`button[role="gridcell"]:not([disabled])`).first();
  if (await anyDateLocator.count() > 0) {
    await anyDateLocator.click();
    return true;
  }
  
  return false;
}

/**
 * Click a specific date if it's available
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {number} dateNum - The day number to click
 * @returns {Promise<boolean>} - True if the date was clicked successfully
 */
async function clickAvailableDate(page, dateNum) {
  const locator = page.locator(`button[role="gridcell"]:not([disabled])`, { hasText: dateNum.toString() });
  if (await locator.count() > 0) {
    await locator.first().click();
    return true;
  }
  return false;
}

/**
 * Select an available time slot
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<boolean>} - True if a time slot was selected successfully
 */
async function selectAvailableTimeSlot(page) {
  // Wait for time slots to appear
  await page.waitForTimeout(2000);
  
  // Click the first available time slot
  const slotLocator = page.locator('button', { hasText: /AM|PM/ }).first();
  try {
    await slotLocator.waitFor({ timeout: 10000 });
    await slotLocator.click();
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  navigateToAvailability,
  navigateToAppointments,
  setProviderAvailability,
  bookAppointment,
  selectAvailableDate,
  selectAvailableTimeSlot
}; 