const express = require('express');
const router = express.Router();

// Task CRUD routes
router.get('/', (req, res) => {
    res.send('Tasks Page');
});

module.exports = router;
