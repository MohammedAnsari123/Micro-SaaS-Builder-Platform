const mongoose = require('mongoose');
const { generateModel } = require('./generator');
const CustomPostType = require('../models/CustomPostType');
const Tenant = require('../models/Tenant');
const User = require('../models/User');

/**
 * Retrieve compiled model or compile dynamically from saved definition.
 */
const getOrCompileModel = async (tenantId, collectionName) => {
    const tenant = await Tenant.findById(tenantId).lean();
    if (!tenant) return null;

    const owner = await User.findById(tenant.ownerId).lean();
    if (!owner) return null;

    const sanitizeEmail = (email) => {
        if (!email) return 'default';
        return email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    };

    const sanitizedEmail = sanitizeEmail(owner.email);
    const modelName = `${sanitizedEmail}_${collectionName.toLowerCase()}`;

    // Return cached compiled model if it exists
    if (mongoose.models[modelName]) {
        return mongoose.models[modelName];
    }

    // Load schema from db
    const definition = await CustomPostType.findOne({
        tenantId,
        slug: collectionName.toLowerCase()
    }).lean();

    if (!definition) return null;

    // Convert custom types (like richtext) to mongoose native types
    const fields = definition.fields.map(f => ({
        name: f.name,
        type: f.type === 'richtext' ? 'string' : f.type,
        required: f.required
    }));

    return generateModel(tenantId, collectionName.toLowerCase(), fields, [], owner.email);
};

// Middleware to bind the correct dynamic model to the request (Admin Auth routes)
const bindDynamicModel = (collectionNameParam) => {
    return async (req, res, next) => {
        try {
            const tenantId = req.tenantId;
            const collectionName = req.params[collectionNameParam] || collectionNameParam;

            if (!tenantId) {
                return res.status(401).json({ success: false, message: 'Tenant ID required for dynamic routes' });
            }

            const Model = await getOrCompileModel(tenantId, collectionName);

            if (!Model) {
                return res.status(404).json({ success: false, message: `Resource table "${collectionName}" not found or not built yet.` });
            }

            req.dynamicModel = Model;
            next();
        } catch (err) {
            next(err);
        }
    };
};

module.exports = { bindDynamicModel, getOrCompileModel };
