const express = require('express');
const { protect } = require('../middlewares/auth');

const {
    getAnalyticsSummary,
    getLogs
} = require('../controllers/analyticsController');

const router = express.Router();

router.get('/', protect, getAnalyticsSummary);
router.get('/logs', protect, getLogs);

module.exports = router;
