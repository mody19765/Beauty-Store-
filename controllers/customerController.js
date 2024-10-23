const Customer = require('../models/Customer');
const  logHistory  = require('../utils/historyLogger'); 

exports.createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
    await logHistory(req.user.id, 'CREATE_CUSTOMER', `Created customer '${customer.first_name} ${customer.last_name}'`, customer._id);

  } catch (error) {
    console.error("Error in updateCustomer:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error in updateCustomer:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(customer);
  } catch (error) {
    console.error("Error in updateCustomer:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    await logHistory(req.user.id, 'UPDATE_CUSTOMER', `Updated customer '${customer.first_name} ${customer.last_name}'`, customer._id);

    res.status(200).json(customer);
  } catch (error) {
    console.error("Error in updateCustomer:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    await logHistory(req.user.id, 'DELETE_CUSTOMER', `Deleted customer '${customer.first_name} ${customer.last_name}'`, customer._id);

    res.status(200).json({ message: 'Customer deleted' });
  } catch (error) {
    console.error("Error in deleteCustomer:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.searchCustomers = async (req, res) => {
  try {
    const { query } = req.query;

    // Validate the search query
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Query parameter is required and should not be empty.' });
    }

    const searchPattern = new RegExp(query.trim(), 'i'); // Case-insensitive search

    // Search in name and email fields
    const customers = await Customer.find({
      $or: [
        { first_name: searchPattern },
        { phone_number: searchPattern }
      ]
    });

    if (customers.length === 0) {
      return res.status(404).json({ message: 'No customers found matching the search query.' });
    }

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
