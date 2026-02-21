const winston = require('winston');
const morgan = require('morgan');

// 1. Setup the raw Winston tool (The Utility part)
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console(),
  ],
});

// 2. Setup Morgan to use Winston (The Middleware part)
const requestLogger = morgan('dev', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});

// 3. Export BOTH.
// Export requestLogger for app.js to track HTTP traffic.
// Export the raw logger for your errorHandler to log manual crashes.
module.exports = { logger, requestLogger };
