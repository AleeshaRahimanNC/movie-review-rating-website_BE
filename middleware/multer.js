// Importing Required Modules
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");

// It checks if the directory exists using fs.existsSync()
if (!fs.existsSync(uploadDir)) {
  // If the directory doesn't exist, it creates it using fs.mkdirSync().
  fs.mkdirSync(uploadDir);
}

// Specify the storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Temporary folder for file uploads
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname)); // Generate unique file name
  },
});

// Configuring Multer Upload Middleware:
const upload = multer({ storage }).single("moviePic"); // Field name should be 'moviePic'

module.exports = upload;
