// Importing Cloudinary Module
const cloudinary = require('cloudinary').v2;

// The below block of code configures Cloudinary with the required credentials.
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Exporting Cloudinary Configuration
module.exports = cloudinary;


