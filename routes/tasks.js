const express = require('express');
const router = express.Router();
const taskController = require('../controllers/tasksController');

// Middleware to ensure the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
}

// Apply the middleware to all routes in this router
router.use(ensureAuthenticated);

// Task routes
router.get('/new', taskController.showNewTaskForm);
router.post('/', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:id/edit', taskController.showEditTaskForm);
router.put('/:id', taskController.updateTask);
router.put('/:id/toggle', taskController.toggleCompleteTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
