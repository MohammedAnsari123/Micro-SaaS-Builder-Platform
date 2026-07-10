const Order = require('../models/Order');
const Booking = require('../models/Booking');
const ContactMessage = require('../models/ContactMessage');
const FormSubmission = require('../models/FormSubmission');

// @desc    Get metrics and chart data for a specific tenant clone
// @route   GET /api/v1/stats/clone/:cloneId
// @access  Private
exports.getCloneStats = async (req, res, next) => {
    try {
        const { cloneId } = req.params;
        const tenantId = req.tenantId;

        // 1. Basic Counts
        const totalOrders = await Order.countDocuments({ tenantId, cloneId });
        
        // Sum total orders revenue
        const orderSum = await Order.aggregate([
            { $match: { tenantId, cloneId } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);
        const totalRevenue = orderSum.length > 0 ? orderSum[0].total : 0;

        const totalBookings = await Booking.countDocuments({ tenantId, cloneId });
        const directMessagesCount = await ContactMessage.countDocuments({ tenantId, cloneId });
        const customFormCount = await FormSubmission.countDocuments({ tenantId, cloneId });
        const totalLeads = directMessagesCount + customFormCount;

        // 2. Weekly Orders Data (Last 7 Days)
        const weeklyOrders = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));

            const dailyOrders = await Order.find({
                tenantId,
                cloneId,
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            }).lean();

            const dayName = startOfDay.toLocaleDateString('en-US', { weekday: 'short' });
            const dailyRevenue = dailyOrders.reduce((sum, o) => sum + (o.total || 0), 0);

            weeklyOrders.push({
                day: dayName,
                revenue: dailyRevenue,
                orders: dailyOrders.length
            });
        }

        // 3. Lead Distribution Data
        const leadDistribution = [
            { name: 'Direct Messages', value: directMessagesCount },
            { name: 'Custom Forms', value: customFormCount }
        ];

        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                totalRevenue,
                totalBookings,
                totalLeads,
                weeklyOrders,
                leadDistribution
            }
        });
    } catch (err) {
        next(err);
    }
};
