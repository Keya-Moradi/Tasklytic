const express = require('express');
const router = express.Router();

// Home Route
router.get('/', (req, res) => {
    res.render('index', { title: 'Welcome to Tasklytic' });
});

module.exports = router;
