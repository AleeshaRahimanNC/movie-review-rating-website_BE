// imported from their respective model files.
const Review = require("../models/reviewModel");
const Movie = require("../models/movieModel");

// Adding new Reviews
const addReview = async (req, res) => {
  const { movieId, reviewText, rating } = req.body;
  const userId = req.user._id;

  // Creating and Saving a New Review
  try {
    const newReview = new Review({
      movieId,
      userId,
      reviewText,
      rating,
    });
    await newReview.save();

    // Fetching and Validating the Movie
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    // Updating the Aggregated Rating
    if (movie.aggregatedRating > 0) {
      movie.aggregatedRating = (movie.aggregatedRating + rating) / 2;
    } else {
      movie.aggregatedRating = rating;
    }
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
  // extract reviewId from the request parameter
  const { id } = req.params;

  // Updating the Review's Status
  try {
    const deletedReview = await Review.findByIdAndUpdate(
      id,
      { status: "deleted" },
      { new: true }
    );

    // Handling the Case Where the Review is Not Found
    if (!deletedReview)
      return res.status(404).json({ message: "Review not found" });

    // Sending the Response
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
