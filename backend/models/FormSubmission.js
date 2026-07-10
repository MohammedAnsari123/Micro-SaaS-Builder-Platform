const mongoose = require('mongoose');

const formSubmissionSchema = new mongoose.Schema({
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
    formSlug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    formTitle: {
        type: String,
        default: 'Custom Form'
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('FormSubmission', formSubmissionSchema);
