const express = require('express');
const router = express.Router(); // Initialize Express Router to handle task-related routes
const taskController = require('../controllers/tasksController'); // Import the taskController to handle task-related logic

// Middleware to ensure the user is authenticated before accessing task-related routes
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { // Check if the user is authenticated
        return next(); // If authenticated, proceed to the next middleware or route handler
    }
    req.flash('error_msg', 'Please log in to view that resource'); // If not authenticated, display an error message
    res.redirect('/users/login'); // Redirect the user to the login page
}

// Apply the middleware to all routes in this router, ensuring only authenticated users can access these routes
router.use(ensureAuthenticated);

// Task routes

// Route to show the form for creating a new task
// When the user visits '/tasks/new', the 'showNewTaskForm' method in taskController is called
router.get('/new', taskController.showNewTaskForm);

// Route to handle task creation
// When the form is submitted via POST to '/tasks', the 'createTask' method in taskController is called
router.post('/', taskController.createTask);

// Route to fetch and display all tasks
// When the user visits '/tasks', the 'getAllTasks' method in taskController is called
router.get('/', taskController.getAllTasks);

// Route to fetch and display only the pending tasks
// When the user visits '/tasks/pending', the 'getPendingTasks' method in taskController is called
router.get('/pending', taskController.getPendingTasks);

// Route to fetch and display only the completed tasks
// When the user visits '/tasks/completed', the 'getCompletedTasks' method in taskController is called
router.get('/completed', taskController.getCompletedTasks);

// Route to show the form for editing an existing task
// When the user visits '/tasks/:id/edit', the 'showEditTaskForm' method in taskController is called for the specific task ID
router.get('/:id/edit', taskController.showEditTaskForm);

// Route to handle task updates
// When the user submits changes via PUT to '/tasks/:id', the 'updateTask' method in taskController is called for the specific task ID
router.put('/:id', taskController.updateTask);

// Route to toggle the completion status of a task
// When the user toggles completion via PUT to '/tasks/:id/toggle', the 'toggleCompleteTask' method in taskController is called
router.put('/:id/toggle', taskController.toggleCompleteTask);

// Route to delete a task
// When the user submits a delete request via DELETE to '/tasks/:id', the 'deleteTask' method in taskController is called for the specific task ID
router.delete('/:id', taskController.deleteTask);

module.exports = router; // Export the router to be used in other parts of the application
