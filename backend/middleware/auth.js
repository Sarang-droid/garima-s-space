const jwt = require('jsonwebtoken');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sarang@example.com';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Middleware: Require user (Garima)
exports.requireUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Middleware: Require admin (Sarang)
exports.requireAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.email !== ADMIN_EMAIL) {
            return res.status(403).json({ error: 'Admin only' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Helper: Sign JWT for login
exports.signToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
