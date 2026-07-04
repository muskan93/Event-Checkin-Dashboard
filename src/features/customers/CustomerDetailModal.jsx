import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';
import { formatDateTime } from '../../utils/constants';

export default function CustomerDetailModal({ isOpen, onClose, customer }) {
  if (!customer) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customer Details" size="md">
      <div className="detail-grid">
        <div className="detail-item">
          <span className="detail-label">Name</span>
          <span className="detail-value">{customer.name}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Mobile</span>
          <span className="detail-value">{customer.mobile}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Email</span>
          <span className="detail-value">{customer.email}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Project</span>
          <span className="detail-value">{customer.projectName}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">QR Code</span>
          <span className="detail-value qr-code">{customer.qrCode}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">QR Status</span>
          <span className="detail-value">{customer.qrUsed ? 'Used' : 'Available'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Event Status</span>
          <StatusBadge status={customer.eventStatus} />
        </div>
        <div className="detail-item">
          <span className="detail-label">Assigned Booth</span>
          <span className="detail-value">{customer.assignedBooth || '-'}</span>
        </div>
        <div className="detail-item full-width">
          <span className="detail-label">Registered On</span>
          <span className="detail-value">{formatDateTime(customer.createdAt)}</span>
        </div>
      </div>
    </Modal>
  );
}
