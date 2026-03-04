const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a template name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    category: {
        type: String,
        trim: true,
        default: 'General'
    },
    type: {
        type: String,
        enum: ['informational', 'functional'],
        default: 'informational'
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    // Pages this template includes
    pages: [{
        name: { type: String, required: true },
        slug: { type: String, required: true },
        icon: { type: String },
        sections: [{ type: String }]
    }],
    // Which backend modules this template uses (e.g. ['product', 'order', 'contact'])
    modules: [{
        type: String,
        trim: true
    }],
    // Inline theme — no separate Theme model dependency
    theme: {
        primary: { type: String, default: '#3b82f6' },
        secondary: { type: String, default: '#64748b' },
        accent: { type: String, default: '#10b981' },
        background: { type: String, default: '#ffffff' },
        text: { type: String, default: '#0f172a' },
        font: { type: String, default: 'Inter, sans-serif' }
    },
    // Default content to seed when cloning (array of { page, section, data })
    defaultContent: [{
        page: { type: String, required: true },
        section: { type: String, required: true },
        data: { type: mongoose.Schema.Types.Mixed, default: {} },
        order: { type: Number, default: 0 }
    }],
    // Preview image URL for gallery
    previewImage: {
        type: String,
        default: ''
    },
    version: {
        type: Number,
        default: 1
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Performance indexes
templateSchema.index({ slug: 1 });
templateSchema.index({ isPublic: 1 });
templateSchema.index({ type: 1, isPublic: 1 });

module.exports = mongoose.model('Template', templateSchema);
