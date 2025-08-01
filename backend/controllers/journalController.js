const JournalEntry = require('../models/journalEntry');
const User = require('../models/User');
const crypto = require('crypto');

// Optional: Replace with your own secret or use env variable
const ENCRYPTION_KEY = process.env.JOURNAL_ENCRYPTION_KEY || 'default_secret_32byteslong!'; // 32 bytes for aes-256
const IV_LENGTH = 16;

function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), ciphertext: encrypted };
}

function decrypt(ciphertext, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Save a journal entry
exports.saveEntry = async (req, res) => {
    try {
        const { text, tags, encrypted } = req.body;
        const userId = req.user._id; // Assumes auth middleware sets req.user
        let entryData = { userId, tags, createdAt: new Date() };
        if (encrypted) {
            const { iv, ciphertext } = encrypt(text);
            entryData = { ...entryData, encrypted: true, iv, ciphertext };
        } else {
            entryData.text = text;
        }
        const entry = new JournalEntry(entryData);
        await entry.save();
        res.status(201).json({ message: 'Entry saved', entryId: entry._id });
    } catch (err) {
        res.status(500).json({ error: 'Could not save entry', details: err.message });
    }
};

// Get entries from the past 7 days
exports.getWeeklyEntries = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 6);
        const entries = await JournalEntry.find({
            userId,
            createdAt: { $gte: weekAgo, $lte: today }
        }).sort({ createdAt: -1 });
        // Decrypt if needed
        const result = entries.map(e => {
            if (e.encrypted) {
                return {
                    ...e.toObject(),
                    text: decrypt(e.ciphertext, e.iv)
                };
            }
            return e.toObject();
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch entries', details: err.message });
    }
};

// Get recent journal entries with optional limit
exports.getRecentEntries = async (req, res) => {
    try {
        const userId = req.user._id;
        const limit = parseInt(req.query.limit) || 5; // Default to 5 entries if no limit specified
        
        const entries = await JournalEntry.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit);
        
        // Decrypt if needed
        const result = entries.map(e => {
            if (e.encrypted) {
                return {
                    ...e.toObject(),
                    text: decrypt(e.ciphertext, e.iv)
                };
            }
            return e.toObject();
        });
        
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch recent entries', details: err.message });
    }
};
