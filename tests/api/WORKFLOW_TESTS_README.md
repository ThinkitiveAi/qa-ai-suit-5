# eCareHealth API Workflow Tests

This directory contains comprehensive API workflow tests for the eCareHealth platform, covering the complete patient-provider appointment lifecycle from booking to encounter completion.

## 📋 Available Workflow Tests

### 1. Complete Appointment Workflow (Basic)
**File:** `complete-appointment-workflow.spec.js`

**Description:** Basic end-to-end appointment booking workflow
**Steps:**
1. 🔐 Get Access Token
2. 👤 Create Patient
3. 👨‍⚕️ Create Provider
4. 📅 Set Provider Availability
5. 🗓️ Get Available Slots
6. 📝 Book Appointment
7. 📋 Verify Appointment in List

### 2. Enhanced Appointment Workflow (Advanced)
**File:** `enhanced-appointment-workflow.spec.js`

**Description:** Advanced workflow with enhanced error handling and retry mechanisms
**Features:**
- Retry logic for failed operations
- Comprehensive data validation
- Detailed logging and troubleshooting
- Better error handling

**Steps:** Same as basic workflow but with enhanced reliability

### 3. Complete Healthcare Workflow (End-to-End)
**File:** `complete-healthcare-workflow.spec.js`

**Description:** Full healthcare workflow based on Postman collection including check-in and encounter management
**Steps:**
1. 🔐 Login API - Authentication
2. 📅 Set Availability - Provider Schedule Setup
3. 🔍 Get Availability - Verify Provider Settings
4. 📝 Create Appointment - Book New Appointment
5. 📋 Get Provider Appointment - Verify Booking
6. ✅ Confirm Appointment - Update Status to CONFIRMED
7. 🏥 Check In - Update Status to CHECKED_IN
8. 📹 Get Zoom Token - Start Telehealth Session
9. 📝 Save Encounter Summary - Create Initial Notes
10. 📋 Update Encounter Summary - Add Examination Details
11. ✍️ Encounter SignOff - Complete the Encounter

## 🚀 Running the Tests

### Option 1: Using the Runner Script
```bash
./run-workflow-tests.sh
```

### Option 2: Direct Playwright Commands
```bash
# Run specific workflow
npx playwright test tests/api/complete-healthcare-workflow.spec.js --reporter=line

# Run all workflow tests
npx playwright test tests/api/complete-*.spec.js --reporter=line

# Run with detailed output
npx playwright test tests/api/complete-healthcare-workflow.spec.js --reporter=list

# Run with HTML report
npx playwright test tests/api/complete-healthcare-workflow.spec.js --reporter=html
```

## 📊 Test Configuration

### Environment Configuration
Tests use configuration from:
- `tests/api/api-endpoints.spec.js` - Main configuration
- `utils/api.js` - Utility functions

### Key Configuration Values
```javascript
const CONFIG = {
  baseURL: 'https://stage-api.ecarehealth.com',
  tenantId: 'stage_aithinkitive',
  credentials: {
    username: 'rose.gomez@jourrapide.com',
    password: 'Pass@123'
  }
};
```

## 🔧 Individual API Tests

The following individual API tests are also available:

### Appointment Booking
- `appointment-booking-test.spec.js` - Test appointment creation
- `get-appointments-test.spec.js` - Test appointment retrieval
- `provider-slots-test.spec.js` - Test provider slot availability
- `update-appointment-status-test.spec.js` - Test appointment status updates

## 📝 Test Data Management

### Dynamic Data Generation
Tests generate unique data using timestamps to avoid conflicts:
- Patient emails: `patient.test.{timestamp}@example.com`
- Provider emails: `provider.test.{timestamp}@example.com`
- Phone numbers: `555{timestamp_last_7_digits}`

### Existing Test Data
Some tests use pre-existing test data:
- Patient ID: `ac59331f-b6ff-4787-8eeb-a52ff0257861`
- Provider ID: `dc769997-f9ce-4153-a6f9-bd491ac35228`

## 🔍 Test Validation

### Success Criteria
Each test validates:
- ✅ HTTP response status codes
- ✅ Response body structure
- ✅ Required fields presence
- ✅ Data consistency across steps
- ✅ Workflow state transitions

### Error Handling
Tests handle various scenarios:
- ⚠️ API endpoint failures
- ⚠️ Authentication issues
- ⚠️ Data validation errors
- ⚠️ Network timeouts
- ⚠️ Missing dependencies

## 📊 Reporting

### Console Output
Tests provide detailed console logging:
- Step-by-step progress
- Success/failure indicators
- Data summaries
- Error details
- Troubleshooting information

### HTML Reports
Generate HTML reports with:
```bash
npx playwright test tests/api/complete-healthcare-workflow.spec.js --reporter=html
```

View reports at: `playwright-report/index.html`

## 🔧 Troubleshooting

### Common Issues

#### Authentication Failures
- Check credentials in `api-endpoints.spec.js`
- Verify tenant ID is correct
- Ensure API endpoint is accessible

#### Appointment Booking Failures
- Verify provider availability is set
- Check appointment time is in the future
- Ensure patient and provider IDs exist

#### Missing Appointment IDs
- Check appointment creation response
- Verify appointment appears in provider list
- Look for ID in response data structure

### Debug Mode
Run tests with debug output:
```bash
DEBUG=pw:api npx playwright test tests/api/complete-healthcare-workflow.spec.js
```

## 📚 API Documentation

### Key Endpoints Tested
- `POST /api/master/login` - Authentication
- `POST /api/master/patient` - Patient creation
- `POST /api/master/provider` - Provider creation
- `POST /api/master/provider/availability-setting` - Set availability
- `GET /api/master/provider/{id}/slots/NEW` - Get available slots
- `POST /api/master/appointment` - Create appointment
- `GET /api/master/appointment` - Get appointments
- `PUT /api/master/appointment/update-status` - Update appointment status
- `GET /api/master/token/{appointmentId}` - Get Zoom token
- `POST /api/master/encounter-summary` - Create encounter
- `PUT /api/master/encounter-summary` - Update encounter

### Request/Response Examples
See individual test files for complete request/response examples matching the Postman collection structure.

## 🔄 Continuous Integration

### GitHub Actions
Add to `.github/workflows/api-tests.yml`:
```yaml
name: API Workflow Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install
      - run: npx playwright test tests/api/complete-healthcare-workflow.spec.js
```

## 📞 Support

For issues or questions about these workflow tests:
1. Check the console output for detailed error messages
2. Review the HTML report for visual test results
3. Verify API endpoint accessibility
4. Check authentication credentials
5. Ensure test data is valid

## 🔄 Updates

This test suite is based on the Postman collection "AI Session eCareHealth Final" and should be updated when:
- API endpoints change
- New workflow steps are added
- Authentication methods change
- Test data requirements change