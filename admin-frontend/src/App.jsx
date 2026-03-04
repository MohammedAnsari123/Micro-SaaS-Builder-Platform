import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Tenants from './pages/Tenants';
import Ecosystem from './pages/Ecosystem';
import Billing from './pages/Billing';
import Analytics from './pages/Analytics';
import Security from './pages/Security';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="tenants" element={<Tenants />} />
        <Route path="ecosystem" element={<Ecosystem />} />
        <Route path="billing" element={<Billing />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="security" element={<Security />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
