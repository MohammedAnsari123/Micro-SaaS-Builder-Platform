const { generateModel } = require('./generator');

// Middleware to bind the correct dynamic model to the request
const bindDynamicModel = (collectionName) => {
    return (req, res, next) => {
        try {
            if (!req.tenantId) {
                return res.status(401).json({ success: false, message: 'Tenant ID required for dynamic routes' });
            }

            // Check if schema exists for this tool/collection (Ideally fetch from Tool DB, but here we expect the model to be cached or we wait for generator)
            // For actual generation, the user hits a `/build` endpoint to generate, which calls `generateModel`.
            // The router will pass the name, and this middleware will fetch the compiled Mongoose model.

            // New Naming Convention: sanitizedEmail_tenantID_collectionName
            const sanitizeEmail = (email) => {
                if (!email) return 'default';
                return email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            };

            const sanitizedEmail = sanitizeEmail(req.user?.email);
            const modelName = `${sanitizedEmail}_${req.tenantId}_${collectionName}`;
            const mongoose = require('mongoose');

            let Model = mongoose.models[modelName];

            if (!Model) {
                return res.status(404).json({ success: false, message: `Resource table ${collectionName} not found or not built yet.` });
            }

            req.dynamicModel = Model;
            next();
        } catch (err) {
            next(err);
        }
    };
};

module.exports = { bindDynamicModel };
