const User = require('../models/User');
const Tenant = require('../models/Tenant');

// Helper to send token response
const sendTokenResponse = (user, statusCode, res) => {
    const accessToken = user.getSignedJwtToken();
    const refreshToken = user.getRefreshToken();

    res.status(statusCode).json({
        success: true,
        accessToken,
        refreshToken
    });
};

// @desc    Register user and create tenant
// @route   POST /api/v1/auth/register
// @access  Public
const Template = require('../models/Template');

// @desc    Register user and create tenant
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, tenantName } = req.body;

        // 1. Check if tenant exists
        let tenant = await Tenant.findOne({ name: tenantName });
        if (tenant) {
            return res.status(400).json({ success: false, message: 'Tenant name already taken' });
        }

        // 2. Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // 3. Find a default template to assign
        let defaultTemplate = await Template.findOne({ isPublic: true });

        // If no templates exist in DB, create a minimal "Starter" template to unblock registration
        if (!defaultTemplate) {
            defaultTemplate = await Template.create({
                name: 'Starter Template',
                slug: 'starter-' + Date.now(),
                isPublic: true,
                layoutType: 'sidebar',
                pages: [{ name: 'Dashboard', slug: 'dashboard', icon: 'LayoutDashboard' }]
            });
        }

        const templateId = defaultTemplate._id;

        // 4. Create User first
        user = await User.create({
            name,
            email,
            password,
            role: 'owner'
        });

        // 5. Create Tenant linked to User and Template
        tenant = await Tenant.create({
            name: tenantName,
            ownerId: user._id,
            templateId: templateId,
            plan: 'free'
        });

        // 6. Link User back to Tenant
        user.tenantId = tenant._id;
        await user.save({ validateBeforeSave: false });

        // 7. NEW: Create a Tool instance by cloning the default template
        const Tool = require('../models/Tool');
        const TemplateClone = require('../models/TemplateClone');

        // Create the Tool document
        const tool = await Tool.create({
            tenantId: tenant._id,
            name: `${defaultTemplate.name} (Clone)`,
            description: defaultTemplate.description,
            currentVersion: 1,
            category: defaultTemplate.category || 'General',
            versions: [{
                version: 1,
                pages: defaultTemplate.pages ? defaultTemplate.pages.map(p => ({
                    name: p.name,
                    slug: p.slug,
                    icon: p.icon,
                    sections: p.sections || []
                })) : [{ name: 'Dashboard', slug: 'dashboard', icon: 'LayoutDashboard', sections: [] }],
                layoutConfig: {
                    type: defaultTemplate.layoutType || 'sidebar',
                    theme: defaultTemplate.colorTheme || 'blue'
                },
                instances: [] // Initial empty state
            }],
            isPublic: false
        });

        // Create the TemplateClone record pointing to the NEW Tool
        await TemplateClone.create({
            tenantId: tenant._id,
            templateId: templateId,
            toolId: tool._id,
            templateVersion: 1,
            cloneSource: 'gallery',
            templateSnapshotName: defaultTemplate.name
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// Admin Secret Key for registration (set in .env or default)
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;
const Admin = require('../models/Admin');

// @desc    Register admin user
// @route   POST /api/v1/auth/admin/register
// @access  Public (requires secret key)
exports.registerAdmin = async (req, res, next) => {
    try {
        const { name, email, password, secretKey } = req.body;

        if (secretKey !== ADMIN_SECRET_KEY) {
            return res.status(403).json({ success: false, message: 'Invalid admin secret key' });
        }

        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        admin = await Admin.create({ name, email, password });

        const accessToken = admin.getSignedJwtToken();
        const refreshToken = admin.getRefreshToken();

        res.status(201).json({
            success: true,
            accessToken,
            refreshToken
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Login admin user
// @route   POST /api/v1/auth/admin/login
// @access  Public
exports.loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        }

        const isMatch = await admin.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        }

        // Update login tracking
        admin.lastLogin = new Date();
        admin.loginCount += 1;
        await admin.save({ validateBeforeSave: false });

        const accessToken = admin.getSignedJwtToken();
        const refreshToken = admin.getRefreshToken();

        res.status(200).json({
            success: true,
            accessToken,
            refreshToken
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('tenantId', 'name plan');
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

