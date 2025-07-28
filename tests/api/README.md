# eCareHealth API Tests

This directory contains automated API tests for eCareHealth platform endpoints using Playwright.

## Available Tests

The API test suite covers the following functionalities:

1. **Authentication** - Provider login and token acquisition
2. **Patient Management** - Create and retrieve patients
3. **Provider Management** - Add and retrieve providers
4. **Schedule Management** - Set and retrieve provider availability
5. **Appointment Management** - Book appointments

## Running Tests

To run the API tests, use one of the following commands:

```bash
# Run all API tests
npm run test:api

# Run with UI mode
npm run test:ui -- tests/api/

# Run in debug mode
npm run test:debug -- tests/api/

# Run specific test (by grep pattern)
npm run test:single -- "Provider Login"
```

## Configuration

API test configuration is located in each test file. You may need to update:

- Authentication credentials
- Access token (if expired)
- Tenant ID

### Token Expiration Notice

> **Important**: The tests include a hardcoded authentication token that may expire. If you encounter 401 Unauthorized errors in tests that follow the login test, you'll need to update the token.
>
> To update the token:
> 1. Use Postman or a similar tool to obtain a fresh token from the authentication endpoint
> 2. Replace the value of `accessToken` in `tests/api/api-endpoints.spec.js`
> 3. If needed, also update the token in `config/api-env.js`

## Notes

- Tests are designed to run in sequence as some tests depend on data created by previous tests
- The tests use dynamic timestamps for creating unique test data
- The test suite automatically captures a fresh access token from the login response for subsequent requests

## Reports

After running tests, view the HTML report with:

```bash
npm run test:report
``` 