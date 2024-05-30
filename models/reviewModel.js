// Importing Mongoose
const mongoose = require('mongoose');

// Defining Review Schema
const reviewSchema = mongoose.Schema({
    // Schema definition properties
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

// Creating Review Model
const Review = mongoose.model('Review', reviewSchema);

// Exporting Review Model
module.exports = Review;

