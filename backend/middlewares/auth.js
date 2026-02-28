const jwt = require('jsonwebtoken');
require('dotenv').config({ path: require('path').join(__dirname, '../.env'), override: true });
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
    console.log(`[AUTH DEBUG] protect called. next type: ${typeof next}`);
    // 10.3 Preview Mode Sandboxing
    if (req.headers['x-preview-mode'] === 'true') {
        if (req.method !== 'GET') {
            return res.status(403).json({
                success: false,
                message: 'Template Preview Mode: Write operations (POST, PUT, DELETE) are disabled.'
            });
        }
        // Assign a universal fake Tenant ID so queries execute cleanly but return empty/demo data
        req.tenantId = '000000000000000000000000';
        return next();
    }

    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        console.warn('Auth Failure: No token found in headers');
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            console.warn(`Auth Failure: User ${decoded.id} not found in database`);
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        req.user = user;
        req.tenantId = decoded.tenantId; // Attach tenantId to request

        next();
    } catch (err) {
        console.error(`Auth Failure: JWT Error - ${err.message}`);
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
};

// Protect admin-only routes (uses separate Admin model)
exports.protectAdmin = async (req, res, next) => {
    const Admin = require('../models/Admin');
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Admin access only' });
        }
        req.user = admin;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};
