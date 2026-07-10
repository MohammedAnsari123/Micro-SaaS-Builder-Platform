const express = require('express');
const { protect } = require('../middlewares/auth');
const { getCloneStats } = require('../controllers/statsController');

const router = express.Router();

router.get('/clone/:cloneId', protect, getCloneStats);

module.exports = router;
