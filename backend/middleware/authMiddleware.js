// Authentication middleware logic here
const jwt = require('jsonwebtoken');

// Middleware to authenticate user
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header

    if (!token) {
        return res.status(401).json({ message: 'No token provided. Authorization denied.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, 'YOUR_SECRET_KEY'); // Replace 'YOUR_SECRET_KEY' with your JWT secret
        req.user = decoded; // Attach the decoded user data to the request
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ message: 'Invalid token. Authorization denied.' });
    }
};

module.exports = authMiddleware;
