import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { boothApi } from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import { BOOTH_STATUSES } from '../../utils/constants';
import './BoothAssignment.css';

export default function BoothAssignment() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editAssignment, setEditAssignment] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await boothApi.getAll();
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load booth assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditAssignment(null);
    reset({ customerId: '', boothNumber: '', salesManagerName: '', status: 'Assigned' });
    setFormOpen(true);
  };

  const openEdit = (assignment) => {
    setEditAssignment(assignment);
    reset({
      boothNumber: assignment.boothNumber,
      salesManagerName: assignment.salesManagerName,
      status: assignment.status,
    });
    setFormOpen(true);
  };

  const onSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editAssignment) {
        await boothApi.update(editAssignment.id, formData);
        toast.success('Assignment updated successfully');
      } else {
        await boothApi.create(formData);
        toast.success('Booth assigned successfully');
      }
      setFormOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = async (assignment) => {
    if (!window.confirm(`Cancel assignment for booth ${assignment.boothNumber}?`)) return;
    try {
      await boothApi.delete(assignment.id);
      toast.success('Assignment cancelled');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel assignment');
    }
  };

  if (loading) return <LoadingSpinner message="Loading booth assignments..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  const availableBooths = data.booths.filter((b) => b.isAvailable);
  const activeAssignments = data.assignments.filter(
    (a) => a.status !== 'Cancelled' && a.status !== 'Completed'
  );

  return (
    <div className="booth-page">
      <div className="page-header-row">
        <div className="page-header">
          <h1>Booth Assignment</h1>
          <p>Assign checked-in customers to available booths</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          + New Assignment
        </button>
      </div>

      <div className="booth-info-grid">
        <div className="info-card">
          <h3>Checked-In Customers</h3>
          <span className="info-count">{data.checkedInCustomers.length}</span>
        </div>
        <div className="info-card">
          <h3>Available Booths</h3>
          <span className="info-count">{availableBooths.length}</span>
        </div>
        <div className="info-card">
          <h3>Active Assignments</h3>
          <span className="info-count">{activeAssignments.length}</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Booth</th>
              <th>Sales Manager</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.assignments.length === 0 ? (
              <tr><td colSpan={5} className="empty-row">No assignments yet</td></tr>
            ) : (
              data.assignments.map((a) => (
                <tr key={a.id}>
                  <td>{a.customerName}</td>
                  <td><strong>{a.boothNumber}</strong></td>
                  <td>{a.salesManagerName}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td>
                    <div className="action-buttons">
                      {a.status !== 'Cancelled' && a.status !== 'Completed' && (
                        <>
                          <button type="button" className="btn btn-sm btn-secondary" onClick={() => openEdit(a)}>Edit</button>
                          <button type="button" className="btn btn-sm btn-danger" onClick={() => handleCancel(a)}>Cancel</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editAssignment ? 'Update Assignment' : 'New Booth Assignment'}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="booth-form">
          {!editAssignment && (
            <div className="form-group">
              <label>Customer *</label>
              <select {...register('customerId', { required: 'Select a customer' })}>
                <option value="">Select customer</option>
                {data.checkedInCustomers
                  .filter((c) => c.eventStatus === 'Checked-In' || !c.assignedBooth)
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.qrCode})</option>
                  ))}
              </select>
              {errors.customerId && <span className="field-error">{errors.customerId.message}</span>}
            </div>
          )}
          <div className="form-group">
            <label>Booth Number *</label>
            <select {...register('boothNumber', { required: 'Select a booth' })}>
              <option value="">Select booth</option>
              {(editAssignment
                ? data.booths
                : availableBooths
              ).map((b) => (
                <option key={b.id} value={b.number}>
                  {b.number} {b.isAvailable ? '(Available)' : '(Occupied)'}
                </option>
              ))}
            </select>
            {errors.boothNumber && <span className="field-error">{errors.boothNumber.message}</span>}
          </div>
          <div className="form-group">
            <label>Sales Manager Name *</label>
            <input {...register('salesManagerName', { required: 'Sales manager name is required' })} />
            {errors.salesManagerName && <span className="field-error">{errors.salesManagerName.message}</span>}
          </div>
          <div className="form-group">
            <label>Status *</label>
            <select {...register('status', { required: 'Select status' })}>
              {BOOTH_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setFormOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? 'Saving...' : editAssignment ? 'Update' : 'Assign'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
