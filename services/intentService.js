const aiProvider = require('./aiProvider');
const logger = require('../utils/logger');

class IntentService {
  async generateChapterIntent(novel, arc, previousChapterSummary = '', memorySummary = '') {
    try {
      const intentPrompt = this.createIntentPrompt(novel, arc, previousChapterSummary, memorySummary);
      const intentResponse = await aiProvider.generateStructure(intentPrompt);
      
      const intent = this.parseIntentResponse(intentResponse);
      
      logger.info(`Generated intent for novel ${novel.id} - Chapter ${arc.currentChapter}`);
      return intent;
    } catch (error) {
      logger.error(`Failed to generate intent for novel ${novel.id}`, { error: error.message });
      throw new Error(`Intent generation failed: ${error.message}`);
    }
  }

  createIntentPrompt(novel, arc, previousChapterSummary, memorySummary) {
    return `You are designing a progression-based WebNovel chapter.

NOVEL CONTEXT:
Title: ${novel.title}
Theme: ${novel.theme}
Genre: ${novel.genre}
Tone: ${novel.tone}
World Rules: ${novel.worldRules}
Main Character: ${novel.mainCharacter}

CURRENT ARC:
Arc Title: ${arc.arcTitle}
Arc Goal: ${arc.arcGoal}
Arc Conflict: ${arc.arcConflict}
Emotional Shift: ${arc.emotionalShift}
Chapter Range: ${arc.startChapter}-${arc.endChapter}
Current Chapter: ${arc.currentChapter}

PREVIOUS CONTEXT:
${previousChapterSummary ? `Previous Chapter Summary: ${previousChapterSummary}` : 'This is the first chapter'}

MEMORY SUMMARY:
${memorySummary || 'Beginning of story'}

FOCUS ON:
- Power growth and progression
- Social hierarchy tension
- Public humiliation or victory
- Hidden ability reveal
- Emotional spikes every scene
- Escalation leading to dramatic climax

REQUIREMENTS FOR THIS CHAPTER (${arc.currentChapter}):
1. Create clear conflict escalation
2. Establish power dynamics
3. Set up emotional reactions
4. Plan for dramatic cliffhanger ending
5. Focus on character growth/progression
6. Build tension throughout

Output format:
Short bullet-point structure.
Minimal narration.
Event-driven format.

Return ONLY a JSON object with this exact structure:
{
  "chapterGoal": "string - what must be accomplished in this chapter",
  "coreConflict": "string - main conflict driving the chapter",
  "powerProgression": "string - how character abilities/social position change",
  "emotionalSpikes": ["string - moments designed to trigger strong emotions"],
  "sceneBreakdown": [
    {
      "sceneName": "string - brief scene title",
      "purpose": "string - what this scene accomplishes",
      "keyEvent": "string - main event in this scene"
    }
  ],
  "cliffhangerSetup": "string - how to end with dramatic tension"
}`;
  }

  parseIntentResponse(response) {
    try {
      const cleanResponse = response.trim();
      const jsonStart = cleanResponse.indexOf('{');
      const jsonEnd = cleanResponse.lastIndexOf('}') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No valid JSON object found in response');
      }
      
      const jsonString = cleanResponse.substring(jsonStart, jsonEnd);
      const intent = JSON.parse(jsonString);
      
      // Validate required fields
      const requiredFields = ['chapterGoal', 'coreConflict', 'powerProgression', 'emotionalSpikes', 'sceneBreakdown', 'cliffhangerSetup'];
      for (const field of requiredFields) {
        if (!intent[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }
      
      if (!Array.isArray(intent.emotionalSpikes)) {
        throw new Error('emotionalSpikes must be an array');
      }
      
      if (!Array.isArray(intent.sceneBreakdown)) {
        throw new Error('sceneBreakdown must be an array');
      }
      
      return intent;
    } catch (error) {
      logger.error('Failed to parse intent response', { error: error.message });
      throw new Error(`Invalid intent format: ${error.message}`);
    }
  }
}

module.exports = new IntentService();