const mongoose = require('mongoose');

// Cache dynamically created models
const dynamicModels = {};

/**
 * Sanitize email to be safe for Mongoose model names
 * e.g., user@gmail.com -> user_gmail_com
 */
const sanitizeEmail = (email) => {
    if (!email) return 'default';
    return email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
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
 * @returns {Model} Mongoose Model
 */
const generateModel = (tenantId, collectionName, fields, indexes = [], email = '') => {
    // New Naming Convention: email_tenantID_collectionName
    const sanitizedEmail = sanitizeEmail(email);
    const modelName = `${sanitizedEmail}_${tenantId}_${collectionName}`;

    if (dynamicModels[modelName]) {
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
        // Avoid "OverwriteModelError" if model already exists
        if (mongoose.models[modelName]) {
            dynamicModels[modelName] = mongoose.models[modelName];
        } else {
            dynamicModels[modelName] = mongoose.model(modelName, dynamicSchema);
        }
        console.log(`[SchemaEngine] Compiled model: ${modelName}`);
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
