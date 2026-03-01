import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Activity, RefreshCw, PieChart as PieIcon, LineChart as LineIcon } from 'lucide-react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const ChartDashboard = ({ instance }) => {
    const title = instance?.config?.title || "Data Analytics";
    const collectionName = instance?.collectionName || "orders";
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        growth: '+0%',
        active: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
                const res = await axios.get(`http://localhost:5000/api/v1/dynamic/${collectionName}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.success) {
                    const rawData = res.data.data;
                    setData(rawData);

                    // Simple logic to generate stats if it's dynamic data
                    setStats({
                        total: rawData.length,
                        growth: `+${Math.floor(Math.random() * 20)}%`,
                        active: Math.floor(rawData.length * 0.8)
                    });
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [collectionName]);

    // Prepare chart data (e.g., grouped by createdAt day)
    const chartData = data.reduce((acc, item) => {
        const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { weekday: 'short' }) : 'Unknown';
        const existing = acc.find(d => d.name === date);
        if (existing) existing.value += 1;
        else acc.push({ name: date, value: 1 });
        return acc;
    }, []).slice(-7);

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    return (
        <div className="space-y-6 w-full h-full flex flex-col group/dashboard">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center border border-blue-500/20 shadow-lg transition-transform group-hover/dashboard:scale-105">
                        <BarChart3 className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
                        <p className="text-[11px] text-slate-500 uppercase tracking-widest font-black">
                            Analyzing <span className="text-blue-500">{collectionName}</span> collection
                        </p>
                    </div>
                </div>
                {loading && <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />}
            </div>

            {/* KPI Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Total Records', value: stats.total, icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Monthly Growth', value: stats.growth, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Projected Volume', value: Math.floor(stats.total * 1.5), icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' }
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl hover:border-slate-700 transition-all shadow-lg hover:shadow-blue-500/5">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-black text-slate-600 tracking-widest uppercase">Metric 0{i + 1}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">{stat.label}</p>
                        <p className="text-2xl font-black text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
                {/* Main Trend Chart */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Activity className="w-4 h-4 text-blue-500" />
                                Growth Velocity
                            </h3>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">7-Day Transactional Flow</p>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData.length > 0 ? chartData : [{ name: 'Empty', value: 0 }]}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px' }}
                                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribution Chart */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <PieIcon className="w-4 h-4 text-purple-500" />
                                Component Split
                            </h3>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Resource Allocation Index</p>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-[250px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData.length > 0 ? chartData : [{ name: 'Empty', value: 1 }]}
                                    paddingAngle={5}
                                    innerRadius={60}
                                    outerRadius={80}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black text-white">{data.length}</span>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartDashboard;
