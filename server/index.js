const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  users,
  customers,
  booths,
  boothAssignments,
  statusHistory,
  uuidv4,
  generateQrCode,
} = require('./data');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'event-checkin-secret-key';
const ADMIN_PASSWORD = 'admin123';

app.use(cors());
app.use(express.json());

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const user = users.find((u) => u.email === email);
  if (!user || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, email: user.email } });
});

// Dashboard summary
app.get('/api/dashboard-summary', authMiddleware, (req, res) => {
  const total = customers.length;
  const checkedIn = customers.filter((c) => c.eventStatus === 'Checked-In').length;
  const waiting = customers.filter((c) => c.eventStatus === 'Waiting').length;
  const assigned = customers.filter((c) => c.eventStatus === 'Assigned' || c.eventStatus === 'In Discussion').length;
  const completed = customers.filter((c) => c.eventStatus === 'Completed').length;

  const statusDistribution = [
    'Waiting',
    'Checked-In',
    'Assigned',
    'In Discussion',
    'Completed',
    'Not Interested',
    'Follow-Up Required',
  ].map((status) => ({
    status,
    count: customers.filter((c) => c.eventStatus === status).length,
  }));

  res.json({
    totalCustomers: total,
    checkedInCustomers: checkedIn,
    waitingCustomers: waiting,
    assignedCustomers: assigned,
    completedCustomers: completed,
    statusDistribution,
  });
});

// Customers CRUD
app.get('/api/customers', authMiddleware, (req, res) => {
  res.json(customers);
});

app.get('/api/customers/:id', authMiddleware, (req, res) => {
  const customer = customers.find((c) => c.id === req.params.id);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json(customer);
});

app.post('/api/customers', authMiddleware, (req, res) => {
  const { name, mobile, email, projectName } = req.body;
  if (!name || !mobile || !email || !projectName) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const existingQr = customers.find((c) => c.mobile === mobile || c.email === email);
  if (existingQr) {
    return res.status(400).json({ message: 'Customer with this mobile or email already exists' });
  }
  const newCustomer = {
    id: uuidv4(),
    name,
    mobile,
    email,
    projectName,
    qrCode: generateQrCode(),
    qrUsed: false,
    eventStatus: 'Waiting',
    assignedBooth: null,
    createdAt: new Date().toISOString(),
  };
  customers.push(newCustomer);
  res.status(201).json(newCustomer);
});

app.put('/api/customers/:id', authMiddleware, (req, res) => {
  const index = customers.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Customer not found' });
  const { name, mobile, email, projectName } = req.body;
  if (!name || !mobile || !email || !projectName) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  customers[index] = { ...customers[index], name, mobile, email, projectName };
  res.json(customers[index]);
});

app.delete('/api/customers/:id', authMiddleware, (req, res) => {
  const index = customers.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Customer not found' });
  customers.splice(index, 1);
  for (let i = boothAssignments.length - 1; i >= 0; i--) {
    if (boothAssignments[i].customerId === req.params.id) {
      boothAssignments.splice(i, 1);
    }
  }
  res.json({ message: 'Customer deleted successfully' });
});

// QR verification
app.get('/api/qr-codes/verify/:qrCode', authMiddleware, (req, res) => {
  const customer = customers.find((c) => c.qrCode === req.params.qrCode);
  if (!customer) {
    return res.status(404).json({ message: 'Invalid QR code' });
  }
  if (customer.qrUsed) {
    return res.status(400).json({ message: 'QR code has already been used', customer });
  }
  res.json({ valid: true, customer });
});

// Check-in
app.post('/api/customers/check-in', authMiddleware, (req, res) => {
  const { qrCode } = req.body;
  if (!qrCode) return res.status(400).json({ message: 'QR code is required' });
  const customer = customers.find((c) => c.qrCode === qrCode);
  if (!customer) return res.status(404).json({ message: 'Invalid QR code' });
  if (customer.qrUsed) return res.status(400).json({ message: 'QR code has already been used' });

  customer.qrUsed = true;
  customer.eventStatus = 'Checked-In';

  statusHistory.push({
    id: uuidv4(),
    customerId: customer.id,
    eventStatus: 'Checked-In',
    remarks: 'Checked in via QR scan',
    followUpDate: null,
    createdAt: new Date().toISOString(),
  });

  res.json({ message: 'Check-in successful', customer });
});

// Booth assignments
app.get('/api/booth-assignments', authMiddleware, (req, res) => {
  const enriched = boothAssignments.map((a) => {
    const customer = customers.find((c) => c.id === a.customerId);
    return { ...a, customerName: customer?.name || 'Unknown' };
  });
  res.json({ assignments: enriched, booths, checkedInCustomers: customers.filter((c) => c.eventStatus === 'Checked-In' || c.eventStatus === 'Assigned' || c.eventStatus === 'In Discussion') });
});

app.post('/api/booth-assignments', authMiddleware, (req, res) => {
  const { customerId, boothNumber, salesManagerName, status } = req.body;
  if (!customerId || !boothNumber || !salesManagerName || !status) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const customer = customers.find((c) => c.id === customerId);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  if (customer.eventStatus !== 'Checked-In' && customer.eventStatus !== 'Assigned' && customer.eventStatus !== 'In Discussion') {
    return res.status(400).json({ message: 'Customer must be checked in to assign a booth' });
  }

  const activeAssignment = boothAssignments.find(
    (a) => a.boothNumber === boothNumber && a.status !== 'Cancelled' && a.status !== 'Completed'
  );
  if (activeAssignment && activeAssignment.customerId !== customerId) {
    return res.status(400).json({ message: 'This booth is already assigned to another customer' });
  }

  const booth = booths.find((b) => b.number === boothNumber);
  if (!booth) return res.status(404).json({ message: 'Booth not found' });

  const newAssignment = {
    id: uuidv4(),
    customerId,
    boothNumber,
    salesManagerName,
    status,
    createdAt: new Date().toISOString(),
  };
  boothAssignments.push(newAssignment);
  booth.isAvailable = false;
  customer.assignedBooth = boothNumber;
  customer.eventStatus = status === 'Waiting' ? 'Assigned' : status;

  res.status(201).json(newAssignment);
});

app.put('/api/booth-assignments/:id', authMiddleware, (req, res) => {
  const index = boothAssignments.findIndex((a) => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Assignment not found' });

  const { boothNumber, salesManagerName, status } = req.body;
  const assignment = boothAssignments[index];
  const customer = customers.find((c) => c.id === assignment.customerId);

  if (boothNumber && boothNumber !== assignment.boothNumber) {
    const activeAssignment = boothAssignments.find(
      (a) => a.boothNumber === boothNumber && a.status !== 'Cancelled' && a.status !== 'Completed' && a.id !== assignment.id
    );
    if (activeAssignment) {
      return res.status(400).json({ message: 'This booth is already assigned to another customer' });
    }
    const oldBooth = booths.find((b) => b.number === assignment.boothNumber);
    const newBooth = booths.find((b) => b.number === boothNumber);
    if (oldBooth) oldBooth.isAvailable = true;
    if (newBooth) newBooth.isAvailable = false;
    assignment.boothNumber = boothNumber;
    if (customer) customer.assignedBooth = boothNumber;
  }

  if (salesManagerName) assignment.salesManagerName = salesManagerName;
  if (status) {
    assignment.status = status;
    if (customer) {
      customer.eventStatus = status === 'Waiting' ? 'Assigned' : status;
      if (status === 'Cancelled' || status === 'Completed') {
        const booth = booths.find((b) => b.number === assignment.boothNumber);
        if (booth) booth.isAvailable = true;
        if (status === 'Cancelled') customer.assignedBooth = null;
      }
    }
  }

  res.json(assignment);
});

app.delete('/api/booth-assignments/:id', authMiddleware, (req, res) => {
  const index = boothAssignments.findIndex((a) => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Assignment not found' });

  const assignment = boothAssignments[index];
  const booth = booths.find((b) => b.number === assignment.boothNumber);
  const customer = customers.find((c) => c.id === assignment.customerId);

  if (booth) booth.isAvailable = true;
  if (customer) {
    customer.assignedBooth = null;
    customer.eventStatus = 'Checked-In';
  }

  boothAssignments.splice(index, 1);
  res.json({ message: 'Assignment cancelled successfully' });
});

// Customer status
app.post('/api/customer-status', authMiddleware, (req, res) => {
  const { customerId, eventStatus, remarks, followUpDate } = req.body;
  if (!customerId || !eventStatus) {
    return res.status(400).json({ message: 'Customer and status are required' });
  }
  if (eventStatus === 'Follow-Up Required' && !followUpDate) {
    return res.status(400).json({ message: 'Follow-up date is required for this status' });
  }

  const customer = customers.find((c) => c.id === customerId);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });

  customer.eventStatus = eventStatus;
  const entry = {
    id: uuidv4(),
    customerId,
    eventStatus,
    remarks: remarks || '',
    followUpDate: eventStatus === 'Follow-Up Required' ? followUpDate : null,
    createdAt: new Date().toISOString(),
  };
  statusHistory.push(entry);
  res.status(201).json(entry);
});

app.get('/api/customer-status/:customerId', authMiddleware, (req, res) => {
  const history = statusHistory
    .filter((s) => s.customerId === req.params.customerId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(history);
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
