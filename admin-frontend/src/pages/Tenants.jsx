import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Search, RefreshCw, Zap, Rocket, Box, Database, ExternalLink, ArrowRight } from 'lucide-react';
import axios from 'axios';
import './users-table.css';

const API = 'http://localhost:5000/api/v1';

const Tenants = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchTenants(); }, []);

    const fetchTenants = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API}/admin/tenants`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) setTenants(data.data);
        } catch (err) {
            console.error('Failed to fetch tenants', err);
        }
        finally { setLoading(false); }
    };

    const filtered = tenants.filter(t => t.name?.toLowerCase().includes(search.toLowerCase()));

    const getPlanConfig = (plan) => {
        switch (plan) {
            case 'pro': return { icon: Rocket, badgeClass: 'badge-plan-pro', label: 'Pro' };
            case 'basic': return { icon: Zap, badgeClass: 'badge-plan-basic', label: 'Basic' };
            default: return { icon: Box, badgeClass: 'badge-plan-free', label: 'Free' };
        }
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
                        <div className="title-icon-wrapper" style={{ backgroundImage: 'linear-gradient(to top right, var(--color-success), var(--color-emerald-600))' }}>
                            <div className="title-icon-inner">
                                <Building2 className="title-icon" style={{ color: 'var(--color-success)' }} />
                            </div>
                        </div>
                        <h1 className="dashboard-title">Tenant Organizations</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="dashboard-subtitle"
                    >
                        Manage workspaces and platform subscribers ({tenants.length} total)
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="header-actions-group"
                >
                    <button onClick={fetchTenants} className="btn-secondary" style={{ padding: '0.625rem' }} title="Refresh Tenants">
                        <RefreshCw size={16} />
                    </button>
                    <button onClick={() => alert("Tenant deployments must be initiated via the public onboarding flow.")} className="btn-primary">
                        + Deploy Tenant
                    </button>
                </motion.div>
            </div>

            {/* Filters & Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="filter-search-bar"
                style={{ justifyContent: 'flex-start' }}
            >
                <div className="search-input-wrapper" style={{ maxWidth: '32rem' }}>
                    <Search className="search-input-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search tenants by name or domain..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="search-field"
                    />
                </div>
            </motion.div>

            {/* Premium Glass Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="data-table-container"
            >
                <div className="table-glow-1" style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', right: '25%', left: 'auto' }} />
                
                <div className="data-table-wrapper">
                    <table className="admin-data-table">
                        <thead>
                            <tr>
                                <th>Workspace</th>
                                <th>Active Plan</th>
                                <th>Resources</th>
                                <th>Provisioned</th>
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
                                                    <Building2 size={32} />
                                                </div>
                                                <h3 className="empty-state-title">No organizations found</h3>
                                                <p className="empty-state-desc">Deploy your first tenant or broaden your search.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((t, index) => {
                                        const planCfg = getPlanConfig(t.plan);
                                        const PlanIcon = planCfg.icon;

                                        return (
                                            <motion.tr
                                                key={t._id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                className="table-row"
                                                style={{ borderLeftColor: 'transparent' }}
                                            >
                                                <td>
                                                    <div className="user-cell-content">
                                                        <div className="user-avatar-placeholder" style={{ borderRadius: 'var(--radius-lg)', backgroundImage: 'linear-gradient(to bottom right, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2))', border: '1px solid var(--color-border)', color: 'var(--color-success)', width: '3rem', height: '3rem' }}>
                                                            <Building2 size={24} />
                                                        </div>
                                                        <div>
                                                            <div className="user-name-text">{t.name}</div>
                                                            <div className="user-email-text">
                                                                <ExternalLink size={12} /> {t.name.toLowerCase().replace(/\s+/g, '-')}.microsaas.dev
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge ${planCfg.badgeClass}`}>
                                                        <PlanIcon size={14} />
                                                        {planCfg.label}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                        <Database size={16} color="var(--color-primary-500)" />
                                                        <span style={{ color: 'var(--color-primary-600)', fontWeight: 600 }}>{t.toolCount || 0} Sites Deployed</span>
                                                    </div>
                                                    {/* Fake progress bar */}
                                                    <div style={{ width: '8rem', height: '0.375rem', backgroundColor: 'var(--color-bg-hover)', borderRadius: '9999px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                                                        <div
                                                            style={{
                                                                height: '100%',
                                                                borderRadius: '9999px',
                                                                backgroundColor: t.plan === 'pro' ? '#f59e0b' : t.plan === 'basic' ? '#06b6d4' : '#6366f1',
                                                                width: t.plan === 'pro' ? '75%' : t.plan === 'basic' ? '50%' : '25%'
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                                <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open(`http://${t.name.toLowerCase().replace(/\s+/g, '-')}.microsaas.dev`, '_blank');
                                                        }}
                                                        className="btn-icon-action"
                                                        style={{ backgroundColor: 'var(--color-bg-hover)', color: 'var(--color-text-muted)', margin: '0 auto' }}
                                                        title="Launch Workspace"
                                                    >
                                                        <ArrowRight size={16} />
                                                    </button>
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

export default Tenants;
