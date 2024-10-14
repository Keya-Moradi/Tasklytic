const express = require('express');
const router = express.Router();

// Task routes (e.g., create, update, delete tasks)
router.get('/', (req, res) => {
    res.send('Tasks Page');
});

module.exports = router;
