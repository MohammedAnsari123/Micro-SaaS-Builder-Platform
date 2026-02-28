const Redis = require('ioredis');

const redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    retryStrategy(times) {
        if (times >= 1) {
            return null;
        }
        return Math.min(times * 50, 2000);
    }
});

redis.on('connect', () => {
    console.log('Redis Connected');
});

redis.on('error', (err) => {
    console.error(`Error connecting to Redis: ${err.message}`);
});

module.exports = redis;
