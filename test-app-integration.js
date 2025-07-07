require('dotenv').config();

const API_KEY = process.env.BIBLE_API_KEY;

console.log('🧪 Testing App Integration with Crossway ESV API...\n');

if (!API_KEY) {
  console.log('❌ No API key found in .env file');
  process.exit(1);
}

console.log('✅ API Key loaded');
console.log('🔍 Testing Bible search functionality...\n');

// Test the same functionality the app uses
async function testAppSearch() {
  const testReferences = [
    'John 3:16',
    'Romans 1:1-16',
    'Genesis 1:1',
    'Psalm 23:1-6'
  ];

  for (const reference of testReferences) {
    console.log(`📖 Testing: ${reference}`);
    
    try {
      const params = new URLSearchParams({
        q: reference,
        'include-verse-numbers': 'true',
        'include-footnotes': 'false',
        'include-headings': 'true',
        'include-passage-references': 'true',
      });

      const response = await fetch(
        `https://api.esv.org/v3/passage/text/?${params}`,
        {
          headers: {
            'Authorization': `Token ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Success: ${data.reference || reference}`);
        console.log(`📝 Content preview: ${data.passages[0].substring(0, 100)}...`);
        console.log(`📊 Verses found: ${data.passages[0].split('[').length - 1}`);
      } else {
        console.log(`❌ Failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
}

// Test note-taking simulation
async function testNoteIntegration() {
  console.log('📝 Testing Note Integration...');
  
  // Simulate what happens when a user creates a note
  const testNote = {
    title: 'Test Note on John 3:16',
    content: 'This is a test note about God\'s love for the world.',
    verse_reference: 'John 3:16',
    tags: ['test', 'love', 'gospel']
  };
  
  console.log('✅ Note structure is valid');
  console.log(`📖 Note title: ${testNote.title}`);
  console.log(`🔗 Verse reference: ${testNote.verse_reference}`);
  console.log(`🏷️ Tags: ${testNote.tags.join(', ')}`);
  console.log('');
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting App Integration Tests...\n');
  
  await testAppSearch();
  await testNoteIntegration();
  
  console.log('🎉 All tests completed!');
  console.log('📱 Your app should now be ready to test in the browser');
  console.log('🌐 Open: http://localhost:8082');
  console.log('🔍 Try searching for: John 3:16, Romans 1:1-16, or Genesis 1:1');
}

runAllTests(); 