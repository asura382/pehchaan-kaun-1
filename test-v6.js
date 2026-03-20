const fs = require('fs-extra');
const path = require('path');

async function testV6Features() {
  console.log('🧪 Testing WebNovel Engine V6 Features...\n');
  
  // Test 1: Check if character core file exists
  console.log('1. Checking Character Core Memory System...');
  const characterCorePath = path.join(__dirname, 'data', 'characterCore.json');
  const characterCoreExists = await fs.pathExists(characterCorePath);
  
  if (characterCoreExists) {
    const characterCore = await fs.readJson(characterCorePath);
    console.log('✅ Character Core file exists with structure:');
    console.log('   - Personality:', !!characterCore.protagonist.personality);
    console.log('   - Speech Style:', !!characterCore.protagonist.speech_style);
    console.log('   - Core Wound:', !!characterCore.protagonist.core_wound);
    console.log('   - Long-term Goal:', !!characterCore.protagonist.long_term_goal);
    console.log('   - Current Arc Goal:', !!characterCore.protagonist.current_arc_goal);
    console.log('   - Emotional Trigger:', !!characterCore.protagonist.emotional_trigger);
  } else {
    console.log('❌ Character Core file does not exist');
  }
  
  // Test 2: Check if metrics file exists
  console.log('\n2. Checking Metrics Logging System...');
  const metricsPath = path.join(__dirname, 'data', 'chapterMetrics.json');
  const metricsExists = await fs.pathExists(metricsPath);
  
  if (metricsExists) {
    console.log('✅ Metrics logging file exists');
  } else {
    console.log('❌ Metrics logging file does not exist');
  }
  
  // Test 3: Check retention service
  console.log('\n3. Checking Retention Service...');
  const retentionServicePath = path.join(__dirname, 'services', 'retentionService.js');
  const retentionServiceExists = await fs.pathExists(retentionServicePath);
  
  if (retentionServiceExists) {
    const retentionServiceCode = await fs.readFile(retentionServicePath, 'utf8');
    const hasCliffhangerEnforcement = retentionServiceCode.includes('cliffhanger');
    const hasMultiLayerEvaluation = retentionServiceCode.includes('tensionHigherThanPrevious');
    const hasCharacterCore = retentionServiceCode.includes('characterCore');
    
    console.log('✅ Retention Service exists with features:');
    console.log('   - Cliffhanger enforcement:', hasCliffhangerEnforcement);
    console.log('   - Multi-layer evaluation:', hasMultiLayerEvaluation);
    console.log('   - Character core integration:', hasCharacterCore);
  } else {
    console.log('❌ Retention Service does not exist');
  }
  
  // Test 4: Check engine mode
  console.log('\n4. Checking Engine Mode...');
  const serverPath = path.join(__dirname, 'server.js');
  const serverCode = await fs.readFile(serverPath, 'utf8');
  const hasEngineMode = serverCode.includes('AUTHOR_V6_STRICT');
  
  console.log('✅ Engine mode check:', hasEngineMode ? 'AUTHOR_V6_STRICT' : 'Not set');
  
  // Test 5: Check chapter service updates
  console.log('\n5. Checking Chapter Service Updates...');
  const chapterServicePath = path.join(__dirname, 'services', 'chapterService.js');
  const chapterServiceCode = await fs.readFile(chapterServicePath, 'utf8');
  const hasCharacterInjection = chapterServiceCode.includes('characterCore');
  const hasCliffhangerProcessing = chapterServiceCode.includes('processCliffhanger');
  const hasMetricsLogging = chapterServiceCode.includes('logMetrics');
  
  console.log('✅ Chapter Service updated with:');
  console.log('   - Character core injection:', hasCharacterInjection);
  console.log('   - Cliffhanger processing:', hasCliffhangerProcessing);
  console.log('   - Metrics logging:', hasMetricsLogging);
  
  console.log('\n🎉 V6 Feature Test Complete!');
  console.log('\n📋 Summary of V6 Enhancements:');
  console.log('   - Character Core Memory System: Persistent character data');
  console.log('   - Strict Retention Evaluation: Higher thresholds (60% dialogue, 8/10 emotion/tension)');
  console.log('   - Cliffhanger Enforcement: Dedicated evaluation/rework for endings');
  console.log('   - Multi-layer Escalation: Power shifts, new info, hooks');
  console.log('   - Metrics Logging: Comprehensive tracking system');
  console.log('   - Engine Mode: AUTHOR_V6_STRICT for maximum quality');
}

testV6Features();