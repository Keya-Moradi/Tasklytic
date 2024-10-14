const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

// Show the registration form
exports.showRegisterForm = (req, res) => {
    res.render('users/register', { errors: [] }); // Ensure errors is passed as an empty array
};

// Register a new user
exports.registerUser = async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        return res.render('users/register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        try {
            const user = await User.findOne({ email });
            if (user) {
                errors.push({ msg: 'Email already exists' });
                return res.render('users/register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }

            const newUser = new User({
                name,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            newUser.password = await bcrypt.hash(password, salt);
            await newUser.save();

            req.flash('success_msg', 'You are now registered and can log in');
            res.redirect('/users/login');
        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'Error registering user');
            res.redirect('/users/register');
        }
    }
};

// Show login form
exports.showLoginForm = (req, res) => {
    res.render('users/login');
};

// Handle user login
exports.loginUser = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/tasks',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
};

// Handle user logout
exports.logoutUser = (req, res) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/login');
    });
};
