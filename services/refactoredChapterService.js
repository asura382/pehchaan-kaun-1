const fs = require('fs-extra');
const path = require('path');
const aiProvider = require('./aiProvider');
const memoryService = require('./memoryService');
const arcService = require('./arcService');
const retentionService = require('./retentionService');
const logger = require('../utils/logger');

// ========================================
// CORE ARCHITECTURE: SINGLE CANONICAL DRAFT
// ========================================

/**
 * Chapter represents the SINGLE CANONICAL DRAFT architecture
 * All modifications happen to this master object
 */
class Chapter {
  constructor(novelId, chapterNumber, options = {}) {
    this.novelId = novelId;
    this.chapterNumber = chapterNumber;
    this.sceneBlocks = []; // Structured scene blocks
    this.metadata = {
      genre: options.genre || 'general',
      tone: options.tone || 'balanced',
      targetAudience: options.targetAudience || 'general',
      intensityLevel: options.intensityLevel || 5,
      pacing: options.pacing || 'medium',
      audienceMaturity: options.audienceMaturity || 'moderate',
      targetWordCount: options.chapterLength || 2200,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.generationStats = {
      regenerationAttempts: 0,
      enhancementAttempts: 0,
      validationErrors: [],
      wordCount: 0
    };
  }

  // Add a scene block to the chapter
  addSceneBlock(block) {
    this.sceneBlocks.push({
      id: `scene_${this.sceneBlocks.length + 1}`,
      ...block,
      timestamp: new Date().toISOString()
    });
    this.metadata.updatedAt = new Date().toISOString();
  }

  // Update a specific scene block
  updateSceneBlock(sceneId, updates) {
    const index = this.sceneBlocks.findIndex(block => block.id === sceneId);
    if (index !== -1) {
      this.sceneBlocks[index] = {
        ...this.sceneBlocks[index],
        ...updates,
        timestamp: new Date().toISOString()
      };
      this.metadata.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  // Get content as clean prose
  getContent() {
    return this.sceneBlocks
      .map(block => block.content)
      .join('\n\n')
      .trim();
  }

  // Get word count
  getWordCount() {
    return this.getContent().split(/\s+/).filter(word => word.length > 0).length;
  }

  // Validate structural integrity
  validateStructure() {
    const validator = new StructuralValidator();
    return validator.validateChapterStructure(this.getContent());
  }
}

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

UNIVERSAL NARRATIVE DRIVERS:
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

Return JSON format:
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
      const jsonStart = rawBlueprint.indexOf('{');
      const jsonEnd = rawBlueprint.lastIndexOf('}') + 1;
      
      if (jsonStart !== -1 && jsonEnd !== 0) {
        const jsonString = rawBlueprint.substring(jsonStart, jsonEnd);
        return JSON.parse(jsonString);
      }
      
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
      logger.warn(`Failed to parse escalation blueprint:`, error.message);
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
Generate 3-Act structured chapter outline for Chapter ${novel.currentChapter || 1} of "${novel.title}".

ESCALATION BLUEPRINT:
${JSON.stringify(escalationBlueprint, null, 2)}

CONTEXT:
- Novel: ${novel.title}
- Genre: ${genre}
- Tone: ${tone}
- Target Audience: ${targetAudience}
- Intensity Level: ${intensityLevel}/10

OUTLINE REQUIREMENTS:
ACT I – Establishment:
- Character state
- Immediate conflict
- Stakes introduced

ACT II – Escalation:
- Stakes intensified
- New complication
- Emotional destabilization
- Power imbalance increased

ACT III – Shift:
- Breaking point
- Irreversible action/reveal
- Status change
- Unresolved hook

STRICT RULES:
- No repetition
- Each act changes character situation
- Acts build toward climax
- Genre-agnostic structure

Return JSON:
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
      const jsonStart = rawOutline.indexOf('{');
      const jsonEnd = rawOutline.lastIndexOf('}') + 1;
      
      if (jsonStart !== -1 && jsonEnd !== 0) {
        const jsonString = rawOutline.substring(jsonStart, jsonEnd);
        return JSON.parse(jsonString);
      }
      
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
      logger.warn(`Failed to parse chapter outline:`, error.message);
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
    
    const actDetails = chapterOutline[`act${actNumber}`] || chapterOutline[`act${actNumber.toUpperCase()}`];
    
    let actPrompt = `
Generate Act ${actNumber} of Chapter ${novel.currentChapter || 1} for "${novel.title}" (${genre} genre).

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
- Section: Act ${actNumber}
- Summary: ${actDetails?.summary || 'Generate act content'}
- Key Elements: ${actDetails?.keyElements?.join(', ') || 'Key story elements'}
- Target Length: ${targetWordCount} words

GENERATION REQUIREMENTS:
- Clear character state and conflict
- Appropriate stakes for this act
- Engaging narrative that builds tension
- Word count close to ${targetWordCount} words

STRICT ANTI-REPETITION RULES:
- No repeated dialogue
- No repeated paragraphs
- No generic emotional clichés
- No recycled insults
- Each paragraph adds new information
- Character dialogue has distinct voice

UNIVERSAL STORY ELEMENTS:
- Identity threat
- Social consequence  
- Loss risk
- Power imbalance
- Emotional vulnerability
- Desire vs obstacle
- Status change
- Mystery introduction

Write exactly ${targetWordCount} words. Start directly with narrative.
        `.trim();

    if (regenerationAttempt > 0) {
      actPrompt += `\n\nREGENERATION INSTRUCTIONS: This is regeneration attempt #${regenerationAttempt}. Address quality issues from previous version. Focus on strengthening the narrative and ensuring clear progression.`;
    }

    return await aiProvider.generateScene(actPrompt);
  }
}

// ========================================
// STAGE 4: EMOTIONAL AMPLIFIER (REFACTORED)
// ========================================
class EmotionalAmplifier {
  async amplifySceneBlocks(sceneBlocks, options = {}) {
    const { genre, tone, targetAudience, intensityLevel, enhancementThreshold = 0.75 } = options;
    
    if (!sceneBlocks || sceneBlocks.length === 0) {
      return sceneBlocks;
    }
    
    // Identify which scenes to enhance
    const totalScenes = sceneBlocks.length;
    const enhancementStartIndex = Math.floor(totalScenes * enhancementThreshold);
    
    if (enhancementStartIndex >= totalScenes) {
      return sceneBlocks;
    }
    
    // Create enhanced copy
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
      
      // Replace content in place (structurally safe)
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
    
    const enhancementPrompt = `
Enhance scene content to intensify emotional impact while preserving exact structure.

SCENE TYPE: ${sceneType || 'General'}
ORIGINAL CONTENT:
${content}

ENHANCEMENT INSTRUCTIONS:
- ONLY enhance emotional intensity and tension
- PRESERVE all original plot points, dialogue, and actions
- MAINTAIN exact scene structure and paragraph boundaries
- STRENGTHEN emotional reactions and sensory descriptions
- INCREASE urgency WITHOUT changing story beats
- REMOVE any enhancement artifacts
- RETURN only enhanced scene content
- DO NOT add new content or paragraphs
- DO NOT repeat existing content

GENRE/CONTEXT:
- Genre: ${genre || 'General'}
- Tone: ${tone || 'Balanced'}
- Target Audience: ${targetAudience || 'General'}
- Intensity Level: ${intensityLevel || 5}/10

Return only enhanced scene content with no additional text.
        `.trim();

    try {
      const enhancedContent = await aiProvider.enhanceEmotion(enhancementPrompt);
      const sanitizedContent = this.sanitizeEnhancedContent(enhancedContent, content);
      return sanitizedContent;
    } catch (error) {
      logger.warn('Failed to enhance scene, returning original:', error.message);
      return content;
    }
  }
  
  getContextForScene(sceneBlocks, currentIndex) {
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
    let sanitized = enhancedContent;
    
    // Remove enhancement artifacts
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
    
    // Ensure no structural additions
    const originalParagraphs = originalContent.split(/\n\s*\n/).filter(p => p.trim());
    const enhancedParagraphs = sanitized.split(/\n\s*\n/).filter(p => p.trim());
    
    if (enhancedParagraphs.length > originalParagraphs.length * 1.2) {
      logger.warn('Enhancement added too many paragraphs, using original content');
      return originalContent;
    }
    
    return sanitized.trim();
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
    
    return {
      valid: errors.length === 0,
      errors,
      content: validatedContent,
      blockCount: blocks.length
    };
  }
  
  parseIntoBlocks(content) {
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
    
    let cleanedContent = blocks.map(block => block.content).join('\n\n');
    
    if (Object.values(actCounts).some(count => count > 1)) {
      const actHeaders = ['Act I', 'Act II', 'Act III'];
      for (const act of actHeaders) {
        const headerPattern = new RegExp(`^${act}\\b`, 'gim');
        let firstFound = false;
        cleanedContent = cleanedContent.replace(headerPattern, (match) => {
          if (!firstFound) {
            firstFound = true;
            return match;
          }
          return '';
        });
      }
      // Clean up multiple line breaks
      cleanedContent = cleanedContent.replace(/
\s*
\s*
/g, '

');
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
    
    blocks.forEach((block, index) => {
      if (seenHashes.has(block.hash)) {
        duplicateIndices.push(index);
        errors.push(`Duplicate content detected at block ${index + 1}`);
      } else {
        seenHashes.add(block.hash);
      }
    });
    
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
    
    // Clean up multiple line breaks
    cleaned = cleaned.replace(/
\s*
\s*
/g, '

');
    
    return cleaned.trim();
  }
  
  classifyBlockType(content) {
    const contentLower = content.toLowerCase();
    
    if (contentLower.includes('act i') || contentLower.includes('act 1')) return 'ACT_I';
    if (contentLower.includes('act ii') || contentLower.includes('act 2')) return 'ACT_II';
    if (contentLower.includes('act iii') || contentLower.includes('act 3')) return 'ACT_III';
    if (/^("|\').*\\1$/.test(content.trim())) return 'DIALOGUE';
    if (/description|scene|location|setting/.test(contentLower)) return 'DESCRIPTION';
    
    return 'NARRATIVE';
  }
  
  generateBlockId(content, index) {
    return `block_${index}_${this.hashContent(content).substring(0, 8)}`;
  }
  
  hashContent(content) {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}

// ========================================
// STAGE 6: DEDUPLICATION ENGINE
// ========================================
class DeduplicationEngine {
  constructor() {
    this.contentHistory = new Map();
    this.paragraphHashes = new Map();
  }
  
  preventReinsertion(content, context = {}) {
    const { chapterId, sceneId } = context;
    
    if (!content || content.trim().length === 0) {
      return { allowed: true, content };
    }
    
    const contentHash = this.hashContent(content);
    const key = `${chapterId || 'unknown'}_${sceneId || 'unknown'}`;
    
    if (this.contentHistory.has(contentHash)) {
      const lastUsed = this.contentHistory.get(contentHash);
      const timeSinceLastUse = Date.now() - lastUsed.timestamp;
      
      if (timeSinceLastUse < 5 * 60 * 1000) {
        logger.warn(`Content duplication detected for key ${key}: ${contentHash}`);
        return { allowed: false, reason: 'Recent duplication detected', content: '' };
      }
    }
    
    this.contentHistory.set(contentHash, {
      timestamp: Date.now(),
      key,
      content: content.substring(0, 100) + '...'
    });
    
    this.cleanupOldEntries();
    
    return { allowed: true, content };
  }
  
  detectRepetitionLoops(blocks, threshold = 0.8) {
    const similarities = [];
    
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
  
  calculateSimilarity(text1, text2) {
    const words1 = new Set(text1.toLowerCase().match(/\b\w+\b/g) || []);
    const words2 = new Set(text2.toLowerCase().match(/\b\w+\b/g) || []);
    
    if (words1.size === 0 && words2.size === 0) return 1;
    if (words1.size === 0 || words2.size === 0) return 0;
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }
  
  hashContent(content) {
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
    
    for (const [hash, entry] of this.contentHistory.entries()) {
      if (now - entry.timestamp > oneHour) {
        this.contentHistory.delete(hash);
      }
    }
    
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
    const { maxAdjectiveStack = 3, preventEscalationLoops = true } = options;
    
    if (!content || content.trim().length === 0) {
      return content;
    }
    
    let regulatedContent = content;
    
    if (maxAdjectiveStack) {
      regulatedContent = this.limitAdjectiveStacking(regulatedContent, maxAdjectiveStack);
    }
    
    if (preventEscalationLoops) {
      regulatedContent = this.preventEscalationLoops(regulatedContent);
    }
    
    return regulatedContent;
  }
  
  limitAdjectiveStacking(content, maxStack) {
    const adjectiveChainPattern = /\b(\w+,\s*){2,}(?=\w+\s+(?:was|were|is|are|felt|seemed|appeared|looked|sounded|smelled|tasted)\b)/gi;
    
    return content.replace(adjectiveChainPattern, (match) => {
      const adjectives = match.split(',').map(adj => adj.trim()).filter(adj => adj);
      if (adjectives.length > maxStack) {
        return adjectives.slice(0, maxStack).join(', ') + ', ';
      }
      return match;
    });
  }
  
  preventEscalationLoops(content) {
    const escalationPatterns = [
      /\b(very|extremely|incredibly|absolutely|totally)\s+(very|extremely|incredibly|absolutely|totally)/gi,
      /\b(more and more|increasingly|growing|escalating)\s+(more and more|increasingly|growing|escalating)/gi,
      /\b(intense|intensely)\s+(intense|intensely)/gi
    ];
    
    let regulated = content;
    
    for (const pattern of escalationPatterns) {
      regulated = regulated.replace(pattern, (match) => {
        return match.split(' ')[0];
      });
    }
    
    return regulated;
  }
}

// ========================================
// STAGE 8: FINAL COHERENCE PASS
// ========================================
class CoherencePass {
  ensureCoherence(content, options = {}) {
    const { removeBrokenTransitions = true, ensureCharacterContinuity = true } = options;
    
    if (!content || content.trim().length === 0) {
      return content;
    }
    
    let coherentContent = content;
    
    if (removeBrokenTransitions) {
      coherentContent = this.fixBrokenTransitions(coherentContent);
    }
    
    if (ensureCharacterContinuity) {
      coherentContent = this.validateCharacterContinuity(coherentContent);
    }
    
    return coherentContent;
  }
  
  fixBrokenTransitions(content) {
    let fixed = content;
    fixed = fixed.replace(/([^.!?])\s*\n\s*([a-z])/g, '$1 $2');
    fixed = fixed.replace(/\n\s*\n\s*([a-z])/g, ' $1');
    // Clean up multiple line breaks
    fixed = fixed.replace(/
\s*
\s*
/g, '

');
    return fixed;
  }
  
  validateCharacterContinuity(content) {
    const characterNames = this.extractCharacterNames(content);
    let consistent = content;
    
    characterNames.forEach(name => {
      const variations = [
        name.toLowerCase(),
        name.toUpperCase(),
        name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
      ];
      
      const counts = variations.map(variation => 
        (content.match(new RegExp(`\\b${variation}\\b`, 'gi')) || []).length
      );
      
      const mostFrequentIndex = counts.indexOf(Math.max(...counts));
      const correctName = variations[mostFrequentIndex];
      
      variations.forEach((variation, index) => {
        if (index !== mostFrequentIndex) {
          consistent = consistent.replace(new RegExp(`\\b${variation}\\b`, 'gi'), correctName);
        }
      });
    });
    
    return consistent;
  }
  
  extractCharacterNames(content) {
    const words = content.match(/\b[A-Z][a-z]+\b/g) || [];
    const nameCounts = {};
    
    words.forEach(word => {
      nameCounts[word] = (nameCounts[word] || 0) + 1;
    });
    
    return Object.keys(nameCounts).filter(name => nameCounts[name] > 1);
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
    this.structuralValidator = new StructuralValidator();
    this.deduplicationEngine = new DeduplicationEngine();
    this.toneGovernor = new ToneGovernor();
    this.coherencePass = new CoherencePass();
  }

  async generateChapter(novelId, chapterNumber, options = {}) {
    try {
      // Load required data
      const novel = await this.loadNovel(novelId);
      const arc = await arcService.getCurrentArc(novelId, chapterNumber);
      const memorySummary = await memoryService.getMemorySummary(novelId);
      const previousChapterSummary = await this.getPreviousChapterSummary(novelId, chapterNumber);
      
      // Create canonical chapter object
      const chapter = new Chapter(novelId, chapterNumber, options);
      
      logger.info(`Starting structurally-safe chapter generation pipeline for novel ${novelId} - Chapter ${chapterNumber}`);
      
      // Step 1: Generate escalation blueprint
      logger.info('Step 1: Generating escalation blueprint...');
      const escalationBlueprint = await this.escalationGenerator.generate(novel, arc, chapterNumber, { 
        ...chapter.metadata,
        previousChapterSummary,
        memorySummary
      });
      
      // Step 2: Generate chapter outline
      logger.info('Step 2: Generating chapter outline...');
      const chapterOutline = await this.outlineGenerator.generate(novel, escalationBlueprint, chapter.metadata);
      
      // Step 3: Generate acts as structured scene blocks
      logger.info('Step 3: Generating acts...');
      const acts = ['I', 'II', 'III'];
      let previousContent = '';
      
      for (const act of acts) {
        const targetWordCount = this.calculateTargetWordCount(act, chapter.metadata.pacing, chapter.metadata.targetWordCount);
        
        const actContent = await this.actGenerator.generate(
          novel, 
          escalationBlueprint, 
          chapterOutline, 
          act, 
          {
            ...chapter.metadata,
            previousContent,
            previousChapterSummary,
            memorySummary,
            targetWordCount
          }
        );
        
        // Add act as scene block
        chapter.addSceneBlock({
          type: `ACT_${act}`,
          content: actContent,
          wordCount: actContent.split(/\s+/).filter(w => w.length > 0).length,
          actNumber: act
        });
        
        previousContent += actContent + '\n\n';
      }
      
      // Step 4: Apply structural validation
      logger.info('Step 4: Applying structural validation...');
      const validation = chapter.validateStructure();
      if (!validation.valid) {
        logger.warn('Structural validation issues found:', validation.errors);
        // Note: In production, you might want to handle these errors more strictly
      }
      
      // Step 5: Apply emotional enhancement to scene blocks
      logger.info('Step 5: Applying emotional enhancement...');
      const enhancedBlocks = await this.emotionalAmplifier.amplifySceneBlocks(
        chapter.sceneBlocks,
        chapter.metadata
      );
      chapter.sceneBlocks = enhancedBlocks;
      chapter.generationStats.enhancementAttempts = 1;
      
      // Step 6: Apply tone regulation
      logger.info('Step 6: Applying tone regulation...');
      const tonedContent = this.toneGovernor.regulateTone(chapter.getContent(), {
        maxAdjectiveStack: 3,
        preventEscalationLoops: true
      });
      
      // Update chapter with toned content
      chapter.sceneBlocks = chapter.sceneBlocks.map((block, index) => ({
        ...block,
        content: tonedContent.split('\n\n')[index] || block.content
      }));
      
      // Step 7: Apply final coherence pass
      logger.info('Step 7: Applying final coherence pass...');
      const coherentContent = this.coherencePass.ensureCoherence(chapter.getContent(), {
        removeBrokenTransitions: true,
        ensureCharacterContinuity: true
      });
      
      // Update chapter with coherent content
      const coherentBlocks = coherentContent.split('\n\n').filter(c => c.trim());
      chapter.sceneBlocks = chapter.sceneBlocks.slice(0, coherentBlocks.length).map((block, index) => ({
        ...block,
        content: coherentBlocks[index] || block.content
      }));
      
      // Step 8: Final structural validation
      logger.info('Step 8: Final structural validation...');
      const finalValidation = chapter.validateStructure();
      if (!finalValidation.valid) {
        logger.error('Final validation failed:', finalValidation.errors);
        throw new Error(`Chapter validation failed: ${finalValidation.errors.join(', ')}`);
      }
      
      // Step 9: Save chapter
      logger.info('Step 9: Saving chapter...');
      await this.saveChapter(chapter);
      
      // Step 10: Update services
      await memoryService.updateMemory(novelId, chapter.getContent(), chapterNumber);
      await arcService.updateArcProgress(novelId, chapterNumber);
      await this.updateNovelProgress(novelId, chapterNumber);
      
      // Step 11: Log metrics
      const wordCount = chapter.getWordCount();
      await retentionService.logMetrics({
        chapterNumber,
        wordCount,
        regenerationAttempts: chapter.generationStats.regenerationAttempts,
        enhancementAttempts: chapter.generationStats.enhancementAttempts
      });
      
      logger.info(`Completed chapter generation for novel ${novelId} - Chapter ${chapterNumber} (${wordCount} words)`);
      
      return {
        success: true,
        message: 'Chapter generated successfully with structural safety',
        data: {
          chapterNumber,
          arcName: arc.arcTitle,
          wordCount,
          targetWordCount: chapter.metadata.targetWordCount,
          genre: chapter.metadata.genre,
          tone: chapter.metadata.tone,
          actsCount: 3,
          generationStats: chapter.generationStats
        }
      };
    } catch (error) {
      logger.error(`Failed to generate chapter ${chapterNumber} for novel ${novelId}`, { error: error.message });
      throw new Error(`Chapter generation failed: ${error.message}`);
    }
  }
  
  calculateTargetWordCount(act, pacing, totalTarget) {
    let baseCount;
    
    switch(act) {
      case 'I':
        baseCount = Math.floor(totalTarget * 0.32);
        break;
      case 'II':
        baseCount = Math.floor(totalTarget * 0.40);
        break;
      case 'III':
        baseCount = Math.floor(totalTarget * 0.28);
        break;
      default:
        baseCount = Math.floor(totalTarget / 3);
    }
    
    if (pacing === 'fast') {
      baseCount = Math.floor(baseCount * 0.9);
    } else if (pacing === 'slow') {
      baseCount = Math.floor(baseCount * 1.1);
    }
    
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
    const novelService = require('./novelService');
    return await novelService.getNovelById(novelId);
  }

  async getPreviousChapterSummary(novelId, chapterNumber) {
    if (chapterNumber <= 1) return '';
    
    try {
      const chapterFile = path.join(this.chaptersDir, novelId, `${chapterNumber - 1}.json`);
      if (!(await fs.pathExists(chapterFile))) {
        return '';
      }
      const chapter = await fs.readJson(chapterFile);
      const content = chapter.content;
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
      return sentences.slice(0, 2).join('. ') + '.';
    } catch (error) {
      logger.warn(`Could not load previous chapter summary for chapter ${chapterNumber - 1}`);
      return '';
    }
  }

  async saveChapter(chapter) {
    try {
      const chapterDir = path.join(this.chaptersDir, chapter.novelId);
      await fs.ensureDir(chapterDir);
      
      const chapterFile = path.join(chapterDir, `${chapter.chapterNumber}.json`);
      const chapterData = {
        novelId: chapter.novelId,
        chapterNumber: chapter.chapterNumber,
        content: chapter.getContent(),
        sceneBlocks: chapter.sceneBlocks,
        metadata: chapter.metadata,
        generationStats: chapter.generationStats,
        wordCount: chapter.getWordCount(),
        createdAt: chapter.metadata.createdAt,
        updatedAt: chapter.metadata.updatedAt
      };
      
      await fs.writeJson(chapterFile, chapterData, { spaces: 2 });
    } catch (error) {
      logger.error(`Failed to save chapter ${chapter.chapterNumber} for novel ${chapter.novelId}`, { error: error.message });
      throw error;
    }
  }

  async updateNovelProgress(novelId, chapterNumber) {
    const novelService = require('./novelService');
    return await novelService.updateNovelProgress(novelId, chapterNumber);
  }
}

module.exports = new StoryOrchestrator();