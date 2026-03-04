const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true
    },
    cloneId: {
        type: mongoose.Schema.ObjectId,
        ref: 'TemplateClone',
        required: false, // Optional for now to maintain compatibility with legacy data
        index: true
    },
    page: {
        type: String,
        required: [true, 'Page name is required'],
        trim: true,
        lowercase: true
    },
    section: {
        type: String,
        required: [true, 'Section name is required'],
        trim: true,
        lowercase: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Compound index for fast page content lookups
contentSchema.index({ tenantId: 1, cloneId: 1, page: 1, section: 1 }, { unique: true });
contentSchema.index({ tenantId: 1, cloneId: 1, page: 1, order: 1 });

module.exports = mongoose.model('Content', contentSchema);
