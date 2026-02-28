const Tool = require('../models/Tool');
const { generateModel } = require('../schema-engine/generator');
const axios = require('axios');
const { aiGenerationQueue } = require('../jobs/queue');

// Helper variable for python AI service
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000/api/v1';

// @desc    Generate Tool Architecture via AI
// @route   POST /api/v1/tools/generate
// @access  Private
exports.generateTool = async (req, res, next) => {
    try {
        const { prompt, name, description } = req.body;

        if (!prompt || !name) {
            return res.status(400).json({ success: false, message: 'Please provide a tool name and AI prompt' });
        }

        // Push generation request to Bull background worker instead of waiting synchronously
        const job = await aiGenerationQueue.add({
            prompt,
            name,
            description,
            tenantId: req.tenantId,
            email: req.user?.email
        });

        res.status(202).json({
            success: true,
            message: 'AI Generation started asynchronously.',
            jobId: job.id
        });

    } catch (err) {
        next(err);
    }
};

// @desc    Check AI Generation Job Status
// @route   GET /api/v1/tools/job/:jobId
// @access  Private
exports.getJobStatus = async (req, res, next) => {
    try {
        const job = await aiGenerationQueue.getJob(req.params.jobId);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        const state = await job.getState();
        const progress = job._progress;
        const result = job.returnvalue; // Bull stores the return value of the process func here
        const failedReason = job.failedReason;

        // If the AI background job succeeded, we need to create the actual Mongo models right now before returning to client
        if (state === 'completed' && result && !job.data.modelsGenerated) {
            const { models, routes, ui_layout_config } = result.data;
            const { name, description, tenantId } = job.data;

            const tool = await Tool.create({
                tenantId,
                name,
                description,
                currentVersion: 1,
                versions: [
                    {
                        version: 1,
                        schemas: models.map(m => ({
                            tableName: m.name,
                            fields: m.fields,
                            indexes: m.indexes
                        })),
                        layout: ui_layout_config
                    }
                ]
            });

            if (models && models.length > 0) {
                models.forEach(modelDef => {
                    generateModel(
                        tenantId,
                        modelDef.name,
                        modelDef.fields,
                        modelDef.indexes,
                        job.data.email
                    );
                });
            }

            // Mark job as fully processed in DB so we don't recreate the Tool on subsequent polls
            await job.update({ ...job.data, modelsGenerated: true, toolId: tool._id, routes });

            return res.status(200).json({
                success: true,
                state,
                data: { tool, generatedRoutes: routes }
            });
        }

        if (state === 'completed' && job.data.modelsGenerated) {
            // Already processed in a previous poll
            const tool = await Tool.findById(job.data.toolId);
            return res.status(200).json({
                success: true,
                state,
                data: { tool, generatedRoutes: job.data.routes }
            });
        }

        res.status(200).json({ success: true, state, progress, error: failedReason });
    } catch (err) {
        next(err);
    }
};

// @desc    Create a new Tool manually (without AI)
// @route   POST /api/v1/tools
// @access  Private
exports.createTool = async (req, res, next) => {
    try {
        const { name, description, schemas, layout } = req.body;

        const tool = await Tool.create({
            tenantId: req.tenantId,
            name,
            description,
            currentVersion: 1,
            versions: [
                {
                    version: 1,
                    schemas,
                    layout
                }
            ]
        });

        if (schemas && schemas.length > 0) {
            schemas.forEach(schemaDef => {
                generateModel(
                    req.tenantId,
                    schemaDef.tableName,
                    schemaDef.fields,
                    schemaDef.indexes,
                    req.user?.email
                );
            });
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

// @desc    Resolve tool by Vanity URL (Name + Email Prefix)
// @route   GET /api/v1/tools/resolve/:templateName/:emailPrefix
// @access  Public
exports.resolveToolByVanity = async (req, res, next) => {
    try {
        const { templateName, emailPrefix } = req.params;
        const User = require('../models/User');

        // 1. Find the user whose email starts with the prefix
        const user = await User.findOne({
            email: { $regex: new RegExp(`^${emailPrefix}@`, 'i') }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Platform owner not found for this prefix' });
        }

        // 2. Slugify the incoming templateName to match DB format
        const slugifiedName = templateName
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');

        // 3. Find the tool matching the slug and belonging to that user's tenant
        const tool = await Tool.findOne({
            slug: slugifiedName,
            tenantId: user.tenantId
        });

        if (!tool) {
            return res.status(404).json({ success: false, message: `Tool with slug '${slugifiedName}' not found for user ${emailPrefix}` });
        }

        res.status(200).json({
            success: true,
            data: tool
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

        if (name) tool.name = name;
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
