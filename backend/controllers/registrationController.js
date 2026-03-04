const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    Register for an event (public — no auth)
// @route   POST /api/v1/registrations/:tenantId/:cloneId
// @access  Public
exports.registerForEvent = async (req, res, next) => {
    try {
        const { eventId, name, email, phone } = req.body;
        const { tenantId, cloneId } = req.params;

        // Check event exists and has capacity (isolated by cloneId)
        const event = await Event.findOne({ _id: eventId, tenantId, cloneId, isActive: true });
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        if (event.registeredCount >= event.capacity) {
            return res.status(400).json({ success: false, message: 'Event is full' });
        }

        const registration = await Registration.create({
            tenantId,
            cloneId,
            eventId,
            name,
            email,
            phone
        });

        // Increment registered count
        event.registeredCount += 1;
        await event.save();

        res.status(201).json({ success: true, message: 'Registration successful', data: registration });
    } catch (err) {
        // Handle duplicate registration
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'You are already registered for this event' });
        }
        next(err);
    }
};

// @desc    Get all registrations for a tenant (admin)
// @route   GET /api/v1/registrations?cloneId=...
// @access  Private
exports.getRegistrations = async (req, res, next) => {
    try {
        const { eventId, cloneId } = req.query;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const skip = (page - 1) * limit;

        const filter = { tenantId: req.tenantId };
        if (cloneId) filter.cloneId = cloneId;
        if (eventId) filter.eventId = eventId;

        const total = await Registration.countDocuments(filter);
        const registrations = await Registration.find(filter)
            .populate('eventId', 'title date venue')
            .sort('-createdAt')
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: registrations.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: registrations
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update registration status
// @route   PUT /api/v1/registrations/:id
// @access  Private
exports.updateRegistration = async (req, res, next) => {
    try {
        const { status } = req.body;

        const registration = await Registration.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            { status },
            { new: true, runValidators: true }
        );

        if (!registration) {
            return res.status(404).json({ success: false, message: 'Registration not found' });
        }

        res.status(200).json({ success: true, data: registration });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete registration
// @route   DELETE /api/v1/registrations/:id
// @access  Private
exports.deleteRegistration = async (req, res, next) => {
    try {
        const registration = await Registration.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });

        if (!registration) {
            return res.status(404).json({ success: false, message: 'Registration not found' });
        }

        // Decrement registered count on the event
        await Event.findByIdAndUpdate(registration.eventId, { $inc: { registeredCount: -1 } });

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
