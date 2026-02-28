import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Database, TrendingUp, Activity, ArrowUpRight, Loader2 } from 'lucide-react';
import axios from 'axios';

const MetricCard = ({ title, value, trend, icon: Icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:bg-slate-800/80 transition-colors"
    >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon className="w-20 h-20" />
        </div>
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="text-slate-400 font-medium text-sm">{title}</div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Icon className="w-5 h-5" />
            </div>
        </div>
        <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">{value}</h3>
            <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-400 flex items-center gap-1 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                    <ArrowUpRight className="w-3 h-3" /> {trend}
                </span>
                <span className="text-slate-500 font-medium tracking-tight">vs last month</span>
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
            <div className="h-full flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">Aggregating platform metrics...</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-20 gap-4">
                <LayoutDashboard className="w-10 h-10 text-slate-600" />
                <p className="text-slate-400 font-medium">No stats available. Deploy a tool to get started!</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-8 shadow-xl shadow-black/20"
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-500" /> Platform Traffic
                        </h2>
                        <p className="text-slate-500 text-sm font-medium mt-1">Daily aggregated API requests for all your tools</p>
                    </div>
                    <div className="text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 tracking-widest uppercase">
                        Last 7 Days
                    </div>
                </div>

                <div className="h-64 flex items-end gap-3 md:gap-6 mt-10">
                    {stats.apiTraffic.map((h, i) => {
                        const max = Math.max(...stats.apiTraffic, 1);
                        const percentage = (h / max) * 100;
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${percentage}%` }}
                                    transition={{ duration: 1, delay: 0.6 + i * 0.1, type: "spring" }}
                                    className="w-full bg-gradient-to-t from-blue-600/20 via-blue-500/40 to-blue-400/80 rounded-xl relative overflow-hidden group-hover:to-blue-300 transition-colors border-x border-t border-blue-500/20"
                                >
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute top-2 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-bold text-white bg-black/40 px-1.5 py-0.5 rounded border border-white/10 uppercase">{h}</span>
                                    </div>
                                </motion.div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
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
