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
  // This getMovies declares an asynchronous function
  try {
    // await Movie.find() uses Mongoose to find all documents in the Movie collection.
    const movies = await Movie.find();

    // Sending the Response
    res.status(200).json(movies);
  } catch (error) {
    // Error Handling
    res.status(500).json({ message: "Something went wrong" });
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

// Get Top Rated Movies
const getTopRatedMovies = async (req, res) => {
  try {
    // Find the top 3 movies based on aggregatedRating
    const topMovies = await Movie.find().sort({ aggregatedRating: -1 }).limit(3);
    
    // Check if there are any top-rated movies
    if (topMovies.length === 0) {
      return res.status(404).json({ message: "No top-rated movies found" });
    }

    // Return the top-rated movies
    res.status(200).json(topMovies);
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};



module.exports = {
  addMovie,
  getMovies,
  getMovieById,
  getTopRatedMovies
};
