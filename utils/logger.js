const fs = require('fs-extra');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDir();
  }

  async ensureLogDir() {
    try {
      await fs.ensureDir(this.logDir);
    } catch (error) {
      console.error('Failed to create log directory:', error);
    }
  }

  formatMessage(level, message, meta = {}) {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta
    };
  }

  async writeToFile(level, message, meta = {}) {
    try {
      const logEntry = this.formatMessage(level, message, meta);
      const logFile = path.join(this.logDir, `${new Date().toISOString().split('T')[0]}.log`);
      await fs.appendFile(logFile, JSON.stringify(logEntry) + '\n');
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }

  info(message, meta = {}) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
    this.writeToFile('info', message, meta);
  }

  error(message, meta = {}) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
    this.writeToFile('error', message, meta);
  }

  warn(message, meta = {}) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
    this.writeToFile('warn', message, meta);
  }

  debug(message, meta = {}) {
    console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`);
    this.writeToFile('debug', message, meta);
  }
}

module.exports = new Logger();