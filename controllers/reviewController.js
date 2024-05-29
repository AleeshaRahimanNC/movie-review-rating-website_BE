const Review = require("../models/reviewModel");
const Movie = require("../models/movieModel");

// Adding new Reviews
const addReview = async (req, res) => {
  const { movieId, reviewText, rating } = req.body;
  const userId = req.user._id;
  try {
    const newReview = new Review({
      movieId,
      userId,
      reviewText,
      rating,
    });
    await newReview.save();

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    

    // Update aggregated rating without considering the number of reviews
    if (movie.aggregatedRating>0) {
        movie.aggregatedRating = (movie.aggregatedRating + rating) / 2;
    } else {
      movie.aggregatedRating = rating;
    }

    
    await movie.save();

    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error adding review:", error); // Log error for debugging
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Retrieving a Review by ID
const getReviewsByMovieId = async (req, res) => {
  const { movieId } = req.params;
  try {
    const reviews = await Review.find({ movieId });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Deleting a Review
const deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedReview = await Review.findByIdAndUpdate(
      id,
      { status: "deleted" },
      { new: true }
    );
    if (!deletedReview)
      return res.status(404).json({ message: "Review not found" });
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  addReview,
  getReviewsByMovieId,
  deleteReview,
};
