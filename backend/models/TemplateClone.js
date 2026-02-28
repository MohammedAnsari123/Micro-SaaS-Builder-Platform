const mongoose = require('mongoose');

const templateCloneSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true
    },
    templateId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Template',
        required: true
    },
    toolId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tool',
        required: true
    },

    // Version of template at clone time
    templateVersion: {
        type: Number,
        default: 1
    },

    // Marketplace attribution
    creatorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tenant',
        default: null
    },

    // Track if clone came from AI or gallery
    cloneSource: {
        type: String,
        enum: ['gallery', 'ai-generated', 'admin', 'import'],
        default: 'gallery'
    },

    // Lifecycle state
    status: {
        type: String,
        enum: ['active', 'archived', 'deleted'],
        default: 'active'
    },

    // Snapshot metadata (optional but powerful)
    templateSnapshotName: {
        type: String
    },

    clonedAt: {
        type: Date,
        default: Date.now
    },

    archivedAt: {
        type: Date
    }
});

// Compound index: quick lookup of all clones by a tenant
templateCloneSchema.index({ tenantId: 1, clonedAt: -1 });

// Prevent same tenant from cloning same template twice
templateCloneSchema.index(
    { tenantId: 1, templateId: 1 },
    { unique: true }
);

module.exports = mongoose.model('TemplateClone', templateCloneSchema);
