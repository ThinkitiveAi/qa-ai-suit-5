/**
 * Environment configuration
 */

module.exports = {
  // URLs
  baseUrl: process.env.BASE_URL || 'https://stage_aithinkitive.uat.provider.ecarehealth.com',
  
  // Credentials
  username: process.env.TEST_USERNAME || 'RubyVOlague@jourrapide.com',
  password: process.env.TEST_PASSWORD || 'Pass@123',
  
  // Timeouts
  defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '60000'),
  
  // Browser settings
  headless: process.env.HEADLESS === 'true' || false,
  
  // Test data
  testProvider: {
    firstName: process.env.PROVIDER_FIRST_NAME || 'lucas',
    lastName: process.env.PROVIDER_LAST_NAME || 'william',
    email: process.env.PROVIDER_EMAIL || 'lucas@gmail.com',
    providerType: process.env.PROVIDER_TYPE || 'MD',
    speciality: process.env.PROVIDER_SPECIALITY || 'Behavioral Health & Psychiatry',
    role: process.env.PROVIDER_ROLE || 'Provider',
    gender: process.env.PROVIDER_GENDER || 'Female'
  }
}; 