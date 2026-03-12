import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, Loader2, RefreshCw, Lock, Wifi, AlertCircle, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import './feature-pages.css';

const API = 'http://localhost:5000/api/v1';

const Security = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data: res } = await axios.get(`${API}/admin/security`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.success) setData(res.data);
        } catch (err) {
            console.error('Failed to fetch security data', err);
        } finally { setLoading(false); }
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '60vh', position: 'relative', zIndex: 10 }}>
                <div className="admin-loader"></div>
            </div>
        );
    }

    const d = data || {};

    return (
        <div className="feature-page-container">
            {/* Header Content */}
            <div className="page-header-panel bg-brand-rose">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="header-title-box"
                    >
                        <div className="header-icon-wrapper bg-brand-rose">
                            <div className="header-icon-inner">
                                <Shield className="w-5 h-5" style={{ color: '#f43f5e' }} />
                            </div>
                        </div>
                        <h1 className="page-title">Security Center</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="page-subtitle"
                    >
                        Monitor audit logs, suspicious activities, and system access
                    </motion.p>
                </div>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={fetchData}
                    className="btn-refresh"
                >
                    <RefreshCw className="icon" style={{ color: '#f43f5e' }} />
                    <span className="btn-refresh-text">Refresh Security</span>
                </motion.button>
            </div>

            {/* Top Metrics */}
            <div className="metrics-grid metrics-grid-3">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="metric-card metric-card-rose">
                    <div className="metric-glow glow-rose" />
                    <div className="metric-header">
                        <span className="metric-title">Failed Logins</span>
                        <div className="metric-icon-box box-rose">
                            <Lock className="metric-icon icon-rose" />
                        </div>
                    </div>
                    <h3 className="metric-value">{d.failedLogins || 0}</h3>
                    <div className="metric-footer footer-rose">
                        <span className="footer-text">Last 24 Hours</span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="metric-card metric-card-amber">
                    <div className="metric-glow glow-amber" />
                    <div className="metric-header">
                        <span className="metric-title">Suspicious Activity</span>
                        <div className="metric-icon-box box-amber">
                            <AlertTriangle className="metric-icon icon-amber" />
                        </div>
                    </div>
                    <h3 className="metric-value">{d.suspiciousActivity || 0}</h3>
                    <div className="metric-footer footer-amber">
                        <span className="footer-text">Flagged Events</span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="metric-card theme-orange" style={{ '--color-primary-400': '#fb923c', '--theme-border': 'rgba(249, 115, 22, 0.2)', '--theme-bg': 'rgba(249, 115, 22, 0.1)' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = `0 20px 25px -5px rgba(249, 115, 22, 0.1), 0 8px 10px -6px rgba(249, 115, 22, 0.1)`}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-xl)'}
                >
                    <div className="metric-glow" style={{ backgroundColor: 'rgba(249, 115, 22, 0.2)' }} />
                    <div className="metric-header">
                        <span className="metric-title">Webhook Failures</span>
                        <div className="metric-icon-box" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', borderColor: 'rgba(249, 115, 22, 0.2)' }}>
                            <Wifi style={{ width: '1.25rem', height: '1.25rem', color: '#fb923c' }} />
                        </div>
                    </div>
                    <h3 className="metric-value">{d.webhookFailures || 0}</h3>
                    <div className="metric-footer" style={{ color: '#fb923c', backgroundColor: 'var(--color-bg-hover)', border: '1px solid var(--color-border)' }}>
                        <span className="footer-text">Failed Dispatches</span>
                    </div>
                </motion.div>
            </div>

            {/* Audit Logs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="feature-table-panel"
            >

                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="table-header-box">
                    <div className="table-header-icon" style={{ backgroundColor: 'var(--color-bg-hover)', border: '1px solid var(--color-border)' }}>
                        <ShieldAlert style={{ width: '1rem', height: '1rem', color: 'var(--color-primary-600)' }} />
                    </div>
                    <h2 className="table-title">System Audit Trail</h2>
                </div>

                <div className="audit-list-container">
                    {(!d.auditLogs || d.auditLogs.length === 0) ? (
                        <div className="empty-state-large">
                            <Shield style={{ width: '3rem', height: '3rem', color: 'var(--color-primary-600)', margin: '0 auto 1rem auto' }} />
                            <h3 className="empty-title">No Audit Logs</h3>
                            <p className="empty-desc">System activity and security events will appear here.</p>
                        </div>
                    ) : (
                        <div className="audit-list custom-scrollbar">
                            <AnimatePresence>
                                {d.auditLogs.map((log, i) => {
                                    const isWarning = log.action?.toLowerCase().includes('fail') || log.action?.toLowerCase().includes('delete');
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="audit-item"
                                            style={{ borderLeftColor: isWarning ? 'rgba(244, 63, 94, 0.4)' : 'rgba(99, 102, 241, 0.4)' }}
                                        >
                                            <div className="audit-content">
                                                <div className="audit-header-row">
                                                    <span className="audit-time">
                                                        {log.date ? new Date(log.date).toLocaleTimeString() : '00:00:00'}
                                                    </span>
                                                    <p className="audit-action">
                                                        {log.action || 'Unknown Action'}
                                                    </p>
                                                    {isWarning && (
                                                        <AlertCircle style={{ width: '0.875rem', height: '0.875rem', color: '#f43f5e', flexShrink: 0 }} />
                                                    )}
                                                </div>
                                                <div className="audit-meta-row">
                                                    <span className="audit-user">
                                                        {log.user || 'System'}
                                                    </span>
                                                    <span className="audit-ip">
                                                        • IP: {log.ip || '-'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="audit-date-container">
                                                <span className="audit-date">
                                                    {log.date ? new Date(log.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Security;
