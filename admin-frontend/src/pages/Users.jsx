import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users as UsersIcon, Search, Ban, Trash2, RefreshCw, ShieldAlert, CheckCircle2, UserX, Mail, Download, Filter } from 'lucide-react';
import axios from 'axios';
import './users-table.css';

const API = 'http://localhost:5000/api/v1';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterPlan, setFilterPlan] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) setUsers(data.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSuspend = async (userId) => {
        if (!confirm('Suspend this user account?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`${API}/admin/users/${userId}/suspend`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (err) {
            alert('Failed to suspend user');
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm('Permanently delete this user? This action cannot be undone.')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${API}/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const filtered = users.filter(u => {
        const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
        const matchPlan = filterPlan === 'all' || u.plan === filterPlan;
        return matchSearch && matchPlan;
    });

    const handleExport = () => {
        if (!users || users.length === 0) return;
        const headers = ["Name", "Email", "Role", "Plan", "Status", "Joined"];
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + users.map(u => {
                return [
                    `"${u.name || ''}"`,
                    `"${u.email || ''}"`,
                    u.role,
                    u.plan,
                    u.suspended ? "Suspended" : "Active",
                    new Date(u.createdAt).toLocaleDateString()
                ].join(",");
            }).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "users_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleNewUser = () => {
        alert("Manual user creation from the admin panel is restricted. Users must register via the public portal.");
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '60vh' }}>
                <div className="admin-loader"></div>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '2.5rem' }}>
            {/* Header Content */}
            <div className="users-header">
                <div className="header-title-section">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="title-row"
                    >
                        <div className="title-icon-wrapper">
                            <div className="title-icon-inner">
                                <UsersIcon className="title-icon" />
                            </div>
                        </div>
                        <h1 className="dashboard-title">User Management</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="dashboard-subtitle"
                    >
                        Monitor and manage all platform users ({users.length} total)
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="header-actions-group"
                >
                    <button onClick={fetchUsers} className="btn-secondary" style={{ padding: '0.625rem' }} title="Refresh Users">
                        <RefreshCw size={16} />
                    </button>
                    <button onClick={handleExport} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Download size={16} /> Export
                    </button>
                    <button onClick={handleNewUser} className="btn-primary">
                        + New User
                    </button>
                </motion.div>
            </div>

            {/* Filters & Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="filter-search-bar"
            >
                <div className="search-input-wrapper">
                    <Search className="search-input-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="search-field"
                    />
                </div>

                <div style={{ position: 'relative', width: '100%', maxWidth: '200px' }}>
                    <select
                        value={filterPlan}
                        onChange={e => setFilterPlan(e.target.value)}
                        style={{
                            width: '100%',
                            appearance: 'none',
                            backgroundColor: 'var(--color-bg-hover)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '0.875rem 2.5rem 0.875rem 2.5rem',
                            color: 'var(--color-text-main)',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            textTransform: 'capitalize',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="all">All Plans</option>
                        <option value="free">Free</option>
                        <option value="basic">Basic</option>
                        <option value="pro">Pro</option>
                    </select>
                    <Filter size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
                </div>
            </motion.div>

            {/* Premium Glass Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="data-table-container"
            >
                <div className="table-glow-1" />

                <div className="data-table-wrapper">
                    <table className="admin-data-table">
                        <thead>
                            <tr>
                                <th>User Content</th>
                                <th>Role & Access</th>
                                <th>Subscription</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="5">
                                            <div className="empty-state-container">
                                                <div className="empty-state-icon-wrapper">
                                                    <Search size={32} />
                                                </div>
                                                <h3 className="empty-state-title">No users found</h3>
                                                <p className="empty-state-desc">We couldn't find any users matching your criteria.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((user, index) => (
                                        <motion.tr
                                            key={user._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="table-row"
                                        >
                                            <td>
                                                <div className="user-cell-content">
                                                    <div className="user-avatar-placeholder">
                                                        <span>{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                                                    </div>
                                                    <div>
                                                        <div className="user-name-text">{user.name || 'Unknown User'}</div>
                                                        <div className="user-email-text">
                                                            <Mail size={12} /> {user.email || 'No email provided'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                                                    {user.role === 'admin' ? <ShieldAlert size={14} /> : <UsersIcon size={14} />}
                                                    {user.role || 'user'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${user.plan === 'pro' ? 'badge-plan-pro' : user.plan === 'basic' ? 'badge-plan-basic' : 'badge-plan-free'}`}>
                                                    {user.plan || 'free'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${!user.suspended ? 'badge-status-active' : 'badge-status-suspended'}`}>
                                                    {!user.suspended ? <CheckCircle2 size={14} /> : <UserX size={14} />}
                                                    {!user.suspended ? 'ACTIVE' : 'SUSPENDED'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <div className="action-buttons-group">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleSuspend(user._id); }}
                                                        className={`btn-icon-action ${user.suspended ? 'btn-restore' : 'btn-suspend'}`}
                                                        title={user.suspended ? 'Restore User' : 'Suspend User'}
                                                    >
                                                        {user.suspended ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(user._id); }}
                                                        className="btn-icon-action btn-delete"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Users;
