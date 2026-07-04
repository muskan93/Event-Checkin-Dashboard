export const EVENT_STATUSES = [
  'Waiting',
  'Checked-In',
  'Assigned',
  'In Discussion',
  'Completed',
  'Not Interested',
  'Follow-Up Required',
];

export const BOOTH_STATUSES = [
  'Waiting',
  'Assigned',
  'In Discussion',
  'Completed',
  'Cancelled',
];

export const STATUS_COLORS = {
  Waiting: '#f59e0b',
  'Checked-In': '#3b82f6',
  Assigned: '#8b5cf6',
  'In Discussion': '#06b6d4',
  Completed: '#22c55e',
  'Not Interested': '#ef4444',
  'Follow-Up Required': '#f97316',
  Cancelled: '#6b7280',
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
