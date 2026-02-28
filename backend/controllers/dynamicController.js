const mongoose = require('mongoose');
const axios = require('axios');
const Webhook = require('../models/Webhook');
const redis = require('../config/redis');

const { webhookQueue } = require('../jobs/queue');

// Utility function to dispatch webhooks asynchronously via BullMQ
const triggerWebhooks = async (tenantId, collectionName, event, payload) => {
    try {
        const webhooks = await Webhook.find({ tenantId, collectionName, event, isActive: true });

        if (webhooks.length > 0) {
            // Push to background Bull queue instead of executing inline
            webhookQueue.add({
                webhooks,
                event,
                collectionName,
                payload
            }, {
                attempts: 3,
                backoff: { type: 'exponential', delay: 1000 } // Retry failed webhook deliveries 3 times
            });
        }
    } catch (err) {
        console.error('Error finding webhooks for queue:', err);
    }
};

// Utility to clear cache for a specific tenant's collection
const clearCollectionCache = async (tenantId, collectionName) => {
    try {
        if (redis.status === 'ready') {
            const pattern = `tenant:${tenantId}:col:${collectionName}:*`;
            const keys = await redis.keys(pattern);
            if (keys.length > 0) {
                await redis.del(keys);
            }
        }
    } catch (err) {
        console.error('Redis Cache Invalidation Error:', err.message);
    }
};

// @desc    Get all resources
// @route   GET /api/v1/dynamic/:collectionName
// @access  Private (Tenant isolated)
exports.getResources = async (req, res, next) => {
    try {
        const cacheKey = `tenant:${req.tenantId}:col:${req.params.collectionName}:list`;

        // Attempt to fetch from cache if Redis is ready
        if (redis.status === 'ready') {
            const cachedData = await redis.get(cacheKey);
            if (cachedData) {
                return res.status(200).json(JSON.parse(cachedData));
            }
        }

        const Model = req.dynamicModel;
        // Always enforce tenant isolation
        const docs = await Model.find({ tenantId: req.tenantId });

        const responseData = { success: true, count: docs.length, data: docs };

        // Save to cache for 60 seconds
        if (redis.status === 'ready') {
            await redis.setex(cacheKey, 60, JSON.stringify(responseData));
        }

        res.status(200).json(responseData);
    } catch (err) {
        next(err);
    }
};

// @desc    Get single resource
// @route   GET /api/v1/dynamic/:collectionName/:id
// @access  Private (Tenant isolated)
exports.getResource = async (req, res, next) => {
    try {
        const cacheKey = `tenant:${req.tenantId}:col:${req.params.collectionName}:id:${req.params.id}`;

        if (redis.status === 'ready') {
            const cachedData = await redis.get(cacheKey);
            if (cachedData) {
                return res.status(200).json(JSON.parse(cachedData));
            }
        }

        const Model = req.dynamicModel;
        const doc = await Model.findOne({ _id: req.params.id, tenantId: req.tenantId });

        if (!doc) {
            return res.status(404).json({ success: false, message: 'Resource not found' });
        }

        const responseData = { success: true, data: doc };

        if (redis.status === 'ready') {
            await redis.setex(cacheKey, 60, JSON.stringify(responseData));
        }

        res.status(200).json(responseData);
    } catch (err) {
        next(err);
    }
};

// @desc    Create resource
// @route   POST /api/v1/dynamic/:collectionName
// @access  Private (Tenant isolated)
exports.createResource = async (req, res, next) => {
    try {
        const Model = req.dynamicModel;

        // Force tenantId onto the body before creating
        req.body.tenantId = req.tenantId;

        const doc = await Model.create(req.body);

        // Invalidate Cache
        await clearCollectionCache(req.tenantId, req.params.collectionName);

        // Dispatch POST webhook
        triggerWebhooks(req.tenantId, req.params.collectionName, 'POST', doc);

        res.status(201).json({ success: true, data: doc });
    } catch (err) {
        // Catch mongoose validation errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        console.error('createResource Error:', err);
        if (typeof next === 'function') next(err);
        else res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

// @desc    Update resource
// @route   PUT /api/v1/dynamic/:collectionName/:id
// @access  Private (Tenant isolated)
exports.updateResource = async (req, res, next) => {
    try {
        const Model = req.dynamicModel;

        // Prevent overwriting tenantId
        delete req.body.tenantId;

        const doc = await Model.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!doc) {
            return res.status(404).json({ success: false, message: 'Resource not found' });
        }

        // Invalidate Cache
        await clearCollectionCache(req.tenantId, req.params.collectionName);

        // Dispatch PUT webhook
        triggerWebhooks(req.tenantId, req.params.collectionName, 'PUT', doc);

        res.status(200).json({ success: true, data: doc });
    } catch (err) {
        console.error('updateResource Error:', err);
        if (typeof next === 'function') next(err);
        else res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

// @desc    Delete resource
// @route   DELETE /api/v1/dynamic/:collectionName/:id
// @access  Private (Tenant isolated)
exports.deleteResource = async (req, res, next) => {
    try {
        const Model = req.dynamicModel;

        const doc = await Model.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });

        if (!doc) {
            return res.status(404).json({ success: false, message: 'Resource not found' });
        }

        // Invalidate Cache
        await clearCollectionCache(req.tenantId, req.params.collectionName);

        // Dispatch DELETE webhook
        triggerWebhooks(req.tenantId, req.params.collectionName, 'DELETE', doc);

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error('deleteResource Error:', err);
        if (typeof next === 'function') next(err);
        else res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
};
