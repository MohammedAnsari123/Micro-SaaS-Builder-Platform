const User = require('../models/User');
const Tenant = require('../models/Tenant');
const TemplateClone = require('../models/TemplateClone');

// Mock missing Log model
const Log = {
    countDocuments: async () => 0,
    find: () => ({ sort: () => ({ limit: async () => [] }) }),
    create: async () => ({})
};

// @desc    Get dashboard stats for a user
// @route   GET /api/v1/user/stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
    try {
        const tenantId = req.tenantId;

        // 1. Get Cloned Templates
        const clones = await TemplateClone.find({ tenantId });
        const cloneCount = clones.length;

        // 2. Estimate metrics
        let totalUsers = 0;
        let totalRevenue = 0;
        let apiRequests = 0;

        clones.forEach(clone => {
            const collectionCount = 3; // mock value
            const toolUsers = (collectionCount * 142) + 50;
            const toolRev = (toolUsers * 2.5);

            totalUsers += toolUsers;
            totalRevenue += toolRev;
            apiRequests += collectionCount * 320;
        });

        // 3. Generate mock API Traffic for last 7 days
        const apiTraffic = [];
        for (let i = 6; i >= 0; i--) {
            // Generate pseudo-realistic daily traffic values
            const base = Math.floor(apiRequests / 7);
            const variance = Math.floor(Math.random() * (base * 0.4));
            apiTraffic.push(base + variance);
        }

        res.status(200).json({
            success: true,
            data: {
                totalARR: `$${totalRevenue.toLocaleString()}`,
                activeUsers: totalUsers.toLocaleString(),
                apiRequests: apiRequests.toLocaleString(),
                deployedTools: cloneCount,
                apiTraffic
            }
        });
    } catch (err) {
        console.error('Stats Error:', err);
        if (typeof next === 'function') {
            next(err);
        } else {
            res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
        }
    }
};

// @desc    Get all cloned websites for the current tenant
// @route   GET /api/v1/user/cloned-websites
// @access  Private
exports.getMyClonedWebsites = async (req, res, next) => {
    try {
        const tenantId = req.tenantId;

        const clones = await TemplateClone.find({ tenantId, status: 'active' })
            .populate('templateId')
            .sort('-clonedAt');

        const tenant = await Tenant.findById(tenantId);

        // Enrich clone data with template metadata and tenant settings
        const websites = clones.map(clone => {
            const template = clone.templateId;

            return {
                _id: clone._id,
                cloneId: clone._id,
                name: tenant?.siteSettings?.siteName || template?.name || 'My Website',
                slug: template?.slug,
                templateName: template?.name || 'Unknown Template',
                templateSlug: template?.slug,
                colorTheme: template?.theme?.primary ? 'custom' : 'blue', // Placeholder for theme color mapping
                category: template?.category || 'General',
                tags: [],
                description: template?.description || '',
                collections: template?.modules?.length || 0,
                pages: template?.pages?.map(p => p.name) || [],
                isPublic: template?.isPublic || true,
                cloneSource: clone.cloneSource || 'template',
                clonedAt: clone.clonedAt,
                status: clone.status
            };
        });

        res.status(200).json({ success: true, count: websites.length, data: websites });
    } catch (err) {
        console.error('Error fetching cloned websites:', err);
        if (typeof next === 'function') {
            next(err);
        } else {
            res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
        }
    }
};
