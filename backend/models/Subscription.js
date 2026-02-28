const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tenant',
        required: true,
        unique: true
    },
    plan: {
        type: String,
        enum: ['free', 'basic', 'pro'],
        default: 'free'
    },
    status: {
        type: String,
        enum: ['active', 'past_due', 'canceled', 'unpaid'],
        default: 'active'
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: {
        type: Boolean,
        default: false
    },
    usage: {
        apiCalls: {
            count: { type: Number, default: 0 },
            limit: { type: Number, default: 1000 } // Free tier limit
        },
        storage: {
            bytesUsed: { type: Number, default: 0 },
            limit: { type: Number, default: 50 * 1024 * 1024 } // 50MB free
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Reset API call count monthly
subscriptionSchema.methods.resetUsage = async function () {
    this.usage.apiCalls.count = 0;
    await this.save();
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
