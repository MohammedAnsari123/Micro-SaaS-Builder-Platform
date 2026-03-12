import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Activity, Users, Globe, PieChart, Loader2, ArrowUpRight } from 'lucide-react';
import axios from 'axios';

import '../styles/analytics.css';
import '../styles/pages.css';

const Analytics = () => {
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
                console.error("Failed to fetch analytics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="analytics-empty">
                <Loader2 style={{ width: '40px', height: '40px', color: 'var(--color-secondary)' }} className="animate-spin" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="analytics-empty">
                <BarChart3 style={{ width: '40px', height: '40px', color: 'var(--color-text-muted)' }} />
                <p style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>No analytics data available yet.</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="analytics-header">
                <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <BarChart3 style={{ color: 'var(--color-secondary)' }} /> Platform-Wide Analytics
                </h2>
                <p className="page-subtitle" style={{ marginTop: '8px' }}>Deep dive into traffic patterns and user engagement across your SaaS portfolio.</p>
            </div>

            <div className="analytics-grid">
                {/* Traffic Distribution */}
                <div className="analytics-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                        <h3 className="page-title" style={{ fontSize: '1.125rem' }}>Traffic Volume (7D)</h3>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)' }} />
                            <span className="metric-label" style={{ marginBottom: 0 }}>API INGRESS</span>
                        </div>
                    </div>
                    <div className="analytics-chart-container">
                        {stats.apiTraffic.map((h, i) => (
                            <div key={i} className="analytics-bar">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(h / Math.max(...stats.apiTraffic, 1)) * 100}%` }}
                                    className="analytics-bar-fill"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Engagement Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="metric-card">
                        <h4 className="metric-label">Top Region</h4>
                        <div className="metric-row">
                            <span className="metric-value"><Globe style={{ width: '16px', height: '16px', color: 'rgb(52, 211, 153)' }} /> North America</span>
                            <span className="metric-highlight">42%</span>
                        </div>
                    </div>
                    <div className="metric-card">
                        <h4 className="metric-label">Error Rate</h4>
                        <div className="metric-row">
                            <span className="metric-value"><Activity style={{ width: '16px', height: '16px', color: 'rgb(251, 113, 133)' }} /> System Healthy</span>
                            <span className="metric-highlight">0.05%</span>
                        </div>
                    </div>
                    <div className="metric-card">
                        <h4 className="metric-label">User Growth</h4>
                        <div className="metric-row" style={{ position: 'relative', zIndex: 10 }}>
                            <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'white' }}>+{stats.activeUsers.split(',')[0]}%</span>
                            <PieChart style={{ width: '60px', height: '60px', color: 'rgba(0, 212, 255, 0.1)', position: 'absolute', right: '-10px', bottom: '-10px', zIndex: -1 }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
