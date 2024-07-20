const ApprovedBooking = require('../models/ApprovedBooking');

exports.createApprovedBooking = async (req, res) => {
  try {
    const approvedBooking = new ApprovedBooking(req.body);
    await approvedBooking.save();
    res.status(201).json(approvedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllApprovedBookings = async (req, res) => {
  try {
    const approvedBookings = await ApprovedBooking.find();
    res.status(200).json(approvedBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApprovedBookingById = async (req, res) => {
  try {
    const approvedBooking = await ApprovedBooking.findById(req.params.id);
    if (!approvedBooking) return res.status(404).json({ message: 'ApprovedBooking not found' });
    res.status(200).json(approvedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateApprovedBooking = async (req, res) => {
  try {
    const approvedBooking = await ApprovedBooking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!approvedBooking) return res.status(404).json({ message: 'ApprovedBooking not found' });
    res.status(200).json(approvedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteApprovedBooking = async (req, res) => {
  try {
    const approvedBooking = await ApprovedBooking.findByIdAndDelete(req.params.id);
    if (!approvedBooking) return res.status(404).json({ message: 'ApprovedBooking not found' });
    res.status(200).json({ message: 'ApprovedBooking deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};