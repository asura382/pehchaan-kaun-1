const retentionService = require('./services/retentionService');

async function testRetentionService() {
  console.log('🧪 Testing Retention Service...\n');
  
  // Test scene that should fail retention criteria
  const lowQualityScene = `The forest was quiet. Alex walked through the trees. It was peaceful here. The sun filtered through the leaves. Birds chirped in the distance. He felt calm and relaxed. This was a nice place to be.`;
  
  const previousSceneSummary = "Alex discovered a mysterious cave entrance in the forest.";
  
  try {
    console.log('1. Testing scene with low retention quality...');
    console.log('Scene content:');
    console.log(lowQualityScene);
    console.log('\nPrevious scene summary:');
    console.log(previousSceneSummary);
    
    const result = await retentionService.processSceneWithRetention(lowQualityScene, previousSceneSummary);
    
    console.log('\n✅ Retention evaluation results:');
    console.log(`- Dialogue: ${result.metrics.dialogue}`);
    console.log(`- Emotion: ${result.metrics.emotion}/10`);
    console.log(`- Tension: ${result.metrics.tension}/10`);
    console.log(`- Hook: ${result.metrics.hook}`);
    console.log(`- Escalation: ${result.metrics.escalation}`);
    console.log(`- Was rewritten: ${result.wasRewritten}`);
    console.log(`- Rewrite attempts: ${result.rewriteAttempts}`);
    
    if (result.wasRewritten) {
      console.log('\n📝 Rewritten scene:');
      console.log(result.scene);
    }
    
    // Test a high-quality scene
    console.log('\n' + '='.repeat(50));
    console.log('\n2. Testing scene with high retention quality...');
    
    const highQualityScene = `"Where is it?" Sarah demanded, her voice sharp. "The entrance has to be here somewhere."
    
"I'm looking!" Mark snapped back, brushing dirt from his hands. "These old maps aren't exactly precise."
    
A low growl echoed from the darkness behind them. Both froze. The sound came again, closer this time.
    
"We need to move. Now." Sarah grabbed his arm, her grip tight with urgency.`;
    
    const result2 = await retentionService.processSceneWithRetention(highQualityScene, previousSceneSummary);
    
    console.log('\n✅ Retention evaluation results:');
    console.log(`- Dialogue: ${result2.metrics.dialogue}`);
    console.log(`- Emotion: ${result2.metrics.emotion}/10`);
    console.log(`- Tension: ${result2.metrics.tension}/10`);
    console.log(`- Hook: ${result2.metrics.hook}`);
    console.log(`- Escalation: ${result2.metrics.escalation}`);
    console.log(`- Was rewritten: ${result2.wasRewritten}`);
    console.log(`- Rewrite attempts: ${result2.rewriteAttempts}`);
    
    if (result2.wasRewritten) {
      console.log('\n📝 Rewritten scene:');
      console.log(result2.scene);
    } else {
      console.log('\n✅ Scene passed retention criteria without rewrite');
    }
    
    console.log('\n🎉 Retention Service testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRetentionService();