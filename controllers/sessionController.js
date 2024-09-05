const Session = require('../models/Session');


exports.createSession = async (req, res) => {
  try {
    const { session_date, Branch_id, services, client_name } = req.body;

    // Validate session start date
    if (new Date(session_date) < new Date()) {
      return res.status(400).json({ message: 'Session date must be in the future.' });
    }

    // Validate services
    for (const service of services) {
      if (new Date(service.service_start_time) < new Date()) {
        return res.status(400).json({ message: 'Service start time must be a future date.' });
      }
    }

    // Create new session object
    const session = new Session({
      session_date,
      Branch_id,
      services,
      client_name
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate('services.service_id') // Fetch full service details
      .populate('services.designer_id') // Fetch full designer details
      .populate('branch_id'); // Fetch branch details

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('services.service_id') // Fetch full service details
      .populate('services.designer_id') // Fetch full designer details
      .populate('branch_id'); // Fetch branch details

    if (!session) return res.status(404).json({ message: 'Session not found' });

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.status(200).json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchSessions = async (req, res) => {
  try {
    const { query } = req.query; // Get search query from request
    const searchPattern = new RegExp(query, 'i'); // Case-insensitive search

    const sessions = await Session.find({
      $or: [
        { session_name: searchPattern },
        { description: searchPattern }
      ]
    });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};