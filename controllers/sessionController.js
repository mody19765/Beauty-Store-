const Session = require('../models/Session');
const Designer = require('../models/Designer');

exports.createSession = async (req, res) => {
  try {
    const { session_date, designer_id } = req.body;
    const sessionEndTime = new Date(session_date);
    sessionEndTime.setMinutes(sessionEndTime.getMinutes() + 45); // Adding 45 minutes to session start time

    // Check if the designer has another session that overlaps with the requested time
    const existingSession = await Session.findOne({
      designer_id,
      $or: [
        { 
          session_date: { $lt: sessionEndTime }, 
          session_end: { $gt: session_date }
        }
      ]
    });

    if (existingSession) {
      return res.status(400).json({ message: 'This designer is already booked for the selected time.' });
    }

    const session = new Session(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
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