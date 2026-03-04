const express = require('express');
const { protect } = require('../middlewares/auth');
const {
    getPageContent,
    getPublicContent,
    getAllContent,
    upsertContent,
    updateContent,
    deleteContent
} = require('../controllers/contentController');

const router = express.Router();

// Public endpoints
router.get('/public/:tenantId/:cloneId', getPublicContent);

// Private endpoints (tenant-isolated)
router.get('/', protect, getPageContent);
router.get('/all', protect, getAllContent);
router.post('/', protect, upsertContent);
router.put('/:id', protect, updateContent);
router.delete('/:id', protect, deleteContent);

module.exports = router;
