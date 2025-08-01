const Message = require('../models/message');

// GET /messages
exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.find({}).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch messages', details: err.message });
    }
};

// GET /messages/daily
exports.getDailyMessage = async (req, res) => {
    try {
        // Get current date at midnight for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Find a message that hasn't been viewed today
        let message = await Message.findOneAndUpdate(
            {
                $or: [
                    { lastViewed: { $lt: today } },
                    { lastViewed: { $exists: false } }
                ]
            },
            { $set: { lastViewed: new Date() } },
            { sort: { createdAt: 1 }, new: true }
        );

        // If all messages have been viewed today, get the first one
        if (!message) {
            message = await Message.findOne().sort({ lastViewed: 1 });
            if (message) {
                message.lastViewed = new Date();
                await message.save();
            }
        }

        if (!message) {
            return res.status(404).json({ error: 'No messages available' });
        }

        res.json(message);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch daily message', details: err.message });
    }
};

// POST /messages (admin only)
exports.postMessage = async (req, res) => {
    try {
        const { text, mediaUrl } = req.body;
        // Optionally: check admin via req.user.isAdmin
        const message = new Message({ text, mediaUrl });
        await message.save();
        res.status(201).json({ message: 'Message posted', id: message._id });
    } catch (err) {
        res.status(500).json({ error: 'Could not post message', details: err.message });
    }
};

// DELETE /messages/:id (admin only)
exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndDelete(id);
        res.json({ message: 'Message deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Could not delete message', details: err.message });
    }
};

// Optional: PUT /messages/:id for update
