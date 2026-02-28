const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    toolId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tool',
        required: true,
        index: true
    },
    tenantId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tenant',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating between 1 and 5'],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        maxlength: [500, 'Review comment cannot be more than 500 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure a tenant can only review a tool once
reviewSchema.index({ toolId: 1, tenantId: 1 }, { unique: true });

// Static method to dynamically calculate average rating on save
reviewSchema.statics.getAverageRating = async function (toolId) {
    const obj = await this.aggregate([
        {
            $match: { toolId: toolId }
        },
        {
            $group: {
                _id: '$toolId',
                averageRating: { $avg: '$rating' },
                numOfReviews: { $sum: 1 }
            }
        }
    ]);

    try {
        await this.model('Tool').findByIdAndUpdate(toolId, {
            rating: obj[0]?.averageRating || 0,
            reviewsCount: obj[0]?.numOfReviews || 0
        });
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageRating after saving/updating a review
reviewSchema.post('save', async function () {
    await this.constructor.getAverageRating(this.toolId);
});

reviewSchema.post('remove', async function () {
    await this.constructor.getAverageRating(this.toolId);
});

module.exports = mongoose.model('Review', reviewSchema);
