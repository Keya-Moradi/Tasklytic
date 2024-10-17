const express = require('express');
const router = express.Router(); // Initialize Express Router to handle routes
const usersController = require('../controllers/usersController'); // Import the usersController to handle user-related logic

// User routes

// Route to show the registration form
// When the user visits '/register', the 'showRegisterForm' method in usersController is called
router.get('/register', usersController.showRegisterForm);

// Route to handle user registration
// When the form is submitted via POST to '/register', 'registerUser' method in usersController is called
router.post('/register', usersController.registerUser);

// Route to show the login form
// When the user visits '/login', the 'showLoginForm' method in usersController is called
router.get('/login', usersController.showLoginForm);

// Route to handle user login
// When the form is submitted via POST to '/login', 'loginUser' method in usersController is called
router.post('/login', usersController.loginUser);

// Route to handle user logout
// When the user visits '/logout', the 'logoutUser' method in usersController is called, logging them out
router.get('/logout', usersController.logoutUser);

module.exports = router; // Export the router to be used in other parts of the application
