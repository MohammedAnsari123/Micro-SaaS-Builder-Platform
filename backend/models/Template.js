const mongoose = require('mongoose');

// We reuse the generic architecture definitions
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

const templateSchema = new mongoose.Schema({
    schemaConfig: {
        tables: [SchemaMetaSchema]
    },
    name: {
        type: String,
        required: [true, 'Please provide a template name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    category: {
        type: String,
        trim: true,
        default: 'General'
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    layoutType: {
        type: String,
        enum: ['sidebar', 'navbar', 'hybrid'],
        default: 'sidebar'
    },
    themeId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Theme'
    },
    pages: [{
        name: { type: String, required: true },
        slug: { type: String, required: true },
        icon: { type: String }, // Lucide icon name
        sections: [{ type: String }] // Array of tool slugs or section names
    }],
    defaultTools: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Tool'
    }],
    version: {
        type: Number,
        default: 1
    },
    colorTheme: {
        type: String,
        default: 'blue'
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Performance index for rapid slug lookup on public Gallery queries
templateSchema.index({ slug: 1 });
templateSchema.index({ isPublic: 1 });

module.exports = mongoose.model('Template', templateSchema);
