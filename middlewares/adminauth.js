const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.createFirstAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if any admin already exists
    const existingAdmin = await Admin.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    // Save to database
    await admin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
// Admin login
exports.adminLogin = async (req, res) => {
  try {
      const { email, password } = req.body;

      const admin = await Admin.findOne({ email });
      if (!admin) return res.status(404).json({ message: 'Admin not found' });

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: admin._id, role: 'admin' },"mo", { expiresIn: '1h' });

      res.status(200).json({ token });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

exports.addAdmin = async (req, res) => {
  try {
      const { name, email, password } = req.body;

      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
          return res.status(400).json({ message: 'Admin already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = new Admin({
          name,
          email,
          password: hashedPassword,
          role: 'admin',
      });

      await newAdmin.save();

      res.status(201).json({ message: 'Admin created successfully.' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

