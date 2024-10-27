const Branch = require('../models/Branch');
const  logHistory  = require('../utils/historyLogger'); 

exports.createBranch = async (req, res) => {
  try {
    const branch = new Branch(req.body);
    await branch.save();
    await logHistory(req.user.id, 'CREATE_BRANCH', `Created branch '${branch.branch_name}'`, branch._id);

    res.status(201).json(branch);
  } catch (error) {
    console.error("Error in createBranch:", error);
    res.status(400).json({ message: error.message });  }
};

exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    await logHistory(req.user.id, 'UPDATE_BRANCH', `Updated branch '${branch.branch_name}'`, branch._id);
  
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
   
    await logHistory(req.user.id, 'DELETE_BRANCH', `Deleted branch '${branch.branch_name}'`, branch._id);

    res.status(200).json({ message: 'Branch deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchBranches = async (req, res) => {
  try {
      const { query } = req.query; // Get search query from request
      const searchPattern = new RegExp(query, 'i'); // Case-insensitive search

      const branches = await Branch.find({
          $or: [
              { branch_name: searchPattern },
              { address: searchPattern }
          ]
      });

      res.status(200).json(branches);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};