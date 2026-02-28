const Subscription = require('../models/Subscription');

// Middleware to track and limit API calls per tenant
const enforceUsageLimits = async (req, res, next) => {
    try {
        if (!req.tenantId) {
            return res.status(401).json({ success: false, message: 'Tenant context missing.' });
        }

        // Find subscription for this tenant
        let sub = await Subscription.findOne({ tenantId: req.tenantId });

        // If no sub found (e.g., legacy tenant), create a default free tier
        if (!sub) {
            sub = await Subscription.create({ tenantId: req.tenantId });
        }

        // Check expiry
        if (sub.status !== 'active' && sub.status !== 'trialing') {
            return res.status(402).json({
                success: false,
                message: 'Subscription is inactive. Please update your billing.'
            });
        }

        // Enforce API limits
        if (sub.usage.apiCalls.count >= sub.usage.apiCalls.limit) {
            return res.status(429).json({
                success: false,
                message: 'API rate limit exceeded for current billing cycle. Upgrade for more.'
            });
        }

        // Increment API count
        sub.usage.apiCalls.count += 1;
        await sub.save();

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = { enforceUsageLimits };
