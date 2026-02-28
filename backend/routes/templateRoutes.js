const express = require('express');
const { getTemplates, getTemplateBySlug, cloneTemplate, getMyClones } = require('../controllers/templateController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Public gallery and template details
router.get('/', getTemplates);
router.get('/:slug', getTemplateBySlug);

// Secure endpoints
router.get('/my/clones', protect, getMyClones);
router.post('/clone/:id', protect, cloneTemplate);

module.exports = router;
