const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true
    },
    customerEmail: {
        type: String,
        required: [true, 'Customer email is required'],
        trim: true
    },
    customerPhone: {
        type: String,
        trim: true
    },
    item: {
        type: String,
        required: [true, 'Booking item is required'],
        trim: true
    },
    itemId: {
        type: mongoose.Schema.ObjectId,
        default: null
    },
    bookingDate: {
        type: Date,
        required: [true, 'Booking date is required']
    },
    timeSlot: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    }
}, {
    timestamps: true
});

bookingSchema.index({ tenantId: 1, cloneId: 1, status: 1 });
bookingSchema.index({ tenantId: 1, cloneId: 1, bookingDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
