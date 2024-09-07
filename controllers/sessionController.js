const Session = require('../models/Session');

exports.createSession = async (req, res) => {
  try {
    const { services } = req.body;

    // Check if services is an array and not empty
    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: 'Services should be a non-empty array.' });
    }

    // Current date and time for validation
    const currentDate = new Date();

    // Initialize an array to track designer schedules
    const designerSchedule = {};

    // Validate and process each service
    const updatedServices = services.map((service) => {
      const { service_start_time, designer_id } = service;

      // Convert start time to Date object
      const startTime = new Date(service_start_time);

      // Check if start time is a valid date
      if (isNaN(startTime.getTime())) {
        throw new Error('Invalid start time. Please provide a valid date.');
      }

      // Ensure service start time is not in the past
      if (startTime < currentDate) {
        throw new Error('Service start time cannot be in the past. Please provide a future date.');
      }

      // Calculate end time (45 minutes after start time)
      const endTime = new Date(startTime.getTime() + 45 * 60000); // 45 minutes in milliseconds

      // Check if designer is already booked for this time
      if (!designerSchedule[designer_id]) {
        designerSchedule[designer_id] = [];
      }

      // Ensure the designer is not booked for overlapping times
      for (const scheduled of designerSchedule[designer_id]) {
        if (
          (startTime >= scheduled.startTime && startTime < scheduled.endTime) ||
          (endTime > scheduled.startTime && endTime <= scheduled.endTime)
        ) {
          throw new Error(
            `Designer is already booked between ${scheduled.startTime.toISOString()} and ${scheduled.endTime.toISOString()}`
          );
        }
      }

      // Add current service time to designer schedule
      designerSchedule[designer_id].push({ startTime, endTime });

      return {
        ...service,
        service_start_time: startTime.toISOString(),
        service_end_time: endTime.toISOString(),
      };
    });

    // Create session with processed services
    const sessionData = {
      ...req.body,
      services: updatedServices,
    };

    const session = new Session(sessionData);
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
  
