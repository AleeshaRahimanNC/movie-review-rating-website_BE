var express = require('express');
const {getDashboardData, deleteUser, reactivateUser, getUserReviews} = require('../controllers/adminController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
var router = express.Router();


router.get('/dashboard-data', adminAuthMiddleware, getDashboardData);
router.delete('/delete-user/:id', adminAuthMiddleware, deleteUser);
router.put('/reactivate-user/:id', adminAuthMiddleware, reactivateUser);
router.get('/user-reviews/:id', adminAuthMiddleware, getUserReviews);


module.exports = router;
