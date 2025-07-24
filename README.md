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

### Run tests with debug mode

```bash
npx playwright test --debug
```

### View test report

```bash
npx playwright show-report
```

## Project Structure

- `tests/` - Test files
- `utils/` - Helper functions and utilities
- `config/` - Configuration files
- `test-results/` - Test results and artifacts (screenshots, videos, etc.)

## Test Files

- `tests/add-provider.spec.js` - Tests for adding provider functionality

## Helper Modules

- `utils/auth.js` - Authentication helper functions
- `utils/provider.js` - Provider-related helper functions
- `utils/helpers.js` - General helper functions 