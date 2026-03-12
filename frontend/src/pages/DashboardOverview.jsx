import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Database, TrendingUp, Activity, ArrowUpRight, Loader2 } from 'lucide-react';
import axios from 'axios';

import '../styles/dashboard.css';

const MetricCard = ({ title, value, trend, icon: Icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="metric-card group"
    >
        <div className="metric-bg-icon">
            <Icon />
        </div>
        <div className="metric-header">
            <div className="metric-title">{title}</div>
            <div className="metric-icon-wrapper">
                <Icon className="w-5 h-5" />
            </div>
        </div>
        <div className="metric-content">
            <h3 className="metric-value">{value}</h3>
            <div className="metric-trend-wrap">
                <span className="metric-trend">
                    <ArrowUpRight /> {trend}
                </span>
                <span className="metric-compare">vs last month</span>
            </div>
        </div>
    </motion.div>
);

const DashboardOverview = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('http://localhost:5000/api/v1/user/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data.success) {
                    setStats(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                <Loader2 className="icon animate-spin" style={{ color: 'var(--color-primary)' }} />
                <p className="dashboard-empty-text animate-pulse">Aggregating platform metrics...</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="dashboard-empty">
                <LayoutDashboard className="icon" />
                <p className="dashboard-empty-text">No stats available. Deploy a tool to get started!</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="metrics-grid">
                <MetricCard title="Total ARR" value={stats.totalARR} trend="+12.5%" icon={TrendingUp} delay={0.1} />
                <MetricCard title="Active Users" value={stats.activeUsers} trend="+5.2%" icon={Users} delay={0.2} />
                <MetricCard title="API Requests" value={stats.apiRequests} trend="+18.1%" icon={Activity} delay={0.3} />
                <MetricCard title="Deployed Tools" value={stats.deployedTools} trend="+1" icon={Database} delay={0.4} />
            </div>

            {/* Main Chart Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="chart-section"
            >
                <div className="chart-header">
                    <div>
                        <h2 className="chart-title">
                            <Activity /> Platform Traffic
                        </h2>
                        <p className="chart-subtitle">Daily aggregated API requests for all your tools</p>
                    </div>
                    <div className="chart-badge">
                        Last 7 Days
                    </div>
                </div>

                <div className="chart-container">
                    {stats.apiTraffic.map((h, i) => {
                        const max = Math.max(...stats.apiTraffic, 1);
                        const percentage = (h / max) * 100;
                        return (
                            <div key={i} className="chart-column">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${percentage}%` }}
                                    transition={{ duration: 1, delay: 0.6 + i * 0.1, type: "spring" }}
                                    className="chart-bar"
                                >
                                    <div className="chart-bar-hover-bg" />
                                    <div className="chart-tooltip">
                                        <span className="chart-tooltip-text">{h}</span>
                                    </div>
                                </motion.div>
                                <span className="chart-label">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][(new Date().getDay() + i + 1) % 7]}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardOverview;
