const Session = require('../models/Session');


exports.createSession = async (req, res) => {
  try {
    const {  Branch_id, services, client_name } = req.body;

    // Validate session start date
    

    // Validate services
    for (const service of services) {
      const startTime = new Date(service.service_start_time);

      if (startTime < new Date()) {
        return res.status(400).json({ message: 'Service start time must be a future date.' });
      }

      // Ensure no overlapping assignments for the same designer
      const overlappingSession = await Session.findOne({
        'services.designer_id': service.designer_id,
        $or: [
          {
            'services.service_start_time': { $lte: startTime },
            'services.service_end_time': { $gt: startTime }
          },
          {
            'services.service_start_time': { $lt: new Date(startTime.getTime() + 45 * 60000) },
            'services.service_end_time': { $gte: new Date(startTime.getTime() + 45 * 60000) }
          }
        ]
      });

      if (overlappingSession) {
        return res.status(400).json({
          message: `Designer is already assigned to another service between ${service.service_start_time} and ${service.service_end_time}.`
        });
      }
    }

    // Create new session object
    const session = new Session({
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
