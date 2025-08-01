const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireUser } = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (require authentication)
router.get('/me', requireUser, userController.getCurrentUser);
router.put('/profile', requireUser, userController.updateProfile);

module.exports = router;