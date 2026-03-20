const axios = require('axios');

async function testWebNovelEngine() {
  const baseURL = 'http://localhost:3000';
  
  try {
    console.log('🧪 Testing Ollama WebNovel Engine v4...\n');
    
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    
    // Test 2: Initialize Novel
    console.log('\n2. Initializing Novel...');
    const novelData = {
      title: "The Last Dragon Keeper",
      theme: "A young orphan discovers they are the last descendant of dragon keepers and must prevent an ancient evil from awakening",
      genre: "Fantasy Adventure",
      tone: "Epic and mysterious with moments of wonder",
      worldRules: "Magic exists but is fading; Dragons are real but mostly dormant; Ancient prophecies guide the fate of kingdoms",
      mainCharacter: "Kira, a 16-year-old orphan with mysterious dragon-markings on her arms",
      sideCharacters: ["Elder Thorne - Village sage who knows the old ways", "Zephyr - A young thief with a heart of gold"],
      totalChapters: 20
    };
    
    const initResponse = await axios.post(`${baseURL}/novel/init`, novelData);
    console.log('✅ Novel Initialized:', initResponse.data.data.novel.title);
    console.log('   Novel ID:', initResponse.data.data.novel.id);
    console.log('   Arcs Generated:', initResponse.data.data.arcs.length);
    
    const novelId = initResponse.data.data.novel.id;
    
    // Test 3: Get Novel Status
    console.log('\n3. Checking Novel Status...');
    const statusResponse = await axios.get(`${baseURL}/novel/${novelId}/status`);
    console.log('✅ Status:', statusResponse.data.data);
    
    // Test 4: Get All Novels
    console.log('\n4. Listing All Novels...');
    const novelsResponse = await axios.get(`${baseURL}/novels`);
    console.log('✅ Novels Count:', novelsResponse.data.data.length);
    
    console.log('\n🎉 All tests passed! The WebNovel Engine is ready for use.');
    console.log('\n🚀 Next steps:');
    console.log('   - Generate chapters using: POST /novel/:id/generate/:chapterNumber');
    console.log('   - Update themes using: PUT /novel/:id/update-theme');
    console.log('   - Check progress using: GET /novel/:id/status');
    console.log('\n📝 Note: Chapter generation uses 5-stage pipeline:');
    console.log('   - Stage 1: Intent creation (Qwen2.5)');
    console.log('   - Stage 2: Scene breakdown (Qwen2.5)');
    console.log('   - Stage 3: Scene generation (Qwen2.5)');
    console.log('   - Stage 4: Emotional enhancement (Llama3)');
    console.log('   - Stage 5: Final assembly');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testWebNovelEngine();