import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Activity, RefreshCw } from 'lucide-react';
import axios from 'axios';

const ChartDashboard = ({ instance }) => {
    const title = instance?.config?.title || "Operational Overview";
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
                const res = await axios.get('http://localhost:5000/api/v1/user/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setMetrics(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch analytics:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    const kpis = [
        { label: 'Platform ARR', value: metrics ? `$${(metrics.totalArr || 0).toLocaleString()}` : '$0', change: '+12.5%', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Active Tenants', value: metrics ? (metrics.activeUsers || 0).toLocaleString() : '0', change: '+4.2%', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'API Queries', value: metrics ? (metrics.apiRequests || 0).toLocaleString() : '0', change: '+18.1%', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'Live Modules', value: metrics ? (metrics.deployedTools || 0).toLocaleString() : '0', change: 'Live Now', icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' }
    ];

    return (
        <div className="space-y-8 w-full h-full flex flex-col group/dashboard">
            {/* Header Area */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-500/10">
                        <BarChart3 className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
                        <p className="text-sm text-slate-500 font-medium">Real-time intelligence dashboard</p>
                    </div>
                </div>
                {loading && <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />}
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {kpis.map((stat, i) => (
                    <div key={i} className="relative group/card overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 transition-all hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/5 active:scale-[0.98]">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover/card:scale-110`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Metric 0{i + 1}</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-white tabular-nums">{stat.value}</p>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 py-0.5 px-2 bg-emerald-500/5 rounded-full border border-emerald-500/10">
                                {stat.change}
                            </span>
                            <span className="text-[10px] font-medium text-slate-600 uppercase">Growth Index</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Visual Analytics Canvas */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[350px]">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col relative overflow-hidden group/chart">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Traffic Distribution</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">7-Day Analysis Horizon</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <div className="w-3 h-3 rounded-full bg-slate-800" />
                        </div>
                    </div>

                    <div className="flex-1 flex items-end gap-3 justify-between">
                        {/* Dynamic Height Bars */}
                        {[30, 85, 45, 110, 60, 95, 125, 75, 55, 105, 80, 115].map((h, i) => (
                            <div key={i} className="flex-1 bg-slate-800/20 rounded-t-xl flex items-end justify-center group relative h-full transition-all">
                                <div
                                    className="w-full bg-gradient-to-t from-blue-600/40 to-indigo-400 group-hover:from-blue-500 group-hover:to-cyan-400 rounded-t-xl transition-all duration-700 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                                    style={{ height: `${(h / 140) * 100}%` }}
                                ></div>
                                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 bg-slate-950 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-2xl border border-slate-800 z-20 pointer-events-none">
                                    {(h * 1.2).toFixed(1)}K
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between mt-6 text-[10px] font-black text-slate-600 uppercase tracking-widest border-t border-slate-800/50 pt-6">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                {/* Engagement Tracker */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-6">User Velocity</h3>
                    <div className="space-y-4 flex-1">
                        {[
                            { name: 'Core Engine', status: 'Optimal', load: 88, color: 'bg-emerald-500' },
                            { name: 'API Gateway', status: 'High Load', load: 72, color: 'bg-blue-500' },
                            { name: 'Worker Cluster', status: 'Syncing', load: 45, color: 'bg-amber-500' },
                            { name: 'Storage Layer', status: 'Ready', load: 12, color: 'bg-slate-700' }
                        ].map((node, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-slate-800/30 border border-transparent hover:border-slate-700 hover:bg-slate-800/50 transition-all">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-bold text-slate-200">{node.name}</span>
                                    <span className="text-[10px] font-black uppercase text-slate-500">{node.status}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${node.color} transition-all duration-1000`}
                                        style={{ width: `${node.load}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-8 w-full py-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-all uppercase tracking-widest">
                        View Detailed Audit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChartDashboard;

