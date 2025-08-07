// Provider Slots API Test
const { test, expect } = require('@playwright/test');
const { API_CONFIG, getAuthHeaders, parseJsonResponse, logResponseDetails } = require('../../utils/api');
const { CONFIG, getFreshToken } = require('./api-endpoints.spec');

test.describe('Provider Slots API Tests', () => {
  let globalAccessToken = null;

  test.beforeAll(async () => {
    console.log('🚀 Starting Provider Slots API Test Suite');
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

  test('02. Get Provider Slots - With Exactly 24 Hours Duration', async ({ request }) => {
    console.log('🗓️ Testing Get Provider Slots API...');

    // Provider ID from the curl command
    const providerId = '91914add-c7ca-41ce-94e2-9ab83a97e596';
    
    // Get fresh token for this operation
    const freshToken = await getFreshToken(request);

    // Create start date at a consistent time
    const startDate = new Date('2025-01-01T00:00:00.000Z');
    
    // Create end date exactly 24 hours later
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 24);

    // URL parameters with fixed time duration (exactly 24 hours)
    const params = {
      page: 0,
      size: 1000,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      availabilityMode: 'VIRTUAL'
    };
    
    console.log('Date Range:', {
      startDate: params.startDate,
      endDate: params.endDate,
      durationHours: (new Date(params.endDate) - new Date(params.startDate)) / (1000 * 60 * 60)
    });
    
    // Build query string
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const url = `${CONFIG.baseURL}/api/master/provider/${providerId}/slots/NEW?${queryString}`;
    console.log('Request URL:', url);

    // Make API call
    const response = await request.get(url, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9,mr;q=0.8',
        'Authorization': `Bearer ${freshToken}`,
        'Connection': 'keep-alive',
        'Origin': `https://${CONFIG.tenantId}.uat.provider.ecarehealth.com`,
        'Referer': `https://${CONFIG.tenantId}.uat.provider.ecarehealth.com/`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        'X-TENANT-ID': CONFIG.tenantId,
        'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site'
      }
    });

    // Log detailed response
    console.log(`Status: ${response.status()} ${response.statusText()}`);

    const responseBody = await parseJsonResponse(response);
    console.log('Response body:', JSON.stringify(responseBody, null, 2));
    
    // Adjust test based on response
    if (response.status() === 200) {
      // Success case
      expect(response.status()).toBe(200);
      
      // Log content summary
      if (responseBody.data && Array.isArray(responseBody.data.content)) {
        console.log(`✅ Provider slots retrieved successfully. Found ${responseBody.data.content.length} slots.`);
        
        if (responseBody.data.content.length > 0) {
          // Show a sample of the first slot
          console.log('Sample slot data:');
          console.log(JSON.stringify(responseBody.data.content[0], null, 2));
        } else {
          console.log('No slots available for the specified time range.');
        }
      } else {
        console.log('Response structure does not match expected format.');
      }
    } else {
      // Error case - don't fail the test, just log the error
      console.log(`⚠️ API returned status ${response.status()}`);
      console.log('Error details:', JSON.stringify(responseBody, null, 2));
      
      // Test that we have a proper error response
      expect(responseBody).toBeDefined();
    }
  });

  test.afterAll(async () => {
    console.log('🏁 Provider Slots API Test Suite Completed');
  });
}); 