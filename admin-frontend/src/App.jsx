import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Tenants from './pages/Tenants';
import Templates from './pages/Templates';
import Marketplace from './pages/Marketplace';
import Billing from './pages/Billing';
import AIMonitor from './pages/AIMonitor';
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
        <Route path="templates" element={<Templates />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="billing" element={<Billing />} />
        <Route path="ai-monitor" element={<AIMonitor />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="security" element={<Security />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
