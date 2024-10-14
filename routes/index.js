const express = require('express');
const router = express.Router();

// Redirect to tasks page
router.get('/', (req, res) => {
    res.redirect('/tasks');
});

module.exports = router;