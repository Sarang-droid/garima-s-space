const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

// Get daily message (public)
router.get('/daily', messageController.getDailyMessage);

// Get all messages (public)
router.get('/', messageController.getAllMessages);

// Post a new message (admin only)
router.post('/', auth.requireAdmin, messageController.postMessage);

// Delete a message (admin only)
router.delete('/:id', auth.requireAdmin, messageController.deleteMessage);

module.exports = router;
