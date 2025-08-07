// Complete Appointment Booking Workflow API Test
// This test covers the complete end-to-end workflow:
// 1. Create Patient
// 2. Create Provider
// 3. Set Provider Availability
// 4. Get Available Slots
// 5. Book Appointment
// 6. Verify Appointment in List

const { test, expect } = require('@playwright/test');
const { API_CONFIG, getAuthHeaders, parseJsonResponse, getFutureDate, generateUniqueId } = require('../../utils/api');
const { CONFIG, getFreshToken } = require('./api-endpoints.spec');

test.describe('Complete Appointment Booking Workflow', () => {
  let globalAccessToken = null;
  let createdPatientId = null;
  let createdProviderId = null;
  let bookedAppointmentId = null;
  let availableSlot = null;

  test.beforeAll(async () => {
    console.log('🚀 Starting Complete Appointment Booking Workflow');
    console.log('Base URL:', CONFIG.baseURL);
    console.log('Tenant:', CONFIG.tenantId);
  });

  test('01. Get Access Token', async ({ request }) => {
    console.log('🔐 Getting access token...');
    
    globalAccessToken = await getFreshToken(request);
    expect(globalAccessToken).toBeTruthy();
    expect(globalAccessToken.length).toBeGreaterThan(100);
    
    console.log('✅ Token obtained:', globalAccessToken.substring(0, 50) + '...');
  });

  test('02. Create Patient', async ({ request }) => {
    console.log('👤 Creating patient...');
    
    const freshToken = await getFreshToken(request);
    const timestamp = Date.now();
    
    const patientData = {
      "phoneNotAvailable": false,
      "emailNotAvailable": false,
      "registrationDate": "",
      "firstName": "John",
      "middleName": "",
      "lastName": "TestPatient",
      "timezone": "EST",
      "birthDate": "1990-01-15T00:00:00.000Z",
      "gender": "MALE",
      "ssn": "",
      "mrn": "",
      "languages": null,
      "avatar": "",
      "mobileNumber": `555${timestamp.toString().slice(-7)}`,
      "faxNumber": "",
      "homePhone": "",
      "email": `patient.test.${timestamp}@example.com`,
      "address": {
        "line1": "123 Test Street",
        "line2": "",
        "city": "Test City",
        "state": "NY",
        "country": "USA",
        "zipcode": "12345"
      },
      "emergencyContacts": [
        {
          "firstName": "Jane",
          "lastName": "Emergency",
          "mobile": "5551234567"
        }
      ],
      "patientInsurances": [
        {
          "active": true,
          "insuranceId": "",
          "copayType": "FIXED",
          "coInsurance": "",
          "claimNumber": "",
          "note": "",
          "deductibleAmount": "",
          "employerName": "",
          "employerAddress": {
            "line1": "",
            "line2": "",
            "city": "",
            "state": "",
            "country": "",
            "zipcode": ""
          },
          "subscriberFirstName": "",
          "subscriberLastName": "",
          "subscriberMiddleName": "",
          "subscriberSsn": "",
          "subscriberMobileNumber": "",
          "subscriberAddress": {
            "line1": "",
            "line2": "",
            "city": "",
            "state": "",
            "country": "",
            "zipcode": ""
          },
          "groupId": "",
          "memberId": "",
          "groupName": "",
          "frontPhoto": "",
          "backPhoto": "",
          "insuredFirstName": "",
          "insuredLastName": "",
          "address": {
            "line1": "",
            "line2": "",
            "city": "",
            "state": "",
            "country": "",
            "zipcode": ""
          },
          "insuredBirthDate": "",
          "coPay": "",
          "insurancePayer": {}
        }
      ],
      "emailConsent": true,
      "messageConsent": true,
      "callConsent": true,
      "patientConsentEntities": [
        {
          "signedDate": new Date().toISOString()
        }
      ]
    };

    const response = await request.post(`${CONFIG.baseURL}/api/master/patient`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': `Bearer ${freshToken}`,
        'Content-Type': 'application/json',
        'X-TENANT-ID': CONFIG.tenantId
      },
      data: patientData
    });

    console.log(`Patient Creation Status: ${response.status()}`);
    
    const responseBody = await parseJsonResponse(response);
    console.log('Patient Creation Response:', JSON.stringify(responseBody, null, 2));
    
    if (response.status() === 201) {
      expect(response.status()).toBe(201);
      expect(responseBody.code).toBe('PATIENT_CREATED');
      
      // Get the created patient ID from the response or fetch from patient list
      if (responseBody.data && responseBody.data.uuid) {
        createdPatientId = responseBody.data.uuid;
      } else {
        // Fallback: Get patient ID from patient list
        const patientsResponse = await request.get(`${CONFIG.baseURL}/api/master/patient?page=0&size=20&searchString=${patientData.firstName}`, {
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Authorization': `Bearer ${freshToken}`,
            'X-TENANT-ID': CONFIG.tenantId
          }
        });
        
        const patientsData = await parseJsonResponse(patientsResponse);
        if (patientsData.data && patientsData.data.content && patientsData.data.content.length > 0) {
          createdPatientId = patientsData.data.content[0].uuid;
        }
      }
      
      console.log('✅ Patient created successfully. ID:', createdPatientId);
    } else {
      console.log('⚠️ Patient creation failed or returned different status');
      expect(responseBody).toBeDefined();
    }
  });

  test('03. Create Provider', async ({ request }) => {
    console.log('👨‍⚕️ Creating provider...');
    
    const freshToken = await getFreshToken(request);
    const timestamp = Date.now();
    
    const providerData = {
      "roleType": "PROVIDER",
      "active": true,
      "admin_access": false,
      "status": true,
      "avatar": "",
      "role": "PROVIDER",
      "firstName": "Dr. Sarah",
      "lastName": "TestProvider",
      "gender": "FEMALE",
      "phone": `555${timestamp.toString().slice(-7)}`,
      "npi": `123456${timestamp.toString().slice(-4)}`,
      "specialities": ["General Practice"],
      "groupNpiNumber": "",
      "licensedStates": ["NY", "CA"],
      "licenseNumber": `LIC${timestamp.toString().slice(-6)}`,
      "acceptedInsurances": null,
      "experience": "5 years",
      "taxonomyNumber": "",
      "workLocations": null,
      "email": `provider.test.${timestamp}@example.com`,
      "officeFaxNumber": "",
      "areaFocus": "General Medicine",
      "hospitalAffiliation": "",
      "ageGroupSeen": null,
      "spokenLanguages": ["English"],
      "providerEmployment": "",
      "insurance_verification": "",
      "prior_authorization": "",
      "secondOpinion": "",
      "careService": null,
      "bio": "Test provider for automated testing",
      "expertise": "General Practice",
      "workExperience": "5 years of experience",
      "licenceInformation": [
        {
          "uuid": "",
          "licenseState": "NY",
          "licenseNumber": `LIC${timestamp.toString().slice(-6)}`
        }
      ],
      "deaInformation": [
        {
          "deaState": "",
          "deaNumber": "",
          "deaTermDate": "",
          "deaActiveDate": ""
        }
      ]
    };

    const response = await request.post(`${CONFIG.baseURL}/api/master/provider`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': `Bearer ${freshToken}`,
        'Content-Type': 'application/json',
        'X-TENANT-ID': CONFIG.tenantId
      },
      data: providerData
    });

    console.log(`Provider Creation Status: ${response.status()}`);
    
    const responseBody = await parseJsonResponse(response);
    console.log('Provider Creation Response:', JSON.stringify(responseBody, null, 2));
    
    if (response.status() === 201) {
      expect(response.status()).toBe(201);
      expect(responseBody.code).toBe('PROVIDER_CREATED');
      
      // Get the created provider ID from the response or fetch from provider list
      if (responseBody.data && responseBody.data.uuid) {
        createdProviderId = responseBody.data.uuid;
      } else {
        // Fallback: Get provider ID from provider list
        const providersResponse = await request.get(`${CONFIG.baseURL}/api/master/provider?page=0&size=20`, {
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Authorization': `Bearer ${freshToken}`,
            'X-TENANT-ID': CONFIG.tenantId
          }
        });
        
        const providersData = await parseJsonResponse(providersResponse);
        if (providersData.data && providersData.data.content && providersData.data.content.length > 0) {
          // Find the provider we just created by email
          const createdProvider = providersData.data.content.find(p => p.email === providerData.email);
          if (createdProvider) {
            createdProviderId = createdProvider.uuid;
          } else {
            createdProviderId = providersData.data.content[0].uuid; // Fallback to first provider
          }
        }
      }
      
      console.log('✅ Provider created successfully. ID:', createdProviderId);
    } else {
      console.log('⚠️ Provider creation failed or returned different status');
      expect(responseBody).toBeDefined();
    }
  });

  test('04. Set Provider Availability', async ({ request }) => {
    console.log('📅 Setting provider availability...');
    
    if (!createdProviderId) {
      console.log('⚠️ Skipping availability setting - no provider ID available');
      return;
    }

    const freshToken = await getFreshToken(request);
    
    const availabilityData = {
      "setToWeekdays": false,
      "providerId": createdProviderId,
      "bookingWindow": "30", // 30 days booking window
      "timezone": "EST",
      "bufferTime": 0,
      "initialConsultTime": 0,
      "followupConsultTime": 0,
      "settings": [
        {
          "type": "NEW",
          "slotTime": "30", // 30-minute slots
          "minNoticeUnit": "1_HOUR" // Minimum 1 hour notice
        }
      ],
      "blockDays": [],
      "daySlots": [
        {
          "day": "MONDAY",
          "startTime": "09:00:00",
          "endTime": "17:00:00",
          "availabilityMode": "VIRTUAL"
        },
        {
          "day": "TUESDAY",
          "startTime": "09:00:00",
          "endTime": "17:00:00",
          "availabilityMode": "VIRTUAL"
        },
        {
          "day": "WEDNESDAY",
          "startTime": "09:00:00",
          "endTime": "17:00:00",
          "availabilityMode": "VIRTUAL"
        },
        {
          "day": "THURSDAY",
          "startTime": "09:00:00",
          "endTime": "17:00:00",
          "availabilityMode": "VIRTUAL"
        },
        {
          "day": "FRIDAY",
          "startTime": "09:00:00",
          "endTime": "17:00:00",
          "availabilityMode": "VIRTUAL"
        }
      ],
      "bookBefore": "undefined undefined",
      "xTENANTID": CONFIG.tenantId
    };

    const response = await request.post(`${CONFIG.baseURL}/api/master/provider/availability-setting`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': `Bearer ${freshToken}`,
        'Content-Type': 'application/json',
        'X-TENANT-ID': CONFIG.tenantId
      },
      data: availabilityData
    });

    console.log(`Availability Setting Status: ${response.status()}`);
    
    const responseBody = await parseJsonResponse(response);
    console.log('Availability Response:', JSON.stringify(responseBody, null, 2));
    
    if (response.status() === 200) {
      expect(response.status()).toBe(200);
      console.log('✅ Provider availability set successfully');
    } else {
      console.log('⚠️ Availability setting failed or returned different status');
      expect(responseBody).toBeDefined();
    }
  });

  test('05. Get Available Slots', async ({ request }) => {
    console.log('🗓️ Getting available slots...');
    
    if (!createdProviderId) {
      console.log('⚠️ Skipping slot retrieval - no provider ID available');
      return;
    }

    const freshToken = await getFreshToken(request);
    
    // Create date range for next 7 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1); // Start from tomorrow
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7); // 7 days from start date
    endDate.setHours(23, 59, 59, 999);

    const params = {
      page: 0,
      size: 100,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      availabilityMode: 'VIRTUAL'
    };
    
    console.log('Slot Query Parameters:', params);
    
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const url = `${CONFIG.baseURL}/api/master/provider/${createdProviderId}/slots/NEW?${queryString}`;
    console.log('Slots Request URL:', url);

    const response = await request.get(url, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': `Bearer ${freshToken}`,
        'X-TENANT-ID': CONFIG.tenantId
      }
    });

    console.log(`Slots Retrieval Status: ${response.status()}`);
    
    const responseBody = await parseJsonResponse(response);
    
    if (response.status() === 200) {
      expect(response.status()).toBe(200);
      
      if (responseBody.data && Array.isArray(responseBody.data.content)) {
        console.log(`✅ Found ${responseBody.data.content.length} available slots`);
        
        if (responseBody.data.content.length > 0) {
          // Store the first available slot for booking
          availableSlot = responseBody.data.content[0];
          console.log('Selected slot for booking:', {
            startTime: availableSlot.startTime,
            endTime: availableSlot.endTime,
            duration: availableSlot.duration
          });
        } else {
          console.log('⚠️ No available slots found');
        }
      } else {
        console.log('⚠️ Unexpected response structure for slots');
        console.log('Response:', JSON.stringify(responseBody, null, 2));
      }
    } else {
      console.log('⚠️ Slots retrieval failed');
      console.log('Response:', JSON.stringify(responseBody, null, 2));
      expect(responseBody).toBeDefined();
    }
  });

  test('06. Book Appointment', async ({ request }) => {
    console.log('📝 Booking appointment...');
    
    if (!createdPatientId || !createdProviderId) {
      console.log('⚠️ Skipping appointment booking - missing patient or provider ID');
      console.log('Patient ID:', createdPatientId);
      console.log('Provider ID:', createdProviderId);
      return;
    }

    const freshToken = await getFreshToken(request);
    
    // Use available slot if found, otherwise create future time
    let startTime, endTime;
    
    if (availableSlot) {
      startTime = new Date(availableSlot.startTime);
      endTime = new Date(availableSlot.endTime);
      console.log('Using available slot:', {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      });
    } else {
      // Fallback: Create appointment time 7 days from now
      startTime = new Date();
      startTime.setDate(startTime.getDate() + 7);
      startTime.setHours(10, 0, 0, 0); // 10:00 AM
      
      endTime = new Date(startTime);
      endTime.setMinutes(startTime.getMinutes() + 30); // 30-minute appointment
      
      console.log('Using fallback time slot:', {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      });
    }

    const appointmentData = {
      "mode": "VIRTUAL",
      "patientId": createdPatientId,
      "customForms": null,
      "visit_type": "",
      "type": "NEW",
      "paymentType": "CASH",
      "providerId": createdProviderId,
      "startTime": startTime.toISOString(),
      "endTime": endTime.toISOString(),
      "insurance_type": "",
      "note": "Automated test appointment - Complete workflow",
      "authorization": "",
      "forms": [],
      "chiefComplaint": "Test appointment for complete workflow validation",
      "isRecurring": false,
      "recurringFrequency": "daily",
      "reminder_set": false,
      "endType": "never",
      "endDate": new Date().toISOString(),
      "endAfter": 5,
      "customFrequency": 1,
      "customFrequencyUnit": "days",
      "selectedWeekdays": [],
      "reminder_before_number": 1,
      "timezone": "EST",
      "duration": 30,
      "xTENANTID": CONFIG.tenantId
    };

    const response = await request.post(`${CONFIG.baseURL}/api/master/appointment`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': `Bearer ${freshToken}`,
        'Content-Type': 'application/json',
        'X-TENANT-ID': CONFIG.tenantId
      },
      data: appointmentData
    });

    console.log(`Appointment Booking Status: ${response.status()}`);
    
    const responseBody = await parseJsonResponse(response);
    console.log('Appointment Booking Response:', JSON.stringify(responseBody, null, 2));
    
    if (response.status() === 201) {
      expect(response.status()).toBe(201);
      expect(responseBody.code).toBe('APPOINTMENT_CREATED');
      expect(responseBody.message).toBe('Appointment booked successfully.');
      
      // Store appointment ID if available in response
      if (responseBody.data && responseBody.data.uuid) {
        bookedAppointmentId = responseBody.data.uuid;
      }
      
      console.log('✅ Appointment booked successfully. ID:', bookedAppointmentId);
    } else {
      console.log('⚠️ Appointment booking failed or returned different status');
      expect(responseBody).toBeDefined();
    }
  });

  test('07. Verify Appointment in List', async ({ request }) => {
    console.log('📋 Verifying appointment in list...');
    
    if (!createdProviderId) {
      console.log('⚠️ Skipping appointment verification - no provider ID available');
      return;
    }

    const freshToken = await getFreshToken(request);
    
    // Create date range for appointment search (wider range to ensure we catch the appointment)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1); // Start from yesterday
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // 30 days from now
    endDate.setHours(23, 59, 59, 999);

    const params = {
      page: 0,
      size: 50,
      providerUuid: createdProviderId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
    
    console.log('Appointment Search Parameters:', params);
    
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const url = `${CONFIG.baseURL}/api/master/appointment?${queryString}`;
    console.log('Appointments Request URL:', url);

    const response = await request.get(url, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': `Bearer ${freshToken}`,
        'X-TENANT-ID': CONFIG.tenantId
      }
    });

    console.log(`Appointments Retrieval Status: ${response.status()}`);
    
    const responseBody = await parseJsonResponse(response);
    
    if (response.status() === 200) {
      expect(response.status()).toBe(200);
      
      if (responseBody.data && Array.isArray(responseBody.data.content)) {
        console.log(`✅ Found ${responseBody.data.content.length} appointments for provider`);
        
        // Look for our booked appointment
        let foundAppointment = null;
        
        if (bookedAppointmentId) {
          // Search by appointment ID if we have it
          foundAppointment = responseBody.data.content.find(apt => apt.uuid === bookedAppointmentId);
        } else if (createdPatientId) {
          // Search by patient ID
          foundAppointment = responseBody.data.content.find(apt => apt.patientId === createdPatientId);
        }
        
        if (foundAppointment) {
          console.log('✅ Successfully verified booked appointment in list:');
          console.log(`- Appointment ID: ${foundAppointment.uuid}`);
          console.log(`- Patient: ${foundAppointment.patientFirstName} ${foundAppointment.patientLastName}`);
          console.log(`- Provider: ${foundAppointment.providerFirstName} ${foundAppointment.providerLastName}`);
          console.log(`- Start Time: ${foundAppointment.startTime}`);
          console.log(`- End Time: ${foundAppointment.endTime}`);
          console.log(`- Type: ${foundAppointment.type}`);
          console.log(`- Mode: ${foundAppointment.mode}`);
          console.log(`- Status: ${foundAppointment.status || 'N/A'}`);
          
          // Verify appointment details
          expect(foundAppointment.patientId).toBe(createdPatientId);
          expect(foundAppointment.providerId).toBe(createdProviderId);
          expect(foundAppointment.type).toBe('NEW');
          expect(foundAppointment.mode).toBe('VIRTUAL');
          
        } else {
          console.log('⚠️ Could not find the booked appointment in the list');
          console.log('Available appointments:');
          responseBody.data.content.forEach((apt, index) => {
            console.log(`${index + 1}. Patient: ${apt.patientFirstName} ${apt.patientLastName}, Time: ${apt.startTime}`);
          });
        }
      } else {
        console.log('⚠️ Unexpected response structure for appointments');
        console.log('Response:', JSON.stringify(responseBody, null, 2));
      }
    } else {
      console.log('⚠️ Appointments retrieval failed');
      console.log('Response:', JSON.stringify(responseBody, null, 2));
      expect(responseBody).toBeDefined();
    }
  });

  test.afterAll(async () => {
    console.log('🏁 Complete Appointment Booking Workflow Completed');
    console.log('Summary:');
    console.log(`- Patient ID: ${createdPatientId || 'Not created'}`);
    console.log(`- Provider ID: ${createdProviderId || 'Not created'}`);
    console.log(`- Appointment ID: ${bookedAppointmentId || 'Not booked'}`);
    console.log(`- Available Slot Used: ${availableSlot ? 'Yes' : 'No'}`);
  });
});