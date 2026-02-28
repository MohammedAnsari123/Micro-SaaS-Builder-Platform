const express = require('express');
const { protect } = require('../middlewares/auth');
const { enforceUsageLimits } = require('../middlewares/usage');
const { trackAnalytics } = require('../middlewares/analytics');
const mongoose = require('mongoose');

// Import controller methods
const {
    getResources,
    getResource,
    createResource,
    updateResource,
    deleteResource
} = require('../controllers/dynamicController');

// We use mergeParams so we can mount this router dynamically.
// Note: router handles paths like /api/v1/dynamic/:collectionName
const router = express.Router({ mergeParams: true });

// We need a custom middleware here because router params can't be used easily in standard middleware definitions at mount time.
const loadDynamicModel = (req, res, next) => {
    const collectionName = req.params.collectionName;
    if (!collectionName) {
        return res.status(400).json({ success: false, message: 'Collection name is required' });
    }

    // New Naming Convention: sanitizedEmail_tenantID_collectionName
    const sanitizeEmail = (email) => {
        if (!email) return 'default';
        return email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    };

    const sanitizedEmail = sanitizeEmail(req.user?.email);
    const modelName = `${sanitizedEmail}_${req.tenantId}_${collectionName}`;
    let Model = mongoose.models[modelName];

    if (!Model) {
        // Automatically initialize a loose-schema model if it doesn't exist.
        // This ensures the frontend doesn't 404 on new or empty collections.
        const dynamicSchema = new mongoose.Schema({
            tenantId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tenant',
                required: true,
                index: true
            }
        }, {
            timestamps: true,
            strict: false // Allow any other fields to be saved
        });

        // Add index on tenantId for isolation
        dynamicSchema.index({ tenantId: 1 });

        try {
            Model = mongoose.model(modelName, dynamicSchema);
            console.log(`Initialized dynamic model: ${modelName}`);
        } catch (err) {
            // Handle race condition if model was created between check and create
            if (err.name === 'OverwriteModelError') {
                Model = mongoose.models[modelName];
            } else {
                return res.status(500).json({ success: false, message: `Error creating resource ${collectionName}` });
            }
        }
    }

    req.dynamicModel = Model;
    next();
};

// @desc    Get all resources
// @route   GET /api/v1/dynamic/:collectionName
// @access  Private (Tenant isolated)
router.get('/', protect, enforceUsageLimits, trackAnalytics, loadDynamicModel, getResources);

// @desc    Get single resource
// @route   GET /api/v1/dynamic/:collectionName/:id
// @access  Private (Tenant isolated)
router.get('/:id', protect, enforceUsageLimits, trackAnalytics, loadDynamicModel, getResource);

// @desc    Create resource
// @route   POST /api/v1/dynamic/:collectionName
// @access  Private (Tenant isolated)
router.post('/', protect, enforceUsageLimits, trackAnalytics, loadDynamicModel, createResource);

// @desc    Update resource
// @route   PUT /api/v1/dynamic/:collectionName/:id
// @access  Private (Tenant isolated)
router.put('/:id', protect, enforceUsageLimits, trackAnalytics, loadDynamicModel, updateResource);

// @desc    Delete resource
// @route   DELETE /api/v1/dynamic/:collectionName/:id
// @access  Private (Tenant isolated)
router.delete('/:id', protect, enforceUsageLimits, trackAnalytics, loadDynamicModel, deleteResource);

module.exports = router;
