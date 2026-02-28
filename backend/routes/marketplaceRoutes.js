const express = require('express');
const { getPublicTools, getToolDetail, publishTool, cloneTool, addReview } = require('../controllers/marketplaceController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router
    .route('/')
    .get(getPublicTools);

router
    .route('/:id')
    .get(getToolDetail);

router
    .route('/publish/:id')
    .post(protect, publishTool);

router
    .route('/clone/:id')
    .post(protect, cloneTool);

router
    .route('/review/:id')
    .post(protect, addReview);

module.exports = router;
