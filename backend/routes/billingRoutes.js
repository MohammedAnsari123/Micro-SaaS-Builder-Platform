const express = require('express');
const { protect } = require('../middlewares/auth');

const {
    getSubscription,
    upgradePlan,
    handleWebhook
} = require('../controllers/billingController');

const router = express.Router();

router.get('/', protect, getSubscription);
router.post('/upgrade', protect, upgradePlan);

// Webhook must be raw body for real Stripe, but standard JSON for our mock
router.post('/webhook', handleWebhook);

module.exports = router;
