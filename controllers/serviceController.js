const Service = require('../models/Service');

exports.createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchServices = async (req, res) => {
  try {
    const { query } = req.query;

    // Check if query is provided and not empty
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Query parameter is required and should not be empty.' });
    }

    const searchPattern = new RegExp(query.trim(), 'i'); // Create a case-insensitive regex for search

    // Perform search on service_name and description only, avoid searching by _id
    const services = await Service.find({
      $or: [
        { name: searchPattern },
        { description: searchPattern }
      ]
    });

    if (services.length === 0) {
      return res.status(404).json({ message: 'No services found matching the search query.' });
    }

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
