const express = require('express');
const { check } = require('express-validator');
const { 
  register, 
  login, 
  getMe  // Add this import
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route
router.get('/me', protect, getMe);

module.exports = router;