const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Middleware to ensure the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login'); // Adjust the login route as necessary
}

// Apply the middleware to all routes in this router
router.use(ensureAuthenticated);

// Show the form to add a new task (GET /tasks/new)
router.get('/new', (req, res) => {
    res.render('tasks/new');
});

// Create new task (POST /tasks)
router.post('/', async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        const newTask = new Task({
            title,
            description,
            dueDate,
            createdAt: Date.now(),
            completed: false,
            user: req.user._id // Correct field name
        });
        await newTask.save();
        req.flash('success_msg', 'Task created successfully');
        res.redirect('/tasks');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error creating task');
        res.redirect('/tasks/new');
    }
});

// Get all tasks for the logged-in user (GET /tasks)
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ dueDate: 1 });
        res.render('tasks/index', { tasks });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching tasks');
        res.redirect('/');
    }
});

// Show edit form for a specific task (GET /tasks/:id/edit)
router.get('/:id/edit', async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        if (!task) {
            req.flash('error_msg', 'Task not found');
            return res.redirect('/tasks');
        }
        res.render('tasks/edit', { task });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching task');
        res.redirect('/tasks');
    }
});

// Update task (PUT /tasks/:id)
router.put('/:id', async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { title, description, dueDate }
        );
        req.flash('success_msg', 'Task updated successfully');
        res.redirect('/tasks');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error updating task');
        res.redirect('/tasks');
    }
});

// Mark task as complete (PUT /tasks/:id/complete)
router.put('/:id/complete', async (req, res) => {
    try {
        await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { completed: true }
        );
        req.flash('success_msg', 'Task marked as complete');
        res.redirect('/tasks');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error marking task as complete');
        res.redirect('/tasks');
    }
});

// Delete task (DELETE /tasks/:id)
router.delete('/:id', async (req, res) => {
    try {
        await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        req.flash('success_msg', 'Task deleted successfully');
        res.redirect('/tasks');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error deleting task');
        res.redirect('/tasks');
    }
});

module.exports = router;
