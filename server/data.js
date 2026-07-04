const { v4: uuidv4 } = require('uuid');

const users = [
  {
    id: '1',
    email: 'admin@event.com',
  },
];

const customers = [
  {
    id: '1',
    name: 'John Smith',
    mobile: '9876543210',
    email: 'john@example.com',
    projectName: 'Skyline Towers',
    qrCode: 'QR-EVT-001',
    qrUsed: false,
    eventStatus: 'Waiting',
    assignedBooth: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    mobile: '9876543211',
    email: 'sarah@example.com',
    projectName: 'Green Valley',
    qrCode: 'QR-EVT-002',
    qrUsed: true,
    eventStatus: 'Checked-In',
    assignedBooth: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Michael Brown',
    mobile: '9876543212',
    email: 'michael@example.com',
    projectName: 'Ocean View',
    qrCode: 'QR-EVT-003',
    qrUsed: true,
    eventStatus: 'Assigned',
    assignedBooth: 'B-01',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Emily Davis',
    mobile: '9876543213',
    email: 'emily@example.com',
    projectName: 'Sunset Heights',
    qrCode: 'QR-EVT-004',
    qrUsed: false,
    eventStatus: 'Waiting',
    assignedBooth: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'David Wilson',
    mobile: '9876543214',
    email: 'david@example.com',
    projectName: 'Metro Plaza',
    qrCode: 'QR-EVT-005',
    qrUsed: true,
    eventStatus: 'Completed',
    assignedBooth: 'B-02',
    createdAt: new Date().toISOString(),
  },
];

const booths = [
  { id: '1', number: 'B-01', isAvailable: false },
  { id: '2', number: 'B-02', isAvailable: false },
  { id: '3', number: 'B-03', isAvailable: true },
  { id: '4', number: 'B-04', isAvailable: true },
  { id: '5', number: 'B-05', isAvailable: true },
  { id: '6', number: 'B-06', isAvailable: true },
];

let boothAssignments = [
  {
    id: '1',
    customerId: '3',
    boothNumber: 'B-01',
    salesManagerName: 'Alex Turner',
    status: 'Assigned',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    customerId: '5',
    boothNumber: 'B-02',
    salesManagerName: 'Lisa Chen',
    status: 'Completed',
    createdAt: new Date().toISOString(),
  },
];

let statusHistory = [
  {
    id: '1',
    customerId: '1',
    eventStatus: 'Waiting',
    remarks: 'Initial registration',
    followUpDate: null,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    customerId: '2',
    eventStatus: 'Checked-In',
    remarks: 'Checked in at main entrance',
    followUpDate: null,
    createdAt: new Date().toISOString(),
  },
];

const generateQrCode = () => `QR-EVT-${String(Math.floor(Math.random() * 900) + 100)}`;

module.exports = {
  users,
  customers,
  booths,
  boothAssignments,
  statusHistory,
  uuidv4,
  generateQrCode,
};
