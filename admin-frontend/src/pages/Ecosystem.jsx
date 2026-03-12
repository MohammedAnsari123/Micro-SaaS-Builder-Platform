import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, ShieldAlert, Trash2, Loader2, RefreshCw, ExternalLink, User, LayoutTemplate, CheckCircle, Ban } from 'lucide-react';
import axios from 'axios';
import './feature-pages.css';
import './users-table.css';

const API = 'http://localhost:5000/api/v1';

const Ecosystem = () => {
    const [clones, setClones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchClones(); }, []);

    const fetchClones = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API}/admin/clones`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                console.log('Fetched Clones:', data.data);
                setClones(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch ecosystem clones', err);
        }
        finally { setLoading(false); }
    };

    const handleUpdateStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'archived' : 'active';
        const actionLabel = currentStatus === 'active' ? 'Ban/Archive' : 'Activate';

        if (!window.confirm(`Are you sure you want to ${actionLabel} this site?`)) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`${API}/admin/clones/${id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchClones();
        } catch (err) {
            alert('Failed to update site status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("CRITICAL: Are you sure you want to permanently REMOVE this site from the ecosystem? This action cannot be undone.")) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${API}/admin/clones/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchClones();
        } catch (err) {
            alert('Failed to remove site');
        }
    };

    const filtered = clones.filter(c =>
        c.siteName?.toLowerCase().includes(search.toLowerCase()) ||
        c.owner?.toLowerCase().includes(search.toLowerCase()) ||
        c.domain?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '60vh', position: 'relative', zIndex: 10 }}>
                <div className="admin-loader"></div>
            </div>
        );
    }

    return (
        <div className="feature-page-container">
            {/* Header Content */}
            <div className="page-header-panel bg-emerald-blue">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="header-title-box"
                    >
                        <div className="header-icon-wrapper bg-emerald-blue">
                            <div className="header-icon-inner">
                                <Globe className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
                            </div>
                        </div>
                        <h1 className="page-title">All Deployed Sites</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="page-subtitle"
                    >
                        Monitor and manage all provisioned Micro-SaaS instances ({clones.length} total)
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="action-buttons-container"
                >
                    <button onClick={fetchClones} className="btn-refresh" title="Refresh Data">
                        <RefreshCw className="icon" />
                    </button>
                </motion.div>
            </div>

            {/* Filters & Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="filter-bar"
            >
                <div className="search-input-container">
                    <div className="search-icon-box">
                        <Search className="search-icon" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by site name, owner, or domain..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="search-input"
                    />
                </div>
            </motion.div>

            {/* Premium Glass Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="data-table-container shadow-2xl"
            >
                <div className="data-table-wrapper custom-scrollbar pb-2">
                    <table className="admin-data-table">
                        <thead>
                            <tr>
                                <th>Instance / Site</th>
                                <th>Owner & Domain</th>
                                <th>Template</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'center' }}>Global Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="5">
                                            <div className="empty-state-large">
                                                <div className="empty-icon-circle">
                                                    <Globe style={{ width: '2rem', height: '2rem', color: 'var(--color-primary-500)' }} />
                                                </div>
                                                <h3 className="empty-title">No provisioned sites found</h3>
                                                <p className="empty-desc">Deploy templates from the user dashboard to see them here.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((c, index) => {
                                        return (
                                            <motion.tr
                                                key={c._id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                className="table-row hover:border-emerald-500"
                                            >
                                                <td className="p-5">
                                                    <div className="user-cell-content">
                                                        <div className="user-avatar-placeholder" style={{ backgroundImage: 'linear-gradient(to bottom right, rgba(59, 130, 246, 0.2), rgba(16, 185, 129, 0.2))', border: '1px solid var(--color-border)' }}>
                                                            <LayoutTemplate style={{ width: '1.5rem', height: '1.5rem', color: '#60a5fa' }} className="group-hover:scale-110 transition-transform duration-300" />
                                                        </div>
                                                        <div>
                                                            <div className="user-name-text group-hover:text-emerald-500">{c.siteName}</div>
                                                            <div className="user-email-text mt-1 font-bold uppercase tracking-widest" style={{ fontSize: '11px' }}>
                                                                Cloned {new Date(c.clonedAt).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem', color: 'var(--color-text-main)', fontWeight: 500 }}>
                                                        <User style={{ width: '0.875rem', height: '0.875rem', color: 'var(--color-primary-500)' }} /> {c.owner}
                                                    </div>
                                                    <div style={{ color: 'var(--color-success)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', fontWeight: 500, fontStyle: 'italic' }}>
                                                        <ExternalLink style={{ width: '0.75rem', height: '0.75rem' }} />
                                                        <a
                                                            href={`http://localhost:5173/site/${c.templateSlug || 'unknown-template'}/${c.emailPrefix || 'unknown-user'}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                                            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                                            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                                        >
                                                            {c.domain} (Preview)
                                                        </a>
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <span className="badge badge-admin">
                                                        {c.template}
                                                    </span>
                                                </td>
                                                <td className="p-5">
                                                    <span className={`badge ${c.status === 'active' ? 'badge-status-active' : 'badge-status-suspended'}`}>
                                                        {c.status === 'active' ? <CheckCircle style={{ width: '0.75rem', height: '0.75rem' }} /> : <Ban style={{ width: '0.75rem', height: '0.75rem' }} />}
                                                        {c.status}
                                                    </span>
                                                </td>
                                                <td className="p-5">
                                                    <div className="action-buttons-group flex-center">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(c._id, c.status); }}
                                                            className={`btn-icon-action ${c.status === 'active' ? 'btn-suspend' : 'btn-restore'}`}
                                                            title={c.status === 'active' ? 'Ban Site' : 'Restore Site'}
                                                        >
                                                            {c.status === 'active' ? <Ban style={{ width: '1rem', height: '1rem' }} /> : <CheckCircle style={{ width: '1rem', height: '1rem' }} />}
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(c._id); }}
                                                            className="btn-icon-action btn-delete"
                                                            title="Permanent Remove"
                                                        >
                                                            <Trash2 style={{ width: '1rem', height: '1rem' }} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Ecosystem;
