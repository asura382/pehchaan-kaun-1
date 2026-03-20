const fs = require('fs-extra');
const path = require('path');
const aiProvider = require('./aiProvider');
const logger = require('../utils/logger');

class MemoryService {
  constructor() {
    this.memoryDir = path.join(__dirname, '../data/memory');
    this.maxMemoryTokens = 1200;
  }

  async initializeMemory(novelId) {
    try {
      const memoryFile = path.join(this.memoryDir, `${novelId}.json`);
      const initialMemory = {
        novelId,
        summary: '',
        keyEvents: [],
        characterDevelopment: [],
        worldState: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await fs.writeJson(memoryFile, initialMemory, { spaces: 2 });
      logger.info(`Initialized memory for novel ${novelId}`);
      return initialMemory;
    } catch (error) {
      logger.error(`Failed to initialize memory for novel ${novelId}`, { error: error.message });
      throw new Error(`Memory initialization failed: ${error.message}`);
    }
  }

  async getMemory(novelId) {
    try {
      const memoryFile = path.join(this.memoryDir, `${novelId}.json`);
      if (!(await fs.pathExists(memoryFile))) {
        return await this.initializeMemory(novelId);
      }
      return await fs.readJson(memoryFile);
    } catch (error) {
      logger.error(`Failed to read memory for novel ${novelId}`, { error: error.message });
      throw new Error(`Failed to retrieve memory: ${error.message}`);
    }
  }

  async updateMemory(novelId, chapterContent, chapterNumber) {
    try {
      const memory = await this.getMemory(novelId);
      
      // Add new events from this chapter
      const newEvent = {
        chapter: chapterNumber,
        content: this.extractKeyPoints(chapterContent),
        timestamp: new Date().toISOString()
      };
      
      memory.keyEvents.push(newEvent);
      
      // Compress memory if it's getting too large
      if (this.shouldCompressMemory(memory)) {
        await this.compressMemory(novelId, memory);
      } else {
        // Update summary with new information
        memory.summary = await this.updateSummary(memory, chapterContent);
      }
      
      memory.updatedAt = new Date().toISOString();
      await this.saveMemory(novelId, memory);
      
      logger.info(`Updated memory for novel ${novelId} - Chapter ${chapterNumber}`);
      return memory;
    } catch (error) {
      logger.error(`Failed to update memory for novel ${novelId}`, { error: error.message });
      throw new Error(`Memory update failed: ${error.message}`);
    }
  }

  extractKeyPoints(content) {
    // Extract key points (simplified - in production, use NLP)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.slice(0, 3).join('. ') + '.';
  }

  shouldCompressMemory(memory) {
    // Simple token estimation (characters / 4)
    const estimatedTokens = JSON.stringify(memory).length / 4;
    return estimatedTokens > this.maxMemoryTokens;
  }

  async compressMemory(novelId, memory) {
    try {
      const compressionPrompt = this.createCompressionPrompt(memory);
      const compressedSummary = await aiProvider.generateStructure(compressionPrompt);
      
      // Create new compressed memory
      const compressedMemory = {
        novelId,
        summary: compressedSummary,
        keyEvents: [memory.keyEvents[memory.keyEvents.length - 1]], // Keep only the latest event
        characterDevelopment: memory.characterDevelopment,
        worldState: memory.worldState,
        createdAt: memory.createdAt,
        updatedAt: new Date().toISOString(),
        compressedAt: new Date().toISOString()
      };
      
      await this.saveMemory(novelId, compressedMemory);
      logger.info(`Compressed memory for novel ${novelId}`);
      return compressedMemory;
    } catch (error) {
      logger.error(`Failed to compress memory for novel ${novelId}`, { error: error.message });
      throw new Error(`Memory compression failed: ${error.message}`);
    }
  }

  createCompressionPrompt(memory) {
    return `Compress the following novel memory into a concise summary under 1200 tokens.
    
Current Memory Summary:
${memory.summary}

Recent Key Events:
${memory.keyEvents.slice(-3).map(event => `Chapter ${event.chapter}: ${event.content}`).join('\n')}

Requirements:
1. Preserve essential plot points and character developments
2. Maintain continuity of important story elements
3. Keep it concise but comprehensive
4. Focus on what's crucial for future chapters
5. Remove redundant or less important details

Return only the compressed summary text.`;
  }

  async updateSummary(memory, newContent) {
    try {
      const summaryPrompt = `Update the following novel summary with new information:
      
Current Summary:
${memory.summary}

New Chapter Content:
${newContent.substring(0, 1000)}...

Instructions:
1. Integrate the new information naturally
2. Maintain existing important details
3. Keep the summary focused and coherent
4. Update character states and plot points as needed

Return only the updated summary text.`;
      
      return await aiProvider.generateStructure(summaryPrompt);
    } catch (error) {
      logger.error('Failed to update summary', { error: error.message });
      return memory.summary; // Return existing summary if update fails
    }
  }

  async saveMemory(novelId, memory) {
    try {
      const memoryFile = path.join(this.memoryDir, `${novelId}.json`);
      await fs.writeJson(memoryFile, memory, { spaces: 2 });
    } catch (error) {
      logger.error(`Failed to save memory for novel ${novelId}`, { error: error.message });
      throw error;
    }
  }

  async getMemorySummary(novelId) {
    try {
      const memory = await this.getMemory(novelId);
      return memory.summary;
    } catch (error) {
      logger.error(`Failed to get memory summary for novel ${novelId}`, { error: error.message });
      return '';
    }
  }
}

module.exports = new MemoryService();