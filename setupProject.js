const fs = require('fs');
const path = require('path');

const dirs = [
  'config',
  'controllers',
  'middlewares',
  'models',
  'routes',
  'utils'
];

const files = {
  'config/dbConfig.js': `
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/yourdbname', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
  `,

  'controllers/branchController.js': `
const Branch = require('../models/Branch');

exports.createBranch = async (req, res) => {
  try {
    const branch = new Branch(req.body);
    await branch.save();
    res.status(201).json(branch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.status(200).json({ message: 'Branch deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
  `,

  'controllers/customerController.js': `
const Customer = require('../models/Customer');

exports.createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
  `,

  'controllers/customerBookingController.js': `
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
  `,

  'controllers/designerController.js': `
const Designer = require('../models/Designer');

exports.createDesigner = async (req, res) => {
  try {
    const designer = new Designer(req.body);
    await designer.save();
    res.status(201).json(designer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllDesigners = async (req, res) => {
  try {
    const designers = await Designer.find();
    res.status(200).json(designers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDesignerById = async (req, res) => {
  try {
    const designer = await Designer.findById(req.params.id);
    if (!designer) return res.status(404).json({ message: 'Designer not found' });
    res.status(200).json(designer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDesigner = async (req, res) => {
  try {
    const designer = await Designer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!designer) return res.status(404).json({ message: 'Designer not found' });
    res.status(200).json(designer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDesigner = async (req, res) => {
  try {
    const designer = await Designer.findByIdAndDelete(req.params.id);
    if (!designer) return res.status(404).json({ message: 'Designer not found' });
    res.status(200).json({ message: 'Designer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
  `,

  'controllers/employeeController.js': `
const Employee = require('../models/Employee');

exports.createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({ message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
  `,

  'controllers/paymentController.js': `
const Payment = require('../models/Payment');

exports.createPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.status(200).json({ message: 'Payment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
  `,

  'controllers/sessionController.js': `
const Session = require('../models/Session');

exports.createSession = async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find();
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
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
  `,

  'controllers/approvedBookingController.js': `
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
  `,

  'controllers/serviceController.js': `
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
  `,

  'models/Branch.js': `
const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  branch_name: { type: String, required: true },
  address: String,
  phone_number: String,
}, { timestamps: true });

module.exports = mongoose.model('Branch', branchSchema);
  `,

  'models/Customer.js': `
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: String,
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
  `,

  'models/CustomerBooking.js': `
const mongoose = require('mongoose');

const customerBookingSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  booking_date: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Completed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('CustomerBooking', customerBookingSchema);
  `,

  'models/Designer.js': `
const mongoose = require('mongoose');

const designerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  experience: Number,
  specialization: String
}, { timestamps: true });

module.exports = mongoose.model('Designer', designerSchema);
  `,

  'models/Employee.js': `
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
  `,

  'models/Payment.js': `
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  customer_booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerBooking', required: true },
  amount: { type: Number, required: true },
  payment_date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
  `,

  'models/Session.js': `
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  session_date: { type: Date, required: true },
  branch_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  designer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Designer', required: true },
  service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
  `,

  'models/ApprovedBooking.js': `
const mongoose = require('mongoose');

const approvedBookingSchema = new mongoose.Schema({
  customer_booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerBooking', required: true },
  approval_status: { type: String, enum: ['Approved', 'Rejected'], required: true },
  approval_date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('ApprovedBooking', approvedBookingSchema);
  `,

  'models/Service.js': `
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
  `,

  'routes/branchRoutes.js': `
const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');

router.post('/', branchController.createBranch);
router.get('/', branchController.getAllBranches);
router.get('/:id', branchController.getBranchById);
router.put('/:id', branchController.updateBranch);
router.delete('/:id', branchController.deleteBranch);

module.exports = router;
  `,

  'routes/customerRoutes.js': `
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/', customerController.createCustomer);
router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
  `,

  'routes/customerBookingRoutes.js': `
const express = require('express');
const router = express.Router();
const customerBookingController = require('../controllers/customerBookingController');

router.post('/', customerBookingController.createCustomerBooking);
router.get('/', customerBookingController.getAllCustomerBookings);
router.get('/:id', customerBookingController.getCustomerBookingById);
router.put('/:id', customerBookingController.updateCustomerBooking);
router.delete('/:id', customerBookingController.deleteCustomerBooking);

module.exports = router;
  `,

  'routes/designerRoutes.js': `
const express = require('express');
const router = express.Router();
const designerController = require('../controllers/designerController');

router.post('/', designerController.createDesigner);
router.get('/', designerController.getAllDesigners);
router.get('/:id', designerController.getDesignerById);
router.put('/:id', designerController.updateDesigner);
router.delete('/:id', designerController.deleteDesigner);

module.exports = router;
  `,

  'routes/employeeRoutes.js': `
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.post('/', employeeController.createEmployee);
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
  `,

  'routes/paymentRoutes.js': `
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/', paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
  `,

  'routes/sessionRoutes.js': `
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.post('/', sessionController.createSession);
router.get('/', sessionController.getAllSessions);
router.get('/:id', sessionController.getSessionById);
router.put('/:id', sessionController.updateSession);
router.delete('/:id', sessionController.deleteSession);

module.exports = router;
  `,

  'routes/approvedBookingRoutes.js': `
const express = require('express');
const router = express.Router();
const approvedBookingController = require('../controllers/approvedBookingController');

router.post('/', approvedBookingController.createApprovedBooking);
router.get('/', approvedBookingController.getAllApprovedBookings);
router.get('/:id', approvedBookingController.getApprovedBookingById);
router.put('/:id', approvedBookingController.updateApprovedBooking);
router.delete('/:id', approvedBookingController.deleteApprovedBooking);

module.exports = router;
  `,

  'server.js': `
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connectDB = require('./config/dbConfig');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/branches', require('./routes/branchRoutes'));
app.use('/customers', require('./routes/customerRoutes'));
app.use('/customerBookings', require('./routes/customerBookingRoutes'));
app.use('/designers', require('./routes/designerRoutes'));
app.use('/employees', require('./routes/employeeRoutes'));
app.use('/payments', require('./routes/paymentRoutes'));
app.use('/sessions', require('./routes/sessionRoutes'));
app.use('/approvedBookings', require('./routes/approvedBookingRoutes'));

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port PORT\`);
});
  `,

  'utils/logger.js': `
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ],
});

module.exports = logger;
  `,

  'middlewares/authMiddleware.js': `
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret_key');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
  `
};

// Create directories
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});

// Create files with content
for (const [filePath, content] of Object.entries(files)) {
  const fileDir = path.dirname(filePath);
  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir);
  }
  fs.writeFileSync(filePath, content.trim());
}

console.log('Project structure and files have been created successfully.');

