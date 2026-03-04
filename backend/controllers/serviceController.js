const Service = require('../models/Service');

// @desc    Get services for public site
// @route   GET /api/v1/services/public/:tenantId
// @access  Public
exports.getPublicServices = async (req, res, next) => {
    try {
        const { tenantId, cloneId } = req.params;
        const { category, template: templateSlug } = req.query;

        // Special handling for template preview mode
        if (tenantId === 'preview' && templateSlug) {
            const seedData = require('../seeders/seedData');
            const data = seedData[templateSlug];
            return res.status(200).json({
                success: true,
                data: data ? (data.services || []) : []
            });
        }

        const filter = { tenantId, cloneId, isAvailable: true };
        if (category) filter.category = category;

        const services = await Service.find(filter).sort('order');
        res.status(200).json({ success: true, count: services.length, data: services });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all services (admin)
// @route   GET /api/v1/services
// @access  Private
exports.getServices = async (req, res, next) => {
    try {
        const { cloneId } = req.query;
        const filter = { tenantId: req.tenantId };
        if (cloneId) filter.cloneId = cloneId;

        const services = await Service.find(filter).sort('order -createdAt');
        res.status(200).json({ success: true, count: services.length, data: services });
    } catch (err) {
        next(err);
    }
};

// @desc    Create service
// @route   POST /api/v1/services
// @access  Private
exports.createService = async (req, res, next) => {
    try {
        req.body.tenantId = req.tenantId;
        // cloneId should be passed in req.body from frontend
        const service = await Service.create(req.body);
        res.status(201).json({ success: true, data: service });
    } catch (err) {
        next(err);
    }
};

// @desc    Update service
// @route   PUT /api/v1/services/:id
// @access  Private
exports.updateService = async (req, res, next) => {
    try {
        delete req.body.tenantId;
        const service = await Service.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        res.status(200).json({ success: true, data: service });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete service
// @route   DELETE /api/v1/services/:id
// @access  Private
exports.deleteService = async (req, res, next) => {
    try {
        const service = await Service.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });

        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
