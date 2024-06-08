// Imports and Setup
const Movie = require("../models/movieModel");
const cloudinary = require("../config/cloudinaryConfig");
const fs = require("fs");
const path = require("path");


// Adding new movie details
const addMovie = async (req, res) => {
  const { title, releaseDate, director, description, genre, category } =
    req.body;

  // Handling the Movie Picture Upload
  try {
    let moviePicUrl = null;
    if (req.file) {
      const filePath = path.join(__dirname, "../", req.file.path); // Construct the file path
      if (fs.existsSync(filePath)) {
        // Check if the file exists at the specified path

        // Code to upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, {
          folder: "movie_pics",
        });
        console.log("Cloudinary Upload Result:", result);
        moviePicUrl = result.secure_url; // Store the URL of the uploaded image

        // Remove the file from the server after upload
        fs.unlinkSync(filePath);
      } else {
        throw new Error(`File not found: ${filePath}`);
      }
    }

    // Creating and Saving the Movie Document
    const newMovie = new Movie({
      title,
      releaseDate,
      director,
      description,
      genre: genre.split(","), // Ensure genre is an array
      category,
      moviePic: moviePicUrl,
    });

    await newMovie.save();
    res
      .status(201)
      .json({
        message: "Movie added successfully",
        movie: newMovie,
        imageUrl: moviePicUrl,
      });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// Retrieving All Movies
const getMovies = async (req, res) => {
  try {
    const genre = req.query.genre; // Extract genre from query parameters
    const category = req.query.category; // Extract category from query parameters

    // Initialize an empty query object
    let query = {};

    // Add genre filter to query if a specific genre is provided and it's not 'top-rated'
    if (genre && genre !== 'top-rated') {
      query.genre = { $in: [genre] };
    }

    // Add category filter to query if a specific category is provided
    if (category) {
      query.category = category;
    }

    let movies;
    // Fetch top 3 rated movies if 'top-rated' query is provided
    if (genre === 'top-rated') {
      movies = await Movie.find().sort({ aggregatedRating: -1 }).limit(3).select('title moviePic aggregatedRating');
    } else {
      // Fetch all movies or movies filtered by genre
      movies = await Movie.find(query).sort({ aggregatedRating: -1 });
    }

    // Send the response with the retrieved movies
    res.status(200).json(movies);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Retrieving a Movie by ID
const getMovieById = async (req, res) => {
  // The below line extracts the id parameter from the request's URL parameters.
  const { id } = req.params;
  try {
    // The below line uses Mongoose to find a single document in the Movie collection by its ID.
    const movie = await Movie.findById(id);

    // Check if Movie Exists
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    // Sending the Response
    res.status(200).json(movie);
  } catch (error) {
    // Error Handling
    res.status(500).json({ message: "Something went wrong" });
  }
};


module.exports = {
  addMovie,
  getMovies,
  getMovieById
};
