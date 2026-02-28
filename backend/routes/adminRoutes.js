const express = require('express');
const { protectAdmin } = require('../middlewares/auth');
const {
    getDashboardMetrics,
    getUsers,
    suspendUser,
    deleteUser,
    getTenants,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplates,
    getMarketplaceItems,
    approveMarketplaceItem,
    rejectMarketplaceItem,
    getBilling,
    getAIMonitor,
    getAnalytics,
    getSecurity,
    getSettings,
    updateSettings
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require admin auth
router.use(protectAdmin);

router.get('/dashboard', getDashboardMetrics);
router.get('/users', getUsers);
router.put('/users/:id/suspend', suspendUser);
router.delete('/users/:id', deleteUser);
router.get('/tenants', getTenants);
router.get('/templates', getTemplates);
router.post('/templates', createTemplate);
router.put('/templates/:id', updateTemplate);
router.delete('/templates/:id', deleteTemplate);
router.get('/marketplace', getMarketplaceItems);
router.put('/marketplace/:id/approve', approveMarketplaceItem);
router.put('/marketplace/:id/reject', rejectMarketplaceItem);
router.get('/billing', getBilling);
router.get('/ai-monitor', getAIMonitor);
router.get('/analytics', getAnalytics);
router.get('/security', getSecurity);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
