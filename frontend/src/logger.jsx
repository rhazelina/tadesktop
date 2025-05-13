
// // logger.js
// const logger = {
//     log: (message) => {
//     if (process.env.NODE_ENV !== "production") {
//     console.log(`[LOG] ${new Date().toISOString()}: ${message}`);
//     }
//     },
//     error: (message) => {
//     if (process.env.NODE_ENV !== "production") {
//     console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
//     }
//     },
//     warn: (message) => {
//     if (process.env.NODE_ENV !== "production") {
//     console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
//     }
//     },
//    };
//    export default logger;


// logger.js
import util from 'util';

// Configurable settings
const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
  TRACE: 'trace'
};

const DEFAULT_CONFIG = {
  logLevel: process.env.LOG_LEVEL || LOG_LEVELS.INFO,
  hideSensitiveData: true,
  maxStringLength: 500,
  maxObjectDepth: 4,
  redactFields: ['password', 'token', 'authorization', 'creditCard', 'apiKey']
};

class Logger {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.levelsPriority = {
      [LOG_LEVELS.ERROR]: 4,
      [LOG_LEVELS.WARN]: 3,
      [LOG_LEVELS.INFO]: 2,
      [LOG_LEVELS.DEBUG]: 1,
      [LOG_LEVELS.TRACE]: 0
    };
  }

  shouldLog(level) {
    return this.levelsPriority[level] >= this.levelsPriority[this.config.logLevel];
  }

  redactSensitiveData(data) {
    if (!this.config.hideSensitiveData) return data;
    
    const redact = (obj) => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      return Object.keys(obj).reduce((acc, key) => {
        const value = obj[key];
        
        if (this.config.redactFields.includes(key)) {
          acc[key] = '***REDACTED***';
        } else if (typeof value === 'object') {
          acc[key] = redact(value);
        } else {
          acc[key] = value;
        }
        
        return acc;
      }, Array.isArray(obj) ? [] : {});
    };
    
    return redact(data);
  }

  formatMessage(message, context) {
    try {
      const cleanedContext = this.redactSensitiveData(context);
      const truncatedMessage = message.length > this.config.maxStringLength 
        ? `${message.substring(0, this.config.maxStringLength)}...` 
        : message;
      
      return {
        timestamp: new Date().toISOString(),
        message: truncatedMessage,
        context: cleanedContext,
        pid: process.pid,
        hostname: process.env.HOSTNAME || require('os').hostname(),
        env: process.env.NODE_ENV || 'development'
      };
    } catch (error) {
      return {
        timestamp: new Date().toISOString(),
        message: 'Failed to format log message',
        error: this.redactSensitiveData({
          name: error.name,
          message: error.message
        })
      };
    }
  }

  writeLog(level, message, context = {}) {
    if (!this.shouldLog(level)) return;

    const logEntry = this.formatMessage(message, context);
    
    // Console output (pretty in dev, JSON in prod)
    if (process.env.NODE_ENV !== 'production') {
      console[level](`[${level.toUpperCase()}] ${logEntry.timestamp} - ${logEntry.message}`, 
        util.inspect(logEntry.context, {
          colors: true,
          depth: this.config.maxObjectDepth,
          compact: false
        })
      );
    } else {
      console.log(JSON.stringify({ level, ...logEntry }));
    }
    

    // this.sendToExternalService(level, logEntry);
  }

  error(message, error = {}, context = {}) {
    const errorContext = {
      ...context,
      error: {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: this.config.logLevel === LOG_LEVELS.DEBUG ? error.stack : undefined
      }
    };
    
    this.writeLog(LOG_LEVELS.ERROR, message, errorContext);
  }

  warn(message, context = {}) {
    this.writeLog(LOG_LEVELS.WARN, message, context);
  }

  info(message, context = {}) {
    this.writeLog(LOG_LEVELS.INFO, message, context);
  }

  debug(message, context = {}) {
    this.writeLog(LOG_LEVELS.DEBUG, message, context);
  }

  trace(message, context = {}) {
    this.writeLog(LOG_LEVELS.TRACE, message, context);
  }

  // For request logging middleware ( Rawan INTRUPT )
  createRequestLogger() {
    return (req, res, next) => {
      const startTime = process.hrtime();
      
      res.on('finish', () => {
        const duration = process.hrtime(startTime);
        const durationMs = (duration[0] * 1e3 + duration[1] * 1e-6).toFixed(2);
        
        const requestLog = {
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode,
          duration: `${durationMs}ms`,
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          // headers nya biarin siapa tau dia bawa data sensitif
          headers: this.redactSensitiveData(req.headers)
        };
        
        if (res.statusCode >= 500) {
          this.error(`${req.method} ${req.originalUrl}`, {}, requestLog);
        } else if (res.statusCode >= 400) {
          this.warn(`${req.method} ${req.originalUrl}`, requestLog);
        } else {
          this.info(`${req.method} ${req.originalUrl}`, requestLog);
        }
      });
      
      next();
    };
  }
}

// Singleton instance
const loggerInstance = new Logger();
export default loggerInstance;