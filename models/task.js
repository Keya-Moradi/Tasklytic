const mongoose = require('mongoose'); // Importing Mongoose for MongoDB object modeling
const Schema = mongoose.Schema; // Schema allows us to define the structure of our MongoDB documents

// Task Schema - outlines the structure of task data in the database
const taskSchema = new Schema({
    title: {
        type: String, // The title of the task must be a string
        required: true // Title is required
    },
    description: {
        type: String // The description of the task, optional field
    },
    dueDate: {
        type: Date // The due date for the task
    },
    completed: {
        type: Boolean, // Tracks if the task is completed
        default: false // By default, tasks are incomplete
    },
    createdAt: {
        type: Date, // The date and time when the task was created
        default: Date.now // Defaults to the current date and time when a task is created
    },
    user: {
        type: Schema.Types.ObjectId, // References the User model (one-to-many relationship)
        ref: 'User' // Creates a relationship between tasks and users
    }
});

// Exporting the Task model so it can be used elsewhere in the application
module.exports = mongoose.model('Task', taskSchema);
