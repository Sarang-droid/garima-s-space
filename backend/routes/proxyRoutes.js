const express = require('express');
const router = express.Router();
const axios = require('axios');

// Proxy route for registration
router.post('/register', async (req, res) => {
    try {
        const response = await axios.post(
            'https://garima-s-space-backend.vercel.app/api/users/register',
            req.body,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        // Forward the response from the backend
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Proxy error:', error);
        if (error.response) {
            // Forward the error response from the backend
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

module.exports = router;
