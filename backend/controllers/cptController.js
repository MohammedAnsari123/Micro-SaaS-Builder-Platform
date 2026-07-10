const CustomPostType = require('../models/CustomPostType');
const { getOrCompileModel } = require('../schema-engine/middleware');

// ============================================
// 1. CPT Definitions Management (Admin)
// ============================================

// @desc    Get all CPT definitions for a tenant
// @route   GET /api/v1/cpt/definitions
// @access  Private (Admin)
exports.getDefinitions = async (req, res, next) => {
    try {
        const definitions = await CustomPostType.find({ tenantId: req.tenantId }).lean();
        res.status(200).json({ success: true, count: definitions.length, data: definitions });
    } catch (err) {
        next(err);
    }
};

// @desc    Create a new CPT definition
// @route   POST /api/v1/cpt/definitions
// @access  Private (Admin)
exports.createDefinition = async (req, res, next) => {
    try {
        const { name, slug, fields } = req.body;

        if (!name || !slug || !fields || !Array.isArray(fields)) {
            return res.status(400).json({ success: false, message: 'Please provide name, slug, and fields array' });
        }

        const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_]/g, '');

        // Check if slug is a reserved name
        const reserved = ['user', 'tenant', 'template', 'content', 'order', 'booking', 'product', 'service', 'event'];
        if (reserved.includes(cleanSlug)) {
            return res.status(400).json({ success: false, message: `"${cleanSlug}" is a reserved system slug.` });
        }

        const existing = await CustomPostType.findOne({ tenantId: req.tenantId, slug: cleanSlug });
        if (existing) {
            return res.status(400).json({ success: false, message: `Custom Post Type with slug "${cleanSlug}" already exists.` });
        }

        const definition = await CustomPostType.create({
            tenantId: req.tenantId,
            name,
            slug: cleanSlug,
            fields
        });

        // Trigger dynamic compile instantly to cache it
        await getOrCompileModel(req.tenantId, cleanSlug);

        res.status(201).json({ success: true, data: definition });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a CPT definition
// @route   DELETE /api/v1/cpt/definitions/:id
// @access  Private (Admin)
exports.deleteDefinition = async (req, res, next) => {
    try {
        const definition = await CustomPostType.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
        if (!definition) {
            return res.status(404).json({ success: false, message: 'Custom Post Type not found' });
        }

        // Note: Dynamic mongoose models cannot easily be uncompiled from memory in Mongoose,
        // but removing the definition ensures it won't load on next server restart.
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

// ============================================
// 2. Dynamic CPT Entry CRUD (Requires bindDynamicModel)
// ============================================

// @desc    Get entries for a custom post type
// @route   GET /api/v1/cpt/entries/:cptSlug
// @access  Public / Private
exports.getEntries = async (req, res, next) => {
    try {
        const entries = await req.dynamicModel.find({ tenantId: req.tenantId || req.query.tenantId }).sort('-createdAt').lean();
        res.status(200).json({ success: true, count: entries.length, data: entries });
    } catch (err) {
        next(err);
    }
};

// @desc    Create a CPT entry
// @route   POST /api/v1/cpt/entries/:cptSlug
// @access  Private (Admin)
exports.createEntry = async (req, res, next) => {
    try {
        const record = await req.dynamicModel.create({
            ...req.body,
            tenantId: req.tenantId
        });
        res.status(201).json({ success: true, data: record });
    } catch (err) {
        next(err);
    }
};

// @desc    Update a CPT entry
// @route   PUT /api/v1/cpt/entries/:cptSlug/:id
// @access  Private (Admin)
exports.updateEntry = async (req, res, next) => {
    try {
        const record = await req.dynamicModel.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!record) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        res.status(200).json({ success: true, data: record });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a CPT entry
// @route   DELETE /api/v1/cpt/entries/:cptSlug/:id
// @access  Private (Admin)
exports.deleteEntry = async (req, res, next) => {
    try {
        const record = await req.dynamicModel.findOneAndDelete({
            _id: req.params.id,
            tenantId: req.tenantId
        });

        if (!record) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
