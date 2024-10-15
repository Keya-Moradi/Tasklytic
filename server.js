// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const app = express();
const MongoStore = require('connect-mongo');
const PORT = process.env.PORT || 3000;
const morgan = require('morgan');

// Passport configuration
require('./config/passport')(passport);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(morgan('dev'));
app.use(express.static('public')); // For serving static files
app.use(express.urlencoded({ extended: false })); // Built-in body parser
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash middleware
app.use(flash());

// Global variables for flash messages and user
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null; // Make user globally available in templates
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/tasks', require('./routes/tasks'));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
