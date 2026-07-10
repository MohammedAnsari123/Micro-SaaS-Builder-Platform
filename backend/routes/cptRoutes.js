const express = require('express');
const { protect } = require('../middlewares/auth');
const { bindDynamicModel } = require('../schema-engine/middleware');
const {
    getDefinitions,
    createDefinition,
    deleteDefinition,
    getEntries,
    createEntry,
    updateEntry,
    deleteEntry
} = require('../controllers/cptController');

const router = express.Router();

// Definition management
router.route('/definitions')
    .get(protect, getDefinitions)
    .post(protect, createDefinition);

router.route('/definitions/:id')
    .delete(protect, deleteDefinition);

// Entry management
router.route('/entries/:cptSlug')
    .get(getEntries) // Public route for rendering on user sites
    .post(protect, bindDynamicModel('cptSlug'), createEntry);

router.route('/entries/:cptSlug/:id')
    .put(protect, bindDynamicModel('cptSlug'), updateEntry)
    .delete(protect, bindDynamicModel('cptSlug'), deleteEntry);

module.exports = router;
