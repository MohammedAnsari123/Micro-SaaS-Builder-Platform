const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a tenant name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    domain: {
        type: String,
        unique: true,
        sparse: true
    },
    plan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // Marketplace Monetization
    earningsBalance: {
        type: Number,
        default: 0 // In cents
    },
    clonedTools: [{
        toolId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tool'
        },
        purchasedAt: {
            type: Date,
            default: Date.now
        },
        pricePaid: {
            type: Number,
            default: 0
        }
    }],
    // White-Label Branding
    branding: {
        logoUrl: { type: String, trim: true, default: '' },
        primaryColor: { type: String, trim: true, default: '#3b82f6' }, // blue-500
        accentColor: { type: String, trim: true, default: '#10b981' }   // emerald-500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Tenant', tenantSchema);
