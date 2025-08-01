const mongoose = require('mongoose');

/**
 * Journal Entry Schema
 * Represents a journal entry in Garima's Space
 */
const journalEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    // For unencrypted text
    text: {
        type: String,
        required: [
            function() { return !this.encrypted; },
            'Text is required for unencrypted entries'
        ],
        trim: true
    },
    // For categorization
    tags: [{
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [30, 'Tag cannot be longer than 30 characters']
    }],
    // Encryption fields
    encrypted: {
        type: Boolean,
        default: false
    },
    iv: {
        type: String,
        required: [
            function() { return this.encrypted; },
            'IV is required for encrypted entries'
        ]
    },
    ciphertext: {
        type: String,
        required: [
            function() { return this.encrypted; },
            'Ciphertext is required for encrypted entries'
        ]
    },
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            // Clean up the returned object
            if (ret.encrypted) {
                delete ret.text; // Don't include text if encrypted
            } else {
                delete ret.iv;
                delete ret.ciphertext;
            }
            return ret;
        }
    }
});

// Indexes for better query performance
journalEntrySchema.index({ userId: 1, createdAt: -1 });
journalEntrySchema.index({ tags: 1 });

// Virtual for getting decrypted text (if encrypted)
journalEntrySchema.virtual('decryptedText').get(function() {
    if (!this.encrypted) return this.text;
    // Note: Actual decryption should be handled in the controller/service layer
    return null;
});

// Pre-save validation
journalEntrySchema.pre('save', function(next) {
    if (!this.text && !(this.iv && this.ciphertext)) {
        const error = new Error('Either text or encrypted content is required');
        return next(error);
    }
    next();
});

// Static method to get recent entries for a user
journalEntrySchema.statics.findRecentByUser = function(userId, limit = 10) {
    return this.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit);
};

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

module.exports = JournalEntry;