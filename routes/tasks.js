const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Show the form to add a new task (GET /tasks/new)
router.get('/new', (req, res) => {
    res.render('tasks/new');
});

// Create new task (POST /tasks)
router.post('/', (req, res) => {
    const { title, description, dueDate } = req.body;
    const newTask = new Task({
        title,
        description,
        dueDate,
        createdAt: Date.now(),   // Automatically set the creation date
        completed: false,        // New tasks are not completed by default
        userId: req.user._id     // Assuming user authentication is enabled (Passport.js)
    });

    newTask.save()
        .then(() => res.redirect('/tasks'))
        .catch(err => {
            console.error(err);
            res.redirect('/tasks/new');
        });
});

// Get all tasks (GET /tasks)
router.get('/', (req, res) => {
    Task.find({ userId: req.user._id }) // Fetch tasks for the logged-in user only
        .then(tasks => res.render('tasks/index', { tasks }))
        .catch(err => console.error(err));
});

// Show edit form for a specific task (GET /tasks/:id/edit)
router.get('/:id/edit', (req, res) => {
    Task.findById(req.params.id)
        .then(task => {
            if (!task) {
                return res.redirect('/tasks');
            }
            res.render('tasks/edit', { task });
        })
        .catch(err => console.error(err));
});

// Update task (PUT /tasks/:id)
router.put('/:id', (req, res) => {
    const { title, description, dueDate } = req.body;
    Task.findByIdAndUpdate(req.params.id, { title, description, dueDate })
        .then(() => res.redirect('/tasks'))
        .catch(err => console.error(err));
});

// Mark task as complete (PUT /tasks/:id/complete)
router.put('/:id/complete', (req, res) => {
    Task.findByIdAndUpdate(req.params.id, { completed: true })
        .then(() => res.redirect('/tasks'))
        .catch(err => console.error(err));
});

// Delete task (DELETE /tasks/:id)
router.delete('/:id', (req, res) => {
    Task.findByIdAndDelete(req.params.id)
        .then(() => res.redirect('/tasks'))
        .catch(err => console.error(err));
});

module.exports = router;
