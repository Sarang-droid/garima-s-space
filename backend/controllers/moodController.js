const MoodEntry = require('../models/MoodEntry');

// POST /mood
exports.saveMood = async (req, res) => {
    try {
        const { moodEmoji } = req.body;
        const userId = req.user._id;
        const today = new Date();
        today.setHours(0,0,0,0);
        // Only one mood per day
        let mood = await MoodEntry.findOne({ userId, date: today });
        if (mood) {
            mood.moodEmoji = moodEmoji;
            await mood.save();
        } else {
            mood = new MoodEntry({ userId, moodEmoji, date: today });
            await mood.save();
        }
        res.status(201).json({ message: 'Mood saved' });
    } catch (err) {
        res.status(500).json({ error: 'Could not save mood', details: err.message });
    }
};

// GET /mood/weekly
exports.getWeeklyMoods = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 6);
        const moods = await MoodEntry.find({
            userId,
            date: { $gte: weekAgo, $lte: today }
        }).sort({ date: 1 });
        res.json(moods);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch moods', details: err.message });
    }
};
