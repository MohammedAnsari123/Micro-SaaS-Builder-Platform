const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
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
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

contactMessageSchema.index({ tenantId: 1, cloneId: 1, createdAt: -1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
