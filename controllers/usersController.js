const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const passport = require('passport'); // Import Passport for authentication
const User = require('../models/user'); // Import the User model

// Show the registration form
exports.showRegisterForm = (req, res) => {
    res.render('users/register', { errors: [] }); // Renders the registration form, passing an empty array for errors
};

// Register a new user
exports.registerUser = async (req, res) => {
    const { name, email, password, password2 } = req.body; // Destructure form input values
    let errors = [];

    // Validate form fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' }); // Error if any fields are missing
    }

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' }); // Error if passwords don't match
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' }); // Password length validation
    }

    // If there are validation errors, re-render the registration form with the errors
    if (errors.length > 0) {
        return res.render('users/register', {
            errors, // Pass errors to the view
            name,
            email,
            password,
            password2
        });
    } else {
        // If no validation errors, proceed with user registration
        try {
            const user = await User.findOne({ email }); // Check if the email already exists in the database
            if (user) {
                errors.push({ msg: 'Email already exists' }); // Error if email is already registered
                return res.render('users/register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }

            // If the email is not taken, create a new User instance
            const newUser = new User({
                name,
                email,
                password
            });

            // Hash the password before saving it to the database
            const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
            newUser.password = await bcrypt.hash(password, salt); // Hash the password with the salt
            await newUser.save(); // Save the new user in the database

            req.flash('success_msg', 'You are now registered and can log in'); // Flash a success message
            res.redirect('/users/login'); // Redirect to the login page
        } catch (err) {
            console.error(err); // Log any errors
            req.flash('error_msg', 'Error registering user'); // Flash an error message
            res.redirect('/users/register'); // Redirect back to the registration page in case of error
        }
    }
};

// Show the login form
exports.showLoginForm = (req, res) => {
    res.render('users/login'); // Renders the login form view
};

// Handle user login
exports.loginUser = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/tasks', // If authentication is successful, redirect to tasks page
        failureRedirect: '/users/login', // If authentication fails, redirect back to the login page
        failureFlash: true // Display failure messages
    })(req, res, next);
};

// Handle user logout
exports.logoutUser = (req, res) => {
    req.logout(function(err) { // Logs out the user
        if (err) {
            return next(err); // Handle error if logout fails
        }
        req.flash('success_msg', 'You are logged out'); // Flash a success message
        res.redirect('/users/login'); // Redirect to the login page
    });
};
