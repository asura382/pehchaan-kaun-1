const fs = require('fs-extra');
const path = require('path');
const aiProvider = require('./aiProvider');
const logger = require('../utils/logger');

class RetentionService {
  constructor() {
    this.maxRewriteAttempts = 3; // Updated to 3 attempts as requested
    this.maxCliffhangerRewriteAttempts = 2;
    this.engineMode = "AUTHOR_V6_STRICT";
    this.characterCoreFile = path.join(__dirname, '../data/characterCore.json');
  }

  async loadCharacterCore() {
    try {
      if (await fs.pathExists(this.characterCoreFile)) {
        const characterCore = await fs.readJson(this.characterCoreFile);
        return characterCore;
      }
      // Return default structure if file doesn't exist
      return {
        protagonist: {
          personality: "",
          speech_style: "",
          core_wound: "",
          long_term_goal: "",
          current_arc_goal: "",
          emotional_trigger: ""
        }
      };
    } catch (error) {
      logger.error('Failed to load character core', { error: error.message });
      return {
        protagonist: {
          personality: "",
          speech_style: "",
          core_wound: "",
          long_term_goal: "",
          current_arc_goal: "",
          emotional_trigger: ""
        }
      };
    }
  }

  async evaluateSceneRetention(sceneText, previousSceneSummary = '', includeCharacterCore = true) {
    try {
      // Load character core if needed
      let characterCore = null;
      if (includeCharacterCore) {
        characterCore = await this.loadCharacterCore();
      }

      const evaluationPrompt = this.createEscalationEvaluationPrompt(sceneText, previousSceneSummary, characterCore);
      const evaluationResponse = await aiProvider.generateStructure(evaluationPrompt);
      
      const metrics = this.parseEscalationEvaluationResponse(evaluationResponse);
      
      logger.info('Scene retention evaluation completed', { 
        dialogue: metrics.dialogue,
        emotion: metrics.emotion,
        tension: metrics.tension,
        tensionHigherThanPrevious: metrics.tensionHigherThanPrevious,
        powerShift: metrics.powerShift,
        newInformation: metrics.newInformation,
        hook: metrics.hook
      });
      
      return metrics;
    } catch (error) {
      logger.error('Retention evaluation failed', { error: error.message });
      // Return conservative metrics on failure to trigger rewrite
      return {
        dialogue: '40%',
        emotion: 5,
        tension: 5,
        tensionHigherThanPrevious: 'No',
        powerShift: 'No',
        newInformation: 'No',
        hook: 'No',
        rawResponse: 'Evaluation failed'
      };
    }
  }

  createEscalationEvaluationPrompt(sceneText, previousSceneSummary, characterCore) {
    let characterContext = '';
    if (characterCore && characterCore.protagonist) {
      const protag = characterCore.protagonist;
      characterContext = `
CHARACTER CORE DATA:
Personality: ${protag.personality}
Speech Style: ${protag.speech_style}
Core Wound: ${protag.core_wound}
Long-term Goal: ${protag.long_term_goal}
Current Arc Goal: ${protag.current_arc_goal}
Emotional Trigger: ${protag.emotional_trigger}`;
    }

    return `You are a WebNovel retention analyst.

Analyze the following scene strictly for reader retention quality.

Evaluate:

Dialogue density (percentage estimate)
Emotional intensity (1–10)
Tension level (1–10)
Is tension higher than previous scene? (Yes/No)
Does power dynamic shift? (Yes/No)
Is new information revealed? (Yes/No)
Is there a hook at the end? (Yes/No)

Respond in short bullet format.

SCENE:
${sceneText}

PREVIOUS SCENE SUMMARY:
${previousSceneSummary || 'This is the first scene in the chapter.'}

${characterContext || ''}

Be strict. Do not be generous.`;
  }

  parseEscalationEvaluationResponse(response) {
    try {
      const lines = response.trim().split('\n');
      const metrics = {};
      
      for (const line of lines) {
        const [key, value] = line.split(':').map(s => s.trim());
        if (key && value) {
          const cleanKey = key.toLowerCase();
          if (cleanKey.includes('dialogue')) {
            metrics.dialogue = value;
          } else if (cleanKey.includes('emotion')) {
            metrics.emotion = parseInt(value.match(/\d+/)?.[0] || '0');
          } else if (cleanKey.includes('tension')) {
            // Handle both "Tension: 8/10" and "Is tension higher than previous scene?: No"
            if (cleanKey.includes('higher')) {
              metrics.tensionHigherThanPrevious = value;
            } else {
              metrics.tension = parseInt(value.match(/\d+/)?.[0] || '0');
            }
          } else if (cleanKey.includes('power')) {
            metrics.powerShift = value;
          } else if (cleanKey.includes('new information')) {
            metrics.newInformation = value;
          } else if (cleanKey.includes('hook')) {
            metrics.hook = value;
          }
        }
      }
      
      // Set defaults for missing metrics
      if (metrics.dialogue === undefined) metrics.dialogue = '40%';
      if (metrics.emotion === undefined) metrics.emotion = 5;
      if (metrics.tension === undefined) metrics.tension = 5;
      if (metrics.tensionHigherThanPrevious === undefined) metrics.tensionHigherThanPrevious = 'No';
      if (metrics.powerShift === undefined) metrics.powerShift = 'No';
      if (metrics.newInformation === undefined) metrics.newInformation = 'No';
      if (metrics.hook === undefined) metrics.hook = 'No';
      
      metrics.rawResponse = response.trim();
      return metrics;
    } catch (error) {
      logger.error('Failed to parse escalation evaluation response', { error: error.message });
      throw new Error(`Invalid evaluation format: ${error.message}`);
    }
  }

  shouldRewriteScene(metrics) {
    try {
      // Extract dialogue percentage
      const dialoguePercent = parseInt(metrics.dialogue.replace('%', '') || '0');
      
      // Check if ANY of the strict criteria are failing
      const rewriteConditions = [
        dialoguePercent < 60,                           // Dialogue < 60%
        metrics.emotion < 8,                            // Emotional intensity < 8
        metrics.tension < 8,                            // Tension < 8
        metrics.tensionHigherThanPrevious !== 'Yes',    // Tension not higher than previous
        metrics.powerShift !== 'Yes',                   // No power shift
        metrics.newInformation !== 'Yes',               // No new information
        metrics.hook !== 'Yes'                          // No hook
      ];
      
      const shouldRewrite = rewriteConditions.some(condition => condition);
      
      logger.info('Retention check result', { 
        dialoguePercent,
        emotion: metrics.emotion,
        tension: metrics.tension,
        tensionHigherThanPrevious: metrics.tensionHigherThanPrevious,
        powerShift: metrics.powerShift,
        newInformation: metrics.newInformation,
        hook: metrics.hook,
        shouldRewrite
      });
      
      return shouldRewrite;
    } catch (error) {
      logger.error('Failed to determine rewrite necessity', { error: error.message });
      return true; // Conservative approach - rewrite on parsing failure
    }
  }

  async rewriteScene(sceneText, previousSceneSummary, attempt = 1, includeCharacterCore = true) {
    try {
      if (attempt > this.maxRewriteAttempts) {
        logger.warn('Max rewrite attempts reached, using best version', { attempt });
        return sceneText;
      }
      
      const rewritePrompt = await this.createRewritePrompt(sceneText, previousSceneSummary, includeCharacterCore);
      const rewrittenScene = await aiProvider.generateStructure(rewritePrompt);
      
      logger.info(`Scene rewrite attempt ${attempt} completed`);
      
      // Evaluate the rewritten scene
      const newMetrics = await this.evaluateSceneRetention(rewrittenScene, previousSceneSummary, includeCharacterCore);
      
      if (this.shouldRewriteScene(newMetrics)) {
        logger.info('Rewritten scene still needs improvement, attempting another rewrite', { 
          attempt: attempt + 1 
        });
        return await this.rewriteScene(rewrittenScene, previousSceneSummary, attempt + 1, includeCharacterCore);
      }
      
      logger.info('Scene rewrite successful - retention criteria met');
      return rewrittenScene;
    } catch (error) {
      logger.error(`Scene rewrite failed on attempt ${attempt}`, { error: error.message });
      return sceneText; // Return original scene on failure
    }
  }

  async createRewritePrompt(sceneText, previousSceneSummary, includeCharacterCore = true) {
    let characterInstructions = '';
    if (includeCharacterCore) {
      const characterCore = await this.loadCharacterCore();
      if (characterCore && characterCore.protagonist) {
        const protag = characterCore.protagonist;
        characterInstructions = `
CHARACTER CORE DATA TO MAINTAIN:
- Personality: ${protag.personality}
- Speech Style: ${protag.speech_style}
- Core Wound: ${protag.core_wound}
- Long-term Goal: ${protag.long_term_goal}
- Current Arc Goal: ${protag.current_arc_goal}
- Emotional Trigger: ${protag.emotional_trigger}

MAINTAIN CHARACTER CONSISTENCY: Ensure character personality, speech style, emotional trigger, and long-term goal consistency in every scene. Character speech must remain aligned with speech_style field. Emotional reactions must reflect emotional_trigger field. No personality drift allowed across chapters.`;
      }
    }

    return `You must rewrite this scene to improve retention with strict quality standards.

Strictly improve:

Increase dialogue above 60%.
Increase emotional intensity to at least 8/10.
Increase tension to at least 8/10.
Ensure tension is higher than previous scene.
Ensure power dynamic shift occurs.
Reveal new information.
Include strong hook at the end.
Keep sentences under 12 words.
Maintain fast pacing.
Keep vocabulary simple.
Avoid filler. Every scene must escalate conflict, power dynamic, or emotional stakes.
Do NOT increase length more than 15%.

${characterInstructions}

Rewrite fully. No explanations.

SCENE:
${sceneText}

PREVIOUS SCENE SUMMARY:
${previousSceneSummary || 'This is the first scene in the chapter.'}`;
  }

  async evaluateCliffhanger(cliffhangerSection) {
    try {
      const evaluationPrompt = this.createCliffhangerEvaluationPrompt(cliffhangerSection);
      const evaluationResponse = await aiProvider.generateStructure(evaluationPrompt);
      
      const metrics = this.parseCliffhangerEvaluationResponse(evaluationResponse);
      
      logger.info('Cliffhanger evaluation completed', { 
        cliffhangerStrength: metrics.cliffhangerStrength,
        unresolvedTension: metrics.unresolvedTension,
        majorElement: metrics.majorElement,
        readerUrgency: metrics.readerUrgency
      });
      
      return metrics;
    } catch (error) {
      logger.error('Cliffhanger evaluation failed', { error: error.message });
      return {
        cliffhangerStrength: 5,
        unresolvedTension: 'No',
        majorElement: 'No',
        readerUrgency: 'No',
        rawResponse: 'Evaluation failed'
      };
    }
  }

  createCliffhangerEvaluationPrompt(cliffhangerSection) {
    return `Evaluate this cliffhanger section for strength:

Evaluate:

Cliffhanger strength (1–10)
Is there unresolved tension? (Yes/No)
Is there a major decision, reveal, or threat? (Yes/No)
Would reader feel urgency to continue? (Yes/No)

Respond in short bullet format.

CLIFFHANGER SECTION:
${cliffhangerSection}

Be strict. Do not be generous.`;
  }

  parseCliffhangerEvaluationResponse(response) {
    try {
      const lines = response.trim().split('\n');
      const metrics = {};
      
      for (const line of lines) {
        const [key, value] = line.split(':').map(s => s.trim());
        if (key && value) {
          const cleanKey = key.toLowerCase();
          if (cleanKey.includes('cliffhanger')) {
            metrics.cliffhangerStrength = parseInt(value.match(/\d+/)?.[0] || '0');
          } else if (cleanKey.includes('unresolved')) {
            metrics.unresolvedTension = value;
          } else if (cleanKey.includes('major')) {
            metrics.majorElement = value;
          } else if (cleanKey.includes('reader') || cleanKey.includes('urgency')) {
            metrics.readerUrgency = value;
          }
        }
      }
      
      // Set defaults for missing metrics
      if (metrics.cliffhangerStrength === undefined) metrics.cliffhangerStrength = 5;
      if (metrics.unresolvedTension === undefined) metrics.unresolvedTension = 'No';
      if (metrics.majorElement === undefined) metrics.majorElement = 'No';
      if (metrics.readerUrgency === undefined) metrics.readerUrgency = 'No';
      
      metrics.rawResponse = response.trim();
      return metrics;
    } catch (error) {
      logger.error('Failed to parse cliffhanger evaluation response', { error: error.message });
      throw new Error(`Invalid cliffhanger evaluation format: ${error.message}`);
    }
  }

  shouldRewriteCliffhanger(metrics) {
    try {
      const shouldRewrite = metrics.cliffhangerStrength < 8;
      
      logger.info('Cliffhanger check result', { 
        strength: metrics.cliffhangerStrength,
        shouldRewrite
      });
      
      return shouldRewrite;
    } catch (error) {
      logger.error('Failed to determine cliffhanger rewrite necessity', { error: error.message });
      return true;
    }
  }

  async rewriteCliffhanger(cliffhangerSection, attempt = 1) {
    try {
      if (attempt > this.maxCliffhangerRewriteAttempts) {
        logger.warn('Max cliffhanger rewrite attempts reached', { attempt });
        return cliffhangerSection;
      }
      
      const rewritePrompt = this.createCliffhangerRewritePrompt(cliffhangerSection);
      const rewrittenCliffhanger = await aiProvider.generateStructure(rewritePrompt);
      
      logger.info(`Cliffhanger rewrite attempt ${attempt} completed`);
      
      // Evaluate the rewritten cliffhanger
      const newMetrics = await this.evaluateCliffhanger(rewrittenCliffhanger);
      
      if (this.shouldRewriteCliffhanger(newMetrics)) {
        logger.info('Rewritten cliffhanger still needs improvement, attempting another rewrite', { 
          attempt: attempt + 1 
        });
        return await this.rewriteCliffhanger(rewrittenCliffhanger, attempt + 1);
      }
      
      logger.info('Cliffhanger rewrite successful - strength criteria met');
      return rewrittenCliffhanger;
    } catch (error) {
      logger.error(`Cliffhanger rewrite failed on attempt ${attempt}`, { error: error.message });
      return cliffhangerSection; // Return original cliffhanger on failure
    }
  }

  createCliffhangerRewritePrompt(cliffhangerSection) {
    return `You must rewrite ONLY the final 300-400 words to strengthen the cliffhanger with maximum emotional intensity.

Strictly improve:

Increase cliffhanger strength to at least 8/10.
Create unresolved tension.
Include a major decision, reveal, or threat.
Ensure reader feels urgent need to continue.
Keep sentences under 12 words.
Maintain fast pacing.
Keep vocabulary simple.
Do NOT increase length more than 15%.

Rewrite fully. No explanations.

CLIFFHANGER SECTION:
${cliffhangerSection}`;
  }

  async processSceneWithRetention(sceneText, previousSceneSummary = '', includeCharacterCore = true) {
    try {
      logger.info('Starting retention evaluation for scene');
      
      // Step 1: Evaluate retention metrics
      const metrics = await this.evaluateSceneRetention(sceneText, previousSceneSummary, includeCharacterCore);
      
      // Step 2: Check if rewrite is needed
      if (this.shouldRewriteScene(metrics)) {
        logger.info('Scene failed retention criteria, initiating rewrite');
        
        // Step 3: Rewrite scene
        const rewrittenScene = await this.rewriteScene(sceneText, previousSceneSummary, 1, includeCharacterCore);
        
        // Step 4: Final evaluation of rewritten scene
        const finalMetrics = await this.evaluateSceneRetention(rewrittenScene, previousSceneSummary, includeCharacterCore);
        
        if (this.shouldRewriteScene(finalMetrics)) {
          logger.warn('Scene still failing retention after rewrite, using best version');
        }
        
        return {
          scene: rewrittenScene,
          metrics: finalMetrics,
          wasRewritten: true,
          rewriteAttempts: 1 // Simplified tracking
        };
      }
      
      // Scene passed retention criteria
      return {
        scene: sceneText,
        metrics,
        wasRewritten: false,
        rewriteAttempts: 0
      };
    } catch (error) {
      logger.error('Retention processing failed', { error: error.message });
      // Return original scene with error metrics
      return {
        scene: sceneText,
        metrics: {
          dialogue: '0%',
          emotion: 0,
          tension: 0,
          tensionHigherThanPrevious: 'No',
          powerShift: 'No',
          newInformation: 'No',
          hook: 'No',
          error: error.message
        },
        wasRewritten: false,
        rewriteAttempts: 0,
        error: true
      };
    }
  }

  async processCliffhanger(cliffhangerSection) {
    try {
      logger.info('Starting cliffhanger evaluation');
      
      // Step 1: Evaluate cliffhanger metrics
      const metrics = await this.evaluateCliffhanger(cliffhangerSection);
      
      // Step 2: Check if rewrite is needed
      if (this.shouldRewriteCliffhanger(metrics)) {
        logger.info('Cliffhanger failed strength criteria, initiating rewrite');
        
        // Step 3: Rewrite cliffhanger
        const rewrittenCliffhanger = await this.rewriteCliffhanger(cliffhangerSection);
        
        // Step 4: Final evaluation of rewritten cliffhanger
        const finalMetrics = await this.evaluateCliffhanger(rewrittenCliffhanger);
        
        if (this.shouldRewriteCliffhanger(finalMetrics)) {
          logger.warn('Cliffhanger still below strength threshold after rewrite, using best version');
        }
        
        return {
          cliffhanger: rewrittenCliffhanger,
          metrics: finalMetrics,
          wasRewritten: true
        };
      }
      
      // Cliffhanger passed strength criteria
      return {
        cliffhanger: cliffhangerSection,
        metrics,
        wasRewritten: false
      };
    } catch (error) {
      logger.error('Cliffhanger processing failed', { error: error.message });
      return {
        cliffhanger: cliffhangerSection,
        metrics: {
          cliffhangerStrength: 5,
          unresolvedTension: 'No',
          majorElement: 'No',
          readerUrgency: 'No',
          error: error.message
        },
        wasRewritten: false,
        error: true
      };
    }
  }

  async logMetrics(chapterData) {
    try {
      const metricsFile = path.join(__dirname, '../data/chapterMetrics.json');
      let metrics = [];
      
      // Read existing metrics if file exists
      if (await fs.pathExists(metricsFile)) {
        metrics = await fs.readJson(metricsFile);
      }
      
      // Add new metrics entry
      const newMetrics = {
        chapter_number: chapterData.chapterNumber,
        average_dialogue_density: chapterData.averageDialogueDensity,
        average_tension_score: chapterData.averageTensionScore,
        average_emotional_intensity: chapterData.averageEmotionalIntensity,
        rewrite_attempts_total: chapterData.rewriteAttemptsTotal,
        cliffhanger_score: chapterData.cliffhangerScore,
        timestamp: new Date().toISOString()
      };
      
      metrics.push(newMetrics);
      
      // Write updated metrics
      await fs.writeJson(metricsFile, metrics, { spaces: 2 });
      
      logger.info('Metrics logged successfully', { chapter: chapterData.chapterNumber });
    } catch (error) {
      logger.error('Failed to log metrics', { error: error.message });
    }
  }
}

module.exports = new RetentionService();