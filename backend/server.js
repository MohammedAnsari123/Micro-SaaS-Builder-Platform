const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });
const express = require('express');
const cluster = require('cluster');
const os = require('os');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');
const logger = require('./utils/logger'); // Import Winston logger
require('./config/redis'); // Initialize Redis connection

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Set security headers
app.use(helmet());

// Sanitize data (prevent NoSQL injection) - Removed express-mongo-sanitize due to Node 24 compatibility bug
// app.use(mongoSanitize());

// Prevent XSS attacks (Removed xss-clean due to Node 24 incompatibility. Helmet + React escaping is sufficient.)
// app.use(xss());

// Rate limiting (100 reqs per 15 minutes per IP natively, increased to 1500 for demo platform heavily loading iframes)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1500
});
app.use('/api/', limiter);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/tools', require('./routes/toolRoutes'));
app.use('/api/v1/billing', require('./routes/billingRoutes'));
app.use('/api/v1/analytics', require('./routes/analyticsRoutes'));
app.use('/api/v1/marketplace', require('./routes/marketplaceRoutes'));
app.use('/api/v1/webhooks', require('./routes/webhookRoutes'));
app.use('/api/v1/tenant', require('./routes/tenantRoutes'));
app.use('/api/v1/templates', require('./routes/templateRoutes'));
app.use('/api/v1/user', require('./routes/userRoutes'));
app.use('/api/v1/dynamic/:collectionName', require('./routes/dynamicRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Backend Engine Running' });
});

// Use error handler middleware (must be after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// ============================================
// Horizontal Scaling via Node Cluster
// ============================================
if (cluster.isPrimary && process.env.NODE_ENV === 'production') {
    // Determine number of CPU cores
    const numCPUs = os.cpus().length;
    logger.info(`Primary cluster setting up ${numCPUs} workers...`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('online', (worker) => {
        logger.info(`Worker ${worker.process.pid} is online.`);
    });

    cluster.on('exit', (worker, code, signal) => {
        logger.error(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
        logger.info('Starting a new worker...');
        cluster.fork();
    });
} else {
    const server = app.listen(PORT, () => {
        logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT} with PID ${process.pid}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
        logger.error(`Unhandled Rejection Error: ${err.message}`);
        // Close server & exit process
        server.close(() => process.exit(1));
    });
}
