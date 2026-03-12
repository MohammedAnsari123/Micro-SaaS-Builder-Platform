import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Users, Loader2, RefreshCw, Activity, Zap, ShieldAlert, LineChart } from 'lucide-react';
import axios from 'axios';
import './feature-pages.css';

const API = 'http://localhost:5000/api/v1';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data: res } = await axios.get(`${API}/admin/analytics`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.success) setData(res.data);
        } catch {
            console.error('Failed to fetch analytics data');
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

    const metrics = [
        { title: 'Growth Rate', value: d.growthRate || '0%', icon: TrendingUp, color: 'emerald', detail: 'vs last month' },
        { title: 'Churn Rate', value: d.churnRate || '0%', icon: TrendingDown, color: 'rose', detail: 'improved 0.5%' },
        { title: 'New Users', value: String(d.newUsersThisMonth || 0), icon: Users, color: 'blue', detail: 'this month' },
        { title: 'Active Today', value: String(d.activeUsersToday || 0), icon: Activity, color: 'fuchsia', detail: 'real-time' },
        { title: 'API Requests', value: String(d.apiCallsToday || 0), icon: Zap, color: 'brand', detail: 'last 24h' },
        { title: 'Error Rate', value: d.errorRate || '0%', icon: ShieldAlert, color: 'amber', detail: 'acceptable bounds' },
    ];

    const getColorClasses = (color) => {
        const colors = {
            emerald: { text: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)', shadow: 'rgba(16, 185, 129, 0.1)' },
            rose: { text: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)', border: 'rgba(244, 63, 94, 0.2)', shadow: 'rgba(244, 63, 94, 0.1)' },
            blue: { text: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)', shadow: 'rgba(59, 130, 246, 0.1)' },
            fuchsia: { text: '#d946ef', bg: 'rgba(217, 70, 239, 0.1)', border: 'rgba(217, 70, 239, 0.2)', shadow: 'rgba(217, 70, 239, 0.1)' },
            brand: { text: 'var(--color-primary-600)', bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.2)', shadow: 'rgba(99, 102, 241, 0.1)' },
            amber: { text: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.2)', shadow: 'rgba(251, 191, 36, 0.1)' }
        };
        return colors[color];
    };

    return (
        <div className="feature-page-container">
            {/* Header */}
            <div className="page-header-panel bg-brand-blue">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="header-title-box"
                    >
                        <div className="header-icon-wrapper bg-brand-fuchsia">
                            <div className="header-icon-inner">
                                <LineChart className="w-5 h-5" style={{ color: '#d946ef' }} />
                            </div>
                        </div>
                        <h1 className="page-title">Platform Analytics</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="page-subtitle"
                    >
                        Growth, engagement, and deep performance insights
                    </motion.p>
                </div>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={fetchData}
                    className="btn-refresh"
                >
                    <RefreshCw className="icon" style={{ color: 'var(--color-primary-600)' }} />
                    <span className="btn-refresh-text">Refresh Data</span>
                </motion.button>
            </div>

            {/* Insight Cards */}
            <div className="metrics-grid metrics-grid-3">
                {metrics.map((card, i) => {
                    const styles = getColorClasses(card.color);
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`metric-card`}
                            style={{ '--hover-shadow-color': styles.shadow }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = `0 20px 25px -5px ${styles.shadow}, 0 8px 10px -6px ${styles.shadow}`}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-xl)'}
                        >
                            <div className="metric-glow" style={{ backgroundColor: styles.bg.replace('0.1', '0.2') || 'rgba(99, 102, 241, 0.2)' }} />

                            <div className="metric-header">
                                <div className="metric-icon-box" style={{ backgroundColor: styles.bg, borderColor: styles.border }}>
                                    <card.icon style={{ width: '1.5rem', height: '1.5rem', color: styles.text }} />
                                </div>
                                <span className="badge badge-admin" style={{ color: styles.text }}>
                                    {card.detail}
                                </span>
                            </div>

                            <div style={{ position: 'relative', zIndex: 10 }}>
                                <h3 className="metric-title" style={{ marginBottom: '0.25rem' }}>{card.title}</h3>
                                <div className="metric-value">{card.value}</div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Immersive Weekly Growth Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="chart-container-panel"
            >
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="chart-header">
                    <h2 className="chart-title">
                        <div className="table-header-icon" style={{ backgroundImage: 'linear-gradient(to bottom right, rgba(99, 102, 241, 0.2), rgba(217, 70, 239, 0.2))', border: '1px solid var(--color-border)' }}>
                            <BarChart3 style={{ width: '1rem', height: '1rem', color: '#d946ef' }} />
                        </div>
                        Weekly User Growth Traffic
                    </h2>
                    <div className="chart-legend">
                        <span className="legend-dot" style={{ backgroundColor: 'var(--color-primary-400)', boxShadow: '0 0 10px rgba(139, 92, 246, 0.8)' }}></span>
                        <span className="legend-text">New Registrations</span>
                    </div>
                </div>

                <div className="chart-bars-container">
                    {/* Y-axis markers */}
                    <div className="y-axis-labels">
                        <span>150</span>
                        <span>100</span>
                        <span>50</span>
                        <span>0</span>
                    </div>

                    {(d.weeklyGrowth || [0, 0, 0, 0, 0, 0, 0]).map((h, i) => {
                        const max = Math.max(...(d.weeklyGrowth || [1]), 150); // Set baseline max for better aesthetics
                        const percentage = Math.max((h / max) * 100, 5);

                        return (
                            <div key={i} className="chart-bar-group group">
                                {/* Hover Tooltip */}
                                <div className="chart-tooltip">
                                    {h} users
                                </div>

                                {/* Bar */}
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${percentage}%` }}
                                    transition={{ duration: 1, delay: i * 0.1, type: 'spring', stiffness: 50 }}
                                    className="chart-bar"
                                >
                                    <div className="chart-bar-highlight" />
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
                <div className="x-axis-labels">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <div key={day} className="x-axis-label">{day}</div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Analytics;
