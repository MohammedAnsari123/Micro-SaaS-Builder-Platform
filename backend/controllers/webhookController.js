const Webhook = require('../models/Webhook');

exports.getWebhooks = async (req, res, next) => {
    try {
        const webhooks = await Webhook.find({ tenantId: req.tenantId, toolId: req.params.toolId });
        res.status(200).json({ success: true, count: webhooks.length, data: webhooks });
    } catch (err) {
        next(err);
    }
};

exports.createWebhook = async (req, res, next) => {
    try {
        req.body.tenantId = req.tenantId;
        req.body.toolId = req.params.toolId;
        const webhook = await Webhook.create(req.body);
        res.status(201).json({ success: true, data: webhook });
    } catch (err) {
        next(err);
    }
};

exports.deleteWebhook = async (req, res, next) => {
    try {
        const webhook = await Webhook.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
        if (!webhook) {
            return res.status(404).json({ success: false, error: 'Webhook not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
