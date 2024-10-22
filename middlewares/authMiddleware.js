const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'mo';

// Middleware to authenticate token for both User and Admin
exports.authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.status(401).json({ message: 'No token provided.' });
  
    try {
      const decoded = jwt.verify(token, "mo");
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      req.user = user;
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
  };
  
  exports.authorizeRole = (role) => {
    return (req, res, next) => {
      if (req.user.role === 'admin') {
        return next();
      }
  
      if (req.user.role !== role) {
        return res.status(403).json({ message: 'Access denied.' });
      }
  
      next();
    };
  };
  