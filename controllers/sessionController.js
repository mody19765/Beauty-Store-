
const Session = require('../models/Session');
const Customer = require('../models/Customer');
const Service = require('../models/Service');
const logHistory = require('../utils/historyLogger'); // Update the path if needed
const History = require('../models/history');


exports.createSession = async (req, res) => {
  try {
    const { services, client_name, phone_number, Branch_id } = req.body;

    if (!Branch_id) {
      return res.status(400).json({ message: 'Branch_id is required.' });
    }

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: 'Services should be a non-empty array.' });
    }

    const currentDate = new Date();

    // Validate each service for overlapping designer bookings
    for (let service of services) {
      const { service_start_time, designer_id } = service;
      const startTime = new Date(service_start_time);

      if (isNaN(startTime.getTime()) || startTime < currentDate) {
        return res.status(400).json({ message: 'Each service must have a valid future start time.' });
      }

      const endTime = new Date(startTime.getTime() + 45 * 60000);

      // Query to find any overlapping bookings for the same designer
      const overlappingSession = await Session.findOne({
        "services.designer_id": designer_id,
        "services.service_start_time": { $lt: endTime, $gte: startTime }
      });

      if (overlappingSession) {
        return res.status(400).json({
          message: `Designer is already booked for a service between ${startTime.toISOString()} and ${endTime.toISOString()}`
        });
      }
    }

    // Check if client exists by phone number, create if not
    let client = await Client.findOne({ phone_number });
    if (!client) {
      client = await Client.create({ phone_number, client_name });
    }

    // Proceed to create session if no overlaps
    const session = new Session({ client_name, Branch_id, services, client: client._id });
    await session.save();
    res.status(201).json({ message: 'Session created successfully', session });
  } catch (error) {
    res.status(500).json({ message: 'Error creating session', error: error.message });
  }
};

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate('branch_id')
      .populate({
        path: 'services',
        populate: [
          { path: 'service_id' },
          { path: 'designer_id' }
        ]
      });

    const updatedSessions = sessions.map(session => {
      const updatedServices = session.services.map(service => ({
        ...service.toObject(),
        session_id: session._id
      }));
      return {
        ...session.toObject(),
        services: updatedServices
      };
    });

    res.status(200).json(updatedSessions);
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
    const { services, client_name } = req.body; // Include client_name
    const sessionId = req.params.id;

    // Check if services is an array and not empty
    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: 'Services should be a non-empty array.' });
    }

    // Find the session to update
    const existingSession = await Session.findById(sessionId);
    if (!existingSession) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Current date and time for validation
    const currentDate = new Date();

    // Initialize an array to track designer schedules
    const designerSchedule = {};

    // Fetch all sessions excluding the one being updated
    const allOtherSessions = await Session.find({ _id: { $ne: sessionId } });

    // Build the schedule for each designer from existing sessions
    allOtherSessions.forEach((session) => {
      session.services.forEach((service) => {
        const { service_start_time, service_end_time, designer_id } = service;

        if (!designerSchedule[designer_id]) {
          designerSchedule[designer_id] = [];
        }
        designerSchedule[designer_id].push({
          startTime: new Date(service_start_time),
          endTime: new Date(service_end_time),
        });
      });
    });

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

    // Update session with processed services and client name
    existingSession.services = updatedServices;
    if (client_name) {
      existingSession.client_name = client_name; // Update client name if provided
    }

    await existingSession.save();
    await logHistory({
      userId: req.user._id,
      action: `Updated session ${sessionId}`,
      timestamp: new Date(),
      details: `Updated services: ${JSON.stringify(updatedServices)} and client_name: ${client_name}`
    });
    res.status(200).json(existingSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);

    if (!session) return res.status(404).json({ message: 'Session not found' });

    await logHistory({
      userId: req.user._id,
      action: `Deleted session ${sessionId}`,
      timestamp: new Date(),
      details: `Deleted session with ID: ${sessionId}`
    });
    res.status(200).json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.searchSessions = async (req, res) => {
  try {
    const { query } = req.query;

    // Validate the search query
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Query parameter is required and should not be empty.' });
    }

    const searchPattern = new RegExp(query.trim(), 'i'); // Case-insensitive search

    // Search in session_name and description fields
    const sessions = await Session.find({
      $or: [
        { client_name: searchPattern },
        { Branch_id: searchPattern }
      ]
    });

    if (sessions.length === 0) {
      return res.status(404).json({ message: 'No sessions found matching the search query.' });
    }

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update a specific service within a session
exports.updateServiceInSession = async (req, res) => {
  try {
    const { sessionId, serviceId } = req.params;
    const { new_service_id, service_start_time, designer_id } = req.body;

    if (!new_service_id || !service_start_time || !designer_id) {
      return res.status(400).json({ message: 'Missing required fields: new_service_id, service_start_time, and designer_id' });
    }

    const startTime = new Date(service_start_time);
    if (startTime < new Date()) {
      return res.status(400).json({ message: 'Service start time cannot be in the past' });
    }

    const endTime = new Date(startTime.getTime() + 45 * 60000);

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const newService = await Service.findById(new_service_id);
    if (!newService) {
      return res.status(404).json({ message: 'New service not found' });
    }

    const service = session.services.id(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found in session' });
    }

    // Internal overlap check
    const internalOverlap = session.services.some(svc =>
      svc._id !== serviceId &&
      svc.designer_id === designer_id &&
      new Date(svc.service_start_time) < endTime &&
      new Date(svc.service_end_time) > startTime
    );

    if (internalOverlap) {
      return res.status(400).json({ message: 'Designer is already booked during the specified time slot in this session.' });
    }

    // Cross-session overlap check
    const overlappingService = await Session.findOne({
      _id: { $ne: sessionId },
      "services.designer_id": designer_id,
      $or: [
        { "services.service_start_time": { $lt: endTime, $gte: startTime } },
        { "services.service_end_time": { $gt: startTime, $lte: endTime } }
      ]
    });

    if (overlappingService) {
      return res.status(400).json({ message: 'Designer is already booked during the specified time slot in another session.' });
    }

    service._id = newService._id;
    service.service_name = newService.service_name;
    service.service_start_time = startTime.toISOString();
    service.service_end_time = endTime.toISOString();
    service.designer_id = designer_id;

    await session.save();
    await logHistory({
      userId: req.user._id,
      action: `Updated service ${serviceId} in session ${sessionId}`,
      timestamp: new Date(),
      details: `Updated to new service: ${newService._id}, start_time: ${service.service_start_time}, end_time: ${service.service_end_time}, designer_id: ${designer_id}`
    });
    res.status(200).json({ message: 'Service updated successfully', session });
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
};

// Delete Service from Session
exports.deleteServiceFromSession = async (req, res) => {
  try {
    const { sessionId, serviceId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const service = session.services.id(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    service.remove();
    await session.save();

    if (req.user && req.user._id) { // Ensure req.user is available
      await logHistory({
        userId: req.user._id,
        action: `Deleted service ${serviceId} from session ${sessionId}`,
        timestamp: new Date(),
        details: `Service ${serviceId} removed from Session ID: ${sessionId}`
      });
    }

    res.status(200).json({ message: 'Service deleted successfully', session });
  } catch (error) {
    console.error("Error logging history:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.findServiceInSessionById = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findById(serviceId);
    if (!service) throw new Error("Service not found in session");
    res.json(service);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};



/**
 * 
 * The request to http://localhost:3000/history/logs returned a 200 status code, indicating a successful response. The Content-Type of the response is "text/xml". However, the response body is null, which means that the server did not return any data in the response. This could indicate a problem with the server or the request itself, as it did not provide the expected data in the response body.



 *     exports.deleteServiceFromSession = async (req, res) => {
  try {
    const { sessionId, serviceId } = req.params;
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

       session.services.length
    for (let index = 0; index < session.services.length; index++) {
         console.log(index);
         console.log(serviceId);
         console.log(session.services[index]._id);

      if(session.services[index].service_id._id==serviceId)
      {
        console.log(session.services[index]._id);
        session.services[index].remove();
        await session.save();
        return res.status(200).json({ message: 'Service deleted successfully', session })
      }
    }
    return res.status(404).json({ message: 'Service not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};  
 */
