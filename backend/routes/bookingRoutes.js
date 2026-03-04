const express = require('express');
const { protect } = require('../middlewares/auth');
const {
    createBooking,
    getBookings,
    updateBooking,
    deleteBooking
} = require('../controllers/bookingController');

const router = express.Router();

// Public endpoint
router.post('/:tenantId/:cloneId', createBooking);

// Private endpoints
router.get('/', protect, getBookings);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

module.exports = router;
