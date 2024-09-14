const Designer = require('../models/Designer');

exports.createDesigner = async (req, res) => {
  try {
    const designer = new Designer(req.body);
    await designer.save();
    res.status(201).json(designer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllDesigners = async (req, res) => {
  try {
    const designers = await Designer.find();
    res.status(200).json(designers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDesignerById = async (req, res) => {
  try {
    const designer = await Designer.findById(req.params.id);
    if (!designer) return res.status(404).json({ message: 'Designer not found' });
    res.status(200).json(designer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDesigner = async (req, res) => {
  try {
    const designer = await Designer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!designer) return res.status(404).json({ message: 'Designer not found' });
    res.status(200).json(designer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDesigner = async (req, res) => {
  try {
    const designer = await Designer.findByIdAndDelete(req.params.id);
    if (!designer) return res.status(404).json({ message: 'Designer not found' });
    res.status(200).json({ message: 'Designer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchDesigners = async (req, res) => {
  try {
    const { query } = req.query;

    // Validate the search query
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Query parameter is required and should not be empty.' });
    }

    const searchPattern = new RegExp(query.trim(), 'i'); // Case-insensitive search

    // Search in name and specialty fields
    const designers = await Designer.find({
      $or: [
        { name: searchPattern },
        { specialization: searchPattern }
      ]
    });

    if (designers.length === 0) {
      return res.status(404).json({ message: 'No designers found matching the search query.' });
    }

    res.status(200).json(designers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
