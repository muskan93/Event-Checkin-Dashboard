import { STATUS_COLORS } from '../utils/constants';
import './StatusBadge.css';

export default function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || '#6b7280';
  return (
    <span className="status-badge" style={{ backgroundColor: `${color}20`, color, borderColor: color }}>
      {status}
    </span>
  );
}
