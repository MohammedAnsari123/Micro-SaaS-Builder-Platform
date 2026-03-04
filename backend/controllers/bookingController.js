const Booking = require('../models/Booking');

// @desc    Create a booking (public — no auth)
// @route   POST /api/v1/bookings/:tenantId/:cloneId
// @access  Public
exports.createBooking = async (req, res, next) => {
    try {
        const { customerName, customerEmail, customerPhone, item, itemId, bookingDate, timeSlot, notes } = req.body;
        const { tenantId, cloneId } = req.params;

        const booking = await Booking.create({
            tenantId,
            cloneId,
            customerName,
            customerEmail,
            customerPhone,
            item,
            itemId,
            bookingDate,
            timeSlot,
            notes
        });

        res.status(201).json({ success: true, message: 'Booking created successfully', data: booking });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all bookings (admin)
// @route   GET /api/v1/bookings?cloneId=...
// @access  Private
exports.getBookings = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const skip = (page - 1) * limit;
        const { status, cloneId } = req.query;

        const filter = { tenantId: req.tenantId };
        if (cloneId) filter.cloneId = cloneId;
        if (status) filter.status = status;

        const total = await Booking.countDocuments(filter);
        const bookings = await Booking.find(filter).sort('-bookingDate').skip(skip).limit(limit);

        res.status(200).json({
            success: true,
            count: bookings.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: bookings
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update booking status
// @route   PUT /api/v1/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
    try {
        const { status, notes } = req.body;
        const update = {};
        if (status) update.status = status;
        if (notes !== undefined) update.notes = notes;

        const booking = await Booking.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            update,
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.status(200).json({ success: true, data: booking });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
