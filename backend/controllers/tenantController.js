const Tenant = require('../models/Tenant');

exports.updateBranding = async (req, res, next) => {
    try {
        const { logoUrl, primaryColor, accentColor } = req.body;

        const tenant = await Tenant.findByIdAndUpdate(
            req.tenantId,
            {
                branding: { logoUrl, primaryColor, accentColor }
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: tenant.branding });
    } catch (err) {
        next(err);
    }
};

exports.getBranding = async (req, res, next) => {
    try {
        const tenant = await Tenant.findById(req.tenantId);
        if (!tenant) return res.status(404).json({ success: false, error: 'Tenant not found' });

        res.status(200).json({ success: true, data: tenant.branding });
    } catch (err) {
        next(err);
    }
};
