const Content = require('../models/Content');
const redis = require('../config/redis');

// @desc    Get all content for a page (tenant-isolated)
// @route   GET /api/v1/content?page=home&cloneId=...
// @access  Private
exports.getPageContent = async (req, res, next) => {
    try {
        const { page, cloneId } = req.query;
        const filter = { tenantId: req.tenantId };
        if (page) filter.page = page.toLowerCase();
        if (cloneId) filter.cloneId = cloneId;

        const content = await Content.find(filter).sort('order').lean();
        res.status(200).json({ success: true, count: content.length, data: content });
    } catch (err) {
        next(err);
    }
};

// @desc    Get content for public site (no auth)
// @route   GET /api/v1/content/public/:tenantId/:cloneId?page=home
// @access  Public
exports.getPublicContent = async (req, res, next) => {
    try {
        const { tenantId, cloneId } = req.params;
        const { page } = req.query;
        const pageKey = page ? page.toLowerCase() : 'all';
        const cacheKey = `content:public:${tenantId}:${cloneId}:${pageKey}`;

        // Try getting from cache
        try {
            const cachedData = await redis.get(cacheKey);
            if (cachedData) {
                const content = JSON.parse(cachedData);
                return res.status(200).json({ success: true, count: content.length, data: content, cached: true });
            }
        } catch (cacheErr) {
            console.warn('Redis read error:', cacheErr.message);
        }

        const filter = { tenantId, cloneId };
        if (page) filter.page = page.toLowerCase();

        const content = await Content.find(filter).sort('order').lean();

        // Cache result in Redis (TTL: 1 hour)
        try {
            await redis.set(cacheKey, JSON.stringify(content), 'EX', 3600);
        } catch (cacheErr) {
            console.warn('Redis write error:', cacheErr.message);
        }

        res.status(200).json({ success: true, count: content.length, data: content });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all content for tenant (admin)
// @route   GET /api/v1/content/all?cloneId=...
// @access  Private
exports.getAllContent = async (req, res, next) => {
    try {
        const { cloneId } = req.query;
        const filter = { tenantId: req.tenantId };
        if (cloneId) filter.cloneId = cloneId;

        const content = await Content.find(filter).sort('page order').lean();
        res.status(200).json({ success: true, count: content.length, data: content });
    } catch (err) {
        next(err);
    }
};

// @desc    Create or update a content section
// @route   POST /api/v1/content
// @access  Private
exports.upsertContent = async (req, res, next) => {
    try {
        const { page, section, data, order, cloneId } = req.body;

        if (!cloneId) {
            return res.status(400).json({ success: false, message: 'cloneId is required' });
        }

        const content = await Content.findOneAndUpdate(
            { tenantId: req.tenantId, cloneId, page: page.toLowerCase(), section: section.toLowerCase() },
            { data, order: order || 0 },
            { new: true, upsert: true, runValidators: true }
        );

        // Invalidate Redis cache
        try {
            const pageKey = page.toLowerCase();
            await redis.del(`content:public:${req.tenantId}:${cloneId}:${pageKey}`);
            await redis.del(`content:public:${req.tenantId}:${cloneId}:all`);
        } catch (cacheErr) {
            console.warn('Redis delete error:', cacheErr.message);
        }

        res.status(200).json({ success: true, data: content });
    } catch (err) {
        next(err);
    }
};

// @desc    Update a content section by ID
// @route   PUT /api/v1/content/:id
// @access  Private
exports.updateContent = async (req, res, next) => {
    try {
        const { data, order } = req.body;

        const content = await Content.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            { data, ...(order !== undefined && { order }) },
            { new: true, runValidators: true }
        );

        if (!content) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }

        // Invalidate Redis cache
        try {
            const pageKey = content.page ? content.page.toLowerCase() : 'all';
            await redis.del(`content:public:${req.tenantId}:${content.cloneId}:${pageKey}`);
            await redis.del(`content:public:${req.tenantId}:${content.cloneId}:all`);
        } catch (cacheErr) {
            console.warn('Redis delete error:', cacheErr.message);
        }

        res.status(200).json({ success: true, data: content });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a content section
// @route   DELETE /api/v1/content/:id
// @access  Private
exports.deleteContent = async (req, res, next) => {
    try {
        const content = await Content.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });

        if (!content) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }

        // Invalidate Redis cache
        try {
            const pageKey = content.page ? content.page.toLowerCase() : 'all';
            await redis.del(`content:public:${req.tenantId}:${content.cloneId}:${pageKey}`);
            await redis.del(`content:public:${req.tenantId}:${content.cloneId}:all`);
        } catch (cacheErr) {
            console.warn('Redis delete error:', cacheErr.message);
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
