const ContactMessage = require('../models/ContactMessage');

// @desc    Submit a contact message (public — no auth needed)
// @route   POST /api/v1/contact/:tenantId/:cloneId
// @access  Public
exports.submitContact = async (req, res, next) => {
    try {
        const { name, email, phone, message } = req.body;
        const { tenantId, cloneId } = req.params;

        const contact = await ContactMessage.create({
            tenantId,
            cloneId,
            name,
            email,
            phone,
            message
        });

        res.status(201).json({ success: true, message: 'Message sent successfully', data: contact });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all contact messages (admin)
// @route   GET /api/v1/contact?cloneId=...
// @access  Private
exports.getMessages = async (req, res, next) => {
    try {
        const { cloneId } = req.query;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const skip = (page - 1) * limit;

        const filter = { tenantId: req.tenantId };
        if (cloneId) filter.cloneId = cloneId;

        const total = await ContactMessage.countDocuments(filter);
        const messages = await ContactMessage.find(filter)
            .sort('-createdAt')
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: messages.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: messages
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Mark message as read
// @route   PUT /api/v1/contact/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
    try {
        const message = await ContactMessage.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            { isRead: true },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        res.status(200).json({ success: true, data: message });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a contact message
// @route   DELETE /api/v1/contact/:id
// @access  Private
exports.deleteMessage = async (req, res, next) => {
    try {
        const message = await ContactMessage.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
