const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user'); // Import the User model

// Show the registration form
router.get('/register', (req, res) => {
    res.render('users/register');
});

// Handle user registration
router.post('/register', (req, res) => {
    const { username, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if (!username || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check if passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors,
            username,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        User.findOne({ email: email }).then(user => {
            if (user) {
                // User exists
                errors.push({ msg: 'Email is already registered' });
                res.render('users/register', {
                    errors,
                    username,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    username,
                    email,
                    password
                });

                // Hash password
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        // Set password to hashed
                        newUser.password = hash;
                        // Save user
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can log in');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    })
                );
            }
        });
    }
});

// Show the login form
router.get('/login', (req, res) => {
    res.render('users/login');
});

// Handle user login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/tasks',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Handle user logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;
