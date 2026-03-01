const Template = require('../models/Template');
const TemplateClone = require('../models/TemplateClone');
const Tool = require('../models/Tool');
const { generateModel } = require('../schema-engine/generator');

// @desc    Get all public templates
// @route   GET /api/v1/templates
// @access  Public
exports.getTemplates = async (req, res, next) => {
    try {
        const templates = await Template.find({ isPublic: true }).sort('-createdAt');
        res.status(200).json({ success: true, count: templates.length, data: templates });
    } catch (err) {
        console.error('getTemplates Error:', err);
        if (typeof next === 'function') next(err);
        else res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

// @desc    Get single template by slug for Preview
// @route   GET /api/v1/templates/:slug
// @access  Public
exports.getTemplateBySlug = async (req, res, next) => {
    try {
        const template = await Template.findOne({ slug: req.params.slug, isPublic: true });

        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        res.status(200).json({
            success: true,
            data: template
        });
    } catch (err) {
        console.error('getTemplateBySlug Error:', err);
        if (typeof next === 'function') next(err);
        else res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

// @desc    Clone a Template into a User's Tool
// @route   POST /api/v1/templates/clone/:id
// @access  Private
exports.cloneTemplate = async (req, res, next) => {
    console.log(">>> [DEBUG] cloneTemplate REACHED!");
    console.log(">>> [DEBUG] Request ID:", req.params.id);
    console.log(">>> [DEBUG] User Email:", req.user?.email);
    try {
        console.log(`[DEBUG] cloneTemplate called. params.id: ${req.params.id}, tenantId: ${req.tenantId}`);
        console.log(`[DEBUG] next type: ${typeof next}`);

        const template = await Template.findById(req.params.id);

        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        // 1. Convert the Template's schemaConfig.tables into the array format for Tool versions
        const schemaArray = [];
        if (template.schemaConfig && template.schemaConfig.tables) {
            for (const table of template.schemaConfig.tables) {
                schemaArray.push({
                    tableName: table.name,
                    fields: table.fields || [],
                    indexes: table.indexes || []
                });
            }
        }

        // 2. Build instances from pages (previously defaultPages)
        const generatedInstances = [];
        const sourcePages = template.pages || [];

        if (sourcePages.length > 0) {
            for (const page of sourcePages) {
                const safeName = String(page.name || 'Page');
                const firstSection = page.sections && page.sections.length > 0 ? page.sections[0] : 'crud_table';

                generatedInstances.push({
                    moduleType: firstSection,
                    moduleSlug: firstSection,
                    pageName: safeName,
                    collectionName: page.slug || safeName.toLowerCase().replace(/ /g, '_'),
                    config: {}
                });
            }
        }

        // 3. Create a pristine new Tool instance under the logged in Tenant
        const toolPages = sourcePages.length > 0
            ? sourcePages.map(p => ({
                name: p.name,
                slug: p.slug,
                icon: p.icon,
                sections: p.sections || []
            }))
            : [{ name: 'Dashboard', slug: 'dashboard', icon: 'LayoutDashboard', sections: [] }];

        const tool = await Tool.create({
            tenantId: req.tenantId,
            name: `${template.name} (Clone)`,
            description: template.description,
            currentVersion: 1,
            category: template.category || template.slug,
            layoutType: template.layoutType || 'sidebar',
            versions: [
                {
                    version: 1,
                    schemas: schemaArray,
                    layoutConfig: {
                        type: template.layoutType || 'sidebar',
                        theme: template.colorTheme || 'blue'
                    },
                    pages: toolPages,
                    instances: generatedInstances
                }
            ]
        });

        // 4. Generate the actual MongoDB Collections physically via the schema-engine
        if (schemaArray.length > 0) {
            schemaArray.forEach(schemaDef => {
                generateModel(
                    req.tenantId,
                    schemaDef.tableName,
                    schemaDef.fields,
                    schemaDef.indexes,
                    req.user?.email
                );
            });
        }

        // 5. Save TemplateClone record for tracking
        await TemplateClone.create({
            tenantId: req.tenantId,
            templateId: template._id,
            toolId: tool._id,
            templateVersion: 1,
            creatorId: template.creatorId || null,
            cloneSource: 'gallery',
            templateSnapshotName: template.name
        });

        // 6. Increment analytics counter on the Template
        template.clonesCount = (template.clonesCount || 0) + 1;
        await template.save();

        res.status(201).json({
            success: true,
            message: 'Template successfully cloned into a new Tool Instance',
            data: tool
        });
    } catch (err) {
        console.error("Clone Error:", err);
        if (typeof next === 'function') {
            next(err);
        } else {
            res.status(500).json({
                success: false,
                message: err.message || 'Internal Server Error',
                error: err.stack
            });
        }
    }
};

// @desc    Get all clones by the current tenant
// @route   GET /api/v1/templates/clones
// @access  Private
exports.getMyClones = async (req, res, next) => {
    try {
        const clones = await TemplateClone.find({ tenantId: req.tenantId })
            .populate('templateId', 'name slug colorTheme category')
            .populate('toolId', 'name slug')
            .sort('-clonedAt');

        res.status(200).json({ success: true, count: clones.length, data: clones });
    } catch (err) {
        console.error('getMyClones Error:', err);
        if (typeof next === 'function') next(err);
        else res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
};
