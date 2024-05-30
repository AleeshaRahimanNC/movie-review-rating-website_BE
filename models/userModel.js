// Importing Mongoose
const mongoose = require('mongoose');

// Define the user schema with Mongoose
const userSchema = mongoose.Schema({
    // Schema definition properties
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'banned'],
        default: 'active',
    },
});

// Create a Mongoose model named 'users' based on the userSchema
const users = mongoose.model('users', userSchema);

// Exporting users Model
module.exports = users;
