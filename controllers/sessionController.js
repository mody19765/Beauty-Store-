
const { log } = require('winston');
const Session = require('../models/Session');
const Customer = require('../models/Customer');


exports.createSession = async (req, res) => {
  try {
    const {Branch_id, services, client_name, phone_number } = req.body;
    
    let client = await Customer.findOne({ phone_number });
    if (!client) {
      // Log that a client needs to be created if not found
      console.log("Client does not exist. Proceed to create a new client.");
      // Proceed to create the client in a different flow instead of here
      return res.status(400).json({ message: "Client does not exist. Please create the client first." });
    }

    if (!Branch_id || !services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: 'Branch_id and services must be provided and services should be an array.' });
    }

    const currentTime = new Date();
    const serviceValidations = await Promise.all(
      services.map(async (service) => {
        const startTime = new Date(service.service_start_time);

        if (startTime <= currentTime) {
          return { error: `Service start time for ${service.service_name} must be a future date.` };
        }

        const endTime = new Date(startTime.getTime() + 45 * 60000);

        const overlappingSession = await Session.findOne({
          'services.designer_id': service.designer_id,
          $or: [
            { 'services.service_start_time': { $lt: endTime }, 'services.service_end_time': { $gt: startTime } }
          ]
        });

        if (overlappingSession) {
          return { error: `Designer is already assigned between ${startTime} and ${endTime}.` };
        }

        return { success: true };
      })
    );

    const failedValidation = serviceValidations.find((result) => result.error);
    if (failedValidation) {
      return res.status(400).json({ message: failedValidation.error });
    }

    const session = new Session({ Branch_id, services, phone_number, client_name });
    await session.save();
    res.status(201).json(session);

  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the session.', error: error.message });
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

    res.status(200).json(existingSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    const { service_start_time,designer_id } = req.body;

    // Validate required fields
    if (!service_start_time || !designer_id) {
      return res.status(400).json({ message: 'Missing required fields: service_start_time and designer_id' });
    }

    // Parse and validate the start time
    const startTime = new Date(service_start_time);
    if (isNaN(startTime.getTime())) {
      return res.status(400).json({ message: 'Invalid service start time format' });
    }
    
    // Ensure the start time is not in the past
    if (startTime < new Date()) {
      return res.status(400).json({ message: 'Service start time cannot be in the past' });
    }

    const endTime = new Date(startTime.getTime() + 45 * 60000);

    // Validate the session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Find the service to update
    const service = session.services.id(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check for overlapping designer bookings in other sessions
    const overlappingService = await Session.findOne({
      _id: { $ne: sessionId },
      "services.designer_id": designer_id,
      $or: [
        { "services.service_start_time": { $lt: endTime, $gte: startTime } },
        { "services.service_end_time": { $gt: startTime, $lte: endTime } }
      ]
    });

    if (overlappingService) {
      return res.status(400).json({
        message: 'Designer is already booked during the specified time slot'
      });
    }

    // Update the service details
    Object.assign(service, {
      service_start_time: startTime.toISOString(),
      service_end_time: endTime.toISOString(),
      designer_id
    });

    await session.save();

    res.status(200).json({ message: 'Service updated successfully', session });
  } 
  catch (error) {
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
};




// Delete Service from Session
exports.deleteServiceFromSession = async (req, res) => {
  try {
    const { sessionId, serviceId } = req.params;
    
    // Retrieve the session by ID and check for its existence
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Use .id() to find and remove the service by its ID
    const service = session.services.id(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    // Remove the service and save the session
    service.remove();
    await session.save();
    
    res.status(200).json({ message: 'Service deleted successfully', session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



    
    /**
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