var express = require('express');
var router = express.Router();
const upload = require('../middleware/multer'); 
const { addMovie, getMovies, getMovieById } = require('../controllers/movieController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// Add movie route requires admin authentication
router.post('/addMovie', adminAuthMiddleware, upload, addMovie);
router.get('/', authMiddleware, getMovies); // All authenticated users can get movies
router.get('/:id', authMiddleware, getMovieById); // All authenticated users can get movies by its Id


module.exports = router;
