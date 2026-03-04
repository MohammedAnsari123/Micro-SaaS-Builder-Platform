const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
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
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    date: {
        type: Date,
        required: [true, 'Event date is required']
    },
    endDate: {
        type: Date
    },
    venue: {
        type: String,
        trim: true
    },
    capacity: {
        type: Number,
        default: 100,
        min: [1, 'Capacity must be at least 1']
    },
    registeredCount: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        trim: true,
        default: 'General'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

eventSchema.index({ tenantId: 1, date: 1 });
eventSchema.index({ tenantId: 1, isActive: 1 });

module.exports = mongoose.model('Event', eventSchema);
