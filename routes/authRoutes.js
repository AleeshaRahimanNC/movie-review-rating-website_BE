var express = require('express');
const { doRegister, doLogin } = require('../controllers/authController');
var router = express.Router(); 

// Defining Routes
router.post('/doregister', doRegister); 
router.post('/dologin', doLogin);

module.exports = router;
