const Subscription = require('../models/Subscription');

// @desc    Get current subscription status
// @route   GET /api/v1/billing
// @access  Private
exports.getSubscription = async (req, res, next) => {
    try {
        let sub = await Subscription.findOne({ tenantId: req.tenantId });

        if (!sub) {
            // Auto-create free tier if missing
            sub = await Subscription.create({ tenantId: req.tenantId });
        }

        res.status(200).json({ success: true, data: sub });
    } catch (err) {
        next(err);
    }
};

// @desc    Upgrade Plan (Mock Stripe Session)
// @route   POST /api/v1/billing/upgrade
// @access  Private
exports.upgradePlan = async (req, res, next) => {
    try {
        const { planId } = req.body;

        if (!['basic', 'pro'].includes(planId)) {
            return res.status(400).json({ success: false, message: 'Invalid plan selected' });
        }

        // In a real app, this would create a Stripe Checkout Session
        // and return the session URL to the client.

        // For this demonstration, we will directly upgrade the user's plan limits.
        const limits = {
            free: { api: 1000, storage: 50 * 1024 * 1024 },
            basic: { api: 10000, storage: 500 * 1024 * 1024 },
            pro: { api: 100000, storage: 5 * 1024 * 1024 * 1024 }
        };

        let sub = await Subscription.findOneAndUpdate(
            { tenantId: req.tenantId },
            {
                plan: planId,
                'usage.apiCalls.limit': limits[planId].api,
                'usage.storage.limit': limits[planId].storage,
                status: 'active'
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: `Successfully upgraded to ${planId.toUpperCase()} plan! (Simulated payment)`,
            data: sub
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Mock Stripe Webhook for payment events
// @route   POST /api/v1/billing/webhook
// @access  Public
exports.handleWebhook = async (req, res, next) => {
    try {
        // The raw body is needed by Stripe, but we simulate it here.
        const event = req.body;

        console.log(`[Stripe Webhook MOCK] Received event: ${event.type}`);

        // Handle different event types
        switch (event.type) {
            case 'invoice.payment_succeeded':
                // const subscriptionId = event.data.object.subscription;
                // Update subscription status in DB
                break;
            case 'invoice.payment_failed':
                // Update DB to mark past_due
                break;
            case 'customer.subscription.deleted':
                // Mark as canceled
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.status(200).json({ received: true });
    } catch (err) {
        next(err);
    }
};
