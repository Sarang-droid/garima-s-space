const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String },
    password: { type: String }, // hashed if used
    lastLogin: { type: Date },
    profile: {
        displayName: String,
        avatarUrl: String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);