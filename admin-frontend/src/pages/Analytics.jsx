import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Users, Loader2, RefreshCw, Activity, Zap, ShieldAlert, LineChart } from 'lucide-react';
import axios from 'axios';

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
            <div className="flex items-center justify-center min-h-[60vh] relative z-10">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-t-2 border-brand-500 border-l-2 border-transparent animate-spin" />
                    <div className="w-16 h-16 rounded-full border-r-2 border-fuchsia-500 border-b-2 border-transparent animate-spin absolute inset-0 animation-delay-500" />
                    <LineChart className="w-6 h-6 text-brand-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
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
            emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', shadow: 'shadow-emerald-500/10' },
            rose: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', shadow: 'shadow-rose-500/10' },
            blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', shadow: 'shadow-blue-500/10' },
            fuchsia: { text: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20', shadow: 'shadow-fuchsia-500/10' },
            brand: { text: 'text-brand-400', bg: 'bg-brand-500/10', border: 'border-brand-500/20', shadow: 'shadow-brand-500/10' },
            amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', shadow: 'shadow-amber-500/10' }
        };
        return colors[color];
    };

    return (
        <div className="space-y-8 relative z-10 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-r from-brand-600/10 to-blue-600/10 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 mb-2"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-fuchsia-600 p-[1px]">
                            <div className="w-full h-full bg-[#0f172a] rounded-[10px] flex items-center justify-center">
                                <LineChart className="w-5 h-5 text-fuchsia-400" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Platform Analytics</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 font-medium ml-1"
                    >
                        Growth, engagement, and deep performance insights
                    </motion.p>
                </div>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={fetchData}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all flex items-center gap-2 group shadow-lg"
                >
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500 text-brand-400" />
                    <span className="text-sm font-bold">Refresh Data</span>
                </motion.button>
            </div>

            {/* Insight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {metrics.map((card, i) => {
                    const styles = getColorClasses(card.color);
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`glass-panel rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 border border-white/5 shadow-xl hover:${styles.shadow}`}
                        >
                            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity ${styles.bg.replace('/10', '')}`} />

                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${styles.bg} ${styles.border}`}>
                                    <card.icon className={`w-6 h-6 ${styles.text}`} />
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 bg-white/5 rounded-full border border-white/10 ${styles.text}`}>
                                    {card.detail}
                                </span>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-slate-400 text-sm font-medium mb-1">{card.title}</h3>
                                <div className="text-3xl font-bold text-white tracking-tight">{card.value}</div>
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
                className="glass-panel rounded-3xl p-8 border border-white/5 relative overflow-hidden shadow-2xl"
            >
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="flex items-center justify-between mb-10 relative z-10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-fuchsia-400" />
                        </div>
                        Weekly User Growth Traffic
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-brand-400 shadow-[0_0_10px_rgba(139,92,246,0.8)]"></span>
                        <span className="text-sm text-slate-400 font-medium">New Registrations</span>
                    </div>
                </div>

                <div className="h-64 flex items-end justify-between gap-4 relative z-10 pl-8 pb-6 border-b border-l border-white/10">
                    {/* Y-axis markers */}
                    <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-slate-500 font-medium -translate-x-full pr-4">
                        <span>150</span>
                        <span>100</span>
                        <span>50</span>
                        <span>0</span>
                    </div>

                    {(d.weeklyGrowth || [0, 0, 0, 0, 0, 0, 0]).map((h, i) => {
                        const max = Math.max(...(d.weeklyGrowth || [1]), 150); // Set baseline max for better aesthetics
                        const percentage = Math.max((h / max) * 100, 5);

                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group h-full justify-end relative">
                                {/* Hover Tooltip */}
                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur border border-white/10 text-white text-xs py-1.5 px-3 rounded-lg font-bold pointer-events-none shadow-xl">
                                    {h} users
                                </div>

                                {/* Bar */}
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${percentage}%` }}
                                    transition={{ duration: 1, delay: i * 0.1, type: 'spring', stiffness: 50 }}
                                    className="w-full max-w-[60px] bg-gradient-to-t from-brand-600/40 via-brand-500/80 to-fuchsia-400 rounded-t-xl relative border-x border-t border-white/10 group-hover:brightness-125 transition-all overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between mt-4 text-xs text-slate-400 font-bold uppercase tracking-wider pl-8 relative z-10">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <div key={day} className="flex-1 text-center">{day}</div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Analytics;
