// Import required modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors=require('cors');
const dotenv=require('dotenv');
dotenv.config();// Load environment variables from .env file
const connectDB = require('./config/db');// Import database connection function

// Import route handlers
const adminRouter = require('./routes/adminRoutes'); 
const authRouter = require('./routes/authRoutes');
const movieRouter = require('./routes/movieRoutes');
const reviewRouter = require('./routes/reviewRoutes');

// Initialize Express App and Connect to Database
const app = express();
connectDB();

// Middleware Configuration
app.use(cors({
  origin:['http://localhost:3000']
}));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// General Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.use('/adminRoutes', adminRouter);
app.use('/authRoutes', authRouter);
app.use('/movieRoutes', movieRouter);
app.use('/reviewRoutes', reviewRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Export the Express app instance for use in other files
module.exports = app;
