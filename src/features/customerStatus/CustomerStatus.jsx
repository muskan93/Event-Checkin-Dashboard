import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { customersApi, statusApi } from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import StatusBadge from '../../components/StatusBadge';
import { EVENT_STATUSES, formatDateTime } from '../../utils/constants';
import './CustomerStatus.css';

export default function CustomerStatus() {
  const [customers, setCustomers] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: { customerId: '', eventStatus: '', remarks: '', followUpDate: '' },
  });

  const selectedStatus = watch('eventStatus');
  const selectedCustomerId = watch('customerId');

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

  const fetchHistory = async (customerId) => {
    if (!customerId) {
      setHistory([]);
      return;
    }
    setHistoryLoading(true);
    try {
      const { data } = await statusApi.getHistory(customerId);
      setHistory(data);
    } catch {
      toast.error('Failed to load status history');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchHistory(selectedCustomerId);
  }, [selectedCustomerId]);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await statusApi.update(formData);
      toast.success('Status updated successfully');
      reset({ customerId: formData.customerId, eventStatus: '', remarks: '', followUpDate: '' });
      fetchCustomers();
      fetchHistory(formData.customerId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCustomers} />;

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  return (
    <div className="status-page">
      <div className="page-header">
        <h1>Customer Status Update</h1>
        <p>Update event status and view customer history</p>
      </div>

      <div className="status-grid">
        <div className="status-form-card">
          <h2>Update Status</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="status-form">
            <div className="form-group">
              <label>Customer *</label>
              <select {...register('customerId', { required: 'Select a customer' })}>
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.eventStatus}
                  </option>
                ))}
              </select>
              {errors.customerId && <span className="field-error">{errors.customerId.message}</span>}
            </div>

            {selectedCustomer && (
              <div className="current-status">
                Current Status: <StatusBadge status={selectedCustomer.eventStatus} />
              </div>
            )}

            <div className="form-group">
              <label>New Status *</label>
              <select {...register('eventStatus', { required: 'Select a status' })}>
                <option value="">Select status</option>
                {EVENT_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.eventStatus && <span className="field-error">{errors.eventStatus.message}</span>}
            </div>

            <div className="form-group">
              <label>Remarks</label>
              <textarea
                rows={3}
                placeholder="Add any remarks..."
                {...register('remarks')}
              />
            </div>

            {selectedStatus === 'Follow-Up Required' && (
              <div className="form-group">
                <label>Follow-Up Date *</label>
                <input
                  type="date"
                  {...register('followUpDate', {
                    required: selectedStatus === 'Follow-Up Required' ? 'Follow-up date is required' : false,
                  })}
                />
                {errors.followUpDate && <span className="field-error">{errors.followUpDate.message}</span>}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Status'}
            </button>
          </form>
        </div>

        <div className="history-card">
          <h2>Status History</h2>
          {!selectedCustomerId ? (
            <p className="history-empty">Select a customer to view history</p>
          ) : historyLoading ? (
            <LoadingSpinner message="Loading history..." />
          ) : history.length === 0 ? (
            <p className="history-empty">No status history found</p>
          ) : (
            <div className="history-timeline">
              {history.map((entry) => (
                <div key={entry.id} className="history-item">
                  <div className="history-dot" />
                  <div className="history-content">
                    <div className="history-header">
                      <StatusBadge status={entry.eventStatus} />
                      <span className="history-date">{formatDateTime(entry.createdAt)}</span>
                    </div>
                    {entry.remarks && <p className="history-remarks">{entry.remarks}</p>}
                    {entry.followUpDate && (
                      <p className="history-followup">Follow-up: {entry.followUpDate}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
