import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, ShoppingBag, Calendar, MessageSquare, Loader2, BarChart2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const MetricCard = ({ title, value, icon: Icon, color }) => (
    <div style={{
        padding: '24px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
    }}>
        <div>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '8px' }}>{title}</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{value}</span>
        </div>
        <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: `${color}15`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Icon size={22} />
        </div>
    </div>
);

const AnalyticsDashboard = ({ token, cloneId }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchStats = async () => {
            if (!cloneId || cloneId === 'undefined') return;
            try {
                setLoading(true);
                const res = await axios.get(`${API_BASE}/stats/clone/${cloneId}`, { headers });
                if (res.data.success) {
                    setStats(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [cloneId]);

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#94a3b8' }}>
                <Loader2 size={36} className="animate-spin" style={{ color: '#3b82f6', marginBottom: '12px' }} />
                <p style={{ fontSize: '14px' }}>Loading clone analytics...</p>
            </div>
        );
    }

    if (!stats) return <p style={{ color: '#94a3b8' }}>Failed to load analytics dashboard.</p>;

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Live Site Analytics</h2>
                <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Track orders, bookings, and form leads generated specifically for this site clone.</p>
            </div>

            {/* Metrics cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <MetricCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon={TrendingUp} color="#10b981" />
                <MetricCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} color="#3b82f6" />
                <MetricCard title="Total Bookings" value={stats.totalBookings} icon={Calendar} color="#8b5cf6" />
                <MetricCard title="Form Leads" value={stats.totalLeads} icon={MessageSquare} color="#f59e0b" />
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px', alignItems: 'start' }}>
                
                {/* Line Chart: Weekly Revenue */}
                <div style={{
                    padding: '24px',
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BarChart2 size={16} color="#3b82f6" /> Revenue Trend (Last 7 Days)
                    </h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.weeklyOrders} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6 }} dot={{ strokeWidth: 2, r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: Lead Allocations */}
                <div style={{
                    padding: '24px',
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Lead Channels</h3>
                    
                    {stats.totalLeads === 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '260px', color: '#94a3b8', fontSize: '13px' }}>
                            No lead interactions yet
                        </div>
                    ) : (
                        <div style={{ width: '100%', height: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ResponsiveContainer width="100%" height="80%">
                                <PieChart>
                                    <Pie
                                        data={stats.leadDistribution.filter(d => d.value > 0)}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.leadDistribution.filter(d => d.value > 0).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            
                            {/* Custom Legend */}
                            <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                                {stats.leadDistribution.map((entry, index) => (
                                    <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: COLORS[index] }} />
                                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{entry.name} ({entry.value})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AnalyticsDashboard;
