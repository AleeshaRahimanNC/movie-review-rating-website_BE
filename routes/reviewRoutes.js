var express = require('express');
const { addReview, getReviewsByMovieId, deleteReview } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
var router = express.Router();

router.post('/add', authMiddleware, addReview); // Protect add review route with authMiddleware
router.get('/movie/:movieId', getReviewsByMovieId); // Public route for getting reviews by movie ID
router.delete('/:id', adminAuthMiddleware, deleteReview); // Protect delete review route with adminAuthMiddleware

module.exports = router;

