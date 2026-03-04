const express = require('express');
const { protect } = require('../middlewares/auth');
const {
    getPublicEvents,
    getPublicEvent,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');

const router = express.Router();

// Public endpoints
router.get('/public/:tenantId/:cloneId', getPublicEvents);
router.get('/public/:tenantId/:cloneId/:id', getPublicEvent);

// Private endpoints
router.get('/', protect, getEvents);
router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;
