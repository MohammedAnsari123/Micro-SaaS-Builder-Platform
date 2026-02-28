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
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    colorTheme: {
        type: String,
        default: 'indigo'
    },
    // Blueprint Configuration
    schemaConfig: { type: mongoose.Schema.Types.Mixed, default: {} },
    layoutJSON: { type: mongoose.Schema.Types.Mixed, default: {} },
    routeConfig: { type: mongoose.Schema.Types.Mixed, default: {} },
    defaultPages: [{ type: mongoose.Schema.Types.Mixed }],
    sampleData: { type: mongoose.Schema.Types.Mixed, default: {} },

    // Future Marketplace
    previewImages: [{ type: String }],
    isPublic: { type: Boolean, default: true },
    isPremium: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    creatorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tenant',
        default: null
    },
    revenueShare: { type: Number, default: 0.3 },
    clonesCount: { type: Number, default: 0 },
    category: { type: String, trim: true, default: 'General' },
    tags: [{ type: String, trim: true }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Performance index for rapid slug lookup on public Gallery queries
templateSchema.index({ slug: 1 });
templateSchema.index({ isPublic: 1 });

module.exports = mongoose.model('Template', templateSchema);
