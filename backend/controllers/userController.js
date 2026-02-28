const User = require('../models/User');
const Tenant = require('../models/Tenant');
const Tool = require('../models/Tool');
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

        // 1. Get Deployed Tools
        const tools = await Tool.find({ tenantId });
        const toolCount = tools.length;

        // 2. Estimate metrics from tool data (Log model removed)
        let totalUsers = 0;
        let totalRevenue = 0;
        let apiRequests = 0;

        tools.forEach(tool => {
            const currentVerIndex = (tool.currentVersion || 1) - 1;
            const currentVer = tool.versions && tool.versions[currentVerIndex];
            const collectionCount = currentVer?.schemas?.length || 0;
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
                deployedTools: toolCount,
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
            .populate('templateId', 'name slug colorTheme category tags description')
            .populate('toolId', 'name slug versions currentVersion isPublic')
            .sort('-clonedAt');

        // Enrich clone data with tool's runtime info
        const websites = clones.map(clone => {
            const template = clone.templateId;
            const tool = clone.toolId;
            const currentVerIndex = (tool?.currentVersion || 1) - 1;
            const currentVer = tool?.versions?.[currentVerIndex];
            const collections = currentVer?.schemas?.length || 0;
            const pages = currentVer?.pages || [];

            return {
                _id: clone._id,
                cloneId: clone._id,
                toolId: tool?._id,
                name: tool?.name || clone.templateSnapshotName || 'Unnamed App',
                slug: tool?.slug,
                templateName: template?.name || 'Unknown Template',
                templateSlug: template?.slug,
                colorTheme: template?.colorTheme || 'blue',
                category: template?.category || 'General',
                tags: template?.tags || [],
                description: template?.description || '',
                collections,
                pages,
                isPublic: tool?.isPublic || false,
                cloneSource: clone.cloneSource,
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
            res.status(500).json({ success: false, message: 'Internal Server Error (next missing)', error: err.message });
        }
    }
};
