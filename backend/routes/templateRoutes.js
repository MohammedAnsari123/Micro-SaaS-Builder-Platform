const express = require('express');
const {
    getTemplates,
    getTemplateBySlug,
    cloneTemplate,
    getMyClones,
    getTenantSite,
    resolveSite,
    updateTheme,
    updateSiteSettings
} = require('../controllers/templateController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Public gallery and template details
router.get('/', getTemplates);
router.get('/site/:tenantId', getTenantSite);
router.get('/resolve/:templateSlug/:emailPrefix', resolveSite);
router.get('/resolve/:templateSlug/:emailPrefix/:cloneId', resolveSite);
router.get('/:slug', getTemplateBySlug);

// Secure endpoints
router.get('/my/clones', protect, getMyClones);
router.post('/clone/:id', protect, cloneTemplate);
router.put('/theme/:cloneId', protect, updateTheme);
router.put('/settings/:cloneId', protect, updateSiteSettings);

module.exports = router;
