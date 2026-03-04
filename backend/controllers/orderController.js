const Order = require('../models/Order');

// @desc    Place an order (public — no auth)
// @route   POST /api/v1/orders/:tenantId/:cloneId
// @access  Public
exports.placeOrder = async (req, res, next) => {
    try {
        const { customerName, customerEmail, customerPhone, items, notes } = req.body;
        const { tenantId, cloneId } = req.params;

        // Calculate total from items
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const order = await Order.create({
            tenantId,
            cloneId,
            customerName,
            customerEmail,
            customerPhone,
            items,
            total,
            notes
        });

        res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all orders (admin)
// @route   GET /api/v1/orders?cloneId=...
// @access  Private
exports.getOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const skip = (page - 1) * limit;
        const { status, cloneId } = req.query;

        const filter = { tenantId: req.tenantId };
        if (cloneId) filter.cloneId = cloneId;
        if (status) filter.status = status;

        const total = await Order.countDocuments(filter);
        const orders = await Order.find(filter).sort('-createdAt').skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: orders
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update order status
// @route   PUT /api/v1/orders/:id
// @access  Private
exports.updateOrder = async (req, res, next) => {
    try {
        const { status } = req.body;

        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete order
// @route   DELETE /api/v1/orders/:id
// @access  Private
exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
