// Import Mongoose
const mongoose = require('mongoose');

// Import user & review models
const User = require("../models/userModel");
const Review = require("../models/reviewModel");

const getDashboardData = async (req, res) => {
  try {
    // Count the total number of users in the database
    const totalUsersCount = await User.countDocuments();

    // Find the list of all users in the database
    const totalUsers = await User.find();

    // Find the most recent 10 users, sorted by creation date in descending order
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10);

    // Count the total number of recent users (this will be the length of recentUsers array)
    const recentUsersCount = recentUsers.length;

    // Format the total users data for response with serial numbers
    const formattedTotalUsers = totalUsers.map((user, index) => ({
      serialNo: index + 1,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      status: user.status,
    }));

    // Format the recent users data for response with serial numbers
    const formattedRecentUsers = recentUsers.map((user, index) => ({
      serialNo: index + 1,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      status: user.status,
    }));


    // Send the data as a JSON response
    res.status(200).json({
      totalUsersCount,
      recentUsersCount,
      recentUsers: formattedRecentUsers,
      totalUsers: formattedTotalUsers
    });
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Deleting a userDetails
const deleteUser = async (req, res) => {
    try {
        // Extract the user ID from the request parameters
        const userId = req.params.id;

        // Extract the status from the request body (either 'banned' or 'inactive')
        const { status } = req.body;

        // Validate the status
        if (status !== 'banned' && status !== 'inactive') {
            return res.status(400).json({ message: "Invalid status provided" });
        }

        // Update the user's status in the database
        await User.findByIdAndUpdate(userId, { status });

        // Send a success message as a JSON response
        res.status(200).json({ message: `User status updated to ${status} successfully` });
    } catch (error) {
        // Handle any errors that occur
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Function to reactivate a user
const reactivateUser = async (req, res) => {
  try {
    // Extract the user ID from the request parameters
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's status to 'active' from "inactive" or "banned"
    user.status = 'active';
    await user.save();

    // Send a success message as a JSON response
    res.status(200).json({ message: 'User reactivated successfully', user });
  } catch (error) {
    // Handle any errors that occur 
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get user reviews
const getUserReviews = async (req, res) => {
  try {
    // Extract the user ID from the request parameters
    const userId = req.params.id;

    // Validate the user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Find the reviews for the given user ID
    const reviews = await Review.find({ userId }).populate('movieId', 'title');

    // Check if reviews exist for the user
    if (!reviews.length) {
      return res.status(404).json({ message: "No reviews found for this user" });
    }

    // Format the review data for response
    const formattedReviews = reviews.map((review, index) => ({
      serialNo: index + 1,
      movieName: review.movieId.title,
      review: review.reviewText,
      rating: review.rating,
    }));

    // Send the data as a JSON response
    res.status(200).json(formattedReviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error); // Log the error for debugging
    // Handle any errors that occur
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = { getDashboardData, deleteUser, reactivateUser, getUserReviews };
