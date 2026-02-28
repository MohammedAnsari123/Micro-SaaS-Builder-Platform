const express = require('express');
const { updateBranding, getBranding } = require('../controllers/tenantController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.route('/branding')
    .get(getBranding)
    .put(updateBranding);

module.exports = router;
