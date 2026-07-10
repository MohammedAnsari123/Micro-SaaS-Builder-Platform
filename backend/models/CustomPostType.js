const mongoose = require('mongoose');

const customPostTypeSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    fields: [{
        name: { type: String, required: true },
        type: { type: String, required: true, enum: ['string', 'number', 'boolean', 'date', 'richtext'] },
        required: { type: Boolean, default: false }
    }]
}, { timestamps: true });

customPostTypeSchema.index({ tenantId: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('CustomPostType', customPostTypeSchema);
