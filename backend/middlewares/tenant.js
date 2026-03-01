const Tenant = require('../models/Tenant');
const Tool = require('../models/Tool');

/**
 * Middleware to load tenant details and attach to req.tenant
 */
exports.loadTenant = async (req, res, next) => {
    try {
        if (!req.tenantId) {
            return res.status(403).json({
                success: false,
                message: 'No tenant context found'
            });
        }

        const tenant = await Tenant.findById(req.tenantId).populate('enabledTools');
        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: 'Tenant not found'
            });
        }

        req.tenant = tenant;
        next();
    } catch (err) {
        console.error(`Tenant Middleware Error: ${err.message}`);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/**
 * Middleware to check if a specific tool is enabled for the current tenant
 * @param {string} toolSlug - The slug of the tool to check
 */
exports.checkToolAccess = (toolSlug) => {
    return async (req, res, next) => {
        try {
            // Ensure tenant is loaded
            if (!req.tenant) {
                const tenant = await Tenant.findById(req.tenantId).populate('enabledTools');
                if (!tenant) {
                    return res.status(404).json({ success: false, message: 'Tenant not found' });
                }
                req.tenant = tenant;
            }

            const toolEnabled = req.tenant.enabledTools.some(tool => tool.slug === toolSlug);

            if (!toolEnabled) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Tool '${toolSlug}' is not enabled for your plan.`
                });
            }

            next();
        } catch (err) {
            console.error(`Tool Access Check Error: ${err.message}`);
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    };
};
