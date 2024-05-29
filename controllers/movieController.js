const Movie = require('../models/movieModel');
const cloudinary = require('../config/cloudinaryConfig');

const fs = require('fs');
const path = require('path');

// Adding new movie details
const addMovie = async (req, res) => {
    const { title, releaseDate, director, description, genre, category } = req.body;

    try {
        let moviePicUrl = null;
        if (req.file) {
            const filePath = path.join(__dirname, '../', req.file.path);
            if (fs.existsSync(filePath)) {
                const result = await cloudinary.uploader.upload(filePath, {
                    folder: 'movie_pics',
                });
                console.log('Cloudinary Upload Result:', result);
                moviePicUrl = result.secure_url;

                // Remove the file from the server after upload
                fs.unlinkSync(filePath);
            } else {
                throw new Error(`File not found: ${filePath}`);
            }
        }

        const newMovie = new Movie({
            title,
            releaseDate,
            director,
            description,
            genre: genre.split(','), // Ensure genre is an array
            category,
            moviePic: moviePicUrl,
           
        });

        await newMovie.save();
        res.status(201).json({ message: 'Movie added successfully', movie: newMovie, imageUrl: moviePicUrl });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

// Retrieving All Movies
const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Retrieving a Movie by ID
const getMovieById = async (req, res) => {
    const { id } = req.params;
    try {
        const movie = await Movie.findById(id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = {
    addMovie,
    getMovies,
    getMovieById
};

