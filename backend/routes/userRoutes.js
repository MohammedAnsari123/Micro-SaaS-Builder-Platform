const express = require('express');
const { getDashboardStats, getMyClonedWebsites } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/cloned-websites', getMyClonedWebsites);

module.exports = router;
