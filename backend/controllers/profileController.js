const User = require('../models/User');
const JournalEntry = require('../models/journalEntry');
const MoodEntry = require('../models/MoodEntry');

// Get user profile with insights
exports.getProfileWithInsights = async (req, res) => {
    try {
        // Get user profile
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get mood statistics
        const moodStats = await MoodEntry.aggregate([
            { $match: { user: user._id } },
            { $group: {
                _id: '$mood',
                count: { $sum: 1 }
            }},
            { $sort: { count: -1 } }
        ]);

        // Get journal statistics
        const journalCount = await JournalEntry.countDocuments({ user: user._id });
        
        // Get recent journal entries
        const recentJournals = await JournalEntry.find({ user: user._id })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title content createdAt tags');

        // Get most used tags
        const tagStats = await JournalEntry.aggregate([
            { $match: { user: user._id } },
            { $unwind: '$tags' },
            { $group: {
                _id: '$tags',
                count: { $sum: 1 }
            }},
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Calculate streak (consecutive days with entries)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let currentDate = new Date(today);
        let streak = 0;
        
        while (true) {
            const startOfDay = new Date(currentDate);
            const endOfDay = new Date(currentDate);
            endOfDay.setHours(23, 59, 59, 999);
            
            const hasEntry = await JournalEntry.findOne({
                user: user._id,
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            });
            
            if (!hasEntry) break;
            
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        }

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profile: user.profile,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt
            },
            insights: {
                journalCount,
                streak,
                moodStats,
                tagStats,
                recentJournals
            }
        });
    } catch (error) {
        console.error('Get profile with insights error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get user activity summary
exports.getActivitySummary = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Get date range (last 30 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        
        // Get journal entries by day
        const journalByDay = await JournalEntry.aggregate([
            { 
                $match: { 
                    user: userId,
                    createdAt: { $gte: startDate, $lte: endDate } 
                } 
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        // Get mood entries by day
        const moodByDay = await MoodEntry.aggregate([
            { 
                $match: { 
                    user: userId,
                    createdAt: { $gte: startDate, $lte: endDate } 
                } 
            },
            {
                $group: {
                    _id: { 
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        mood: "$mood"
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.date": 1 } }
        ]);
        
        res.json({
            journalByDay,
            moodByDay
        });
    } catch (error) {
        console.error('Get activity summary error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};