const Employee = require('../models/Employee');
const  logHistory  = require('../utils/historyLogger')


 exports.createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();

    // Log the creation of the employee
    await logHistory(req.user.id, 'CREATE_EMPLOYEE', `Created employee '${employee.name}'`, employee._id);

    res.status(201).json({ message: "Success", data: employee });
  } catch (error) {
    console.error("Error in createEmployee:", error);
    res.status(400).json({ message: error.message });
  }
};

// Retrieve all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json({ message: "Success", data: employees });
  } catch (error) {
    console.error("Error in getAllEmployees:", error);
    res.status(500).json({ message: error.message });
  }
};

// Retrieve an employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: "Success", data: employee });
  } catch (error) {
    console.error("Error in getEmployeeById:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update an existing employee
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Log the update of the employee
    await logHistory(req.user.id, 'UPDATE_EMPLOYEE', `Updated employee '${employee.name}'`, employee._id);

    res.status(200).json({ message: "Success", data: employee });
  } catch (error) {
    console.error("Error in updateEmployee:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete an employee by ID
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Log the deletion of the employee
    await logHistory(req.user.id, 'DELETE_EMPLOYEE', `Deleted employee '${employee.name}'`, employee._id);

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error("Error in deleteEmployee:", error);
    res.status(500).json({ message: error.message });
  }
};

// Search employees by name or email
exports.searchEmployees = async (req, res) => {
  try {
    const { query } = req.query;

    // Validate the search query
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Query parameter is required and should not be empty.' });
    }

    const searchPattern = new RegExp(query.trim(), 'i'); // Case-insensitive search

    // Search in name and email fields
    const employees = await Employee.find({
      $or: [
        { name: searchPattern },
        { email: searchPattern }
      ]
    });

    if (employees.length === 0) {
      return res.status(404).json({ message: 'No employees found matching the search query.' });
    }

    res.status(200).json({ message: "Success", data: employees });
  } catch (error) {
    console.error("Error in searchEmployees:", error);
    res.status(500).json({ message: error.message });
  }
};