import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { dashboardApi } from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { STATUS_COLORS } from '../../utils/constants';
import './Dashboard.css';

const summaryCards = [
  { key: 'totalCustomers', label: 'Total Customers', icon: '👥', color: '#3b82f6' },
  { key: 'checkedInCustomers', label: 'Checked-In', icon: '✅', color: '#22c55e' },
  { key: 'waitingCustomers', label: 'Waiting', icon: '⏳', color: '#f59e0b' },
  { key: 'assignedCustomers', label: 'Assigned', icon: '🏪', color: '#8b5cf6' },
  { key: 'completedCustomers', label: 'Completed', icon: '🎉', color: '#06b6d4' },
];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await dashboardApi.getSummary();
      setSummary(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchSummary} />;

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Event customer check-in overview</p>
      </div>

      <div className="summary-grid">
        {summaryCards.map((card) => (
          <div key={card.key} className="summary-card" style={{ borderTopColor: card.color }}>
            <div className="summary-card-icon" style={{ background: `${card.color}15` }}>
              {card.icon}
            </div>
            <div className="summary-card-content">
              <span className="summary-value">{summary[card.key]}</span>
              <span className="summary-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-card">
        <h2>Customer Status Distribution</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={summary.statusDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="status"
              tick={{ fontSize: 11 }}
              angle={-30}
              textAnchor="end"
              interval={0}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {summary.statusDistribution.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#6b7280'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
