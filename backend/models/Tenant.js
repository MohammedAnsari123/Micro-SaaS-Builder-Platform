const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a tenant name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    ownerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false
    },
    templateId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Template',
        required: false
    },
    // Tenant can override template theme
    theme: {
        primary: { type: String, default: '#3b82f6' },
        secondary: { type: String, default: '#64748b' },
        accent: { type: String, default: '#10b981' },
        background: { type: String, default: '#ffffff' },
        text: { type: String, default: '#0f172a' },
        font: { type: String, default: 'Inter, sans-serif' }
    },
    // Site-level settings
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
    enabledTools: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Tool'
    }],
    subscriptionPlan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free'
    },
    isActive: {
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

module.exports = mongoose.model('Tenant', tenantSchema);
