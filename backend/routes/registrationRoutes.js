const express = require('express');
const { protect } = require('../middlewares/auth');
const {
    registerForEvent,
    getRegistrations,
    updateRegistration,
    deleteRegistration
} = require('../controllers/registrationController');

const router = express.Router();

// Public endpoint
router.post('/:tenantId/:cloneId', registerForEvent);

// Private endpoints
router.get('/', protect, getRegistrations);
router.put('/:id', protect, updateRegistration);
router.delete('/:id', protect, deleteRegistration);

module.exports = router;
