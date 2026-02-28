const Tool = require('../models/Tool');
const Tenant = require('../models/Tenant');
const Review = require('../models/Review');
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
            .select('-versions.layout') // Exclude heavy layout JSON on list view
            .populate({ path: 'tenantId', select: 'name' }); // Show creator's studio name

        // Sort logic
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
        if (typeof next === 'function') next(err);
        else res.status(500).json({ success: false, error: 'Server Error retrieving marketplace tools', message: err.message });
    }
};

// @desc    Get single public tool detail
// @route   GET /api/v1/marketplace/:id
// @access  Public
exports.getToolDetail = async (req, res, next) => {
    try {
        const tool = await Tool.findOne({ _id: req.params.id, isPublic: true })
            .populate({ path: 'tenantId', select: 'name' });

        if (!tool) {
            return res.status(404).json({ success: false, error: 'Public tool not found' });
        }

        const reviews = await Review.find({ toolId: tool._id }).populate({ path: 'tenantId', select: 'name' }).sort('-createdAt');

        res.status(200).json({
            success: true,
            data: {
                ...tool.toObject(),
                reviews
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error retrieving tool details' });
    }
};

// @desc    Publish a user's tool to the marketplace
// @route   POST /api/v1/marketplace/publish/:id
// @access  Private (Needs to be the owner)
exports.publishTool = async (req, res, next) => {
    try {
        const { price, category, tags, description } = req.body;

        const tool = await Tool.findOne({ _id: req.params.id, tenantId: req.tenantId });

        if (!tool) {
            return res.status(404).json({ success: false, error: 'Tool not found or unauthorized' });
        }

        // Apply marketplace fields
        tool.isPublic = true;
        tool.price = price !== undefined ? price : tool.price;
        tool.category = category || tool.category;
        tool.tags = tags || tool.tags;

        if (description) {
            tool.description = description;
        }

        await tool.save();

        res.status(200).json({
            success: true,
            data: tool,
            message: 'Tool successfully published to the public Marketplace!'
        });
    } catch (err) {
        console.error('publishTool Error:', err);
        if (typeof next === 'function') next(err);
        else res.status(500).json({ success: false, error: 'Server Error publishing tool', message: err.message });
    }
};

// @desc    Clone a public tool into user's own tenant space
// @route   POST /api/v1/marketplace/clone/:id
// @access  Private
exports.cloneTool = async (req, res, next) => {
    try {
        const sourceToolId = req.params.id;
        const clonerTenantId = req.tenantId;

        console.log(`[Marketplace] Tenant ${clonerTenantId} is cloning Tool ${sourceToolId}`);

        // 1. Validate the source tool
        const sourceTool = await Tool.findOne({ _id: sourceToolId, isPublic: true });

        if (!sourceTool) {
            return res.status(404).json({ success: false, error: 'Template not found or not public' });
        }

        if (sourceTool.tenantId.toString() === clonerTenantId.toString()) {
            return res.status(400).json({ success: false, error: 'You cannot clone your own tool' });
        }

        const clonerTenant = await Tenant.findById(clonerTenantId);
        if (!clonerTenant) {
            return res.status(404).json({ success: false, error: 'Your Tenant space was not found' });
        }

        // 2. Premium Access Check
        if (sourceTool.isPremium && clonerTenant.plan === 'free') {
            return res.status(403).json({
                success: false,
                error: 'This is a premium template. Please upgrade your plan to Pro or Enterprise to clone it.'
            });
        }

        // 3. Prevent Duplicate Clones
        const alreadyCloned = clonerTenant.clonedTools.find(ct => ct.toolId.toString() === sourceToolId.toString());
        if (alreadyCloned) {
            return res.status(400).json({ success: false, error: 'You have already cloned this tool' });
        }

        // 3. Payment / Revenue Share Logic Sandbox
        // We will assume UI verified payment intent previously via QR. Here we distribute the theoretical funds.
        const salePrice = sourceTool.price || 0;

        if (salePrice > 0) {
            const platformFeePercentage = 0.20; // 20% platform cut
            const creatorEarnings = salePrice * (1 - platformFeePercentage);

            // Increment creator wallet
            await Tenant.findByIdAndUpdate(sourceTool.tenantId, {
                $inc: { earningsBalance: creatorEarnings }
            });

            console.log(`[Marketplace] Distributed $${creatorEarnings} to Creator ${sourceTool.tenantId}`);
        }

        // Record the transaction for the buyer
        clonerTenant.clonedTools.push({
            toolId: sourceToolId,
            pricePaid: salePrice
        });
        await clonerTenant.save();

        // 4. Execute The Deep Clone
        // We take the latest version from the source tool and build a totally new Tool document
        const sourceLatestVersion = sourceTool.versions[sourceTool.versions.length - 1];

        const newTool = await Tool.create({
            tenantId: clonerTenantId,
            name: `${sourceTool.name} (Clone)`, // Let them rename later
            description: `Cloned from ${sourceTool.name}. ${sourceTool.description || ''}`,
            currentVersion: 1,
            versions: [{
                version: 1,
                schemas: sourceLatestVersion.schemas,
                layout: sourceLatestVersion.layout
            }],
            isPublic: false // Clones default to private
        });

        // 5. Spin up the actual MongoDB Collections dynamically (Schema Engine)
        // Pass the cloned schema configuration to the actual generator so tables are created!
        try {
            const schemasToGenerate = newTool.versions[0].schemas;
            for (const schemaDef of schemasToGenerate) {
                generateModel(newTool.tenantId.toString(), schemaDef.name, schemaDef.fields, [], req.user?.email);
            }
            console.log(`[Marketplace] Successfully instantiated dynamic schemas for Clone ${newTool._id}`);
        } catch (engineError) {
            console.error("[Marketplace] Error generating schemas during clone:", engineError);
            // Rollback clone creation if DB compilation fails
            await Tool.findByIdAndDelete(newTool._id);
            return res.status(500).json({ success: false, error: 'Failed to compile cloned application schemas' });
        }

        // 6. Update Marketplace Statistics
        sourceTool.clonesCount += 1;
        await sourceTool.save();

        res.status(200).json({
            success: true,
            data: newTool,
            message: 'Successfully cloned template! Check your Dashboard.'
        });

    } catch (err) {
        console.error('cloneTool Error:', err);
        if (typeof next === 'function') next(err);
        else res.status(500).json({ success: false, error: 'Server Error during cloning process', message: err.message });
    }
};

// @desc    Add a review to a public tool
// @route   POST /api/v1/marketplace/review/:id
// @access  Private
exports.addReview = async (req, res, next) => {
    try {
        const toolId = req.params.id;
        const tenantId = req.tenantId;
        const { rating, comment } = req.body;

        const tool = await Tool.findOne({ _id: toolId, isPublic: true });
        if (!tool) {
            return res.status(404).json({ success: false, error: 'Public tool not found' });
        }

        // Prevent creator from reviewing their own tool
        if (tool.tenantId.toString() === tenantId.toString()) {
            return res.status(400).json({ success: false, error: 'Creators cannot review their own tools' });
        }

        // Optional: Check if tenant has cloned it first before allowing review
        const tenant = await Tenant.findById(tenantId);
        const hasCloned = tenant.clonedTools.some(ct => ct.toolId.toString() === toolId.toString());
        if (!hasCloned) {
            return res.status(403).json({ success: false, error: 'You must clone this tool before reviewing it' });
        }

        // Upsert Review
        let review = await Review.findOne({ toolId, tenantId });

        if (review) {
            review.rating = rating;
            review.comment = comment;
            await review.save();
        } else {
            review = await Review.create({
                toolId,
                tenantId,
                rating,
                comment
            });
        }

        res.status(201).json({
            success: true,
            data: review,
            message: 'Review successfully tracked'
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, error: 'You have already reviewed this tool' });
        }
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error adding review' });
    }
};
