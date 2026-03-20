const fs = require('fs-extra');
const path = require('path');
const aiProvider = require('./aiProvider');
const logger = require('../utils/logger');

class ArcService {
  constructor() {
    this.arcsDir = path.join(__dirname, '../data/arcs');
  }

  async generateArcs(novel) {
    try {
      const arcCount = this.determineArcCount(novel.totalChapters);
      const arcsPrompt = this.createArcsPrompt(novel, arcCount);
      
      const arcsResponse = await aiProvider.generateStructure(arcsPrompt);
      const arcs = this.parseArcsResponse(arcsResponse, novel.totalChapters, arcCount);
      
      await this.saveArcs(novel.id, arcs);
      
      logger.info(`Generated ${arcs.length} arcs for novel ${novel.id}`);
      return arcs;
    } catch (error) {
      logger.error(`Failed to generate arcs for novel ${novel.id}`, { error: error.message });
      throw new Error(`Arc generation failed: ${error.message}`);
    }
  }

  determineArcCount(totalChapters) {
    if (totalChapters <= 15) return 3;
    if (totalChapters <= 30) return 4;
    if (totalChapters <= 50) return 5;
    return 6;
  }

  createArcsPrompt(novel, arcCount) {
    return `Create ${arcCount} compelling story arcs for a ${novel.genre} novel with theme "${novel.theme}".
    
Novel Details:
- Title: ${novel.title}
- Theme: ${novel.theme}
- Genre: ${novel.genre}
- Tone: ${novel.tone}
- Total Chapters: ${novel.totalChapters}
- Main Character: ${novel.mainCharacter}
- World Rules: ${novel.worldRules}

Requirements:
1. Divide ${novel.totalChapters} chapters into ${arcCount} logical arcs
2. Each arc should have clear progression
3. Include emotional shifts and character development
4. Create compelling conflicts and goals
5. End with satisfying resolutions

Return ONLY a JSON array with this exact structure:
[
  {
    "arcTitle": "string",
    "arcGoal": "string",
    "arcConflict": "string",
    "emotionalShift": "string",
    "startChapter": number,
    "endChapter": number
  }
]`;
  }

  parseArcsResponse(response, totalChapters, arcCount) {
    try {
      const cleanResponse = response.trim();
      const jsonStart = cleanResponse.indexOf('[');
      const jsonEnd = cleanResponse.lastIndexOf(']') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No valid JSON array found in response');
      }
      
      const jsonArray = cleanResponse.substring(jsonStart, jsonEnd);
      const arcs = JSON.parse(jsonArray);
      
      if (!Array.isArray(arcs) || arcs.length !== arcCount) {
        throw new Error(`Expected ${arcCount} arcs, got ${arcs.length}`);
      }
      
      // Validate and assign chapter ranges
      let currentChapter = 1;
      const chaptersPerArc = Math.floor(totalChapters / arcCount);
      const remainder = totalChapters % arcCount;
      
      return arcs.map((arc, index) => {
        const extraChapter = index < remainder ? 1 : 0;
        const startChapter = currentChapter;
        const endChapter = startChapter + chaptersPerArc + extraChapter - 1;
        
        currentChapter = endChapter + 1;
        
        return {
          ...arc,
          startChapter,
          endChapter,
          currentChapter: startChapter,
          completed: false
        };
      });
    } catch (error) {
      logger.error('Failed to parse arcs response', { error: error.message });
      throw new Error(`Invalid arcs format: ${error.message}`);
    }
  }

  async saveArcs(novelId, arcs) {
    try {
      const arcsFile = path.join(this.arcsDir, `${novelId}.json`);
      await fs.writeJson(arcsFile, arcs, { spaces: 2 });
    } catch (error) {
      logger.error(`Failed to save arcs for novel ${novelId}`, { error: error.message });
      throw error;
    }
  }

  async getArcs(novelId) {
    try {
      const arcsFile = path.join(this.arcsDir, `${novelId}.json`);
      if (!(await fs.pathExists(arcsFile))) {
        return [];
      }
      return await fs.readJson(arcsFile);
    } catch (error) {
      logger.error(`Failed to read arcs for novel ${novelId}`, { error: error.message });
      throw new Error(`Failed to retrieve arcs: ${error.message}`);
    }
  }

  async getCurrentArc(novelId, chapterNumber) {
    try {
      const arcs = await this.getArcs(novelId);
      const currentArc = arcs.find(arc => 
        chapterNumber >= arc.startChapter && chapterNumber <= arc.endChapter
      );
      
      if (!currentArc) {
        throw new Error(`No arc found for chapter ${chapterNumber}`);
      }
      
      return currentArc;
    } catch (error) {
      logger.error(`Failed to get current arc for novel ${novelId}`, { error: error.message });
      throw error;
    }
  }

  async updateArcProgress(novelId, chapterNumber) {
    try {
      const arcs = await this.getArcs(novelId);
      const arcIndex = arcs.findIndex(arc => 
        chapterNumber >= arc.startChapter && chapterNumber <= arc.endChapter
      );
      
      if (arcIndex === -1) {
        throw new Error(`No arc found for chapter ${chapterNumber}`);
      }
      
      arcs[arcIndex] = {
        ...arcs[arcIndex],
        currentChapter: chapterNumber,
        completed: chapterNumber >= arcs[arcIndex].endChapter
      };
      
      await this.saveArcs(novelId, arcs);
      return arcs[arcIndex];
    } catch (error) {
      logger.error(`Failed to update arc progress for novel ${novelId}`, { error: error.message });
      throw error;
    }
  }
}

module.exports = new ArcService();