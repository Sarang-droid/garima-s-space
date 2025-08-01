const JournalEntry = require('../models/journalEntry');

const MESSAGE_BANK = {
    Family: "You’ve been thinking a lot about your family. It’s okay to feel this weight.",
    Dreams: "Your dreams are reflecting your emotional world. Trust them.",
    Anxiety: "It’s okay to feel anxious sometimes. You’re not alone.",
    Work: "Work has been on your mind. Remember to rest.",
    Friends: "Friendship is important. Cherish your connections.",
    Boyfriend: "Love and relationships are part of your journey.",
    'Self-doubt': "It’s okay to question yourself. Growth comes from reflection.",
    Other: "Every thought is valid."
};

// Helper: Aggregate tags from entries
function aggregateTags(entries) {
    const tagCounts = {};
    entries.forEach(entry => {
        (entry.tags || []).forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });
    return tagCounts;
}

// GET /tags/weekly
exports.getWeeklyStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 6);
        const entries = await JournalEntry.find({
            userId,
            createdAt: { $gte: weekAgo, $lte: today }
        });
        const tagCounts = aggregateTags(entries);
        const messages = {};
        Object.keys(tagCounts).forEach(tag => {
            messages[tag] = MESSAGE_BANK[tag] || "You’ve been thinking about this a lot.";
        });
        res.json({ ...tagCounts, Messages: messages });
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch tag stats', details: err.message });
    }
};

// Optional: GET /tags/history (not implemented)
