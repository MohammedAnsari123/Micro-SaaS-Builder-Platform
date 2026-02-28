const express = require('express');
const { protect } = require('../middlewares/auth');
const Template = require('../models/Template');

// Import controller methods
const { generateTool, createTool, getTools, getToolById, updateTool, getJobStatus, resolveToolByVanity } = require('../controllers/toolController');

const router = express.Router();

router.post('/generate', protect, generateTool);
router.get('/job/:jobId', protect, getJobStatus);
router.post('/', protect, createTool);
router.get('/', protect, getTools);
router.get('/resolve/:templateName/:emailPrefix', resolveToolByVanity);

// Fetch all available templates as modules
router.get('/modules', protect, async (req, res) => {
    try {
        const modules = await Template.find().sort({ category: 1, name: 1 });
        res.status(200).json({ success: true, count: modules.length, data: modules });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to fetch modules' });
    }
});

router
    .route('/:id')
    .get(protect, getToolById)
    .put(protect, updateTool);

module.exports = router;

