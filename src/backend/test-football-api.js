const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testFootballAPI() {
  console.log('Testing Football API...\n');

  const endpoints = [
    '/football/competitions',
    '/football/areas',
    '/football/competitions/PL/teams',
    '/football/competitions/PL/standings'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      const response = await axios.get(`${BASE_URL}${endpoint}`);
      
      if (response.data.success) {
        console.log(`SUCCESS: ${endpoint}`);
        console.log(`   Data keys: ${Object.keys(response.data.data || {}).join(', ')}`);
      } else {
        console.log(`FAILED: ${endpoint}`);
        console.log(`   Error: ${response.data.error}`);
      }
    } catch (error) {
      console.log(`ERROR: ${endpoint}`);
      console.log(`   ${error.response?.status}: ${error.response?.data?.error || error.message}`);
    }
    console.log('');
  }

  console.log('Football API test completed!');
}

// Test CORS
async function testCORS() {
  console.log('Testing CORS...\n');

  try {
    const response = await axios.get(`${BASE_URL}/football/competitions`, {
      headers: {
        'Origin': 'http://localhost:3000'
      }
    });
    
    console.log('CORS test PASSED');
    console.log('   Response headers:', Object.keys(response.headers));
  } catch (error) {
    console.log('CORS test FAILED');
    console.log(`   ${error.response?.status}: ${error.response?.data?.error || error.message}`);
  }
}

// Run tests
async function runTests() {
  try {
    await testCORS();
    console.log('\n' + '='.repeat(50) + '\n');
    await testFootballAPI();
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Check if server is running first
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/health`);
    console.log('Server is running, starting tests...\n');
    return true;
  } catch (error) {
    console.log('ERROR: Server is not running on', BASE_URL);
    console.log('Please start the server with: npm run dev');
    return false;
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
}

main().catch(console.error); 