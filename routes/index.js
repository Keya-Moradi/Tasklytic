const express = require('express');
const router = express.Router(); // Initialize Express Router to handle the root route

// Root route: Redirects the user to the '/tasks' page
// When the user visits the home page '/', they are automatically redirected to the '/tasks' page
router.get('/', (req, res) => {
    res.redirect('/tasks'); // Redirect to the tasks page
});

module.exports = router; // Export the router so it can be used in the main application file
