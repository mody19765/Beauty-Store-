const CustomerBooking = require('../models/CustomerBooking');

exports.createCustomerBooking = async (req, res) => {
  try {
    const customerBooking = new CustomerBooking(req.body);
    await customerBooking.save();
    res.status(201).json(customerBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllCustomerBookings = async (req, res) => {
  try {
    const customerBookings = await CustomerBooking.find();
    res.status(200).json(customerBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCustomerBookingById = async (req, res) => {
  try {
    const customerBooking = await CustomerBooking.findById(req.params.id);
    if (!customerBooking) return res.status(404).json({ message: 'CustomerBooking not found' });
    res.status(200).json(customerBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCustomerBooking = async (req, res) => {
  try {
    const customerBooking = await CustomerBooking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customerBooking) return res.status(404).json({ message: 'CustomerBooking not found' });
    res.status(200).json(customerBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCustomerBooking = async (req, res) => {
  try {
    const customerBooking = await CustomerBooking.findByIdAndDelete(req.params.id);
    if (!customerBooking) return res.status(404).json({ message: 'CustomerBooking not found' });
    res.status(200).json({ message: 'CustomerBooking deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchCustomerBookings = async (req, res) => {
  try {
      const { query } = req.query;
      if (!query) {
          return res.status(400).json({ message: 'Query parameter is required' });
      }

      const searchPattern = new RegExp(query, 'i'); 

      const customerBookings = await CustomerBooking.find({
          $or: [
              { service: searchPattern },
              { date: searchPattern }  // Assumes `date` is a string field; adjust if it's a date type
          ]
      });

      res.status(200).json(customerBookings);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};