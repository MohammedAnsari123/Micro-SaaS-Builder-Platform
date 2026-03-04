const express = require('express');
const { protect } = require('../middlewares/auth');
const {
    getPublicServices,
    getServices,
    createService,
    updateService,
    deleteService
} = require('../controllers/serviceController');

const router = express.Router();

// Public endpoint
router.get('/public/:tenantId/:cloneId', getPublicServices);

// Private endpoints
router.get('/', protect, getServices);
router.post('/', protect, createService);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;
