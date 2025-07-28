# Ecare Health Provider Portal Tests

This repository contains automated tests for the Ecare Health Provider Portal using Playwright.

## Prerequisites

- Node.js 14 or higher
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
```

## Running Tests

### Run all tests

```bash
npx playwright test
```

### Run specific test file

```bash
npx playwright test tests/add-provider.spec.js
```

### Run tests in headed mode (with browser UI)

```bash
npx playwright test --headed
```

### Run tests in headless mode

```bash
npx playwright test --headed false
```

### Run tests with debug mode

```bash
npx playwright test --debug
```

### View test report

```bash
npx playwright show-report
```

### Run API tests

```bash
npm run test:api
```

Or use the dedicated script:

```bash
./run-api-tests.sh
```

## Project Structure

- `tests/` - Test files
  - `tests/api/` - API test files
  - `tests/base/` - Base test classes and fixtures
  - `tests/setup/` - Test setup and teardown logic
- `utils/` - Helper functions and utilities
- `config/` - Configuration files
- `test-results/` - Test results and artifacts (screenshots, videos, etc.)

## Test Files

### UI Tests
- `tests/add-provider.spec.js` - Tests for adding provider functionality
- `tests/login.spec.js` - Tests for login functionality
- `tests/schedule-availability.spec.js` - Tests for schedule availability functionality
- `tests/patient-registration.spec.js` - Tests for patient registration with dynamic data

### API Tests
- `tests/api/api-endpoints.spec.js` - Comprehensive API endpoint tests covering authentication, patient and provider management, scheduling, and appointments

## Helper Modules

- `utils/auth.js` - Authentication helper functions
- `utils/provider.js` - Provider-related helper functions
- `utils/helpers.js` - General helper functions
- `utils/scheduling.js` - Scheduling-related helper functions
- `utils/patient.js` - Patient data generation with Faker.js for dynamic test data
- `utils/api.js` - API testing helper functions

## Patient Registration Test

The patient registration test automates the following workflow:

1. Login to the provider portal
2. Navigate to patient creation
3. Fill in mandatory patient details with dynamic data
4. Save the new patient
5. Verify the patient appears in the patient list

The test uses Faker.js to generate random patient data for each test run, including:
- Gender-appropriate first names
- Last names
- Email addresses
- Contact information

To run only the patient registration test:

```bash
npx playwright test tests/patient-registration.spec.js
```

## API Tests

The API test suite verifies the backend functionality of the eCareHealth platform by making direct API calls. These tests cover:

1. **Authentication** - Provider login and token acquisition
2. **Patient Management** - Create and retrieve patients
3. **Provider Management** - Add and retrieve providers
4. **Schedule Management** - Set and retrieve provider availability
5. **Appointment Management** - Book appointments

For more details on API testing, see [API Test README](tests/api/README.md).

### Running API Tests

```bash
# Run all API tests
npm run test:api

# Run with UI mode
npm run test:ui -- tests/api/

# Run specific API test
npm run test:single -- "Provider Login"
```
