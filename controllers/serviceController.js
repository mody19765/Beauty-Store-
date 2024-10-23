const Service = require('../models/Service');
const  logHistory  = require('../utils/historyLogger');

// Create a new service
exports.createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();

    // Log the creation of the service
    await logHistory(req.user.id, 'CREATE_SERVICE', `Created service '${service.name}'`, service._id);

    res.status(201).json({ message: "Success", data: service });
  } catch (error) {
    console.error("Error in createService:", error);
    res.status(400).json({ message: error.message });
  }
};

// Retrieve all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({ message: "Success", data: services });
  } catch (error) {
    console.error("Error in getAllServices:", error);
    res.status(500).json({ message: error.message });
  }
};

// Retrieve a service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({ message: "Success", data: service });
  } catch (error) {
    console.error("Error in getServiceById:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update an existing service
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Log the update of the service
    await logHistory(req.user.id, 'UPDATE_SERVICE', `Updated service '${service.name}'`, service._id);

    res.status(200).json({ message: "Success", data: service });
  } catch (error) {
    console.error("Error in updateService:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a service by ID
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Log the deletion of the service
    await logHistory(req.user.id, 'DELETE_SERVICE', `Deleted service '${service.name}'`, service._id);

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error("Error in deleteService:", error);
    res.status(500).json({ message: error.message });
  }
};

// Search services by name or description
exports.searchServices = async (req, res) => {
  try {
    const { query } = req.query;

    // Check if query is provided and not empty
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Query parameter is required and should not be empty.' });
    }

    const searchPattern = new RegExp(query.trim(), 'i'); // Create a case-insensitive regex for search

    // Perform search on name and description fields
    const services = await Service.find({
      $or: [
        { name: searchPattern },
        { description: searchPattern }
      ]
    });

    if (services.length === 0) {
      return res.status(404).json({ message: 'No services found matching the search query.' });
    }

    res.status(200).json({ message: "Success", data: services });
  } catch (error) {
    console.error("Error in searchServices:", error);
    res.status(500).json({ message: error.message });
  }
};
