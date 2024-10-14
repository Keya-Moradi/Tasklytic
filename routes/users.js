const express = require('express');
const router = express.Router();

// Routes for login, register, etc. here
router.get('/login', (req, res) => {
    res.render('login');
});

module.exports = router;
