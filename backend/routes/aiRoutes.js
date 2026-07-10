const express = require('express');
const { protect } = require('../middlewares/auth');
const { generateCopy } = require('../utils/ai');

const router = express.Router();

router.post('/generate', protect, async (req, res, next) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ success: false, message: 'Please provide a prompt' });
        }
        const text = await generateCopy(prompt);
        res.status(200).json({ success: true, data: text });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
