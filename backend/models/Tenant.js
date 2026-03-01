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
    enabledTools: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Tool'
    }],
    subscriptionPlan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free'
    },
    themeId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Theme'
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
