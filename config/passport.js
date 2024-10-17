const LocalStrategy = require('passport-local').Strategy; // Import the LocalStrategy for local authentication
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcrypt to compare hashed passwords

// Load User model
const User = require('../models/user');

module.exports = function(passport) {
    // Define the local strategy for handling email/password login
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match user by email
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        // If no user found, return a failure message
                        return done(null, false, { message: 'That email is not registered' });
                    }

                    // Compare provided password with the stored hashed password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err; // Handle any error during password comparison
                        if (isMatch) {
                            // If the password matches, return the user object
                            return done(null, user);
                        } else {
                            // If the password doesn't match, return a failure message
                            return done(null, false, { message: 'Password incorrect' });
                        }
                    });
                })
                .catch(err => console.log(err)); // Catch any error during user lookup
        })
    );

    // Serialize the user to store the user ID in the session
    passport.serializeUser((user, done) => {
        done(null, user.id); // Store user ID in the session
    });

    // Deserialize the user to retrieve the full user object by ID
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id); // Find the user by ID
            done(null, user); // Return the full user object
        } catch (err) {
            done(err, null); // Handle any error during deserialization
        }
    });
};
