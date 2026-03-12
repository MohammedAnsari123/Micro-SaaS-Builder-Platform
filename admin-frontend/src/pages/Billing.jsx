import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, TrendingUp, ArrowUpRight, Loader2, RefreshCw, DollarSign, ListOrdered, Wallet, Receipt } from 'lucide-react';
import axios from 'axios';
import './feature-pages.css';

const API = 'http://localhost:5000/api/v1';

const Billing = () => {
    const [billing, setBilling] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchBilling(); }, []);

    const fetchBilling = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API}/admin/billing`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) setBilling(data.data);
        } catch (err) {
            console.error('Failed to fetch billing data', err);
        } finally { setLoading(false); }
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '60vh', position: 'relative', zIndex: 10 }}>
                <div className="admin-loader"></div>
            </div>
        );
    }

    const b = billing || {};

    return (
        <div className="feature-page-container">
            {/* Header Content */}
            <div className="page-header-panel bg-brand-emerald">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="header-title-box"
                    >
                        <div className="header-icon-wrapper bg-brand-emerald">
                            <div className="header-icon-inner">
                                <Wallet className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
                            </div>
                        </div>
                        <h1 className="page-title">Revenue Operations</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="page-subtitle"
                    >
                        Monitor platform revenue, active subscriptions, and cash flow
                    </motion.p>
                </div>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={fetchBilling}
                    className="btn-refresh"
                >
                    <RefreshCw className="icon" style={{ color: 'var(--color-success)' }} />
                    <span className="btn-refresh-text">Refresh Finances</span>
                </motion.button>
            </div>

            {/* Revenue Cards */}
            <div className="metrics-grid metrics-grid-3">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="metric-card metric-card-emerald">
                    <div className="metric-glow glow-emerald" />
                    <div className="metric-header">
                        <span className="metric-title">Platform Total Volume</span>
                        <div className="metric-icon-box box-emerald">
                            <DollarSign className="metric-icon icon-emerald" />
                        </div>
                    </div>
                    <h3 className="metric-value value-emerald-currency">
                        ${((b.totalRevenue || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h3>
                    <div className="metric-footer footer-emerald">
                        <TrendingUp className="footer-icon" />
                        <span className="footer-text">Lifetime Gross</span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="metric-card metric-card-blue">
                    <div className="metric-glow glow-blue" />
                    <div className="metric-header">
                        <span className="metric-title">Monthly Recuring (MRR)</span>
                        <div className="metric-icon-box box-blue">
                            <TrendingUp className="metric-icon icon-blue" />
                        </div>
                    </div>
                    <h3 className="metric-value value-blue-currency">
                        ${((b.monthlyRevenue || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h3>
                    <div className="metric-footer footer-blue">
                        <ArrowUpRight className="footer-icon" />
                        <span className="footer-text">Current Month</span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="metric-card metric-card-brand">
                    <div className="metric-glow glow-brand" />
                    <div className="metric-header">
                        <span className="metric-title">Active Subscriptions</span>
                        <div className="metric-icon-box box-brand">
                            <CreditCard className="metric-icon icon-brand" />
                        </div>
                    </div>
                    <h3 className="metric-value">
                        {(b.activeSubscriptions || 0).toLocaleString()}
                    </h3>
                    <div className="metric-footer footer-brand">
                        <ListOrdered className="footer-icon" />
                        <span className="footer-text">Paid Tiers</span>
                    </div>
                </motion.div>
            </div>

            {/* Transactions Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="feature-table-panel"
            >
                <div className="table-header-box">
                    <div className="table-header-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)' }}>
                        <Receipt style={{ width: '1rem', height: '1rem', color: '#10b981' }} />
                    </div>
                    <h2 className="table-title">Latest Transactions</h2>
                </div>

                <div className="data-table-wrapper custom-scrollbar pb-2">
                    <table className="admin-data-table">
                        <thead>
                            <tr>
                                <th>Customer / Alias</th>
                                <th>Payment Amount</th>
                                <th>Subscribed Plan</th>
                                <th style={{ textAlign: 'right' }}>Settlement Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {(!b.transactions || b.transactions.length === 0) ? (
                                    <tr>
                                        <td colSpan="4">
                                            <div className="empty-state-large">
                                                <div className="empty-icon-circle">
                                                    <CreditCard style={{ width: '2rem', height: '2rem', color: 'var(--color-primary-500)' }} />
                                                </div>
                                                <h3 className="empty-title">No Transactions Found</h3>
                                                <p className="empty-desc">When tenants make payments, they will appear here.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    b.transactions.map((tx, index) => (
                                        <motion.tr
                                            key={tx.id || index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="table-row group"
                                        >
                                            <td className="p-5">
                                                <span className="user-name-text group-hover:text-emerald-500">
                                                    {tx.user || '-'}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <div style={{ fontWeight: 700, color: 'var(--color-success)', fontSize: '1rem' }}>
                                                    ${((tx.amount || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className="badge badge-admin">
                                                    {tx.plan || '-'}
                                                </span>
                                            </td>
                                            <td className="p-5" style={{ color: 'var(--color-primary-500)', fontWeight: 500, textAlign: 'right', fontSize: '0.75rem' }}>
                                                {tx.date ? new Date(tx.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
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

export default Billing;
