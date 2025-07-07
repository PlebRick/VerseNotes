require('dotenv').config();

const API_KEY = process.env.BIBLE_API_KEY;

console.log('🔑 Testing Crossway ESV API Configuration...\n');

if (!API_KEY) {
  console.log('❌ No API key found in .env file');
  process.exit(1);
}

console.log('✅ API Key loaded from .env');
console.log(`🔑 Key: ${API_KEY.substring(0, 8)}...${API_KEY.substring(API_KEY.length - 4)}`);
console.log(`📏 Length: ${API_KEY.length} characters`);
console.log('');

// Test Crossway ESV API
async function testCrosswayAPI() {
  const testReference = 'John 3:16';
  console.log(`📖 Testing reference: ${testReference}`);
  
  const params = new URLSearchParams({
    q: testReference,
    'include-verse-numbers': 'true',
    'include-footnotes': 'false',
    'include-headings': 'true',
    'include-passage-references': 'true',
  });

  try {
    const response = await fetch(
      `https://api.esv.org/v3/passage/text/?${params}`,
      {
        headers: {
          'Authorization': `Token ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Crossway ESV API Test Successful!');
      console.log(`📖 Reference: ${data.reference}`);
      console.log(`📝 Content: ${data.passages[0].substring(0, 150)}...`);
      console.log(`© Copyright: ${data.copyright}`);
      console.log('\n🎉 Your Crossway ESV API key is working correctly!');
      
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ API Test Failed!');
      console.log('Error Response:', errorText.substring(0, 200));
      
      if (response.status === 401) {
        console.log('💡 401 Error - Invalid API key or unauthorized');
      } else if (response.status === 403) {
        console.log('💡 403 Error - API key lacks permissions');
      } else if (response.status === 429) {
        console.log('💡 429 Error - Rate limit exceeded');
      }
      
      return false;
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    return false;
  }
}

// Run the test
testCrosswayAPI().then(success => {
  if (success) {
    console.log('\n🚀 Ready to update the app for Crossway ESV API!');
  } else {
    console.log('\n❌ Please check your Crossway ESV API key');
  }
}); 