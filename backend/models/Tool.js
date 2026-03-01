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
    pages: [{
        name: { type: String, required: true },
        slug: { type: String, required: true },
        icon: { type: String },
        sections: [{ type: String }] // Array of tool slugs
    }],
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
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please provide a tool name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    slug: {
        type: String,
        required: true,
        unique: false,
        trim: true,
        lowercase: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        default: 0
    },
    clonesCount: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 5.0
    },
    reviewsCount: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String
    }],
    currentVersion: {
        type: Number,
        default: 1
    },
    versions: [ToolVersionSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Ensure (Tenant + Slug) is unique, AND allow (Public + Slug) uniqueness for Marketplace
toolSchema.index({ tenantId: 1, slug: 1 }, { unique: true });
toolSchema.index({ slug: 1, isPublic: 1 }, { unique: true, partialFilterExpression: { isPublic: true } });

// Auto-generate slug if not provided (pre-save hook already exists in logic usually, but I'll simplify)
toolSchema.pre('validate', function (next) {
    if (!this.slug && this.name) {
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    next();
});

module.exports = mongoose.model('Tool', toolSchema);
