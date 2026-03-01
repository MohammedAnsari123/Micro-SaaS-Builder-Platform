const mongoose = require('mongoose');

// Cache for tenant connections to avoid creating a new pool on every request
const tenantConnections = new Map();

/**
 * Gets or creates a Mongoose connection for a specific tenant database.
 * The main database connection remains untouched.
 * 
 * @param {string} emailIdentifier - The sanitized email of the user
 * @returns {mongoose.Connection} The tenant's isolated database connection
 */
const getTenantConnection = async (emailIdentifier) => {
    if (!emailIdentifier) {
        throw new Error('Email identifier is required to establish a tenant connection');
    }

    const dbName = `codeara_${emailIdentifier}`;

    // Return cached connection if it exists and is open
    if (tenantConnections.has(dbName)) {
        const conn = tenantConnections.get(dbName);
        if (conn.readyState === 1) { // 1 = connected
            return conn;
        }
    }

    // Determine the base URI without the database name
    const uriObj = new URL(process.env.MONGO_URI);
    uriObj.pathname = `/${dbName}`;
    const tenantUri = uriObj.toString();

    // Create a new connection pool for this tenant
    const connection = mongoose.createConnection(tenantUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
    });

    // Event listeners for debugging
    connection.on('connected', () => {
        console.log(`📡 [TenantDb] Connected to isolated DB: ${dbName}`);
    });

    connection.on('error', (err) => {
        console.error(`❌ [TenantDb] Error connecting to ${dbName}:`, err);
    });

    connection.on('disconnected', () => {
        console.log(`🔌 [TenantDb] Disconnected from ${dbName}`);
        tenantConnections.delete(dbName);
    });

    // Add to cache
    tenantConnections.set(dbName, connection);

    return connection;
};

/**
 * Cleanup function to close idle connections.
 * In a real-world scenario, you might run this periodically.
 */
const closeTenantConnection = async (emailIdentifier) => {
    const dbName = `codeara_${emailIdentifier}`;
    if (tenantConnections.has(dbName)) {
        const conn = tenantConnections.get(dbName);
        await conn.close();
        tenantConnections.delete(dbName);
        console.log(`🔌 [TenantDb] Explicitly closed connection to ${dbName}`);
    }
};

module.exports = {
    getTenantConnection,
    closeTenantConnection
};
