import api from './axios';

export const authApi = {
  login: (credentials) => api.post('/login', credentials),
};

export const dashboardApi = {
  getSummary: () => api.get('/dashboard-summary'),
};

export const customersApi = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  checkIn: (qrCode) => api.post('/customers/check-in', { qrCode }),
};

export const qrApi = {
  verify: (qrCode) => api.get(`/qr-codes/verify/${qrCode}`),
};

export const boothApi = {
  getAll: () => api.get('/booth-assignments'),
  create: (data) => api.post('/booth-assignments', data),
  update: (id, data) => api.put(`/booth-assignments/${id}`, data),
  delete: (id) => api.delete(`/booth-assignments/${id}`),
};

export const statusApi = {
  update: (data) => api.post('/customer-status', data),
  getHistory: (customerId) => api.get(`/customer-status/${customerId}`),
};
