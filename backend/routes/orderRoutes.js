const express = require('express');
const { protect } = require('../middlewares/auth');
const {
    placeOrder,
    getOrders,
    updateOrder,
    deleteOrder
} = require('../controllers/orderController');

const router = express.Router();

// Public endpoint
router.post('/:tenantId/:cloneId', placeOrder);

// Private endpoints
router.get('/', protect, getOrders);
router.put('/:id', protect, updateOrder);
router.delete('/:id', protect, deleteOrder);

module.exports = router;
