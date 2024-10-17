// Load environment variables from .env file
// I’m loading environment variables like the MongoDB URI and session secret from the .env file.
// This keeps sensitive information out of my codebase and helps when deploying the app later.
require('dotenv').config();

const express = require('express'); // Importing Express, which is my server framework.
const mongoose = require('mongoose'); // Mongoose is used for connecting and interacting with MongoDB.
const passport = require('passport'); // Passport handles user authentication for me.
const session = require('express-session'); // Express-session manages sessions, storing user data between requests.
const methodOverride = require('method-override'); // Method override allows me to use HTTP methods like PUT/DELETE via POST.
const flash = require('connect-flash'); // Flash messages show quick alerts like errors or success notices to users.
const app = express(); // I’m creating an instance of Express to build my app.
const MongoStore = require('connect-mongo'); // MongoStore stores session data in MongoDB, ensuring persistent login sessions.
const PORT = process.env.PORT || 3000; // Either using the port from my environment variables or defaulting to port 3000.
const morgan = require('morgan'); // Morgan logs requests to the console so I can see incoming traffic.

// Passport configuration
// Here I’m requiring the Passport config file and passing the passport instance to it.
require('./config/passport')(passport);

// Connect to MongoDB
// I’m using Mongoose to connect to my MongoDB database, which is hosted at the MONGO_URI in my .env file.
// If the connection succeeds, I log a success message, and if it fails, I log the error.
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Set EJS as the view engine
// I’m telling Express to use EJS as my templating engine, which will help render dynamic content on my pages.
app.set('view engine', 'ejs');

// Middleware
app.use(morgan('dev')); // I’m using Morgan in 'dev' mode to log HTTP requests with concise output.
app.use(express.static('public')); // This serves static files like CSS, images, and JavaScript from the 'public' folder.
app.use(express.urlencoded({ extended: false })); // This middleware parses incoming requests with URL-encoded payloads (used for form submissions).
app.use(methodOverride('_method')); // Method override allows me to simulate PUT/DELETE requests in forms by passing a special query parameter.

// Session middleware
// I’m using express-session to create a session for each user, using a session secret from my environment variables.
// The session is stored in MongoDB using MongoStore, and I'm setting the session cookie to expire after 1 day.
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // Don’t save the session if nothing is modified.
    saveUninitialized: false, // Don’t create a session until something is stored.
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // Store sessions in MongoDB.
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // Session lasts for 1 day (in milliseconds).
}));

// Passport middleware
// These lines initialize Passport and allow Passport to handle persistent login sessions.
app.use(passport.initialize());
app.use(passport.session());

// Flash middleware
// Flash messages will show success or error messages to the user, like after login or form submission.
app.use(flash());

// Global variables for flash messages and user
// I’m setting global variables for the app, making flash messages and user information available in every EJS template.
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); // Error message for failed login.
    res.locals.user = req.user || null; // If the user is logged in, store their data globally for use in templates.
    next();
});

// Routes
// Defining my routes. I'm telling Express to use the routes defined in these files for different paths.
app.use('/', require('./routes/index')); // Routes for the home page and general views.
app.use('/users', require('./routes/users')); // Routes for user registration, login, etc.
app.use('/tasks', require('./routes/tasks')); // Routes for handling tasks (CRUD operations).

// Start server
// Finally, I'm starting the server and having it listen on the specified PORT.
// When the server is running, it will log a message to the console.
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
