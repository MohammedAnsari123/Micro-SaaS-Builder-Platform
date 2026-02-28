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
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, tenantName } = req.body;

        // Check if tenant exists
        let tenant = await Tenant.findOne({ name: tenantName });
        if (tenant) {
            return res.status(400).json({ success: false, message: 'Tenant name already taken' });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // Create Tenant
        tenant = await Tenant.create({
            name: tenantName,
            plan: 'free'
        });

        // Create User linked to Tenant
        user = await User.create({
            name,
            email,
            password,
            role: 'owner', // First user is the owner
            tenantId: tenant._id
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

