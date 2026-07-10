const express = require('express');
const { protect } = require('../middlewares/auth');
const {
    submitContact,
    getMessages,
    markAsRead,
    deleteMessage,
    submitCustomForm,
    getCustomSubmissions
} = require('../controllers/contactController');

const router = express.Router();

// Public endpoints
router.post('/:tenantId/:cloneId', submitContact);
router.post('/custom/:tenantId/:cloneId/:formSlug', submitCustomForm);

// Private endpoints
router.get('/', protect, getMessages);
router.get('/custom', protect, getCustomSubmissions);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
