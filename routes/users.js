const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// User routes
router.get('/register', usersController.showRegisterForm);
router.post('/register', usersController.registerUser);
router.get('/login', usersController.showLoginForm);
router.post('/login', usersController.loginUser);
router.get('/logout', usersController.logoutUser);

module.exports = router;