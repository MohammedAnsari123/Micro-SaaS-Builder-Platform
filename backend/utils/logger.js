const winston = require('winston');
const path = require('path');

// Define format based on environment
const devFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
        ({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
                }`;
        }
    )
);

const prodFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Parseable by ELK, Datadog, etc.
);

// Create the logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: process.env.NODE_ENV === 'development' ? devFormat : prodFormat,
    defaultMeta: { service: 'saasforge-api' },
    transports: [
        // Always write to console
        new winston.transports.Console(),
        // Write all logs with level `error` and below to `error.log`
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/error.log'),
            level: 'error'
        }),
        // Write all logs with level `info` and below to `combined.log`
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/combined.log')
        }),
    ],
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

module.exports = logger;
