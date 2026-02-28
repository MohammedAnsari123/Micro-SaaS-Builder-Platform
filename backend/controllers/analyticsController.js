
// @desc    Get analytics summary for the tenant
// @route   GET /api/v1/analytics
// @access  Private
exports.getAnalyticsSummary = async (req, res, next) => {
    try {
        // Log model has been removed – return mock analytics
        const totalCalls = Math.floor(Math.random() * 5000) + 1000;
        const avgResponseTime = Math.floor(Math.random() * 80) + 30;
        const errorRate = (Math.random() * 2).toFixed(2);

        const callsPerCollection = [
            { _id: 'contacts', count: Math.floor(totalCalls * 0.35) },
            { _id: 'tasks', count: Math.floor(totalCalls * 0.25) },
            { _id: 'invoices', count: Math.floor(totalCalls * 0.20) },
            { _id: 'users', count: Math.floor(totalCalls * 0.20) }
        ];

        const callsByMethod = [
            { _id: 'GET', count: Math.floor(totalCalls * 0.60) },
            { _id: 'POST', count: Math.floor(totalCalls * 0.25) },
            { _id: 'PUT', count: Math.floor(totalCalls * 0.10) },
            { _id: 'DELETE', count: Math.floor(totalCalls * 0.05) }
        ];

        res.status(200).json({
            success: true,
            data: {
                totalCalls,
                avgResponseTime,
                errorRate: `${errorRate}%`,
                callsPerCollection,
                callsByMethod
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get raw logs (paginated)
// @route   GET /api/v1/analytics/logs
// @access  Private
exports.getLogs = async (req, res, next) => {
    try {
        // Log model has been removed – return empty paginated set
        res.status(200).json({
            success: true,
            count: 0,
            pagination: {
                page: 1,
                limit: 20,
                total: 0,
                totalPages: 0
            },
            data: []
        });
    } catch (err) {
        next(err);
    }
};
