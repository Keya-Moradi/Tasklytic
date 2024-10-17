const mongoose = require('mongoose'); // Importing Mongoose for MongoDB object modeling
const Schema = mongoose.Schema; // Schema allows us to define the structure of our MongoDB documents

// Creating a schema for the User model, which outlines the structure of user data in the database
const userSchema = new Schema({
    name: {
        type: String, // The user's name must be a string
        required: true // Name is a required field
    },
    email: {
        type: String, // The user's email must be a string
        required: true, // Email is a required field
        unique: true // Each email must be unique, ensuring no duplicate user registrations
    },
    password: {
        type: String, // The user's password must be a string
        required: true // Password is a required field
    },
    date: {
        type: Date, // The date when the user registered
        default: Date.now // Defaults to the current date and time when a user registers
    }
});

// Exporting the User model so it can be used elsewhere in the application
module.exports = mongoose.model('User', userSchema);
