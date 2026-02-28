import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Activity, Users, Globe, PieChart, Loader2, ArrowUpRight } from 'lucide-react';
import axios from 'axios';

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
            <div className="h-full flex items-center justify-center p-20">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-20 gap-4">
                <BarChart3 className="w-10 h-10 text-slate-600" />
                <p className="text-slate-400 font-medium">No analytics data available yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 p-8 rounded-3xl border border-blue-500/10 backdrop-blur-md">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-blue-400" /> Platform-Wide Analytics
                </h2>
                <p className="text-slate-400 font-medium">Deep dive into traffic patterns and user engagement across your SaaS portfolio.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Traffic Distribution */}
                <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-white text-lg">Traffic Volume (7D)</h3>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">API INGRESS</span>
                        </div>
                    </div>
                    <div className="h-64 flex items-end gap-3 mt-4">
                        {stats.apiTraffic.map((h, i) => (
                            <div key={i} className="flex-1 bg-slate-800/50 rounded-lg relative group">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(h / Math.max(...stats.apiTraffic, 1)) * 100}%` }}
                                    className="absolute bottom-0 inset-x-0 bg-blue-500/30 rounded-lg border-t border-blue-400/50 group-hover:bg-blue-500/50 transition-all"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Engagement Metrics */}
                <div className="space-y-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Top Region</h4>
                        <div className="flex items-center justify-between">
                            <span className="text-white font-bold flex items-center gap-2"><Globe className="w-4 h-4 text-emerald-400" /> North America</span>
                            <span className="text-emerald-400 font-bold text-sm">42%</span>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Error Rate</h4>
                        <div className="flex items-center justify-between">
                            <span className="text-white font-bold flex items-center gap-2"><Activity className="w-4 h-4 text-rose-400" /> System Healthy</span>
                            <span className="text-emerald-400 font-bold text-sm">0.05%</span>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-hidden relative">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">User Growth</h4>
                        <div className="flex items-end justify-between relative z-10">
                            <span className="text-3xl font-bold text-white tracking-tighter">+{stats.activeUsers.split(',')[0]}%</span>
                            <PieChart className="w-10 h-10 text-blue-500/20 absolute -right-2 -bottom-2" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
