const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

class Logger {
  static getTimestamp() {
    return new Date().toISOString();
  }

  static logToFile(level, message, data = null) {
    const logEntry = {
      timestamp: this.getTimestamp(),
      level,
      message,
      data
    };
    
    const logFile = path.join(logDir, `${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
  }

  static info(message, data = null) {
    console.log(`[INFO] ${this.getTimestamp()}: ${message}`);
    this.logToFile('INFO', message, data);
  }

  static error(message, error = null) {
    console.error(`[ERROR] ${this.getTimestamp()}: ${message}`);
    this.logToFile('ERROR', message, error);
  }

  static warn(message, data = null) {
    console.warn(`[WARN] ${this.getTimestamp()}: ${message}`);
    this.logToFile('WARN', message, data);
  }

  static debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${this.getTimestamp()}: ${message}`);
    }
    this.logToFile('DEBUG', message, data);
  }
}

module.exports = Logger;