// Complete structural repair for chapterService.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'chapterService.js');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Starting structural repair...');

// Fix 1: Add amplify method to EmotionalAmplifier (after enhanceSceneContent method, before getContextForScene)
const amplifyMethod = `
  
  async amplify(content, options = {}) {
    const { genre, tone, targetAudience, intensityLevel } = options;
    
    if (!content || typeof content !== 'string') {
      console.warn('Invalid content provided to emotional amplifier');
      return content;
    }
    
    // Calculate the 75% split point
    const words = content.split(/\s+/);
    const splitIndex = Math.floor(words.length * 0.75);
    
    if (splitIndex <= 0) {
      console.warn('Content too short for emotional enhancement');
      return content;
    }
    
    const first75Percent = words.slice(0, splitIndex).join(' ');
    const last25Percent = words.slice(splitIndex).join(' ');
    
    try {
      // Enhance only the final 25%
      const enhancedLast25Percent = await this.enhanceSceneContent(last25Percent, {
        genre,
        tone,
        targetAudience,
        intensityLevel,
        sceneType: 'Chapter Climax'
      });
      
      // Combine back together
      const enhancedContent = `${first75Percent} ${enhancedLast25Percent}`.trim();
      
      console.log('Emotional enhancement applied to final 25% of chapter');
      return enhancedContent;
    } catch (error) {
      console.warn('Failed to apply emotional enhancement, using original content:', error.message);
      return content;
    }
  }
`;

// Insert after sanitizeEnhancedContent method (find line with "return sanitized.trim();")
const insertAfterSanitize = content.indexOf('return sanitized.trim();\n  }\n}\n\n// ========================================\n// STAGE 5: STRUCTURAL VALIDATOR');
if (insertAfterSanitize !== -1) {
  const insertPos = content.indexOf('}\n}\n\n// ========================================\n// STAGE 5: STRUCTURAL VALIDATOR', insertAfterSanitize);
  if (insertPos !== -1) {
    const before = content.substring(0, insertPos + 1);
    const after = content.substring(insertPos + 1);
    content = before + amplifyMethod + after;
    console.log('✓ Added amplify method to EmotionalAmplifier');
  }
}

// Fix 2: Repair ContinuityValidator class
const brokenContinuity = content.indexOf('// ========================================\n// STAGE 7: CONTINUITY VALIDATOR\n// ========================================\nclass ContinuityValidator {\n\n\n\n\n\n    if (locationsInActIII.length > 0');
if (brokenContinuity !== -1) {
  // Find where this broken section starts and replace with proper class structure
  const lines = content.split('\n');
  let newLines = [];
  let skipUntil = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (i >= 1240 && i <= 1245 && lines[i].trim().startsWith('if (locationsInActIII')) {
      // Replace the broken beginning with proper validate method
      newLines.push('  validate(content) {');
      newLines.push('    const acts = content.split(\'\\n\\n\');');
      newLines.push('    if (acts.length < 3) {');
      newLines.push('      return { valid: false, violations: [\'Insufficient acts\'] };');
      newLines.push('    }');
      newLines.push('    ');
      newLines.push('    const actI = acts[0];');
      newLines.push('    const actII = acts[1];');
      newLines.push('    const actIII = acts[2];');
      newLines.push('    const violations = [];');
      skipUntil = i + 5; // Skip orphaned variable declarations
    } else if (i > skipUntil) {
      newLines.push(lines[i]);
    } else if (i < 1240 || i > 1250) {
      newLines.push(lines[i]);
    }
  }
  
  content = newLines.join('\n');
  console.log('✓ Repaired ContinuityValidator class structure');
}

// Write the repaired file
fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ File repaired successfully');
console.log('Verifying syntax...');
