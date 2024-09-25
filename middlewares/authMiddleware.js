const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'mo';

// Middleware to authenticate token for both User and Admin
exports.authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: 'No token provided.' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check in both Admin and User models
        const user = await User.findById(decoded.id) || await Admin.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User or Admin not found.' });
        }

        // Attach user/admin info to request
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};
exports.authorizeRole = (role) => {
    return (req, res, next) => {
        // Admin has full access
        if (req.user.role === 'admin') {
            return next();
        }

        // Only allow users access to specific areas (sessions, clients)
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        next();
    };
};
