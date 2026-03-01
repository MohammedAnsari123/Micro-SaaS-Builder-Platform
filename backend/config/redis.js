const Redis = require('ioredis');

// Mock Redis for environments without a running Redis server
let redis;
try {
    redis = new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        maxRetriesPerRequest: 0, // Fail fast
        retryStrategy() { return null; } // Don't retry
    });

    redis.on('error', (err) => {
        console.warn(`Redis not available (Mock mode active): ${err.message}`);
    });
} catch (e) {
    console.warn('Redis initialization skipped.');
    redis = { on: () => { }, get: () => null, set: () => null };
}

module.exports = redis;
