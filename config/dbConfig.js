const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://Mo:Mo@cluster0.w0qfnzb.mongodb.net/Beauty_Store', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 10, 
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;