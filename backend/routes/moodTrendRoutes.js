const express = require('express');
const router = express.Router();
const MoodEntry = require('../models/MoodEntry');
const { requireUser } = require('../middleware/auth');

// @route   GET /api/mood/trends
// @desc    Get mood trends for the current user
// @access  Private
router.get('/', requireUser, async (req, res) => {
    try {
        // Get moods from the last 30 days by default
        const days = req.query.days || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        const moods = await MoodEntry.find({
            userId: req.user.id,
            date: { $gte: startDate }
        }).sort({ date: -1 });
        
        res.json(moods);
    } catch (err) {
        console.error('Error fetching mood trends:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/mood/trends/summary
// @desc    Get mood summary statistics
// @access  Private
router.get('/summary', requireUser, async (req, res) => {
    try {
        // Get moods from the last 30 days by default
        const days = req.query.days || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        const moods = await MoodEntry.find({
            userId: req.user.id,
            date: { $gte: startDate }
        });
        
        // Count occurrences of each mood
        const moodCounts = {};
        moods.forEach(entry => {
            if (!moodCounts[entry.moodEmoji]) {
                moodCounts[entry.moodEmoji] = 0;
            }
            moodCounts[entry.moodEmoji]++;
        });
        
        // Calculate most frequent mood
        let mostFrequentMood = null;
        let maxCount = 0;
        
        for (const mood in moodCounts) {
            if (moodCounts[mood] > maxCount) {
                mostFrequentMood = mood;
                maxCount = moodCounts[mood];
            }
        }
        
        // Calculate mood change over time
        const moodsByDay = {};
        const today = new Date();
        
        // Initialize all days with empty arrays
        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            moodsByDay[dateString] = [];
        }
        
        // Fill in moods for each day
        moods.forEach(entry => {
            const dateString = entry.date.toISOString().split('T')[0];
            if (moodsByDay[dateString]) {
                moodsByDay[dateString].push(entry.moodEmoji);
            }
        });
        
        // Calculate daily mood averages or most frequent mood
        const dailyMoods = {};
        for (const date in moodsByDay) {
            if (moodsByDay[date].length > 0) {
                // For simplicity, just use the first mood of the day
                // Could be enhanced to use most frequent or average
                dailyMoods[date] = moodsByDay[date][0];
            }
        }
        
        res.json({
            totalEntries: moods.length,
            moodCounts,
            mostFrequentMood,
            dailyMoods
        });
    } catch (err) {
        console.error('Error fetching mood summary:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;