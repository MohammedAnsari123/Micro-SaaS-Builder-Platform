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

    // Track if clone came from gallery or admin
    cloneSource: {
        type: String,
        enum: ['gallery', 'admin', 'import'],
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

    // Theme override for this specific clone
    theme: {
        primary: { type: String },
        secondary: { type: String },
        accent: { type: String },
        background: { type: String },
        text: { type: String },
        font: { type: String }
    },

    // Site-level settings for this specific clone
    siteSettings: {
        siteName: { type: String, default: '' },
        tagline: { type: String, default: '' },
        logo: { type: String, default: '' },
        favicon: { type: String, default: '' },
        socialLinks: {
            facebook: { type: String, default: '' },
            twitter: { type: String, default: '' },
            instagram: { type: String, default: '' },
            linkedin: { type: String, default: '' },
            github: { type: String, default: '' }
        }
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
