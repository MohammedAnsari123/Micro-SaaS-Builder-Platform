const mongoose = require('mongoose');

const webhookSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true
    },
    toolId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tool',
        required: true,
        index: true
    },
    collectionName: {
        type: String,
        required: true,
        trim: true
    },
    event: {
        type: String,
        required: true,
        enum: ['POST', 'PUT', 'DELETE'], // The CRUD operation that triggers the webhook
    },
    targetUrl: {
        type: String,
        required: true,
        trim: true
    },
    secret: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure a single URL isn't repeatedly trying to bind the same event on the same collection for a tenant
webhookSchema.index({ tenantId: 1, collectionName: 1, event: 1, targetUrl: 1 }, { unique: true });

// Performance index for rapid retrieval during dynamic route triggers
webhookSchema.index({ tenantId: 1, collectionName: 1, event: 1, isActive: 1 });

module.exports = mongoose.model('Webhook', webhookSchema);
