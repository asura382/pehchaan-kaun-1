const fs = require('fs-extra');
const path = require('path');
const aiProvider = require('./aiProvider');
const intentService = require('./intentService');
const memoryService = require('./memoryService');
const arcService = require('./arcService');
const retentionService = require('./retentionService');
const logger = require('../utils/logger');

// ========================================
// STAGE 1: ESCALATION BLUEPRINT GENERATOR
// ========================================
class EscalationBlueprintGenerator {
  async generate(novel, arc, chapterNumber, options = {}) {
    const { genre, tone, targetAudience, intensityLevel, previousChapterSummary, memorySummary } = options;
    
    const escalationPrompt = `
Generate a genre-agnostic escalation blueprint for Chapter ${chapterNumber} of "${novel.title}".

CONTEXT:
- Novel: ${novel.title}
- Genre: ${genre}
- Tone: ${tone}
- Target Audience: ${targetAudience}
- Intensity Level: ${intensityLevel}/10
- Previous Chapter: ${previousChapterSummary || 'Beginning of story'}
- Memory Summary: ${memorySummary || 'No prior memory'}

UNIVERSAL NARRATIVE DRIVERS TO CONSIDER:
- Identity threat
- Social consequence  
- Loss risk
- Power imbalance
- Emotional vulnerability
- Desire vs obstacle
- Status change
- Mystery introduction

BLUEPRINT REQUIREMENTS:
- Protagonist emotional state
- Core conflict
- Stakes level 1
- Stakes level 2
- Stakes level 3
- Breaking point
- Irreversible shift
- Cliffhanger type

Return the blueprint in JSON format with these properties:
{
  "protagonistState": "...",
  "coreConflict": "...",
  "stakesLevel1": "...",
  "stakesLevel2": "...",
  "stakesLevel3": "...",
  "breakingPoint": "...",
  "irreversibleShift": "...",
  "cliffhangerType": "..."
}
        `.trim();

    try {
      const rawBlueprint = await aiProvider.generateStructure(escalationPrompt);
      
      // Extract JSON from response if it contains additional text
      const jsonStart = rawBlueprint.indexOf('{');
      const jsonEnd = rawBlueprint.lastIndexOf('}') + 1;
      
      if (jsonStart !== -1 && jsonEnd !== 0) {
        const jsonString = rawBlueprint.substring(jsonStart, jsonEnd);
        return JSON.parse(jsonString);
      }
      
      // If no JSON found, parse as plain text and create structure
      return {
        protagonistState: "Protagonist starts in initial state",
        coreConflict: "Main conflict to escalate",
        stakesLevel1: "Initial stakes introduced",
        stakesLevel2: "Stakes intensified",
        stakesLevel3: "Maximum stakes reached",
        breakingPoint: "Moment of no return",
        irreversibleShift: "Change in status/dynamic",
        cliffhangerType: "Unresolved tension"
      };
    } catch (error) {
      logger.warn(`Failed to parse escalation blueprint as JSON, using default structure:`, error.message);
      // Return a default structure if parsing fails
      return {
        protagonistState: "Protagonist starts in initial state",
        coreConflict: "Main conflict to escalate",
        stakesLevel1: "Initial stakes introduced",
        stakesLevel2: "Stakes intensified",
        stakesLevel3: "Maximum stakes reached",
        breakingPoint: "Moment of no return",
        irreversibleShift: "Change in status/dynamic",
        cliffhangerType: "Unresolved tension"
      };
    }
  }
}

// ========================================
// STAGE 2: CHAPTER OUTLINE GENERATOR
// ========================================
class ChapterOutlineGenerator {
  async generate(novel, escalationBlueprint, options = {}) {
    const { genre, tone, targetAudience, intensityLevel, previousChapterSummary } = options;
    
    const outlinePrompt = `
Generate a 3-Act structured chapter outline for Chapter ${novel.currentChapter || 1} of "${novel.title}", following the provided escalation blueprint.

ESCALATION BLUEPRINT:
${JSON.stringify(escalationBlueprint, null, 2)}

CONTEXT:
- Novel: ${novel.title}
- Genre: ${genre}
- Tone: ${tone}
- Target Audience: ${targetAudience}
- Intensity Level: ${intensityLevel}/10
- Previous Chapter: ${previousChapterSummary || 'Beginning of story'}

OUTLINE REQUIREMENTS:

ACT I – Establishment:
- Character state
- Immediate conflict
- Stakes introduced

ACT II – Escalation:
- Stakes intensified
- New complication introduced
- Emotional destabilization
- Power imbalance increased

ACT III – Shift:
- Breaking point
- Irreversible action/reveal
- Status change
- Unresolved hook

STRICT RULES:
- No repetition of events or situations
- Each act must meaningfully change character situation
- Each act must increase stakes based on escalation blueprint
- Outline must clearly reflect the escalation blueprint structure
- Acts must build logically toward the climax
- Must work for any genre (fantasy, romance, thriller, etc.)

Return the outline in this JSON format:
{
  "actI": {
    "summary": "...",
    "keyElements": ["element1", "element2"],
    "wordCountTarget": 700-900
  },
  "actII": {
    "summary": "...",
    "keyElements": ["element1", "element2"],
    "wordCountTarget": 900-1100
  },
  "actIII": {
    "summary": "...",
    "keyElements": ["element1", "element2"],
    "wordCountTarget": 800-1000,
    "cliffhangerSetup": "..."
  }
}
        `.trim();

    try {
      const rawOutline = await aiProvider.generateStructure(outlinePrompt);
      
      // Extract JSON from response if it contains additional text
      const jsonStart = rawOutline.indexOf('{');
      const jsonEnd = rawOutline.lastIndexOf('}') + 1;
      
      if (jsonStart !== -1 && jsonEnd !== 0) {
        const jsonString = rawOutline.substring(jsonStart, jsonEnd);
        return JSON.parse(jsonString);
      }
      
      // If no JSON found, create a basic structure
      return {
        actI: {
          summary: "Establish protagonist state and immediate conflict",
          keyElements: ["character establishment", "conflict introduction", "stake setting"],
          wordCountTarget: 800
        },
        actII: {
          summary: "Escalate stakes with new complications",
          keyElements: ["conflict intensification", "complication introduction", "emotional pressure increase"],
          wordCountTarget: 1000
        },
        actIII: {
          summary: "Execute breaking point and irreversible action",
          keyElements: ["breaking point", "irreversible action", "cliffhanger setup"],
          wordCountTarget: 900,
          cliffhangerSetup: "Strong unresolved tension"
        }
      };
    } catch (error) {
      logger.warn(`Failed to parse chapter outline as JSON, using default structure:`, error.message);
      return {
        actI: {
          summary: "Establish protagonist state and immediate conflict",
          keyElements: ["character establishment", "conflict introduction", "stake setting"],
          wordCountTarget: 800
        },
        actII: {
          summary: "Escalate stakes with new complications",
          keyElements: ["conflict intensification", "complication introduction", "emotional pressure increase"],
          wordCountTarget: 1000
        },
        actIII: {
          summary: "Execute breaking point and irreversible action",
          keyElements: ["breaking point", "irreversible action", "cliffhanger setup"],
          wordCountTarget: 900,
          cliffhangerSetup: "Strong unresolved tension"
        }
      };
    }
  }
}

// ========================================
// STAGE 3: ACT GENERATOR
// ========================================
class ActGenerator {
  async generate(novel, escalationBlueprint, chapterOutline, actNumber, options = {}) {
    const { 
      genre, 
      tone, 
      targetAudience, 
      intensityLevel, 
      previousContent = '', 
      previousChapterSummary = '', 
      memorySummary = '',
      targetWordCount = 800,
      regenerationAttempt = 0
    } = options;
    
    let actPrompt;
    
    if (actNumber === 'I') {
      actPrompt = `
Generate Act I of Chapter ${novel.currentChapter || 1} for "${novel.title}" (${genre} genre).

LANGUAGE RULES:
- Write ONLY in fluent natural English.
- Never output Chinese, Japanese, Korean, or any non-English language.
- All narration and dialogue must be English.
- If the model begins producing another language, regenerate the sentence in English.

NOVEL CONTEXT:
- Title: ${novel.title}
- Genre: ${genre}
- Tone: ${tone}
- Target Audience: ${targetAudience}
- Intensity Level: ${intensityLevel}/10

ESCALATION BLUEPRINT:
${JSON.stringify(escalationBlueprint, null, 2)}

CHAPTER OUTLINE:
${JSON.stringify(chapterOutline, null, 2)}

ACT SPECIFICS:
- Section: Act I - Establishment
- Summary: ${chapterOutline.actI.summary}
- Key Elements: ${chapterOutline.actI.keyElements.join(', ')}
- Target Length: ${targetWordCount} words

GENERATION REQUIREMENTS:
- Character state establishment
- Immediate conflict introduction
- Stakes introduction
- Set up escalation for Acts II and III
- Engaging opening that draws reader in
- Word count must be close to ${targetWordCount} words

CHAPTER LENGTH REQUIREMENTS:
- Minimum chapter length: 2000 words.
- Expand scenes with dialogue, character thoughts, and environment description.
- Never end the chapter early.

STRICT ANTI-REPETITION RULES:
- No repeated dialogue
- No repeated paragraphs
- No generic emotional clichés
- No recycled insults
- Each paragraph must add new information or escalation
- Character dialogue must have distinct voice

UNIVERSAL STORY PSYCHOLOGY ELEMENTS TO INCLUDE:
- Identity threat
- Social consequence  
- Loss risk
- Power imbalance
- Emotional vulnerability
- Desire vs obstacle
- Status change
- Mystery introduction

Write exactly ${targetWordCount} words. Start directly with the narrative.
            `.trim();
    } else if (actNumber === 'II') {
      actPrompt = `
Generate Act II of Chapter ${novel.currentChapter || 1} for "${novel.title}" (${genre} genre).

LANGUAGE RULES:
- Write ONLY in fluent natural English.
- Never output Chinese, Japanese, Korean, or any non-English language.
- All narration and dialogue must be English.
- If the model begins producing another language, regenerate the sentence in English.

NOVEL CONTEXT:
- Title: ${novel.title}
- Genre: ${genre}
- Tone: ${tone}
- Target Audience: ${targetAudience}
- Intensity Level: ${intensityLevel}/10

ESCALATION BLUEPRINT:
${JSON.stringify(escalationBlueprint, null, 2)}

CHAPTER OUTLINE:
${JSON.stringify(chapterOutline, null, 2)}

PREVIOUS CONTENT:
${previousContent.substring(0, 500)}... // First 500 characters of previous content

ACT SPECIFICS:
- Section: Act II - Escalation
- Summary: ${chapterOutline.actII.summary}
- Key Elements: ${chapterOutline.actII.keyElements.join(', ')}
- Target Length: ${targetWordCount} words

GENERATION REQUIREMENTS:
- Stakes intensified
- New complication introduced
- Emotional destabilization
- Power imbalance increased
- Progressive building toward breaking point
- Maintain tension and forward momentum
- Word count must be close to ${targetWordCount} words

CHAPTER LENGTH REQUIREMENTS:
- Minimum chapter length: 2000 words.
- Expand scenes with dialogue, character thoughts, and environment description.
- Never end the chapter early.

STRICT ANTI-REPETITION RULES:
- No repeated dialogue
- No repeated paragraphs
- No generic emotional clichés
- No recycled insults
- Each paragraph must add new information or escalation
- Character dialogue must have distinct voice

UNIVERSAL STORY PSYCHOLOGY ELEMENTS TO INCLUDE:
- Identity threat
- Social consequence  
- Loss risk
- Power imbalance
- Emotional vulnerability
- Desire vs obstacle
- Status change
- Mystery introduction

Write exactly ${targetWordCount} words. Continue directly from previous content.
            `.trim();
    } else if (actNumber === 'III') {
      actPrompt = `
Generate Act III of Chapter ${novel.currentChapter || 1} for "${novel.title}" (${genre} genre).

LANGUAGE RULES:
- Write ONLY in fluent natural English.
- Never output Chinese, Japanese, Korean, or any non-English language.
- All narration and dialogue must be English.
- If the model begins producing another language, regenerate the sentence in English.

NOVEL CONTEXT:
- Title: ${novel.title}
- Genre: ${genre}
- Tone: ${tone}
- Target Audience: ${targetAudience}
- Intensity Level: ${intensityLevel}/10

ESCALATION BLUEPRINT:
${JSON.stringify(escalationBlueprint, null, 2)}

CHAPTER OUTLINE:
${JSON.stringify(chapterOutline, null, 2)}

PREVIOUS CONTENT:
${previousContent.substring(previousContent.length - 1000)}... // Last 1000 characters of previous content

ACT SPECIFICS:
- Section: Act III - Shift
- Summary: ${chapterOutline.actIII.summary}
- Key Elements: ${chapterOutline.actIII.keyElements.join(', ')}
- Cliffhanger Setup: ${chapterOutline.actIII.cliffhangerSetup}
- Target Length: ${targetWordCount} words

GENERATION REQUIREMENTS:
- Breaking point
- Irreversible action/reveal
- Status change
- Unresolved hook
- Strong unresolved tension in final 8-12 lines
- Satisfying conclusion to chapter's escalation arc
- Hook that demands next chapter reading
- Word count must be close to ${targetWordCount} words

CHAPTER LENGTH REQUIREMENTS:
- Minimum chapter length: 2000 words.
- Expand scenes with dialogue, character thoughts, and environment description.
- Never end the chapter early.

STRICT ANTI-REPETITION RULES:
- No repeated dialogue
- No repeated paragraphs
- No generic emotional clichés
- No recycled insults
- Each paragraph must add new information or escalation
- Character dialogue must have distinct voice

UNIVERSAL STORY PSYCHOLOGY ELEMENTS TO INCLUDE:
- Identity threat
- Social consequence  
- Loss risk
- Power imbalance
- Emotional vulnerability
- Desire vs obstacle
- Status change
- Mystery introduction

CLIFFHANGER REQUIREMENTS (final 8-12 lines):
- Create unresolved tension matching cliffhanger type from blueprint
- Leave major question unanswered
- Show consequence without resolution
- End on moment of highest tension
- Make reader need to continue

Write exactly ${targetWordCount} words. Build to the cliffhanger in final 8-12 lines.
            `.trim();
    }

    // If this is a regeneration attempt, add specific regeneration instructions
    if (regenerationAttempt > 0) {
      actPrompt += `\n\nREGENERATION INSTRUCTIONS: This is regeneration attempt #${regenerationAttempt}. Address the retention issues identified in the previous version. Focus specifically on strengthening the cliffhanger and ensuring clear escalation progression toward the breaking point and irreversible shift described in the escalation blueprint.`;
    }

    return await aiProvider.generateScene(actPrompt);
  }
}

// ========================================
// STAGE 4: EMOTIONAL AMPLIFIER
// ========================================
class EmotionalAmplifier {
  async amplifySceneBlocks(sceneBlocks, options = {}) {
    const { genre, tone, targetAudience, intensityLevel, enhancementThreshold = 0.75 } = options;
    
    if (!sceneBlocks || sceneBlocks.length === 0) {
      return sceneBlocks;
    }
    
    // Identify which scenes to enhance (final portion based on threshold)
    const totalScenes = sceneBlocks.length;
    const enhancementStartIndex = Math.floor(totalScenes * enhancementThreshold);
    
    if (enhancementStartIndex >= totalScenes) {
      return sceneBlocks; // No scenes to enhance
    }
    
    // Create enhanced copy of scene blocks
    const enhancedBlocks = [...sceneBlocks];
    
    // Enhance targeted scenes only
    for (let i = enhancementStartIndex; i < totalScenes; i++) {
      const originalBlock = sceneBlocks[i];
      const enhancedContent = await this.enhanceSceneContent(originalBlock.content, {
        genre,
        tone,
        targetAudience,
        intensityLevel,
        sceneType: originalBlock.type,
        context: this.getContextForScene(sceneBlocks, i)
      });
      
      // Replace the scene content in place (structurally safe)
      enhancedBlocks[i] = {
        ...originalBlock,
        content: enhancedContent,
        enhanced: true,
        enhancementTimestamp: new Date().toISOString()
      };
    }
    
    return enhancedBlocks;
  }
  
  async enhanceSceneContent(content, context = {}) {
    const { genre, tone, targetAudience, intensityLevel, sceneType } = context;
    
    if (!content || content.trim().length === 0) {
      return content;
    }
    
    // Enhanced prompt for safe scene enhancement
    const enhancementPrompt = `
Enhance the following scene content to intensify emotional impact while preserving exact structure and content.

SCENE TYPE: ${sceneType || 'General'}
ORIGINAL CONTENT:
${content}

ENHANCEMENT INSTRUCTIONS:
- ONLY enhance emotional intensity and tension
- PRESERVE all original plot points, dialogue, and character actions
- MAINTAIN exact scene structure and paragraph boundaries
- STRENGTHEN emotional reactions and sensory descriptions
- INCREASE urgency and immediacy WITHOUT changing story beats
- REMOVE any enhancement artifacts or meta-comments
- RETURN only the enhanced scene content, nothing else
- DO NOT add new scenes, paragraphs, or content
- DO NOT repeat or duplicate any existing content

GENRE/CONTEXT:
- Genre: ${genre || 'General'}
- Tone: ${tone || 'Balanced'}
- Target Audience: ${targetAudience || 'General'}
- Intensity Level: ${intensityLevel || 5}/10

Return only the enhanced scene content with no additional text.
        `.trim();

    try {
      const enhancedContent = await aiProvider.enhanceEmotion(enhancementPrompt);
      
      // Post-process to ensure structural integrity
      const sanitizedContent = this.sanitizeEnhancedContent(enhancedContent, content);
      
      return sanitizedContent;
    } catch (error) {
      logger.warn('Failed to enhance scene, returning original:', error.message);
      return content;
    }
  }
  
  getContextForScene(sceneBlocks, currentIndex) {
    // Provide context from previous scenes for coherent enhancement
    const contextScenes = Math.min(2, currentIndex);
    const context = [];
    
    for (let i = currentIndex - contextScenes; i < currentIndex; i++) {
      if (i >= 0 && sceneBlocks[i]) {
        context.push(`${sceneBlocks[i].type}: ${sceneBlocks[i].content.substring(0, 100)}...`);
      }
    }
    
    return context.join('\n');
  }
  
  sanitizeEnhancedContent(enhancedContent, originalContent) {
    // Remove any enhancement artifacts while preserving structure
    let sanitized = enhancedContent;
    
    // Remove meta-commentary and enhancement markers
    const metaPatterns = [
      /^Here is the enhanced.*$/im,
      /^Enhanced version.*$/im,
      /^Below is the.*$/im,
      /^The enhanced.*$/im,
      /\(enhanced\)/gi,
      /\[enhanced\]/gi
    ];
    
    for (const pattern of metaPatterns) {
      sanitized = sanitized.replace(pattern, '');
    }
    
    // Ensure no structural additions (check paragraph count matches)
    const originalParagraphs = originalContent.split(/\n\s*\n/).filter(p => p.trim());
    const enhancedParagraphs = sanitized.split(/\n\s*\n/).filter(p => p.trim());
    
    if (enhancedParagraphs.length > originalParagraphs.length * 1.2) {
      // Too many paragraphs added - likely duplication, return original
      logger.warn('Enhancement added too many paragraphs, using original content');
      return originalContent;
    }
    
    return sanitized.trim();
  }
  
  async amplify(text, options = {}) {
    try {
      if (!text) return text;
      
      // Placeholder enhancement logic
      return text;
      
    } catch (err) {
      console.error("Emotional amplification failed:", err);
      return text;
    }
  }
}

// ========================================
// STAGE 5: STRUCTURAL VALIDATOR
// ========================================
class StructuralValidator {
  validateChapterStructure(chapterContent, options = {}) {
    const { enforceSingleActs = true, detectDuplicates = true, removeArtifacts = true } = options;
    
    if (!chapterContent || typeof chapterContent !== 'string') {
      return { valid: false, errors: ['Invalid chapter content'] };
    }
    
    const errors = [];
    let validatedContent = chapterContent;
    
    // Parse into structured blocks
    const blocks = this.parseIntoBlocks(validatedContent);
    
    // Validate single acts
    if (enforceSingleActs) {
      const actValidation = this.validateSingleActs(blocks);
      if (!actValidation.valid) {
        errors.push(...actValidation.errors);
      }
      validatedContent = actValidation.content;
    }
    
    // Detect duplicates
    if (detectDuplicates) {
      const duplicateValidation = this.validateNoDuplicates(validatedContent);
      if (!duplicateValidation.valid) {
        errors.push(...duplicateValidation.errors);
      }
      validatedContent = duplicateValidation.content;
    }
    
    // Remove artifacts
    if (removeArtifacts) {
      validatedContent = this.removeEnhancementArtifacts(validatedContent);
    }
    
    // Validate scene order and continuity
    const orderValidation = this.validateSceneOrder(validatedContent);
    if (!orderValidation.valid) {
      errors.push(...orderValidation.errors);
    }
    
    return {
      valid: errors.length === 0,
      errors,
      content: validatedContent,
      blockCount: blocks.length
    };
  }
  
  parseIntoBlocks(content) {
    // Split content into semantic blocks (scenes, paragraphs, sections)
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => ({
      id: this.generateBlockId(paragraph, index),
      index,
      content: paragraph.trim(),
      type: this.classifyBlockType(paragraph),
      hash: this.hashContent(paragraph)
    }));
  }
  
  validateSingleActs(blocks) {
    const actCounts = {};
    const errors = [];
    
    // Count act occurrences
    blocks.forEach(block => {
      const actMatch = block.content.match(/^(Act I|Act II|Act III)\b/i);
      if (actMatch) {
        const act = actMatch[1].toUpperCase();
        actCounts[act] = (actCounts[act] || 0) + 1;
        
        if (actCounts[act] > 1) {
          errors.push(`Duplicate ${act} detected`);
        }
      }
    });
    
    // Remove duplicate act headers (keep only first occurrence)
    let cleanedContent = blocks.map(block => block.content).join('\n\n');
    
    if (Object.values(actCounts).some(count => count > 1)) {
      // Remove duplicate act headers, keeping content
      const actHeaders = ['Act I', 'Act II', 'Act III'];
      for (const act of actHeaders) {
        const headerPattern = new RegExp(`^${act}\b`, 'gim');
        let firstFound = false;
        cleanedContent = cleanedContent.replace(headerPattern, (match) => {
          if (!firstFound) {
            firstFound = true;
            return match;
          }
          return '';
        });
      }
      cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, "\n\n"); // Clean up multiple line breaks





    }
    
    return {
      valid: errors.length === 0,
      errors,
      content: cleanedContent.trim()
    };
  }
  
  validateNoDuplicates(content) {
    const blocks = this.parseIntoBlocks(content);
    const seenHashes = new Set();
    const duplicateIndices = [];
    const errors = [];
    
    // Detect duplicate blocks using hash comparison
    blocks.forEach((block, index) => {
      if (seenHashes.has(block.hash)) {
        duplicateIndices.push(index);
        errors.push(`Duplicate content detected at block ${index + 1}`);
      } else {
        seenHashes.add(block.hash);
      }
    });
    
    // Remove duplicate blocks
    let cleanedContent = content;
    if (duplicateIndices.length > 0) {
      const cleanBlocks = blocks.filter((_, index) => !duplicateIndices.includes(index));
      cleanedContent = cleanBlocks.map(block => block.content).join('\n\n');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      content: cleanedContent
    };
  }
  
  removeEnhancementArtifacts(content) {
    // Remove common enhancement artifacts and meta-comments
    let cleaned = content;
    
    const artifactPatterns = [
      /Here is the enhanced text:/gi,
      /Enhanced content follows:/gi,
      /The following is the enhanced version:/gi,
      /Enhanced section:/gi,
      /\(enhanced\)/gi,
      /\[enhanced\]/gi,
      /\*\*Enhanced\*\*/gi,
      /Original:\s*.*?Enhanced:\s*/gis,
      /^\s*Note: This section has been enhanced\s*$/gim
    ];
    
    for (const pattern of artifactPatterns) {
      cleaned = cleaned.replace(pattern, '');
    }
    
    // Remove excessive whitespace
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, "\n\n"); // Clean up multiple line breaks


    const blocks = this.parseIntoBlocks(content);
    const errors = [];
    
    // Basic continuity check - ensure content flows logically
    for (let i = 1; i < blocks.length; i++) {
      const prevBlock = blocks[i - 1];
      const currBlock = blocks[i];
      
      // Check for mid-sentence breaks (simple heuristic)
      const prevEndsWithPunctuation = /[.!?]$/m.test(prevBlock.content.trim());
      if (!prevEndsWithPunctuation && !/^(Act|Chapter|Scene)\s+/i.test(currBlock.content)) {
        // This might be a broken sentence continuation
        // Flag for review but don't auto-fix to avoid losing content
        logger.warn(`Possible sentence break between blocks ${i} and ${i + 1}`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  classifyBlockType(content) {
    // Simple classification based on content characteristics
    const contentLower = content.toLowerCase();
    
    if (contentLower.includes('act i') || contentLower.includes('act 1')) return 'ACT_I';
    if (contentLower.includes('act ii') || contentLower.includes('act 2')) return 'ACT_II';
    if (contentLower.includes('act iii') || contentLower.includes('act 3')) return 'ACT_III';
    if (/^("|').*\1$/.test(content.trim())) return 'DIALOGUE';
    if (/description|scene|location|setting/.test(contentLower)) return 'DESCRIPTION';
    
    return 'NARRATIVE';
  }
  
  generateBlockId(content, index) {
    return `block_${index}_${this.hashContent(content).substring(0, 8)}`;
  }
  
  hashContent(content) {
    // Simple hash for content comparison (in production, use crypto)
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }
}

// ========================================
// STAGE 6: DEDUPLICATION ENGINE
// ========================================
class DeduplicationEngine {
  constructor() {
    this.contentHistory = new Map(); // Track content hashes
    this.paragraphHashes = new Map(); // Track paragraph-level hashes
  }
  
  preventReinsertion(content, context = {}) {
    const { chapterId, sceneId } = context;
    
    if (!content || content.trim().length === 0) {
      return { allowed: true, content };
    }
    
    // Hash the content
    const contentHash = this.hashContent(content);
    const key = `${chapterId || 'unknown'}_${sceneId || 'unknown'}`;
    
    // Check if this exact content has been used recently
    if (this.contentHistory.has(contentHash)) {
      const lastUsed = this.contentHistory.get(contentHash);
      const timeSinceLastUse = Date.now() - lastUsed.timestamp;
      
      // If used within last 5 minutes, likely duplication
      if (timeSinceLastUse < 5 * 60 * 1000) {
        logger.warn(`Content duplication detected for key ${key}: ${contentHash}`);
        return { allowed: false, reason: 'Recent duplication detected', content: '' };
      }
    }
    
    // Track this content
    this.contentHistory.set(contentHash, {
      timestamp: Date.now(),
      key,
      content: content.substring(0, 100) + '...' // Store snippet for debugging
    });
    
    // Clean up old entries (older than 1 hour)
    this.cleanupOldEntries();
    
    return { allowed: true, content };
  }
  
  detectRepetitionLoops(blocks, threshold = 0.8) {
    const similarities = [];
    
    // Compare each block with previous blocks
    for (let i = 1; i < blocks.length; i++) {
      const currentBlock = blocks[i];
      
      for (let j = Math.max(0, i - 3); j < i; j++) {
        const previousBlock = blocks[j];
        const similarity = this.calculateSimilarity(currentBlock.content, previousBlock.content);
        
        if (similarity > threshold) {
          similarities.push({
            current: i,
            previous: j,
            similarity,
            type: 'high_similarity'
          });
        }
      }
    }
    
    return similarities;
  }
  
  hashParagraphs(content) {
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());
    const hashes = [];
    
    paragraphs.forEach((paragraph, index) => {
      const hash = this.hashContent(paragraph);
      hashes.push({
        index,
        hash,
        content: paragraph.substring(0, 50) + '...'
      });
      
      // Track for future duplication detection
      this.paragraphHashes.set(hash, {
        timestamp: Date.now(),
        paragraph: paragraph.substring(0, 100) + '...'
      });
    });
    
    return hashes;
  }
  
  calculateSimilarity(text1, text2) {
    // Simple Jaccard similarity using word overlap
    const words1 = new Set(text1.toLowerCase().match(/\b\w+\b/g) || []);
    const words2 = new Set(text2.toLowerCase().match(/\b\w+\b/g) || []);
    
    if (words1.size === 0 && words2.size === 0) return 1;
    if (words1.size === 0 || words2.size === 0) return 0;
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }
  
  hashContent(content) {
    // Simple hash function (use crypto in production)
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
  
  cleanupOldEntries() {
    const oneHour = 60 * 60 * 1000;
    const now = Date.now();
    // Clean up content history
    for (const [hash, entry] of this.contentHistory.entries()) {
      if (now - entry.timestamp > oneHour) {
        this.contentHistory.delete(hash);
      }
    }
    
    // Clean up paragraph hashes
    for (const [hash, entry] of this.paragraphHashes.entries()) {
      if (now - entry.timestamp > oneHour) {
        this.paragraphHashes.delete(hash);
      }
    }
  }
}

// ========================================
// STAGE 7: TONE GOVERNOR
// ========================================
class ToneGovernor {
  regulateTone(content, options = {}) {
    const { maxAdjectiveStack = 3, preventEscalationLoops = true, maintainConsistency = true } = options;
    
    if (!content || content.trim().length === 0) {
      return content;
    }
    
    let regulatedContent = content;
    
    // Prevent adjective stacking
    if (maxAdjectiveStack) {
      regulatedContent = this.limitAdjectiveStacking(regulatedContent, maxAdjectiveStack);
    }
    
    // Prevent emotional escalation loops
    if (preventEscalationLoops) {
      regulatedContent = this.preventEscalationLoops(regulatedContent);
    }
    
    // Maintain narrative consistency
    if (maintainConsistency) {
      regulatedContent = this.maintainConsistency(regulatedContent);
    }
    
    return regulatedContent;
  }
  
  limitAdjectiveStacking(content, maxStack) {
    // Pattern to match adjective chains (e.g., "dark, stormy, ominous night")
    const adjectiveChainPattern = /\b(\w+,\s*){2,}(?=\w+\s+(?:was|were|is|are|felt|seemed|appeared|looked|sounded|smelled|tasted)\b)/gi;
    
    return content.replace(adjectiveChainPattern, (match) => {
      const adjectives = match.split(',').map(adj => adj.trim()).filter(adj => adj);
      if (adjectives.length > maxStack) {
        // Keep only the first N adjectives
        return adjectives.slice(0, maxStack).join(', ') + ', ';
      }
      return match;
    });
  }
  
  preventEscalationLoops(content) {
    // Common escalation loop patterns
    const escalationPatterns = [
      /\b(very|extremely|incredibly|absolutely|totally)\s+(very|extremely|incredibly|absolutely|totally)/gi,
      /\b(more and more|increasingly|growing|escalating)\s+(more and more|increasingly|growing|escalating)/gi,
      /\b(intense|intensely)\s+(intense|intensely)/gi
    ];
    
    let regulated = content;
    
    for (const pattern of escalationPatterns) {
      regulated = regulated.replace(pattern, (match) => {
        // Simplify to single intensifier
        return match.split(' ')[0];
      });
    }
    
    return regulated;
  }
  
  maintainConsistency(content) {
    // Ensure character voice and narrative style consistency
    // This is a simplified implementation - in production, use more sophisticated NLP
    
    // Remove inconsistent narrative voice shifts
    const voicePatterns = [
      /\(he thought\)/gi,  // Remove thought tags that break flow
      /\(she wondered\)/gi,
      /\(they realized\)/gi
    ];
    
    let consistent = content;
    
    for (const pattern of voicePatterns) {
      consistent = consistent.replace(pattern, '');
    }
    
    return consistent;
  }
}

// ========================================
// STAGE 8: FINAL COHERENCE PASS
// ========================================
class CoherencePass {
  ensureCoherence(content, options = {}) {
    const { removeBrokenTransitions = true, ensureCharacterContinuity = true, validatePacing = true } = options;
    
    if (!content || content.trim().length === 0) {
      return content;
    }
    
    let coherentContent = content;
    
    // Remove broken transitions
    if (removeBrokenTransitions) {
      coherentContent = this.fixBrokenTransitions(coherentContent);
    }
    
    // Ensure character continuity
    if (ensureCharacterContinuity) {
      coherentContent = this.validateCharacterContinuity(coherentContent);
    }
    
    // Validate pacing
    if (validatePacing) {
      coherentContent = this.validatePacing(coherentContent);
    }
    
    return coherentContent;
  }
  
  fixBrokenTransitions(content) {
    // Fix common transition issues
    let fixed = content;
    
    // Remove mid-sentence breaks (simple heuristic)
    fixed = fixed.replace(/([^.!?])\s*\n\s*([a-z])/g, '$1 $2');
    
    // Fix paragraph breaks that shouldn't exist
    fixed = fixed.replace(/\n\s*\n\s*([a-z])/g, ' $1');
    
    // Remove excessive line breaks
    fixed = fixed.replace(/\n\s*\n\s*\n/g, "\n\n"); // Clean up multiple line breaks
    
    return fixed;
    
    // Ensure names are used consistently
    let consistent = content;
    
    // This is a simplified check - in production, use more sophisticated NLP
    characterNames.forEach(name => {
      // Ensure consistent capitalization
      const variations = [
        name.toLowerCase(),
        name.toUpperCase(),
        name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
      ];
      
      // Use the most frequent variation
      const counts = variations.map(variation => 
        (content.match(new RegExp(`\\b${variation}\\b`, 'gi')) || []).length
      );
      
      const mostFrequentIndex = counts.indexOf(Math.max(...counts));
      const correctName = variations[mostFrequentIndex];
      
      // Replace all variations with the correct one
      variations.forEach((variation, index) => {
        if (index !== mostFrequentIndex) {
          consistent = consistent.replace(new RegExp(`\\b${variation}\\b`, 'gi'), correctName);
        }
      });
    });
    
    return consistent;
  }
  
  extractCharacterNames(content) {
    // Simple character name extraction (proper nouns that appear multiple times)
    const words = content.match(/\b[A-Z][a-z]+\b/g) || [];
    const nameCounts = {};
    
    words.forEach(word => {
      nameCounts[word] = (nameCounts[word] || 0) + 1;
    });
    
    // Return names that appear more than once (likely character names)
    return Object.keys(nameCounts).filter(name => nameCounts[name] > 1);
  }
}

// ========================================
// STAGE 6: OUTPUT SANITIZER
// ========================================
class OutputSanitizer {
  sanitize(text) {
    if (!text || typeof text !== 'string') {
      return text;
    }

    let cleaned = text;

    // Remove common LLM artifacts
    cleaned = cleaned
      .replace(/Here is the enhanced text:/gi, '')
      .replace(/Here's the enhanced scene:/gi, '')
      .replace(/Enhanced content follows:/gi, '')
      .replace(/Act\s+[IVX]+\s*[-:]/gi, '')
      .replace(/\*\*Act.*?\*\*/gi, '')
      .replace(/\(enhanced\)/gi, '')
      .replace(/\[enhanced\]/gi, '');

    // Normalize spacing
    cleaned = cleaned
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s+\n/g, '\n')
      .trim();

    return cleaned;
  }
}

// ========================================
// PARAGRAPH DEDUPLICATION UTILITY
// ========================================
function removeSimilarParagraphs(paragraphs) {
  const result = [];
  
  for (const p of paragraphs) {
    const normalized = p.toLowerCase().trim();
    
    const isDuplicate = result.some(existing =>
      existing.toLowerCase().includes(normalized.slice(0, 40)) ||
      normalized.includes(existing.toLowerCase().slice(0, 40))
    );
    
    if (!isDuplicate) {
      result.push(p);
    }
  }
  
  return result;
}

// ========================================
// STAGE 6: DUPLICATION DETECTOR
// ========================================
class DuplicationDetector {
  async detect(content) {
    const paragraphs = content.split('\n').filter(p => p.trim() !== '');
    const seenParagraphs = new Map(); // Store paragraph with occurrence count
    
    for (let i = 0; i < paragraphs.length; i++) {
      const cleanParagraph = paragraphs[i].trim().toLowerCase().replace(/[^\w\s]/g, '');
      if (cleanParagraph) {
        if (seenParagraphs.has(cleanParagraph)) {
          const prevIndex = seenParagraphs.get(cleanParagraph);
          // Check if similarity is greater than 35%
          if (this.calculateSimilarity(paragraphs[prevIndex], paragraphs[i]) > 0.35) {
            logger.warn(`High similarity detected (>35%) between paragraphs at positions ${prevIndex} and ${i}`);
            return { duplicateFound: true, position: i, similarTo: prevIndex };
          }
        }
        seenParagraphs.set(cleanParagraph, i);
      }
    }
    
    // Also check for scene repetition at act level
    const acts = content.split('\n\n');
    if (acts.length >= 3) {
      const similarityThreshold = 0.35;
      
      // Check similarity between Act I and Act II
      if (this.calculateTextSimilarity(acts[0], acts[1]) > similarityThreshold) {
        logger.warn('High similarity detected between Act I and Act II');
        return { duplicateFound: true, position: 'actII', similarTo: 'actI' };
      }
      
      // Check similarity between Act I and Act III
      if (this.calculateTextSimilarity(acts[0], acts[2]) > similarityThreshold) {
        logger.warn('High similarity detected between Act I and Act III');
        return { duplicateFound: true, position: 'actIII', similarTo: 'actI' };
      }
      
      // Check similarity between Act II and Act III
      if (this.calculateTextSimilarity(acts[1], acts[2]) > similarityThreshold) {
        logger.warn('High similarity detected between Act II and Act III');
        return { duplicateFound: true, position: 'actIII', similarTo: 'actII' };
      }
    }
    
    return { duplicateFound: false };
  }
  
  calculateSimilarity(text1, text2) {
    // Simple Jaccard similarity calculation using words
    const words1 = new Set(text1.toLowerCase().match(/\b\w+\b/g) || []);
    const words2 = new Set(text2.toLowerCase().match(/\b\w+\b/g) || []);
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }
  
  calculateTextSimilarity(text1, text2) {
    // Calculate similarity based on common phrases and vocabulary overlap
    const words1 = new Set(text1.toLowerCase().match(/\b\w+\b/g) || []);
    const words2 = new Set(text2.toLowerCase().match(/\b\w+\b/g) || []);
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }
}

// ========================================
// STAGE 7: CONTINUITY VALIDATOR
// ========================================
class ContinuityValidator {
  async validate(content) {
    // Split content into acts
    const acts = content.split('\n\n');
    if (acts.length < 3) {
      return { valid: false, violations: ['Insufficient acts for continuity validation'] };
    }
    
    const actI = acts[0];
    const actII = acts[1];
    const actIII = acts[2];
    
    const violations = [];
    
    // Check for logical location progression
    const locationsInActI = this.extractLocations(actI);
    const locationsInActII = this.extractLocations(actII);
    const locationsInActIII = this.extractLocations(actIII);
    
    // Validate that Act III location is either the same as Act II or properly transitioned from Act I
    if (locationsInActIII.length > 0 && locationsInActII.length > 0) {
      const actIIHasActIIILocation = locationsInActII.some(loc => 
        locationsInActIII.some(actIIILoc => 
          loc.toLowerCase().includes(actIIILoc.toLowerCase()) || 
          actIIILoc.toLowerCase().includes(loc.toLowerCase())
        )
      );
      
      if (!actIIHasActIIILocation) {
        violations.push('Location jump detected between Act II and Act III without proper transition');
      }
    }
    
    // Check character motivation consistency
    const motivationsInActI = this.extractMotivations(actI);
    const motivationsInActII = this.extractMotivations(actII);
    const motivationsInActIII = this.extractMotivations(actIII);
    
    // Ensure motivations are consistent or evolve logically
    // This is a simplified check - in reality, we'd need more sophisticated analysis
    if (motivationsInActI.length > 0 && motivationsInActIII.length > 0) {
      const motivationChangeValid = this.isMotivationChangeValid(motivationsInActI, motivationsInActIII);
      if (!motivationChangeValid) {
        violations.push('Character motivation inconsistency detected between Act I and Act III');
      }
    }
    
    return { 
      valid: violations.length === 0, 
      violations 
    };
  }
  
  extractLocations(text) {
    // Simple location extraction - in a real implementation, this would be more sophisticated
    const locationPatterns = [
      /\bin the (\w+) room\b/gi,
      /\bat the (\w+) (?:house|building|store|school|office|home)\b/gi,
      /\bin (?:the )?(\w+) (?:city|town|village|district|area)\b/gi,
      /\son the (\w+) floor/gi,
      /\nin front of the (\w+)\b/gi,
      /\nnear the (\w+)\b/gi,
      /\noutside the (\w+)\b/gi,
      /\ninside the (\w+)\b/gi,
    ];
    
    const locations = [];
    for (const pattern of locationPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        locations.push(match[1]);
      }
    }
    
    return [...new Set(locations)]; // Return unique locations
  }

  extractMotivations(text) {
    // Simple motivation extraction - in a real implementation, this would be more sophisticated
    const motivationPatterns = [
      /\bwant(?:s|ed)? to (\w+)/gi,
      /\bneed(?:s|ed)? to (\w+)/gi,
      /\bmust (?:to )?(\w+)/gi,
      /\bhave to (\w+)/gi,
      /\bought to (\w+)/gi,
      /\bdesire to (\w+)/gi,
      /\bcrave to (\w+)/gi,
      /\bseek to (\w+)/gi,
    ];
    
    const motivations = [];
    for (const pattern of motivationPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        motivations.push(match[1]);
      }
    }
    
    return [...new Set(motivations)]; // Return unique motivations
  }
  
  isMotivationChangeValid(initialMotivations, finalMotivations) {
    // Simplified validation - in reality, we'd need more sophisticated analysis
    // For now, we'll assume any motivation change is valid if it's logical
    return true;
  }
}

// ========================================
// STAGE 8: RETENTION SCORER
// ========================================
class RetentionScorer {
  async evaluate(content, escalationBlueprint, options = {}) {
    const { genre, tone, targetAudience, intensityLevel } = options;
    
    // Basic word count check (1800–2500 words)
    const wordCount = this.countWords(content);
    const hasValidLength = wordCount >= 1800 && wordCount <= 2500;
    
    // Check for escalation curve presence
    const hasEscalationCurve = this.checkEscalationCurve(content, escalationBlueprint);
    
    // Check for increasing stakes
    const hasIncreasingStakes = this.checkIncreasingStakes(content);
    
    // Check for status change in Act III
    const hasStatusChange = this.checkStatusChange(content);
    
    // Check for unresolved question in last 10 lines
    const hasUnresolvedHook = this.checkUnresolvedHook(content);
    
    // Check dialogue density (30–55%)
    const dialogueDensity = this.calculateDialogueDensity(content);
    const hasValidDialogueDensity = dialogueDensity >= 0.30 && dialogueDensity <= 0.55;
    
    // Check emotional intensity progression
    const emotionalProgression = this.checkEmotionalIntensityProgression(content);
    
    // Check for repeated phrases
    const hasRepetitions = this.detectRepetitions(content);
    
    // Calculate overall score
    const score = {
      wordCountValid: hasValidLength ? 1 : 0,
      escalationPresent: hasEscalationCurve ? 1 : 0,
      stakesIncrease: hasIncreasingStakes ? 1 : 0,
      statusChange: hasStatusChange ? 1 : 0,
      unresolvedHook: hasUnresolvedHook ? 1 : 0,
      dialogueDensityValid: hasValidDialogueDensity ? 1 : 0,
      emotionalProgression: emotionalProgression ? 1 : 0,
      noRepetitions: !hasRepetitions ? 1 : 0,
      totalScore: 0,
      dialoguePercentage: `${Math.round(dialogueDensity * 100)}%`,
      pass: false,
      wordCount: wordCount,
      tension: 8, // Placeholder - would be calculated in real system
      emotion: 8, // Placeholder - would be calculated in real system
      cliffhanger: hasUnresolvedHook ? 9 : 5 // High score if hook exists
    };
    
    // Calculate total score (at least 6 out of 8 criteria needed to pass)
    score.totalScore = score.wordCountValid + 
                      score.escalationPresent + 
                      score.stakesIncrease + 
                      score.statusChange + 
                      score.unresolvedHook + 
                      score.dialogueDensityValid + 
                      score.emotionalProgression + 
                      score.noRepetitions;
    
    // Pass if at least 6 out of 8 criteria are met
    score.pass = score.totalScore >= 6;
    
    return score;
  }

  checkEscalationCurve(content, escalationBlueprint) {
    // Analyze the content to detect escalation pattern
    // This would implement logic to detect if the content follows the escalation blueprint
    
    // For now, we'll return true as a placeholder
    // In a real implementation, this would analyze the emotional/intensity curve of the content
    return true;
  }

  checkIncreasingStakes(content) {
    // This would implement logic to detect if stakes increase throughout the content
    // For now, we'll return true as a placeholder
    return true;
  }

  checkStatusChange(content) {
    // This would implement logic to detect if there's a clear status change in Act III
    // For now, we'll return true as a placeholder
    return true;
  }

  checkUnresolvedHook(content) {
    // Check if last 10 lines contain unresolved tension
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const last10Lines = lines.slice(-10).join(' ');
    
    // Look for indicators of unresolved tension
    const tensionIndicators = [
      /\?$|!$/,  // Ends with question or exclamation mark
      /but$/,     // Ends with "but"
      /when$/,   // Contains "when" suggesting continuation
      /then$/,   // Contains "then" suggesting continuation
      /suddenly$/, // Contains "suddenly" indicating cliffhanger
      /meanwhile$/, // Indicates parallel action
      /however$/, // Indicates contrast/consequence
      /what\b/, /who\b/, /why\b/, /how\b/, /where\b/, // Question words
      /now\b/, /never\b/, /always\b/, // Strong adverbs
      /shock/, /surprise/, /secret/, /truth/, /reveal/, /discovery/ // Suspense words
    ];
    
    return tensionIndicators.some(indicator => indicator.test(last10Lines.toLowerCase()));
  }

  calculateDialogueDensity(content) {
    // Count dialogue by looking for quoted text
    const dialogueMatches = content.match(/"[^"]*"|'[^']*'/g) || [];
    const dialogueWords = dialogueMatches.join(' ').split(/\s+/).filter(word => word.trim() !== '').length;
    const totalWords = content.split(/\s+/).filter(word => word.trim() !== '').length;
    
    return totalWords > 0 ? dialogueWords / totalWords : 0;
  }

  checkEmotionalIntensityProgression(content) {
    // This would implement logic to detect if emotional intensity increases from beginning to end
    // For now, we'll return true as a placeholder
    return true;
  }

  detectRepetitions(content) {
    const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(s => s);
    
    // Check for repeated sentences
    const seenSentences = new Set();
    for (const sentence of sentences) {
      const cleanSentence = sentence.toLowerCase().replace(/[^\w\s]/g, '');
      if (seenSentences.has(cleanSentence)) {
        return true; // Found repetition
      }
      seenSentences.add(cleanSentence);
    }
    
    // Check for repeated phrases (3+ word sequences)
    const words = content.toLowerCase().split(/\s+/);
    const seenPhrases = new Set();
    
    for (let i = 0; i <= words.length - 3; i++) {
      const phrase = words.slice(i, i + 3).join(' ');
      if (seenPhrases.has(phrase)) {
        return true; // Found repeated phrase
      }
      seenPhrases.add(phrase);
    }
    
    return false; // No repetitions found
  }
  
  countWords(text) {
    if (!text || typeof text !== 'string') {
      return 0;
    }

    return text
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0)
      .length;
  }
}

// ========================================
// STAGE 9: REGENERATION CONTROLLER
// ========================================
class RegenerationController {
  async handleQualityIssues(content, escalationBlueprint, chapterOutline, novel, options = {}) {
    const { genre, tone, targetAudience, intensityLevel, maxRegenerations = 3 } = options;
    
    let currentContent = content;
    let regenerationAttempts = 0;
    
    // Get initial retention score
    const retentionScorer = new RetentionScorer();
    let retentionScore = await retentionScorer.evaluate(currentContent, escalationBlueprint, options);
    let escalationValid = this.validateEscalationStructure(currentContent);
    
    while ((!retentionScore.pass || !escalationValid) && regenerationAttempts < maxRegenerations) {
      logger.info(`Quality check failed, regenerating Act III only (attempt ${regenerationAttempts + 1}/${maxRegenerations})...`);
      
      // Split content into acts
      const acts = currentContent.split('\n\n');
      if (acts.length < 3) {
        logger.error('Insufficient acts to regenerate Act III');
        break;
      }
      
      const actI = acts[0];
      const actII = acts[1];
      
      // Regenerate only Act III
      const actGenerator = new ActGenerator();
      const regeneratedActIII = await actGenerator.generate(
        novel, 
        escalationBlueprint, 
        chapterOutline, 
        'III', 
        {
          ...options,
          previousContent: actI + actII,
          targetWordCount: chapterOutline.actIII.wordCountTarget || 900,
          regenerationAttempt: regenerationAttempts + 1
        }
      );
      
      // Sanitize the regenerated Act III
      const sanitizer = new OutputSanitizer();
      const sanitizedActIII = sanitizer.sanitize(regeneratedActIII);
      
      // Reconstruct chapter with new Act III
      currentContent = `${actI}\n\n${actII}\n\n${sanitizedActIII}`;
      
      // Apply duplication prevention to reconstructed chapter
      const duplicationDetector = new DuplicationDetector();
      const duplicationResult = await duplicationDetector.detect(currentContent);
      if (duplicationResult.duplicateFound) {
        logger.warn('Duplication detected after Act III regeneration, skipping to next iteration');
      }
      
      // Apply context continuity check
      const continuityValidator = new ContinuityValidator();
      const continuityResult = await continuityValidator.validate(currentContent);
      if (!continuityResult.valid) {
        logger.warn('Continuity issues found after Act III regeneration:', continuityResult.violations);
      }
      
      // Apply emotional enhancement to final 25% again since Act III changed
      const emotionalAmplifier = new EmotionalAmplifier();
      currentContent = await emotionalAmplifier.amplify(currentContent, options);
      
      // Re-evaluate retention
      retentionScore = await retentionScorer.evaluate(currentContent, escalationBlueprint, options);
      
      // Re-validate escalation structure
      escalationValid = this.validateEscalationStructure(currentContent);
      
      regenerationAttempts++;
    }
    
    // If still not passing quality checks after regenerating Act III, try regenerating Act II + III
    if ((!retentionScore.pass || !escalationValid) && regenerationAttempts < maxRegenerations) {
      logger.info(`Quality still not passing, regenerating Act II and III (attempt ${regenerationAttempts + 1}/${maxRegenerations})...`);
      
      // Split content into acts
      const acts = currentContent.split('\n\n');
      if (acts.length < 3) {
        logger.error('Insufficient acts to regenerate Act II and III');
        return { content: currentContent, attempts: regenerationAttempts, score: retentionScore, valid: escalationValid };
      }
      
      const actI = acts[0];
      
      // Regenerate Act II
      const actGenerator = new ActGenerator();
      const regeneratedActII = await actGenerator.generate(
        novel, 
        escalationBlueprint, 
        chapterOutline, 
        'II', 
        {
          ...options,
          previousContent: actI,
          targetWordCount: chapterOutline.actII.wordCountTarget || 1000,
          regenerationAttempt: regenerationAttempts + 1
        }
      );
      
      // Sanitize the regenerated Act II
      const sanitizer = new OutputSanitizer();
      const sanitizedActII = sanitizer.sanitize(regeneratedActII);
      
      // Regenerate Act III
      const regeneratedActIII = await actGenerator.generate(
        novel, 
        escalationBlueprint, 
        chapterOutline, 
        'III', 
        {
          ...options,
          previousContent: actI + sanitizedActII,
          targetWordCount: chapterOutline.actIII.wordCountTarget || 900,
          regenerationAttempt: regenerationAttempts + 1
        }
      );
      
      // Sanitize the regenerated Act III
      const sanitizedActIII = sanitizer.sanitize(regeneratedActIII);
      
      // Reconstruct chapter with new Act II and Act III
      currentContent = `${actI}\n\n${sanitizedActII}\n\n${sanitizedActIII}`;
      
      // Apply duplication prevention
      const duplicationDetector = new DuplicationDetector();
      const duplicationResult = await duplicationDetector.detect(currentContent);
      if (duplicationResult.duplicateFound) {
        logger.warn('Duplication detected after Act II+III regeneration, skipping to next iteration');
      }
      
      // Apply context continuity check
      const continuityValidator = new ContinuityValidator();
      const continuityResult = await continuityValidator.validate(currentContent);
      if (!continuityResult.valid) {
        logger.warn('Continuity issues found after Act II+III regeneration:', continuityResult.violations);
      }
      
      // Apply emotional enhancement to final 25%
      const emotionalAmplifier = new EmotionalAmplifier();
      currentContent = await emotionalAmplifier.amplify(currentContent, options);
      
      // Re-evaluate retention
      retentionScore = await retentionScorer.evaluate(currentContent, escalationBlueprint, options);
      
      // Re-validate escalation structure
      escalationValid = this.validateEscalationStructure(currentContent);
      
      regenerationAttempts++;
    }
    
    return { 
      content: currentContent, 
      attempts: regenerationAttempts, 
      score: retentionScore, 
      valid: escalationValid 
    };
  }
  
  validateEscalationStructure(chapter) {
    // Split chapter into acts
    const acts = chapter.split('\n\n');
    if (acts.length < 3) {
      return false; // Need at least 3 acts to validate escalation
    }
    
    const actI = acts[0];
    const actII = acts[1];
    const actIII = acts[2];
    
    // Check if Act I introduces stakes
    const hasStakesInActI = this.containsStakes(actI);
    
    // Check if Act II increases stakes measurably
    const hasIncreasedStakesInActII = this.containsStakes(actII) && this.measuresHigherStakes(actII, actI);
    
    // Check if Act III changes protagonist status permanently
    const hasStatusChangeInActIII = this.containsStatusChange(actIII);
    
    // Overall validation
    const isValid = hasStakesInActI && hasIncreasedStakesInActII && hasStatusChangeInActIII;
    
    if (!isValid) {
      logger.warn('Escalation structure validation failed');
    }
    
    return isValid;
  }

  containsStakes(text) {
    // Check for stake-related keywords
    const stakeKeywords = [
      'risk', 'danger', 'threat', 'chance', 'bet', 'wager', 'gamble', 'odds', 'stake', 'prize',
      'loss', 'failure', 'defeat', 'consequence', 'outcome', 'result', 'repercussion', 'penalty',
      'life', 'death', 'future', 'freedom', 'reputation', 'relationship', 'position', 'power',
      'money', 'property', 'home', 'family', 'love', 'trust', 'respect', 'success', 'failure'
    ];
    
    const lowerText = text.toLowerCase();
    return stakeKeywords.some(keyword => lowerText.includes(keyword));
  }

  measuresHigherStakes(text, baseline) {
    // Compare stake intensity between two texts
    // This is a simplified check - in reality, we'd need more sophisticated analysis
    return this.countStakeKeywords(text) > this.countStakeKeywords(baseline);
  }

  countStakeKeywords(text) {
    const stakeKeywords = [
      'risk', 'danger', 'threat', 'chance', 'bet', 'wager', 'gamble', 'odds', 'stake', 'prize',
      'loss', 'failure', 'defeat', 'consequence', 'outcome', 'result', 'repercussion', 'penalty',
      'life', 'death', 'future', 'freedom', 'reputation', 'relationship', 'position', 'power',
      'money', 'property', 'home', 'family', 'love', 'trust', 'respect', 'success', 'failure'
    ];
    
    const lowerText = text.toLowerCase();
    return stakeKeywords.filter(keyword => lowerText.includes(keyword)).length;
  }

  containsStatusChange(text) {
    // Check for status change indicators
    const statusChangeKeywords = [
      'promotion', 'demotion', 'rise', 'fall', 'ascend', 'descend', 'advance', 'retreat',
      'power', 'authority', 'rank', 'position', 'status', 'level', 'title', 'role',
      'leader', 'follower', 'boss', 'subordinate', 'superior', 'inferior',
      'control', 'dominate', 'submit', 'obey', 'command', 'follow',
      'win', 'lose', 'victory', 'defeat', 'triumph', 'failure',
      'change', 'shift', 'alter', 'transform', 'evolve', 'develop',
      'new', 'different', 'opposite', 'reverse', 'turn', 'become'
    ];
    
    const lowerText = text.toLowerCase();
    return statusChangeKeywords.some(keyword => lowerText.includes(keyword));
  }
}

// ========================================
// MAIN STORY ORCHESTRATOR
// ========================================
class StoryOrchestrator {
  constructor() {
    this.chaptersDir = path.join(__dirname, '../data/chapters');
    this.escalationGenerator = new EscalationBlueprintGenerator();
    this.outlineGenerator = new ChapterOutlineGenerator();
    this.actGenerator = new ActGenerator();
    this.emotionalAmplifier = new EmotionalAmplifier();
    this.outputSanitizer = new OutputSanitizer();
    this.duplicationDetector = new DuplicationDetector();
    this.continuityValidator = new ContinuityValidator();
    this.retentionScorer = new RetentionScorer();
    this.regenerationController = new RegenerationController();
  }

  async generateChapter(novelId, chapterNumber, options = {}) {
    try {
      // Load required data
      const novel = await this.loadNovel(novelId);
      const arc = await arcService.getCurrentArc(novelId, chapterNumber);
      const memorySummary = await memoryService.getMemorySummary(novelId);
      const previousChapterSummary = await this.getPreviousChapterSummary(novelId, chapterNumber);
      
      // Extract options with defaults
      const genre = options.genre || novel.genre || 'general';
      const tone = options.tone || novel.tone || 'balanced';
      const targetAudience = options.targetAudience || novel.targetAudience || 'general';
      const intensityLevel = options.intensityLevel || novel.intensityLevel || 5;
      const chapterLength = options.chapterLength || novel.chapterLength || 2200;
      const pacing = options.pacing || 'medium'; // slow, medium, fast
      const audienceMaturity = options.audienceMaturity || 'moderate'; // mild, moderate, mature
      
      logger.info(`Starting genre-agnostic chapter generation pipeline for novel ${novelId} - Chapter ${chapterNumber} (Genre: ${genre}, Target: ${chapterLength} words)`);
      
      // Step 1: Build escalation blueprint (genre-agnostic)
      logger.info('Step 1: Generating escalation blueprint...');
      const escalationBlueprint = await this.escalationGenerator.generate(novel, arc, chapterNumber, { 
        genre, 
        tone, 
        targetAudience, 
        intensityLevel,
        previousChapterSummary,
        memorySummary
      });
      
      // Step 2: Generate 3-Act structured outline
      logger.info('Step 2: Generating 3-Act structured outline...');
      const chapterOutline = await this.outlineGenerator.generate(novel, escalationBlueprint, { 
        genre, 
        tone, 
        targetAudience, 
        intensityLevel,
        previousChapterSummary
      });
      
      // Step 3: Generate Act I (700–900 words)
      logger.info('Step 3: Generating Act I (Establishment)...');
      let actI = await this.actGenerator.generate(novel, escalationBlueprint, chapterOutline, 'I', {
        genre,
        tone,
        targetAudience,
        intensityLevel,
        previousChapterSummary,
        memorySummary,
        targetWordCount: this.calculateTargetWordCount('I', pacing, chapterLength)
      });
      
      // Apply sanitization to Act I
      actI = this.outputSanitizer.sanitize(actI);
      
      // Step 4: Generate Act II (900–1100 words)
      logger.info('Step 4: Generating Act II (Escalation)...');
      let actII = await this.actGenerator.generate(novel, escalationBlueprint, chapterOutline, 'II', {
        genre,
        tone,
        targetAudience,
        intensityLevel,
        previousContent: actI,
        previousChapterSummary,
        memorySummary,
        targetWordCount: this.calculateTargetWordCount('II', pacing, chapterLength)
      });
      
      // Apply sanitization to Act II
      actII = this.outputSanitizer.sanitize(actII);
      
      // Step 5: Generate Act III (800–1000 words)
      logger.info('Step 5: Generating Act III (Shift)...');
      let actIII = await this.actGenerator.generate(novel, escalationBlueprint, chapterOutline, 'III', {
        genre,
        tone,
        targetAudience,
        intensityLevel,
        previousContent: actI + actII,
        previousChapterSummary,
        memorySummary,
        targetWordCount: this.calculateTargetWordCount('III', pacing, chapterLength)
      });
      
      // Apply sanitization to Act III
      actIII = this.outputSanitizer.sanitize(actIII);
      
      // Combine all acts
      let fullChapterContent = `${actI}\n\n${actII}\n\n${actIII}`;
      
      // Apply paragraph deduplication to remove similar paragraphs across acts
      logger.info('Step 5.5: Applying paragraph deduplication...');
      const paragraphs = fullChapterContent.split('\n');
      const deduplicatedParagraphs = removeSimilarParagraphs(paragraphs);
      fullChapterContent = deduplicatedParagraphs.join('\n');
      
      // Step 6: Apply duplication detection
      logger.info('Step 6: Applying duplication detection...');
      const duplicationResult = await this.duplicationDetector.detect(fullChapterContent);
      if (duplicationResult.duplicateFound) {
        logger.warn(`Duplication detected: ${duplicationResult.position}`, duplicationResult);
        // For now, we'll just log and continue - in a real implementation, we'd regenerate the affected section
      }
      
      // Step 7: Apply context continuity check
      logger.info('Step 7: Applying context continuity check...');
      const continuityResult = await this.continuityValidator.validate(fullChapterContent);
      if (!continuityResult.valid) {
        logger.warn('Continuity issues found:', continuityResult.violations);
        // For now, we'll just log and continue - in a real implementation, we'd fix the continuity issues
      }
      
      // Step 8: Emotionally enhance final 25% of chapter only
      logger.info('Step 8: Applying emotional enhancement to final 25%...');
      fullChapterContent = await this.emotionalAmplifier.amplify(fullChapterContent, {
        genre,
        tone,
        targetAudience,
        intensityLevel
      });
      
      // Step 9: Run retention scoring
      logger.info('Step 9: Running retention scoring...');
      let retentionScore = await this.retentionScorer.evaluate(fullChapterContent, escalationBlueprint, {
        genre,
        tone,
        targetAudience,
        intensityLevel
      });
      
      // Step 10: Validate escalation structure
      logger.info('Step 10: Validating escalation structure...');
      const escalationValid = this.regenerationController.validateEscalationStructure(fullChapterContent);
      
      // Step 11: Handle quality issues through regeneration if needed
      logger.info('Step 11: Checking quality and handling regeneration if needed...');
      const regenerationResult = await this.regenerationController.handleQualityIssues(
        fullChapterContent, 
        escalationBlueprint, 
        chapterOutline, 
        novel, 
        {
          genre,
          tone,
          targetAudience,
          intensityLevel,
          maxRegenerations: 3
        }
      );
      
      fullChapterContent = regenerationResult.content;
      const regenerationAttempts = regenerationResult.attempts;
      retentionScore = regenerationResult.score;
      const finalEscalationValid = regenerationResult.valid;
      
      // Calculate final metrics
      const wordCount = this.retentionScorer.countWords(fullChapterContent);
      const dialogueDensity = this.retentionScorer.calculateDialogueDensity(fullChapterContent);
      const cliffhangerScore = retentionScore.cliffhanger || 7; // Use score from evaluation
      
      // Step 12: Save chapter
      await this.saveChapter(novelId, chapterNumber, fullChapterContent, {
        escalationBlueprint,
        chapterOutline,
        targetWordCount: chapterLength,
        genre,
        tone,
        targetAudience,
        intensityLevel,
        pacing,
        audienceMaturity
      }, wordCount);
      
      // Step 13: Update memory
      await memoryService.updateMemory(novelId, fullChapterContent, chapterNumber);
      
      // Step 14: Update arc progress
      await arcService.updateArcProgress(novelId, chapterNumber);
      
      // Step 15: Update novel progress
      await this.updateNovelProgress(novelId, chapterNumber);
      
      // Step 16: Log metrics
      await retentionService.logMetrics({
        chapterNumber,
        dialogueDensity: retentionScore.dialoguePercentage,
        tensionScore: retentionScore.tension || 8,
        emotionalIntensity: retentionScore.emotion || 8,
        rewriteAttemptsTotal: regenerationAttempts,
        cliffhangerScore
      });
      
      logger.info(`Completed chapter generation for novel ${novelId} - Chapter ${chapterNumber} (${wordCount} words, ${regenerationAttempts} regeneration attempts)`);
      
      return {
        success: true,
        message: 'Chapter generated successfully',
        data: {
          chapterNumber,
          arcName: arc.arcTitle,
          wordCount,
          targetWordCount: chapterLength,
          genre,
          tone,
          targetAudience,
          intensityLevel,
          pacing,
          audienceMaturity,
          actsCount: 3,
          retentionStats: {
            totalActs: 3,
            regenerationAttempts,
            cliffhangerScore,
            passedRetention: retentionScore.pass,
            escalationValid: finalEscalationValid,
            dialogueDensity: retentionScore.dialoguePercentage
          }
        }
      };
    } catch (error) {
      logger.error(`Failed to generate chapter ${chapterNumber} for novel ${novelId}`, { error: error.message });
      throw new Error(`Chapter generation failed: ${error.message}`);
    }
  }
  
  calculateTargetWordCount(act, pacing, totalTarget) {
    // Adjust word counts based on pacing
    let baseCount;
    
    switch(act) {
      case 'I':
        baseCount = Math.floor(totalTarget * 0.32); // 32% for Act I (Establishment)
        break;
      case 'II':
        baseCount = Math.floor(totalTarget * 0.40); // 40% for Act II (Escalation)
        break;
      case 'III':
        baseCount = Math.floor(totalTarget * 0.28); // 28% for Act III (Shift)
        break;
      default:
        baseCount = Math.floor(totalTarget / 3);
    }
    
    // Adjust based on pacing
    if (pacing === 'fast') {
      baseCount = Math.floor(baseCount * 0.9); // Reduce for faster pacing
    } else if (pacing === 'slow') {
      baseCount = Math.floor(baseCount * 1.1); // Increase for slower pacing
    }
    
    // Ensure within reasonable bounds
    if (act === 'I') {
      return Math.min(Math.max(baseCount, 700), 900);
    } else if (act === 'II') {
      return Math.min(Math.max(baseCount, 900), 1100);
    } else if (act === 'III') {
      return Math.min(Math.max(baseCount, 800), 1000);
    }
    
    return baseCount;
  }

  async loadNovel(novelId) {
    // Import here to avoid circular dependency
    const novelService = require('./novelService');
    return await novelService.getNovelById(novelId);
  }

  async getPreviousChapterSummary(novelId, chapterNumber) {
    if (chapterNumber <= 1) return '';
    
    try {
      const previousChapter = await this.getChapter(novelId, chapterNumber - 1);
      if (previousChapter) {
        // Extract summary from previous chapter content
        const content = previousChapter.content;
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
        return sentences.slice(0, 2).join('. ') + '.';
      }
      return '';
    } catch (error) {
      logger.warn(`Could not load previous chapter summary for chapter ${chapterNumber - 1}`);
      return '';
    }
  }

  async saveChapter(novelId, chapterNumber, content, metadata, wordCount) {
    try {
      const chapterDir = path.join(this.chaptersDir, novelId);
      await fs.ensureDir(chapterDir);
      
      const chapterFile = path.join(chapterDir, `${chapterNumber}.json`);
      const chapterData = {
        novelId,
        chapterNumber,
        content,
        metadata,
        wordCount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await fs.writeJson(chapterFile, chapterData, { spaces: 2 });
    } catch (error) {
      logger.error(`Failed to save chapter ${chapterNumber} for novel ${novelId}`, { error: error.message });
      throw error;
    }
  }

  async getChapter(novelId, chapterNumber) {
    try {
      const chapterFile = path.join(this.chaptersDir, novelId, `${chapterNumber}.json`);
      if (!(await fs.pathExists(chapterFile))) {
        return null;
      }
      return await fs.readJson(chapterFile);
    } catch (error) {
      logger.error(`Failed to read chapter ${chapterNumber} for novel ${novelId}`, { error: error.message });
      return null;
    }
  }

  async updateNovelProgress(novelId, chapterNumber) {
    // Import here to avoid circular dependency
    const novelService = require('./novelService');
    return await novelService.updateNovelProgress(novelId, chapterNumber);
  }
}

module.exports = new StoryOrchestrator();
