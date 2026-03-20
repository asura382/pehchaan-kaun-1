const logger = require('./logger');

async function retry(fn, retries = 3, delay = 1000, context = '') {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      logger.warn(`Attempt ${attempt} failed for ${context}:`, { error: error.message });
      
      if (attempt === retries) {
        logger.error(`All ${retries} attempts failed for ${context}`, { error: error.message });
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
}

module.exports = retry;