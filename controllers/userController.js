// controllers/userController.js
const User = require('../models/userModel');
const userService = require('../services/userServices');
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
    const token = jwt.sign({ id: user._id }, "mo", { expiresIn: '1h' });

    // Send the invitation email with the token link
    await sendInvitationEmail(email, token);
    await logHistory({
      userId: req.user.id,
      action: 'Add User by Admin',
      details: `Admin : ${req.user.id} added user: ${name} with role: ${role}`,
     });
console.log("user : ",user);

    // Return success message
    res.status(201).json({ message: 'User added and invitation sent', token });
  } catch (error) {
    console.error('Error in addUserByAdmin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.getAllUsers = async (req, res) => {
 try {
  const users = await User.find();
  res.status(200).json({ data: users });
} catch (error) {
  console.error("Error fetching users:", error);
  res.status(400).json({ message: error.message });
}
};

exports.updateUser = async (req, res) => {
 try {
  const { id } = req.params;
  const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

  await logHistory(req.user.id, 'UPDATE_USER', `Updated user: ${updatedUser.name}`);

  res.status(200).json({ message: "User updated successfully", data: updatedUser });
} catch (error) {
  console.error("Error in updateUser:", error);
  res.status(400).json({ message: error.message });
}
};

exports.deleteUser = async (req, res) => {
 try {
  const { id } = req.params;
  const userToDelete = await User.findByIdAndDelete(id);

  await logHistory(req.user.id, 'DELETE_USER', `Deleted user: ${userToDelete.name}`);

  res.status(200).json({ message: "User deleted successfully" });
} catch (error) {
  console.error("Error in deleteUser:", error);
  res.status(400).json({ message: error.message });
}
};

exports.findById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.findById(id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const results = await userService.searchUsers(query);
    res.json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
