const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { requireUser } = require('../middleware/auth');

// All profile routes require authentication
router.use(requireUser);

// Get profile with insights
router.get('/', profileController.getProfileWithInsights);

// Get activity summary
router.get('/activity', profileController.getActivitySummary);

module.exports = router;