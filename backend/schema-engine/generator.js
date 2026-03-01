const mongoose = require('mongoose');

// Cache dynamically created models
const dynamicModels = {};

/**
 * Sanitize email to be safe for Mongoose model names
 * e.g., user@gmail.com -> user_gmail_com
 */
const sanitizeEmail = (email) => {
    if (!email) return 'default';
    return email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
};

// Helper to map string types to Mongoose types
const getType = (typeString) => {
    switch (typeString.toLowerCase()) {
        case 'string': return String;
        case 'number': return Number;
        case 'boolean': return Boolean;
        case 'date': return Date;
        case 'objectid': return mongoose.Schema.Types.ObjectId;
        default: return String;
    }
};

/**
 * Generate a Mongoose Model dynamically from a schema definition.
 * 
 * @param {string} tenantId - The ID of the tenant
 * @param {string} collectionName - Base name of the collection (e.g., 'products')
 * @param {Array} fields - Array of field definitions { name, type, required, unique }
 * @param {Array} indexes - Array of field names to index
 * @param {string} email - The email of the tenant owner for naming convention
 * @param {mongoose.Connection} tenantConnection - Optional tenant-specific DB connection
 * @returns {Model} Mongoose Model
 */
const generateModel = (tenantId, collectionName, fields, indexes = [], email = '', tenantConnection = null) => {
    // New naming: If tenant connection is provided, collection is isolated so we just use collectionName.
    // If fallback global connection is used, use the sanitized email prefix to avoid collisions.
    let modelName = collectionName;
    if (!tenantConnection) {
        const sanitizedEmail = sanitizeEmail(email);
        modelName = `${sanitizedEmail}_${collectionName}`;
    }

    if (dynamicModels[modelName] && !tenantConnection) {
        // Only return cached model if using global connection (tenant connections are cached differently)
        return dynamicModels[modelName];
    }

    const schemaDefinition = {
        // Force tenantId on all dynamic schemas for isolation
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tenant',
            required: true,
            index: true
        }
    };

    fields.forEach(field => {
        schemaDefinition[field.name] = {
            type: getType(field.type),
            required: field.required || false,
            unique: field.unique || false
        };
    });

    const dynamicSchema = new mongoose.Schema(schemaDefinition, { timestamps: true });

    // Add custom indexes
    if (indexes && indexes.length > 0) {
        indexes.forEach(indexField => {
            dynamicSchema.index({ tenantId: 1, [indexField]: 1 });
        });
    }

    // Compile model
    try {
        if (tenantConnection) {
            // Check if model exists on the tenant connection
            if (tenantConnection.models[modelName]) {
                return tenantConnection.models[modelName];
            } else {
                const model = tenantConnection.model(modelName, dynamicSchema);
                console.log(`[SchemaEngine] Compiled model ${modelName} on Tenant DB`);
                return model;
            }
        } else {
            // Avoid "OverwriteModelError" if model already exists on global connection
            if (mongoose.models[modelName]) {
                dynamicModels[modelName] = mongoose.models[modelName];
            } else {
                dynamicModels[modelName] = mongoose.model(modelName, dynamicSchema);
            }
            console.log(`[SchemaEngine] Compiled model: ${modelName} on Global DB`);
        }
    } catch (err) {
        console.error(`Error compiling dynamic model ${modelName}:`, err);
        throw err;
    }

    return dynamicModels[modelName];
};

module.exports = {
    generateModel,
    dynamicModels
};
