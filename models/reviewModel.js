const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    reviewText: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    status: {
        type: String,
        enum: ['active', 'deleted'],
        default: 'active',
    },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

