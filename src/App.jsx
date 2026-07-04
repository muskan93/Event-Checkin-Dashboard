import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';
import Login from './features/auth/Login';
import Dashboard from './features/dashboard/Dashboard';
import Customers from './features/customers/Customers';
import QrScanner from './features/qrScanner/QrScanner';
import BoothAssignment from './features/boothAssignment/BoothAssignment';
import CustomerStatus from './features/customerStatus/CustomerStatus';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/qr-scanner" element={<QrScanner />} />
          <Route path="/booth-assignment" element={<BoothAssignment />} />
          <Route path="/customer-status" element={<CustomerStatus />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </BrowserRouter>
  );
}
