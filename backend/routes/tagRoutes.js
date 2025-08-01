const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const auth = require('../middleware/auth');

// Get weekly tag stats
router.get('/weekly', auth.requireUser, tagController.getWeeklyStats);

module.exports = router;
