require('dotenv').config();

const API_KEY = process.env.BIBLE_API_KEY;

console.log('🔑 Testing Bible API Configuration...\n');

if (!API_KEY || API_KEY === 'your-esv-api-key-here') {
  console.log('❌ API Key not configured!');
  console.log('Please add your API key to the .env file');
  process.exit(1);
}

console.log('✅ API Key found in .env file');
console.log(`🔑 Key: ${API_KEY.substring(0, 8)}...${API_KEY.substring(API_KEY.length - 4)}`);
console.log('📚 Checking available Bibles...\n');

// First, let's see what Bibles are available with this API key
async function getAvailableBibles() {
  try {
    const response = await fetch('https://api.scripture.api.bible/v1/bibles', {
      headers: {
        'api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      console.log('✅ Available Bibles:');
      data.data.forEach((bible, index) => {
        console.log(`${index + 1}. ${bible.name} (${bible.abbreviation}) - ID: ${bible.id}`);
      });
      
      // Try to find ESV
      const esv = data.data.find(bible => 
        bible.abbreviation === 'ESV' || 
        bible.name.includes('English Standard Version')
      );
      
      if (esv) {
        console.log(`\n🎯 Found ESV Bible: ${esv.id}`);
        return esv.id;
      } else {
        console.log('\n⚠️  ESV not found, using first available Bible');
        return data.data[0].id;
      }
    } else {
      console.log('❌ No Bibles available with this API key');
      return null;
    }
  } catch (error) {
    console.log('❌ Failed to get available Bibles');
    console.log('Error:', error.message);
    return null;
  }
}

// Test a specific passage
async function testPassage(bibleId) {
  if (!bibleId) {
    console.log('❌ No Bible ID available for testing');
    return;
  }

  console.log(`\n📖 Testing passage with Bible ID: ${bibleId}`);
  
  try {
    const response = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${bibleId}/passages/JHN.3.16`,
      {
        headers: {
          'api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.data && data.data.content) {
      console.log('✅ Passage Test Successful!');
      console.log(`📖 Reference: ${data.data.reference}`);
      console.log(`📝 Content: ${data.data.content.substring(0, 150)}...`);
      console.log('\n🎉 Your API key is working correctly!');
    } else {
      console.log('❌ Unexpected API response format');
      console.log('Response:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log('❌ Passage Test Failed!');
    console.log('Error:', error.message);
    
    if (error.message.includes('401')) {
      console.log('💡 This usually means the API key is invalid');
    } else if (error.message.includes('403')) {
      console.log('💡 This usually means the API key has no permissions');
    } else if (error.message.includes('429')) {
      console.log('💡 This usually means you hit the rate limit');
    } else if (error.message.includes('404')) {
      console.log('💡 This usually means the passage ID format is incorrect');
    }
  }
}

// Run the tests
async function runTests() {
  const bibleId = await getAvailableBibles();
  await testPassage(bibleId);
}

runTests(); 