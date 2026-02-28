const Bull = require('bull');
const axios = require('axios');

// Connect to Redis
const redisOptions = {
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
    }
};

// 1. Webhook Queue
const webhookQueue = new Bull('webhook-dispatch', redisOptions);

webhookQueue.process(async (job) => {
    const { webhooks, event, collectionName, payload } = job.data;

    const deliveryPromises = webhooks.map(wh => {
        return axios.post(wh.targetUrl, {
            event,
            collection: collectionName,
            timestamp: new Date(),
            data: payload
        }, {
            headers: { 'x-webhook-secret': wh.secret || '' },
            timeout: 5000
        }).catch(err => {
            console.error(`Webhook background delivery to ${wh.targetUrl} failed:`, err.message);
            // Optionally, throw to trigger Bull retry mechanics
            // throw err; 
        });
    });

    await Promise.allSettled(deliveryPromises);
    return { success: true, delivered: webhooks.length };
});

// 2. AI Generation Queue 
const aiGenerationQueue = new Bull('ai-generation', redisOptions);

aiGenerationQueue.process(async (job) => {
    const { prompt } = job.data;

    try {
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

        // This can take 30+ seconds, but since it's in a background queue, the main Node thread is totally unblocked!
        const response = await axios.post(`${aiServiceUrl}/api/v1/generate`, { prompt }, { timeout: 120000 });

        return { success: true, data: response.data.data };
    } catch (err) {
        console.error("AI Generation Job Failed:", err.message);
        throw err; // Trigger Bull's failure state
    }
});

module.exports = {
    webhookQueue,
    aiGenerationQueue
};
