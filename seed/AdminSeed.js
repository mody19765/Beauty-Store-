const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb+srv://Mo:Mo@cluster0.w0qfnzb.mongodb.net/Beauty_Store', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const hashedPassword = await bcrypt.hash('123', 10);
    const admin = new Admin({
      name: 'Shady',
      email: 'Shady@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    await admin.save();
    console.log('Admin user created successfully!');
    mongoose.connection.close();
  })
  .catch(err => console.log('Error:', err));
