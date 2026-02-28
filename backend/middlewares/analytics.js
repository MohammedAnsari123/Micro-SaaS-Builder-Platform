const logger = require('../utils/logger');

const trackAnalytics = (req, res, next) => {
    const start = Date.now();

    // Listen for the response to finish
    res.on('finish', () => {
        const responseTime = Date.now() - start;

        // Log the request details if it's an API call
        if (req.originalUrl.startsWith('/api/v1')) {
            logger.info(`API Request: [${req.method}] ${req.originalUrl} - Status: ${res.statusCode} - Time: ${responseTime}ms`);
        }
    });

    next();
};

module.exports = { trackAnalytics };
