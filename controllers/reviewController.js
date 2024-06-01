// imported from their respective model files.
const Review = require("../models/reviewModel");
const Movie = require("../models/movieModel");

// Adding new Reviews
const addReview = async (req, res) => {
  const { movieId, title, reviewText, rating } = req.body;
  const userId = req.user._id;

  try {
    // Check if the user has already reviewed the movie
    const existingReview = await Review.findOne({ movieId, userId });
    if (existingReview) {
      return res.status(400).json({ message: "User has already reviewed this movie" });
    }

    // Creating and Saving a New Review
    const newReview = new Review({
      movieId,
      userId,
      title,
      reviewText,
      rating,
    });
    await newReview.save();

    // Fetching and Validating the Movie
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Update the Aggregated Rating
    const reviews = await Review.find({ movieId });
    const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const aggregatedRating = totalRatings / reviews.length;

    // Round the aggregatedRating to one decimal place
    const roundedRating = Math.round(aggregatedRating * 10) / 10;

    movie.aggregatedRating = roundedRating;
    await movie.save();

    // Sending Response and Error Handling
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error adding review:", error); // Log error for debugging
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Retrieving a Review by ID
const getReviewsByMovieId = async (req, res) => {
  // extract movieId from the request parameter
  const { movieId } = req.params;

  // Fetching Reviews
  try {
    // Fetch Reviews Excluding Deleted Ones
    const reviews = await Review.find({ movieId, status:{ $ne: 'deleted' }});

    if (reviews.length === 0) {
      return res.status(200).json({ message: "No reviews added yet. Be the first to add a review!" });
    }

    // Sending the Response
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Deleting a Review
const deleteReview = async (req, res) => {
  // Extract reviewId from the request parameter
  const { id } = req.params;

  try {
    // Find the review to be deleted
    const reviewToDelete = await Review.findById(id);
    if (!reviewToDelete) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Mark the review status as deleted
    reviewToDelete.status = "deleted";
    await reviewToDelete.save();

    // Update the aggregated rating for the movie
    const movieId = reviewToDelete.movieId;
    const reviews = await Review.find({ movieId, status: "active" });

    if (reviews.length > 0) {
      const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
      const aggregatedRating = totalRatings / reviews.length;
      await Movie.findByIdAndUpdate(movieId, { aggregatedRating });
    } else {
      // If no active reviews left, set the aggregated rating to 0
      await Movie.findByIdAndUpdate(movieId, { aggregatedRating: 0 });
    }

    // Sending the response
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error); // Log error for debugging
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  addReview,
  getReviewsByMovieId,
  deleteReview,
};
