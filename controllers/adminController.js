// Import user database
const User = require("../models/userModel");

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

    // Send the data as a JSON response
    res.status(200).json({
      totalUsersCount,
      recentUsersCount,
      recentUsers,
      totalUsers,
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
        if (status !== 'Banned' && status !== 'Inactive') {
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

module.exports = { getDashboardData, deleteUser, reactivateUser };
