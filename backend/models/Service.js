const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true
    },
    cloneId: {
        type: mongoose.Schema.ObjectId,
        ref: 'TemplateClone',
        index: true
    },
    name: {
        type: String,
        required: [true, 'Service name is required'],
        trim: true,
        maxlength: [150, 'Name cannot exceed 150 characters']
    },
    description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    duration: {
        type: String,
        trim: true,
        default: '60 min'
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        trim: true,
        default: 'General'
    },
    image: {
        type: String,
        default: ''
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

serviceSchema.index({ tenantId: 1, category: 1 });
serviceSchema.index({ tenantId: 1, isAvailable: 1 });

module.exports = mongoose.model('Service', serviceSchema);
