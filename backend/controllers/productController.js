const Product = require('../models/Product');

// @desc    Get products for public site
// @route   GET /api/v1/products/public/:tenantId
// @access  Public
exports.getPublicProducts = async (req, res, next) => {
    try {
        const { tenantId, cloneId } = req.params;
        const { category, page: pageNum, limit: limitNum, template: templateSlug } = req.query;

        // Special handling for template preview mode
        if (tenantId === 'preview' && templateSlug) {
            const seedData = require('../seeders/seedData');
            const data = seedData[templateSlug];
            return res.status(200).json({
                success: true,
                data: data ? (data.products || []) : []
            });
        }

        const page = parseInt(pageNum, 10) || 1;
        const limit = parseInt(limitNum, 10) || 20;
        const skip = (page - 1) * limit;

        const filter = { tenantId, cloneId, isAvailable: true };
        if (category) filter.category = category;

        const total = await Product.countDocuments(filter);
        const products = await Product.find(filter).sort('order createdAt').skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: products
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all products (admin)
// @route   GET /api/v1/products
// @access  Private
exports.getProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const skip = (page - 1) * limit;

        const { cloneId } = req.query;
        const filter = { tenantId: req.tenantId };
        if (cloneId) filter.cloneId = cloneId;

        const total = await Product.countDocuments(filter);
        const products = await Product.find(filter).sort('order -createdAt').skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: products
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = async (req, res, next) => {
    try {
        req.body.tenantId = req.tenantId;
        // cloneId should be passed in req.body from the frontend admin
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = async (req, res, next) => {
    try {
        delete req.body.tenantId;
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
