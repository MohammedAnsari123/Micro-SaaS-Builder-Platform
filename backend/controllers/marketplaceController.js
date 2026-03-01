const Tool = require('../models/Tool');
const TemplateClone = require('../models/TemplateClone');
const mongoose = require('mongoose');
const { generateModel } = require('../schema-engine/generator');

// @desc    Get all public tools for the marketplace
// @route   GET /api/v1/marketplace
// @access  Public
exports.getPublicTools = async (req, res, next) => {
    try {
        const { search, category, sort } = req.query;
        let queryStr = { isPublic: true };

        if (search) {
            queryStr.name = { $regex: search, $options: 'i' };
        }
        if (category) {
            queryStr.category = category;
        }

        let query = Tool.find(queryStr)
            .select('-versions.layoutConfig')
            .populate({ path: 'tenantId', select: 'name' });

        if (sort === 'popular') {
            query = query.sort('-clonesCount');
        } else if (sort === 'newest') {
            query = query.sort('-createdAt');
        } else if (sort === 'rating') {
            query = query.sort('-rating');
        } else {
            query = query.sort('-createdAt');
        }

        const tools = await query;

        res.status(200).json({
            success: true,
            count: tools.length,
            data: tools
        });
    } catch (err) {
        console.error('getPublicTools Error:', err);
        next(err);
    }
};

// @desc    Get single tool detail
// @route   GET /api/v1/marketplace/:id
// @access  Public
exports.getToolDetail = async (req, res, next) => {
    try {
        const tool = await Tool.findOne({ _id: req.params.id, isPublic: true })
            .populate({ path: 'tenantId', select: 'name description' });

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

// @desc    Clone a public tool/template for a tenant
// @route   POST /api/v1/marketplace/clone/:id
// @access  Private
exports.cloneTool = async (req, res, next) => {
    try {
        const sourceToolId = req.params.id;
        const clonerTenantId = req.user.tenantId;

        console.log(`[Marketplace] Tenant ${clonerTenantId} is cloning Tool ${sourceToolId}`);

        // 1. Validate the source tool - using findById for cleaner Mongoose integration
        const sourceTool = await Tool.findById(sourceToolId).lean();

        if (!sourceTool || !sourceTool.isPublic) {
            return res.status(404).json({ success: false, error: 'Template not found or not public' });
        }

        if (clonerTenantId && sourceTool.tenantId && sourceTool.tenantId.toString() === clonerTenantId.toString()) {
            return res.status(400).json({ success: false, error: 'You cannot clone your own tool' });
        }

        // 2. Increment clone count on source
        await Tool.findByIdAndUpdate(sourceToolId, { $inc: { clonesCount: 1 } });

        // 3. Execute The Deep Clone
        if (!sourceTool.versions || sourceTool.versions.length === 0) {
            return res.status(500).json({ success: false, error: 'Source template is corrupt (no versions found)' });
        }

        const sourceLatestVersion = sourceTool.versions[sourceTool.versions.length - 1];

        const newTool = await Tool.create({
            tenantId: clonerTenantId,
            name: `${sourceTool.name} (Clone)`,
            description: `Cloned from ${sourceTool.name}. ${sourceTool.description || ''}`,
            versions: [{
                version: 1,
                schemas: sourceLatestVersion.schemas || [],
                layoutConfig: sourceLatestVersion.layoutConfig || sourceLatestVersion.layout || {},
                pages: sourceLatestVersion.pages ? sourceLatestVersion.pages.map(p => {
                    if (typeof p === 'string') return { name: p, slug: p.toLowerCase().replace(/ /g, '-'), icon: 'File', sections: [] };
                    return {
                        name: p.name || 'Page',
                        slug: p.slug || (p.name ? p.name.toLowerCase().replace(/ /g, '-') : 'page'),
                        icon: p.icon || 'File',
                        sections: p.sections || []
                    };
                }) : [{ name: 'Dashboard', slug: 'dashboard', icon: 'LayoutDashboard', sections: [] }],
                instances: sourceLatestVersion.instances || []
            }],
            currentVersion: 1,
            isPublic: false
        });

        // 4. Spin up dynamic collections
        try {
            const schemasToGenerate = sourceLatestVersion.schemas || [];
            for (const schemaDef of schemasToGenerate) {
                const tableName = schemaDef.tableName || schemaDef.name;
                if (tableName) {
                    generateModel(newTool.tenantId.toString(), tableName, schemaDef.fields, [], req.user?.email);
                }
            }
        } catch (engineError) {
            console.error('[Marketplace] Schema Engine initialization failed during clone:', engineError.message);
        }

        // 5. Create the TemplateClone record
        const cloneRecord = await TemplateClone.create({
            tenantId: clonerTenantId,
            templateId: sourceTool._id,
            toolId: newTool._id,
            templateVersion: sourceLatestVersion.version,
            cloneSource: 'marketplace',
            templateSnapshotName: sourceTool.name
        });

        res.status(201).json({
            success: true,
            message: 'Tool cloned successfully',
            data: {
                cloneId: cloneRecord._id,
                toolId: newTool._id,
                name: newTool.name
            }
        });

    } catch (err) {
        console.error('cloneTool Error:', err);
        next(err);
    }
};

// @desc    Publish a tool to the marketplace
// @route   POST /api/v1/marketplace/publish/:id
// @access  Private
exports.publishTool = async (req, res, next) => {
    try {
        const tool = await Tool.findOne({ _id: req.params.id, tenantId: req.user.tenantId });

        if (!tool) {
            return res.status(404).json({ success: false, message: 'Tool not found' });
        }

        tool.isPublic = true;
        await tool.save();

        res.status(200).json({
            success: true,
            message: 'Tool published to marketplace',
            data: tool
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Add review to a tool
// @route   POST /api/v1/marketplace/review/:id
// @access  Private
exports.addReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const tool = await Tool.findById(req.params.id);

        if (!tool) {
            return res.status(404).json({ success: false, message: 'Tool not found' });
        }

        // In a real app we'd have a Review model. For now we just update stats.
        const totalRating = (tool.rating * tool.reviewsCount) + rating;
        tool.reviewsCount += 1;
        tool.rating = totalRating / tool.reviewsCount;

        await tool.save();

        res.status(201).json({
            success: true,
            message: 'Review added',
            data: { rating: tool.rating, reviewsCount: tool.reviewsCount }
        });
    } catch (err) {
        next(err);
    }
};
