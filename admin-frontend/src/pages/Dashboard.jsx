import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Activity, Database, ArrowUpRight, Bot, AlertTriangle, Server, Loader2, ArrowDownRight, Zap } from 'lucide-react';
import api from '../utils/api';

const MetricCard = ({ title, value, trend, isPositive, icon: Icon, colorClass, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        whileHover={{ y: -5 }}
        className="glass-panel p-6 rounded-3xl relative overflow-hidden group transition-all duration-300"
    >
        {/* Glow effect on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

        {/* Decorative background icon */}
        <div className={`absolute -bottom-6 -right-6 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 transform group-hover:scale-110 group-hover:-rotate-12`}>
            <Icon className="w-40 h-40" />
        </div>

        <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="space-y-1">
                <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{title}</span>
                <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors shadow-inner`}>
                <Icon className={`w-6 h-6 ${colorClass.split(' ')[0].replace('from-', 'text-')}`} />
            </div>
        </div>

        <div className="flex items-center justify-between text-sm relative z-10 mt-auto pt-4 border-t border-white/5">
            {trend && (
                <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 font-bold px-2 py-1 rounded-lg ${isPositive ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'
                        }`}>
                        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {trend}
                    </span>
                    <span className="text-slate-500 font-medium">vs last month</span>
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
            + `Deployed Tools,${metrics.deployedTools}\n`
            + `AI Requests,${metrics.aiRequests}\n`
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
            <div className="flex items-center justify-center min-h-[60vh] relative z-10">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-t-2 border-brand-500 border-l-2 border-transparent animate-spin" />
                    <div className="w-16 h-16 rounded-full border-r-2 border-blue-500 border-b-2 border-transparent animate-spin absolute inset-0 animation-delay-500" />
                    <Zap className="w-6 h-6 text-brand-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
            </div>
        );
    }

    const m = metrics || {};
    const trafficData = m.apiTraffic || [0, 0, 0, 0, 0, 0, 0];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="space-y-8 relative z-10 pb-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-r from-brand-600/10 to-blue-600/10 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 mb-2"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-blue-600 p-[1px]">
                            <div className="w-full h-full bg-[#0f172a] rounded-[10px] flex items-center justify-center">
                                <Activity className="w-5 h-5 text-brand-400" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Platform Overview</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 font-medium ml-1"
                    >
                        Real-time metrics and system performance
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-3"
                >
                    <button onClick={handleDownloadReport} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl border border-white/10 transition-all">
                        Download Report
                    </button>
                    <button onClick={fetchMetrics} className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                        Refresh Data
                    </button>
                </motion.div>
            </div>

            {/* Metric Cards Grid 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Total Users" value={m.totalUsers?.toLocaleString() || '0'} trend="12.5%" isPositive={true} icon={Users} colorClass="from-blue-500 to-cyan-500" delay={0.1} />
                <MetricCard title="Active Tenants" value={m.totalTenants?.toLocaleString() || '0'} trend="8.2%" isPositive={true} icon={Database} colorClass="from-emerald-500 to-teal-500" delay={0.2} />
                <MetricCard title="Monthly Revenue" value={m.monthlyRevenue || '$0'} trend="24.1%" isPositive={true} icon={TrendingUp} colorClass="from-brand-500 to-purple-500" delay={0.3} />
                <MetricCard title="Deployed Tools" value={m.deployedTools?.toLocaleString() || '0'} trend="5.4%" isPositive={true} icon={Activity} colorClass="from-amber-500 to-orange-500" delay={0.4} />
            </div>

            {/* Metric Cards Grid 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="AI Requests" value={m.aiRequests?.toLocaleString() || '0'} trend="45.2%" isPositive={true} icon={Bot} colorClass="from-pink-500 to-rose-500" delay={0.5} />
                <MetricCard title="API Traffic Vol" value={m.apiUsage?.toLocaleString() || '0'} trend="18.1%" isPositive={true} icon={Activity} colorClass="from-cyan-500 to-blue-500" delay={0.6} />
                <MetricCard title="Active Subs" value={m.activeSubscriptions?.toLocaleString() || '0'} trend="11.2%" isPositive={true} icon={TrendingUp} colorClass="from-teal-500 to-emerald-500" delay={0.7} />
                <MetricCard title="Error Rate" value={m.errorCount?.toLocaleString() || '0'} trend="2.4%" isPositive={false} icon={AlertTriangle} colorClass="from-red-500 to-rose-500" delay={0.8} />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Traffic Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="glass-panel p-8 rounded-3xl lg:col-span-2 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                                <Activity className="w-5 h-5 text-brand-400" /> API Request Volume
                            </h2>
                            <p className="text-sm text-slate-400">Weekly traffic analysis across all tenants</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-lg p-1 flex items-center">
                            <button className="px-3 py-1.5 text-xs font-semibold bg-brand-500 text-white rounded-md shadow-sm">Week</button>
                            <button className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors">Month</button>
                        </div>
                    </div>

                    {/* Minimalist Bar Chart */}
                    <div className="h-64 relative z-10">
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className="w-full h-[1px] bg-white/[0.03]" />
                            ))}
                        </div>
                        <div className="h-full flex items-end justify-between gap-1 sm:gap-4 relative pt-6 pb-2">
                            {trafficData.map((h, i) => {
                                const max = Math.max(...trafficData, 1);
                                const heightPercent = (h / max) * 100;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar h-full justify-end cursor-pointer">
                                        {/* Tooltip */}
                                        <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg border border-white/10 whitespace-nowrap mb-2 absolute top-0 transform -translate-y-full z-20 shadow-xl">
                                            {h.toLocaleString()} reqs
                                            <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 border-b border-r border-white/10 rotate-45" />
                                        </div>

                                        {/* Bar */}
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${heightPercent}%` }}
                                            transition={{ duration: 1, delay: i * 0.1, type: 'spring', bounce: 0.4 }}
                                            className="w-full relative overflow-hidden rounded-t-xl z-10"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-brand-600/40 to-blue-400/80 group-hover/bar:from-brand-500/60 group-hover/bar:to-blue-300 transition-colors" />
                                            {/* Shimmer effect */}
                                            <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-transparent via-white/20 to-transparent -translate-y-full group-hover/bar:animate-[shimmer_1s_infinite]" />
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex justify-between mt-2 pt-2 border-t border-white/5 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                        {days.map(d => <span key={d}>{d}</span>)}
                    </div>
                </motion.div>

                {/* System Health */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="glass-panel p-8 rounded-3xl flex flex-col relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none" />

                    <div className="mb-8 relative z-10">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                            <Server className="w-5 h-5 text-emerald-400" /> System Status
                        </h2>
                        <p className="text-sm text-slate-400">Live infrastructure health</p>
                    </div>

                    <div className="flex-1 flex flex-col gap-4 relative z-10">
                        {[
                            { label: 'Core API Server', status: 'Operational', color: 'bg-emerald-400', load: '12%' },
                            { label: 'MongoDB Cluster', status: 'Connected', color: 'bg-emerald-400', load: '45%' },
                            { label: 'AI Inference Engine', status: 'High Load', color: 'bg-amber-400', load: '89%' },
                            { label: 'Redis Cache', status: 'Optimal', color: 'bg-emerald-400', load: '5%' },
                        ].map((s, i) => (
                            <div key={i} className="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 flex items-center justify-between border border-white/5 group-hover:border-white/10">
                                <div className="flex items-center gap-4">
                                    <div className="relative flex items-center justify-center">
                                        <div className={`w-3 h-3 rounded-full ${s.color} absolute animate-ping opacity-75`} />
                                        <div className={`w-3 h-3 rounded-full ${s.color} relative border border-black/20`} />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-bold">{s.label}</p>
                                        <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mt-0.5">{s.status}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-slate-300">{s.load}</div>
                                    <div className="text-[10px] text-slate-500 font-medium uppercase">Load</div>
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
