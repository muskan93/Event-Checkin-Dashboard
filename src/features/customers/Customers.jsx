import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { customersApi } from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import CustomerForm from './CustomerForm';
import CustomerDetailModal from './CustomerDetailModal';
import { EVENT_STATUSES } from '../../utils/constants';
import './Customers.css';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await customersApi.getAll();
      setCustomers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search);
    const matchesStatus = !statusFilter || c.eventStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = async (data, reset) => {
    setFormLoading(true);
    try {
      await customersApi.create(data);
      toast.success('Customer created successfully');
      setFormOpen(false);
      reset();
      fetchCustomers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create customer');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data, reset) => {
    setFormLoading(true);
    try {
      await customersApi.update(selectedCustomer.id, data);
      toast.success('Customer updated successfully');
      setFormOpen(false);
      setSelectedCustomer(null);
      reset();
      fetchCustomers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update customer');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await customersApi.delete(selectedCustomer.id);
      toast.success('Customer deleted successfully');
      setDeleteOpen(false);
      setSelectedCustomer(null);
      fetchCustomers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete customer');
    }
  };

  const openEdit = (customer) => {
    setSelectedCustomer(customer);
    setFormOpen(true);
  };

  const openDelete = (customer) => {
    setSelectedCustomer(customer);
    setDeleteOpen(true);
  };

  const openDetail = (customer) => {
    setSelectedCustomer(customer);
    setDetailOpen(true);
  };

  if (loading) return <LoadingSpinner message="Loading customers..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCustomers} />;

  return (
    <div className="customers-page">
      <div className="page-header-row">
        <div className="page-header">
          <h1>Customer Management</h1>
          <p>Manage event customers and their details</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => { setSelectedCustomer(null); setFormOpen(true); }}>
          + Add Customer
        </button>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search by name or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {EVENT_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Project</th>
              <th>QR Code</th>
              <th>Status</th>
              <th>Booth</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-row">No customers found</td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.mobile}</td>
                  <td>{c.email}</td>
                  <td>{c.projectName}</td>
                  <td><code className="qr-code">{c.qrCode}</code></td>
                  <td><StatusBadge status={c.eventStatus} /></td>
                  <td>{c.assignedBooth || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button type="button" className="btn-icon" title="View" onClick={() => openDetail(c)}>👁</button>
                      <button type="button" className="btn-icon" title="Edit" onClick={() => openEdit(c)}>✏️</button>
                      <button type="button" className="btn-icon danger" title="Delete" onClick={() => openDelete(c)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CustomerForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setSelectedCustomer(null); }}
        onSubmit={selectedCustomer ? handleUpdate : handleCreate}
        customer={selectedCustomer}
        loading={formLoading}
      />

      <CustomerDetailModal
        isOpen={detailOpen}
        onClose={() => { setDetailOpen(false); setSelectedCustomer(null); }}
        customer={selectedCustomer}
      />

      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title="Confirm Delete" size="sm">
        <p>Are you sure you want to delete <strong>{selectedCustomer?.name}</strong>? This action cannot be undone.</p>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => setDeleteOpen(false)}>Cancel</button>
          <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}
