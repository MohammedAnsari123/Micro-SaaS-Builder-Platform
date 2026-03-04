const Template = require('../models/Template');
const TemplateClone = require('../models/TemplateClone');
const Content = require('../models/Content');
const Tenant = require('../models/Tenant');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Event = require('../models/Event');
const seedData = require('../seeders/seedData');

// @desc    Get all public templates
// @route   GET /api/v1/templates
// @access  Public
exports.getTemplates = async (req, res, next) => {
    try {
        const { type, category } = req.query;
        const filter = { isPublic: true };
        if (type) filter.type = type;
        if (category) filter.category = category;

        const templates = await Template.find(filter).sort('-createdAt');
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

        res.status(200).json({ success: true, data: template });
    } catch (err) {
        console.error('getTemplateBySlug Error:', err);
        if (typeof next === 'function') next(err);
        else res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

// @desc    Clone a Template — create content, seed data, assign theme
// @route   POST /api/v1/templates/clone/:id
// @access  Private
exports.cloneTemplate = async (req, res, next) => {
    try {
        const template = await Template.findById(req.params.id);

        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        // 1. Create TemplateClone record FIRST to get a cloneId
        const newClone = await TemplateClone.create({
            tenantId: req.tenantId,
            templateId: template._id,
            toolId: req.tenantId,
            templateVersion: template.version || 1,
            cloneSource: 'gallery',
            templateSnapshotName: template.name,
            theme: {
                primary: template.theme.primary,
                secondary: template.theme.secondary,
                accent: template.theme.accent,
                background: template.theme.background,
                text: template.theme.text,
                font: template.theme.font
            },
            siteSettings: {
                siteName: template.name,
                tagline: template.description || '',
                socialLinks: { facebook: '', twitter: '', instagram: '', linkedin: '', github: '' }
            }
        });

        const cloneId = newClone._id;

        // 2. Seed content from template's defaultContent (Isolated by cloneId)
        if (template.defaultContent && template.defaultContent.length > 0) {
            const contentDocs = template.defaultContent.map(c => ({
                tenantId: req.tenantId,
                cloneId: cloneId,
                page: c.page,
                section: c.section,
                data: c.data,
                order: c.order || 0
            }));
            await Content.insertMany(contentDocs);
        }

        // 3. Seed module-specific data (Isolated by cloneId)
        const templateSeedData = seedData[template.slug];
        if (templateSeedData) {
            if (templateSeedData.products && template.modules.includes('product')) {
                const productDocs = templateSeedData.products.map(p => ({
                    ...p,
                    tenantId: req.tenantId,
                    cloneId: cloneId
                }));
                await Product.insertMany(productDocs);
            }

            if (templateSeedData.services && template.modules.includes('service')) {
                const serviceDocs = templateSeedData.services.map(s => ({
                    ...s,
                    tenantId: req.tenantId,
                    cloneId: cloneId
                }));
                await Service.insertMany(serviceDocs);
            }

            if (templateSeedData.events && template.modules.includes('event')) {
                const eventDocs = templateSeedData.events.map(e => ({
                    ...e,
                    tenantId: req.tenantId,
                    cloneId: cloneId
                }));
                await Event.insertMany(eventDocs);
            }
        }

        res.status(201).json({
            success: true,
            message: `Template "${template.name}" successfully cloned as a new independent site`,
            data: {
                cloneId: newClone._id,
                templateId: template._id,
                templateName: template.name,
                templateSlug: template.slug,
                theme: newClone.theme,
                modules: template.modules
            }
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
            .populate('templateId', 'name slug type category theme pages modules')
            .sort('-clonedAt');

        res.status(200).json({ success: true, count: clones.length, data: clones });
    } catch (err) {
        console.error('getMyClones Error:', err);
        if (typeof next === 'function') next(err);
        else res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

// @desc    Get tenant info with template for public rendering
// @route   GET /api/v1/templates/site/:tenantId
// @access  Public
exports.getTenantSite = async (req, res, next) => {
    try {
        const tenant = await Tenant.findById(req.params.tenantId)
            .populate('templateId', 'name slug type category pages modules theme');

        if (!tenant || !tenant.templateId) {
            return res.status(404).json({ success: false, message: 'Site not found' });
        }

        res.status(200).json({
            success: true,
            data: {
                tenantId: tenant._id,
                tenantName: tenant.name,
                template: tenant.templateId,
                theme: tenant.theme,
                siteSettings: tenant.siteSettings,
                plan: tenant.subscriptionPlan
            }
        });
    } catch (err) {
        if (typeof next === 'function') next(err);
        else res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

// @desc    Get tenant site by vanity URL (template slug + email prefix + optional cloneId)
// @route   GET /api/v1/templates/resolve/:templateSlug/:emailPrefix/:cloneId?
// @access  Public
exports.resolveSite = async (req, res, next) => {
    try {
        const { templateSlug, emailPrefix, cloneId } = req.params;
        const User = require('../models/User');

        // 1. Find user by email prefix
        const user = await User.findOne({
            email: { $regex: new RegExp(`^${emailPrefix}@`, 'i') }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Site owner not found' });
        }

        // 2. Find any tenant owned by user (to get tenantId)
        const tenant = await Tenant.findOne({ ownerId: user._id });
        if (!tenant) {
            return res.status(404).json({ success: false, message: 'Site not found' });
        }

        // 3. Find the actual template by slug
        const Template = require('../models/Template');
        const targetTemplate = await Template.findOne({ slug: templateSlug });
        if (!targetTemplate) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        // 4. Find the TemplateClone record for this specific tenant and template
        const TemplateClone = require('../models/TemplateClone');
        const query = {
            tenantId: tenant._id,
            templateId: targetTemplate._id
        };

        // If cloneId provided, use it. Otherwise find the most recent one for this template.
        if (cloneId) {
            query._id = cloneId;
        }

        const clone = await TemplateClone.findOne(query)
            .populate('templateId', 'name slug type category pages modules theme')
            .sort('-clonedAt');

        if (!clone) {
            return res.status(404).json({ success: false, message: 'Site instance not found' });
        }

        res.status(200).json({
            success: true,
            data: {
                tenantId: tenant._id,
                cloneId: clone._id,
                tenantName: tenant.name,
                template: clone.templateId,
                theme: clone.theme,
                siteSettings: clone.siteSettings,
                plan: tenant.subscriptionPlan
            }
        });
    } catch (err) {
        if (typeof next === 'function') next(err);
        else res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
};

// @desc    Update clone theme
// @route   PUT /api/v1/templates/theme/:cloneId
// @access  Private
exports.updateTheme = async (req, res, next) => {
    try {
        const { primary, secondary, accent, background, text, font } = req.body;
        const { cloneId } = req.params;

        const clone = await TemplateClone.findOne({ _id: cloneId, tenantId: req.tenantId });
        if (!clone) {
            return res.status(404).json({ success: false, message: 'Clone not found' });
        }

        if (primary) clone.theme.primary = primary;
        if (secondary) clone.theme.secondary = secondary;
        if (accent) clone.theme.accent = accent;
        if (background) clone.theme.background = background;
        if (text) clone.theme.text = text;
        if (font) clone.theme.font = font;

        await clone.save();
        res.status(200).json({ success: true, data: clone.theme });
    } catch (err) {
        next(err);
    }
};

// @desc    Update site settings for a clone
// @route   PUT /api/v1/templates/settings/:cloneId
// @access  Private
exports.updateSiteSettings = async (req, res, next) => {
    try {
        const { siteName, tagline, logo, favicon, socialLinks } = req.body;
        const { cloneId } = req.params;

        const clone = await TemplateClone.findOne({ _id: cloneId, tenantId: req.tenantId });
        if (!clone) {
            return res.status(404).json({ success: false, message: 'Clone not found' });
        }

        if (siteName !== undefined) clone.siteSettings.siteName = siteName;
        if (tagline !== undefined) clone.siteSettings.tagline = tagline;
        if (logo !== undefined) clone.siteSettings.logo = logo;
        if (favicon !== undefined) clone.siteSettings.favicon = favicon;
        if (socialLinks) {
            clone.siteSettings.socialLinks = {
                ...clone.siteSettings.socialLinks.toObject?.() || {},
                ...socialLinks
            };
        }

        await clone.save();
        res.status(200).json({ success: true, data: clone.siteSettings });
    } catch (err) {
        next(err);
    }
};
