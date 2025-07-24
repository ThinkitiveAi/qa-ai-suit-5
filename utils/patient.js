const { faker } = require('@faker-js/faker');

/**
 * Generates random patient data for testing
 * @returns {Object} Patient data object
 */
function generatePatientData() {
  // Randomly assign gender: 'Male' or 'Female'
  const genderType = faker.helpers.arrayElement(['male', 'female']);
  const gender = genderType === 'male' ? 'Male' : 'Female';
  const firstName = faker.person.firstName(genderType);
  const lastName = faker.person.lastName();
  const fullName = `${firstName} ${lastName}`;
  
  return {
    firstName,
    lastName,
    fullName,
    dateOfBirth: '11-30-1995',
    gender,
    genderType,
    mobile: '9776544487',
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@mailinator.com`,
  };
}

module.exports = {
  generatePatientData
}; 