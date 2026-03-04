const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true
    },
    cloneId: {
        type: mongoose.Schema.ObjectId,
        ref: 'TemplateClone',
        required: true,
        index: true
    },
    eventId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['registered', 'attended', 'cancelled'],
        default: 'registered'
    }
}, {
    timestamps: true
});

registrationSchema.index({ tenantId: 1, cloneId: 1, eventId: 1 });
registrationSchema.index({ tenantId: 1, cloneId: 1, eventId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
