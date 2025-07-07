require('dotenv').config();

const API_KEY = process.env.BIBLE_API_KEY;

console.log('🔍 Detailed API Key Debug...\n');

if (!API_KEY) {
  console.log('❌ No API key found in .env file');
  process.exit(1);
}

console.log('✅ API Key loaded from .env');
console.log(`🔑 Key: ${API_KEY.substring(0, 8)}...${API_KEY.substring(API_KEY.length - 4)}`);
console.log(`📏 Length: ${API_KEY.length} characters`);
console.log('');

// Test different endpoints and provide detailed error info
async function testEndpoint(endpoint, description) {
  console.log(`🔍 Testing: ${description}`);
  console.log(`🌐 Endpoint: ${endpoint}`);
  
  try {
    const response = await fetch(endpoint, {
      headers: {
        'api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success!');
      if (data.data && Array.isArray(data.data)) {
        console.log(`📚 Found ${data.data.length} items`);
        if (data.data.length > 0) {
          console.log(`📖 First item: ${data.data[0].name || data.data[0].id}`);
        }
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Error Response:');
      console.log(errorText.substring(0, 200) + (errorText.length > 200 ? '...' : ''));
      
      if (response.status === 401) {
        console.log('💡 401 Error - Possible causes:');
        console.log('   - API key is invalid or expired');
        console.log('   - API key format is incorrect');
        console.log('   - API key doesn\'t have permission for this endpoint');
      } else if (response.status === 403) {
        console.log('💡 403 Error - API key lacks permissions');
      } else if (response.status === 429) {
        console.log('💡 429 Error - Rate limit exceeded');
      }
    }
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`);
  }
  
  console.log('');
}

async function runDebugTests() {
  console.log('🚀 Starting API Debug Tests...\n');
  
  // Test 1: Basic bibles endpoint
  await testEndpoint(
    'https://api.scripture.api.bible/v1/bibles',
    'Available Bibles'
  );
  
  // Test 2: Try with different header format
  console.log('🔍 Testing alternative header format...');
  try {
    const response = await fetch('https://api.scripture.api.bible/v1/bibles', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(`📊 Status with Bearer: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.log(`❌ Bearer test failed: ${error.message}`);
  }
  console.log('');
  
  // Test 3: Check if it's a different API service
  console.log('🔍 Testing if this might be a different Bible API...');
  console.log('💡 Your key might be for a different Bible API service');
  console.log('   Common alternatives:');
  console.log('   - Bible Gateway API');
  console.log('   - Crossway ESV API');
  console.log('   - Bible.org API');
  console.log('   - Custom ESV API');
  console.log('');
  
  // Test 4: Try ESV-specific endpoint
  await testEndpoint(
    'https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02',
    'ESV Bible Info'
  );
}

runDebugTests(); 