const Event = require('../models/Event');

// @desc    Get events for public site
// @route   GET /api/v1/events/public/:tenantId/:cloneId
// @access  Public
exports.getPublicEvents = async (req, res, next) => {
    try {
        const { tenantId, cloneId } = req.params;
        const { template: templateSlug } = req.query;

        // Special handling for template preview mode
        if (tenantId === 'preview' && templateSlug) {
            const seedData = require('../seeders/seedData');
            const data = seedData[templateSlug];
            return res.status(200).json({
                success: true,
                data: data ? (data.events || []) : []
            });
        }

        const events = await Event.find({ tenantId, cloneId, isActive: true }).sort('date');
        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single event for public site
// @route   GET /api/v1/events/public/:tenantId/:cloneId/:id
// @access  Public
exports.getPublicEvent = async (req, res, next) => {
    try {
        const { tenantId, cloneId, id } = req.params;
        const event = await Event.findOne({ _id: id, tenantId, cloneId, isActive: true });

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        res.status(200).json({ success: true, data: event });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all events (admin)
// @route   GET /api/v1/events?cloneId=...
// @access  Private
exports.getEvents = async (req, res, next) => {
    try {
        const { cloneId } = req.query;
        const filter = { tenantId: req.tenantId };
        if (cloneId) filter.cloneId = cloneId;

        const events = await Event.find(filter).sort('-date');
        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (err) {
        next(err);
    }
};

// @desc    Create event
// @route   POST /api/v1/events
// @access  Private
exports.createEvent = async (req, res, next) => {
    try {
        req.body.tenantId = req.tenantId;
        // cloneId should be passed in req.body
        const event = await Event.create(req.body);
        res.status(201).json({ success: true, data: event });
    } catch (err) {
        next(err);
    }
};

// @desc    Update event
// @route   PUT /api/v1/events/:id
// @access  Private
exports.updateEvent = async (req, res, next) => {
    try {
        delete req.body.tenantId;
        const event = await Event.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        res.status(200).json({ success: true, data: event });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete event
// @route   DELETE /api/v1/events/:id
// @access  Private
exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
