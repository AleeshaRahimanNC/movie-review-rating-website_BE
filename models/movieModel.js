const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    genre: {
        type: [String],
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    moviePic: {
        type: String,
        required: false, // Optional if moviePic is not always provided
    },
    aggregatedRating: {
        type: Number,
        default: 0,
    },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;

