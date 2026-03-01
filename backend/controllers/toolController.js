const Tool = require('../models/Tool');
const { generateModel } = require('../schema-engine/generator');
const { getTenantConnection } = require('../config/tenantDb');



// @desc    Create a new Tool manually (without AI)
// @route   POST /api/v1/tools
// @access  Private
exports.createTool = async (req, res, next) => {
    try {
        const { name, description, schemas, layout } = req.body;

        const sanitizedEmail = req.user?.email ? req.user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() : 'default';
        const dbName = `codeara_${sanitizedEmail}`;

        const tool = await Tool.create({
            tenantId: req.tenantId,
            name,
            description,
            currentVersion: 1,
            dbName,
            versions: [
                {
                    version: 1,
                    schemas,
                    layout
                }
            ]
        });

        if (schemas && schemas.length > 0) {
            try {
                const tenantConnection = await getTenantConnection(sanitizedEmail);
                schemas.forEach(schemaDef => {
                    generateModel(
                        req.tenantId,
                        schemaDef.tableName,
                        schemaDef.fields,
                        schemaDef.indexes,
                        req.user?.email,
                        tenantConnection
                    );
                });
            } catch (dbErr) {
                console.error("Failed to provision manual tool DB collections:", dbErr);
            }
        }

        res.status(201).json({
            success: true,
            data: tool
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all tools for a tenant
// @route   GET /api/v1/tools
// @access  Private
exports.getTools = async (req, res, next) => {
    try {
        const tools = await Tool.find({ tenantId: req.tenantId }).sort('-createdAt');

        // Mock revenue and users for the Dashboard view based on collections
        const enrichedTools = tools.map(tool => {
            const collectionCount = tool.versions[tool.currentVersion - 1]?.schemas?.length || 0;
            return {
                _id: tool._id,
                name: tool.name,
                status: 'Active',
                users: Math.floor(Math.random() * 500) * collectionCount,
                revenue: `$${Math.floor(Math.random() * 1000) * collectionCount}`,
                collections: collectionCount,
                createdAt: tool.createdAt
            };
        });

        res.status(200).json({
            success: true,
            count: tools.length,
            data: enrichedTools
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single tool
// @route   GET /api/v1/tools/:id
// @access  Private
exports.getToolById = async (req, res, next) => {
    try {
        const tool = await Tool.findOne({ _id: req.params.id, tenantId: req.tenantId });

        if (!tool) {
            return res.status(404).json({ success: false, message: 'Tool not found' });
        }

        res.status(200).json({
            success: true,
            data: tool
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Resolve Site by Vanity URL (Template Slug + Email Prefix)
// @route   GET /api/v1/tools/resolve/:templateSlug/:emailPrefix
// @access  Public
exports.resolveSiteByVanity = async (req, res, next) => {
    try {
        const { templateSlug, emailPrefix } = req.params;
        const User = require('../models/User');
        const Tenant = require('../models/Tenant');

        // 1. Find the user whose email starts with the prefix
        const user = await User.findOne({
            email: { $regex: new RegExp(`^${emailPrefix}@`, 'i') }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Platform owner not found' });
        }

        // 2. Find the tenant belonging to this user
        const tenant = await Tenant.findOne({ ownerId: user._id })
            .populate('templateId')
            .populate('themeId')
            .lean();

        if (!tenant) {
            return res.status(404).json({ success: false, message: 'No tenant found for this user' });
        }

        // 3. Find the specific Tool by slug for this tenant
        const tool = await Tool.findOne({
            tenantId: tenant._id,
            slug: templateSlug.toLowerCase()
        }).lean();

        let responseTemplate = tenant.templateId;
        if (tool) {
            const latestVer = tool.versions[tool.currentVersion - 1];
            // Normalize Tool to look like a Template for the LayoutRenderer
            responseTemplate = {
                ...tool,
                pages: latestVer.pages || [],
                instances: latestVer.instances || [],
                layoutType: latestVer.layoutConfig?.layoutType || tenant.templateId?.layoutType || 'sidebar',
                schemaConfig: { tables: latestVer.schemas || [] }
            };
        }

        if (!responseTemplate) {
            return res.status(404).json({ success: false, message: 'Requested application structure not found.' });
        }

        res.status(200).json({
            success: true,
            data: {
                tenantName: tenant.name,
                template: responseTemplate,
                theme: tenant.themeId,
                tools: tenant.enabledTools,
                plan: tenant.subscriptionPlan
            }
        });

    } catch (err) {
        if (typeof next === 'function') next(err);
        else res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

// @desc    Update a Tool (Save changes or publish)
// @route   PUT /api/v1/tools/:id
// @access  Private
exports.updateTool = async (req, res, next) => {
    try {
        const { name, description, isPublic, instances, pages, layoutConfig } = req.body;

        const tool = await Tool.findOne({ _id: req.params.id, tenantId: req.tenantId });

        if (!tool) {
            return res.status(404).json({ success: false, message: 'Tool not found' });
        }

        if (name) {
            tool.name = name;
            // Automatically update the slug when the name changes so vanity URLs are dynamic
            tool.slug = name
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/-+/g, '-')
                .replace(/^-+|-+$/g, '');
        }
        if (description) tool.description = description;
        if (isPublic !== undefined) tool.isPublic = isPublic;

        // Update the latest version
        const latestVersionIndex = tool.currentVersion - 1;
        if (tool.versions[latestVersionIndex]) {
            if (instances) tool.versions[latestVersionIndex].instances = instances;
            if (pages) tool.versions[latestVersionIndex].pages = pages;
            if (layoutConfig) tool.versions[latestVersionIndex].layoutConfig = layoutConfig;
        }

        await tool.save();

        res.status(200).json({
            success: true,
            data: tool
        });
    } catch (err) {
        next(err);
    }
};
