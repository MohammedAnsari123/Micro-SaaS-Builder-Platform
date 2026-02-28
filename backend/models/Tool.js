const mongoose = require('mongoose');

const SchemaFieldSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    required: { type: Boolean, default: false },
    unique: { type: Boolean, default: false }
});

const SchemaMetaSchema = new mongoose.Schema({
    tableName: { type: String, required: true },
    fields: [SchemaFieldSchema],
    indexes: [{ type: String }]
});

const ToolVersionSchema = new mongoose.Schema({
    version: { type: Number, required: true },
    schemas: [SchemaMetaSchema],

    // Core App Configurations
    layoutConfig: { type: mongoose.Schema.Types.Mixed, default: {} }, // Global sidebar, nav, branding

    // Generated Modules
    pages: [{ type: String }], // Array of active page names e.g. ["Dashboard", "Contacts"]
    instances: [{
        moduleType: String, // String representation e.g. 'crud_table', 'kanban_board', 'custom' 
        moduleSlug: String,
        pageName: String,     // The page this instance lives on
        collectionName: String, // E.g., 'contacts'
        config: { type: mongoose.Schema.Types.Mixed } // Instance specific overrides (like which fields to show in the table)
    }],
    createdAt: { type: Date, default: Date.now }
});

const toolSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true // Important for tenant isolation queries
    },
    name: {
        type: String,
        required: [true, 'Please provide a tool name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    slug: {
        type: String,
        index: true
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    currentVersion: {
        type: Number,
        default: 1
    },
    versions: [ToolVersionSchema],
    // Marketplace & Ecosystem Fields
    isPublic: {
        type: Boolean,
        default: false,
        index: true
    },
    isPremium: {
        type: Boolean,
        default: false,
        index: true
    },
    price: {
        type: Number,
        default: 0, // Price in cents. 0 = Free
        min: 0
    },
    category: {
        type: String,
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    clonesCount: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewsCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for rendering a tenant's specific tools quickly
toolSchema.index({ tenantId: 1, createdAt: -1 });

// Compound index for filtering the public Marketplace
toolSchema.index({ isPublic: 1, category: 1, rating: -1 });

// Text index for Marketplace search query optimization
toolSchema.index({ name: 'text', description: 'text', tags: 'text' });

toolSchema.pre('save', async function () {
    if ((this.isModified('name') || !this.slug) && this.name) {
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
});

module.exports = mongoose.model('Tool', toolSchema);
