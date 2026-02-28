const express = require('express');
const { getWebhooks, createWebhook, deleteWebhook } = require('../controllers/webhookController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.route('/:toolId')
    .get(getWebhooks)
    .post(createWebhook);

router.route('/:id')
    .delete(deleteWebhook);

module.exports = router;
