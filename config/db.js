const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB database using the connection string from environment variables
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB database connection established');
    } catch (error) {
        // If there's an error during the connection attempt, it will be caught here
        console.error('MongoDB connection error:', error.message);
        
    }
};

module.exports = connectDB;