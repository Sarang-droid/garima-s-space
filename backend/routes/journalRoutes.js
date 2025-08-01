const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const auth = require('../middleware/auth');

// Save new journal entry
router.post('/', auth.requireUser, journalController.saveEntry);

// Get weekly journal entries
router.get('/weekly', auth.requireUser, journalController.getWeeklyEntries);

// Get recent journal entries (with optional limit parameter)
router.get('/', auth.requireUser, journalController.getRecentEntries);

module.exports = router;
