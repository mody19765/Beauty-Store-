// services/userService.js
const User = require('../models/userModel');
exports.getAllUsers = async () => {
 try {
   return await User.find({});
 } catch (error) {
   throw new Error('Error retrieving users');
 }
};
exports.updateUser = async (id, updatedData) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');

  await History.create({
   action: 'UPDATE',
   targetId: userId,
   changes: { old: existingUser, new: updatedUser },
   performedBy,
 });
 
  Object.assign(user, updatedData);
  return await user.save();
};

exports.deleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');
  await User.findByIdAndDelete(id);
};

exports.findById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');
  return user;
};

exports.searchUsers = async (query) => {
  return await User.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { phone: { $regex: query, $options: 'i' } }
    ]
  });
};
