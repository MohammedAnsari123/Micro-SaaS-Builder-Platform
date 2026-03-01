const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a theme name'],
        trim: true
    },
    colors: {
        primary: { type: String, default: '#3b82f6' },
        secondary: { type: String, default: '#64748b' },
        background: { type: String, default: '#f8fafc' },
        text: { type: String, default: '#0f172a' },
        accent: { type: String, default: '#10b981' }
    },
    typography: {
        fontFamily: { type: String, default: 'Inter, sans-serif' },
        fontSize: { type: String, default: '16px' }
    },
    version: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Theme', themeSchema);
