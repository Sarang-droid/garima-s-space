const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');
const auth = require('../middleware/auth');

// Submit today's mood
router.post('/', auth.requireUser, moodController.saveMood);

// Get moods for past 7 days
router.get('/weekly', auth.requireUser, moodController.getWeeklyMoods);

module.exports = router;
