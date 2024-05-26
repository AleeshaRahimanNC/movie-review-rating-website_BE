var express = require('express');
const { doRegister, doLogin } = require('../controllers/authController');
var router = express.Router();

/* GET home page. */
router.post('/doregister', doRegister);
router.post('/dologin', doLogin);

module.exports = router;
