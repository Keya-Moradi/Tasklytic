const Task = require('../models/task');

// Show form to add a new task
exports.showNewTaskForm = (req, res) => {
    res.render('tasks/new');
};

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        const newTask = new Task({
            title,
            description,
            dueDate,
            createdAt: Date.now(),
            completed: false,
            user: req.user._id
        });
        await newTask.save();
        req.flash('success_msg', 'Task created successfully');
        res.redirect('/tasks');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error creating task');
        res.redirect('/tasks/new');
    }
};

// Get all tasks for the logged-in user
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ dueDate: 1 });
        res.render('tasks/index', { tasks });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error fetching tasks');
        res.redirect('/');
    }
};

// Show edit form for a specific task
exports.showEditTaskForm = async (req, res) => {
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
};

// Update a task
exports.updateTask = async (req, res) => {
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
};

// Toggle task completion status
exports.toggleCompleteTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
        task.completed = !task.completed;
        await task.save();
        req.flash('success_msg', 'Task updated successfully');
        res.redirect('/tasks');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error updating task');
        res.redirect('/tasks');
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        req.flash('success_msg', 'Task deleted successfully');
        res.redirect('/tasks');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error deleting task');
        res.redirect('/tasks');
    }
};
