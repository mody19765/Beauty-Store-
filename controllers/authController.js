const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendPasswordResetEmail, sendInvitationEmail } = require('../utils/emailService');
const BlacklistedToken = require('../models/blacklistedToken'); // Optional: If implementing blacklist
const logHistory  = require('../utils/historyLogger');

// Admin adds user
exports.addUserByAdmin = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user with no password set initially
    const user = new User({ name, email, phone, role, isPasswordSet: false });

    // Save user to the database
    await user.save();

    // Generate token for email invitation (expires in 1 hour)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the invitation email with the token link
    await sendInvitationEmail(email, token);
    await logHistory({
      userId: req.user.id,
      action: 'Add User by Admin',
      details: `Admin : ${req.user.id}added user: ${name} with role: ${role}`,
    });
    // Return success message
    res.status(201).json({ message: 'User added and invitation sent', token });
  } catch (error) {
    console.error('Error in addUserByAdmin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Set password after clicking invitation link
exports.setPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds for security
    user.password = hashedPassword;
    user.isPasswordSet = true;

    await user.save();
    res.status(200).json({ message: 'Password set successfully' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Token expired. Please request a new invitation.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid token.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.isPasswordSet) {
      return res.status(400).json({ message: 'User does not exist or password not set.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, "mo", { expiresIn: '1d' });
    await logHistory({
      userId: user._id,
      action: 'Login',
      details: `User ${user.name} logged in.`,
    });
    
    res.status(200).json({ message:"Sucess",token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// controllers/authController.js

exports.logout = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (token) {
      // Optional: Add token to a blacklist if you plan to check this list on login
      await BlacklistedToken.create({ token });

      // Alternatively, you can expire the token by setting a short lifespan when issuing the token
    }

    // Send a response to the client indicating successful logout
    await logHistory({
      userId: req.user.id,
      action: 'Logout',
      details: `User ${req.user.id} logged out.`,
    });
    res.status(200).json({ message: 'Logout successful. Please remove the token from your client storage.' });
  } catch (error) {
    res.status(500).json({ message: 'Error during logout', error: error.message });
  }
};


// Request Password Reset
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Generate password reset token (expires in 1 hour)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send password reset email
    await sendPasswordResetEmail(email, token);
    await logHistory({
      userId: user._id,
      action: 'Password Reset Requested',
      details: `User ${user.email} requested password reset.`,
    });
    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds
    user.password = hashedPassword;

    await user.save();
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Token expired. Please request a new reset.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid token.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin adds new admin
exports.addAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds

    // Create new admin
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
