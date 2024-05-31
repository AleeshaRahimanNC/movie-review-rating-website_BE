var express = require('express');
const {getDashboardData, deleteUser, reactivateUser} = require('../controllers/adminController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
var router = express.Router();


router.get('/dashboard-data', adminAuthMiddleware, getDashboardData);
router.delete('/delete-user/:id', adminAuthMiddleware, deleteUser);
router.put('/reactivate-user/:id', adminAuthMiddleware, reactivateUser);


module.exports = router;
