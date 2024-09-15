const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to authenticate token
exports.authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);

        // Attach user info to request
        req.user = await User.findById(user.userId);
        next();
    });
};

// Middleware to authorize specific roles
exports.authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) return res.status(403).json({ message: 'Access denied.' });
        next();
    };
};
