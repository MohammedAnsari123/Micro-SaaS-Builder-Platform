const express = require('express');
const { protect } = require('../middlewares/auth');
const {
    getPublicProducts,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const router = express.Router();

// Public endpoint
router.get('/public/:tenantId/:cloneId', getPublicProducts);

// Private endpoints
router.get('/', protect, getProducts);
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
