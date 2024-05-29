// Importing Modules
const USERS = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User Registration Handler
const doRegister = (req, res) => {
  bcrypt.hash(
    req.body.password,
    parseInt(process.env.SALT_ROUNDS), // Using SALT_ROUNDS from .env file
    function (err, hash) {
      // Creating a new user with the hashed password
      USERS({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      })
        .save()
        .then((response) => {
          res.status(200).json({
            message: "Registered Successfully",
          });
        })
        .catch((error) => {
          // Error handling for duplicate email
          console.log(error);
          if (error.code === 11000) {
            res.status(500).json({
              message: `${req.body.email} is already existing`,
            });
          } else {
            // General error handling
            res.status(500).json({
              message: `Something Went Wrong`,
            });
          }
        });
    }
  );
};

// User Login Handler
const doLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await USERS.findOne({ email: email });

    if (!userData) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    bcrypt.compare(password, userData.password, (err, result) => {
      if (result) {
        userData.password = undefined; // Removing password from the user object
        const token = jwt.sign(
          { ...userData.toJSON() }, // Convert to plain JavaScript object
          process.env.JWT_PASSWORD, // Secret key from environment variables
          { expiresIn: "2d" }
        );
        res.status(200).json({ user: userData, token });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  doRegister,
  doLogin,
};
