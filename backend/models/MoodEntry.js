const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    moodEmoji: { type: String, required: true },
    date: { type: Date, required: true, unique: true }
});

module.exports = mongoose.model('MoodEntry', moodEntrySchema);