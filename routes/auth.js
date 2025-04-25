const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Register Page
router.get('/register', (req, res) => {
    res.render('register');
});

// Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Logout
router.get('/logout', authController.logout);

module.exports = router;