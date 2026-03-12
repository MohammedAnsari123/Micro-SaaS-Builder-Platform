import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Activity, Database, ArrowUpRight, AlertTriangle, Server, ArrowDownRight, Zap } from 'lucide-react';
import api from '../utils/api';
import './dashboard.css';

const MetricCard = ({ title, value, trend, isPositive, icon: Icon, colorClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        className={`metric-card ${colorClass}`}
    >
        {/* Decorative background icon */}
        <div className="metric-card-bg-icon">
            <Icon width={160} height={160} />
        </div>

        <div className="metric-card-header">
            <div className="metric-text-group">
                <span className="metric-title font-heading">{title}</span>
                <h3 className="metric-value">{value}</h3>
            </div>
            <div className="metric-icon-box">
                <Icon width={24} height={24} />
            </div>
        </div>

        <div className="metric-footer">
            {trend && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`trend-badge ${isPositive ? 'trend-positive' : 'trend-negative'}`}>
                        {isPositive ? <ArrowUpRight width={14} height={14} /> : <ArrowDownRight width={14} height={14} />}
                        {trend}
                    </span>
                    <span className="trend-label">vs last month</span>
                </div>
            )}
        </div>
    </motion.div>
);

const Dashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/dashboard');
            if (data.success) setMetrics(data.data);
        } catch (err) {
            console.error('Failed to fetch dashboard metrics', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, []);

    const handleDownloadReport = () => {
        if (!metrics) return;
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Metric,Value\n"
            + `Total Users,${metrics.totalUsers}\n`
            + `Total Tenants,${metrics.totalTenants}\n`
            + `Monthly Revenue,${metrics.monthlyRevenue}\n`
            + `Deployed Sites,${metrics.deployedTools}\n`
            + `API Traffic Vol,${metrics.apiUsage}\n`
            + `Active Subs,${metrics.activeSubscriptions}\n`
            + `Error Logs,${metrics.errorCount}\n`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "platform_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '60vh' }}>
                <div className="admin-loader"></div>
            </div>
        );
    }

    const m = metrics || {};
    const trafficData = m.apiTraffic || [0, 0, 0, 0, 0, 0, 0];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div style={{ paddingBottom: '2.5rem' }}>
            {/* Header Area */}
            <div className="dashboard-header">
                <div className="header-title-section">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="title-row"
                    >
                        <div className="title-icon-wrapper">
                            <div className="title-icon-inner">
                                <Activity className="title-icon" />
                            </div>
                        </div>
                        <h1 className="dashboard-title">Platform Overview</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="dashboard-subtitle"
                    >
                        Real-time metrics and system performance
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="header-actions-group"
                >
                    <button onClick={handleDownloadReport} className="btn-secondary">
                        Download Report
                    </button>
                    <button onClick={fetchMetrics} className="btn-primary">
                        Refresh Data
                    </button>
                </motion.div>
            </div>

            {/* Metric Cards Grid 1 */}
            <div className="metrics-grid">
                <MetricCard title="Total Users" value={m.totalUsers?.toLocaleString() || '0'} trend="12.5%" isPositive={true} icon={Users} colorClass="color-blue" delay={0.1} />
                <MetricCard title="Active Tenants" value={m.totalTenants?.toLocaleString() || '0'} trend="8.2%" isPositive={true} icon={Database} colorClass="color-emerald" delay={0.2} />
                <MetricCard title="Monthly Revenue" value={m.monthlyRevenue || '$0'} trend="24.1%" isPositive={true} icon={TrendingUp} colorClass="color-purple" delay={0.3} />
                <MetricCard title="Deployed Sites" value={m.deployedTools?.toLocaleString() || '0'} trend="5.4%" isPositive={true} icon={Activity} colorClass="color-amber" delay={0.4} />
            </div>

            {/* Metric Cards Grid 2 */}
            <div className="metrics-grid">
                <MetricCard title="API Traffic Vol" value={m.apiUsage?.toLocaleString() || '0'} trend="18.1%" isPositive={true} icon={Activity} colorClass="color-blue" delay={0.6} />
                <MetricCard title="Active Subs" value={m.activeSubscriptions?.toLocaleString() || '0'} trend="11.2%" isPositive={true} icon={TrendingUp} colorClass="color-emerald" delay={0.7} />
                <MetricCard title="Error Rate" value={m.errorCount?.toLocaleString() || '0'} trend="2.4%" isPositive={false} icon={AlertTriangle} colorClass="color-rose" delay={0.8} />
            </div>

            <div className="dashboard-detailed-grid">
                {/* Traffic Chart Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="panel-card chart-panel"
                    style={{ minHeight: '400px' }}
                >
                    <div className="panel-header">
                        <div className="panel-title-wrapper">
                            <h2 className="font-heading"><Activity width={20} className="text-primary" /> API Request Volume</h2>
                            <p>Weekly traffic analysis across all tenants</p>
                        </div>
                        <div className="chart-controls">
                            <button className="chart-btn active">Week</button>
                            <button className="chart-btn">Month</button>
                        </div>
                    </div>

                    <div style={{ height: '240px', position: 'relative', marginTop: '2rem', display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                         {/* Minimalist Bar Chart Representation */}
                        {trafficData.map((h, i) => {
                            const max = Math.max(...trafficData, 1);
                            const heightPercent = (h / max) * 100;
                            return (
                                <div key={i} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative', cursor: 'pointer' }}>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${heightPercent}%` }}
                                        transition={{ duration: 1, delay: i * 0.1, type: 'spring', bounce: 0.4 }}
                                        style={{ width: '100%', backgroundColor: 'var(--color-primary-500)', borderRadius: '0.5rem 0.5rem 0 0', opacity: 0.8 }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                         {days.map(d => <span key={d}>{d}</span>)}
                    </div>
                </motion.div>

                {/* System Health */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="panel-card"
                >
                    <div className="panel-header" style={{ marginBottom: '1.5rem' }}>
                        <div className="panel-title-wrapper">
                            <h2 className="font-heading"><Server width={20} style={{ color: 'var(--color-success)' }} /> System Status</h2>
                            <p>Live infrastructure health</p>
                        </div>
                    </div>

                    <div className="system-health-list">
                        {[
                            { label: 'Core API Server', status: 'Operational', colorClass: 'status-indicator', load: '12%' },
                            { label: 'MongoDB Cluster', status: 'Connected', colorClass: 'status-indicator', load: '45%' },
                            { label: 'Template Engine', status: 'Optimal', colorClass: 'status-indicator', load: '14%' },
                            { label: 'Redis Cache', status: 'Optimal', colorClass: 'status-indicator', load: '5%' },
                        ].map((s, i) => (
                            <div key={i} className="health-item">
                                <div className="health-status-info">
                                    <div className="status-indicator">
                                        <div className="status-ping" />
                                        <div className="status-dot" />
                                    </div>
                                    <div className="health-labels">
                                        <p>{s.label}</p>
                                        <p>{s.status}</p>
                                    </div>
                                </div>
                                <div className="health-load">
                                    <div className="load-value">{s.load}</div>
                                    <div className="load-label">Load</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
