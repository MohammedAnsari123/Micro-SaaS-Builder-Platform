const express = require('express');
const { protect } = require('../middlewares/auth');
const {
    submitContact,
    getMessages,
    markAsRead,
    deleteMessage
} = require('../controllers/contactController');

const router = express.Router();

// Public endpoint
router.post('/:tenantId/:cloneId', submitContact);

// Private endpoints
router.get('/', protect, getMessages);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
