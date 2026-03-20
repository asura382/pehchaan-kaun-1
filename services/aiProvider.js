const axios = require('axios');
const retry = require('../utils/retry');
const logger = require('../utils/logger');

class AIProvider {
  constructor() {
    this.baseUrl = 'http://localhost:11434/api/generate';
    this.timeout = 4500000; // Increased timeout for better processing
  }

  // Qwen2.5 7B - Primary Engine Brain for structure, intent, and scene generation
  async generateStructure(prompt) {
    try {
      const response = await retry(async () => {
        const result = await axios.post(this.baseUrl, {
          model: 'qwen2.5:7b',
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.85,
            top_p: 0.9,
            num_predict: 800 // Appropriate for structure generation
          }
        }, {
          timeout: this.timeout
        });
        
        return result;
      }, 3, 1000, 'qwen2.5:7b structure generation');
      
      logger.info('Structure generation completed with qwen2.5:7b');
      return response.data.response;
    } catch (error) {
      logger.error('Failed to generate structure with qwen2.5:7b', { error: error.message });
      throw new Error(`Structure generation failed: ${error.message}`);
    }
  }

  // Qwen2.5 7B - For scene generation and first-pass prose
  async generateScene(prompt) {
    try {
      const response = await retry(async () => {
        const result = await axios.post(this.baseUrl, {
          model: 'qwen2.5:7b',
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.85,
            top_p: 0.9,
            num_predict: 2600 // Increased for full chapter length (2000-2500 words)
          }
        }, {
          timeout: this.timeout
        });
        
        return result;
      }, 3, 1000, 'qwen2.5:7b scene generation');
      
      logger.info('Scene generation completed with qwen2.5:7b');
      return response.data.response;
    } catch (error) {
      logger.error('Failed to generate scene with qwen2.5:7b', { error: error.message });
      throw new Error(`Scene generation failed: ${error.message}`);
    }
  }

  // Llama 3 8B - Emotional Enhancer Layer for intensifying key scenes
  async enhanceEmotion(prompt) {
    try {
      const response = await retry(async () => {
        const result = await axios.post(this.baseUrl, {
          model: 'llama3:8b',
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.8,
            top_p: 0.9,
            num_predict: 500 // Keep enhancement focused
          }
        }, {
          timeout: this.timeout
        });
        
        return result;
      }, 3, 1000, 'llama3 emotion enhancement');
      
      logger.info('Emotional enhancement completed with llama3');
      return response.data.response;
    } catch (error) {
      logger.warn('Emotional enhancement failed, continuing with original content', { error: error.message });
      // Return original content if enhancement fails to maintain functionality
      return prompt; // In case of failure, return original prompt as fallback
    }
  }
}

module.exports = new AIProvider();
