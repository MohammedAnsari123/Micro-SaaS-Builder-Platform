import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Loader2, RefreshCw, Zap, XCircle, Terminal, Activity, Server, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000/api/v1';

const AIMonitor = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data: res } = await axios.get(`${API}/admin/ai-monitor`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.success) setData(res.data);
        } catch (err) {
            console.error('Failed to fetch AI monitor data', err);
        } finally { setLoading(false); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] relative z-10">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-t-2 border-brand-500 border-l-2 border-transparent animate-spin" />
                    <div className="w-16 h-16 rounded-full border-r-2 border-cyan-500 border-b-2 border-transparent animate-spin absolute inset-0 animation-delay-500" />
                    <Bot className="w-6 h-6 text-brand-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
            </div>
        );
    }

    const d = data || {};
    const failureRate = d.totalCalls > 0 ? ((d.failedCalls / d.totalCalls) * 100).toFixed(2) : 0;

    return (
        <div className="space-y-8 relative z-10 pb-10">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-r from-brand-600/10 to-cyan-600/10 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 mb-2"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-cyan-500 p-[1px]">
                            <div className="w-full h-full bg-[#0f172a] rounded-[10px] flex items-center justify-center">
                                <Bot className="w-5 h-5 text-cyan-400" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">AI Service Monitor</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 font-medium ml-1"
                    >
                        Real-time tracking of AI generation requests, tokens, and system health
                    </motion.p>
                </div>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={fetchData}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all flex items-center gap-2 group shadow-lg"
                >
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500 text-cyan-400" />
                    <span className="text-sm font-bold">Live Refresh</span>
                </motion.button>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group hover:border-brand-500/30 transition-all">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand-500/20 rounded-full blur-[30px]" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <span className="text-slate-400 text-sm font-medium">Total AI Calls</span>
                        <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-brand-400" />
                        </div>
                    </div>
                    <h3 className="text-4xl font-black text-white tracking-tight relative z-10">{(d.totalCalls || 0).toLocaleString()}</h3>
                    <div className="flex items-center gap-1.5 mt-3 relative z-10">
                        <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                        <span className="text-brand-400 text-xs font-bold uppercase tracking-wider">System Active</span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group hover:border-rose-500/30 transition-all">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-500/20 rounded-full blur-[30px]" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <span className="text-slate-400 text-sm font-medium">Failed Responses</span>
                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                            <XCircle className="w-5 h-5 text-rose-400" />
                        </div>
                    </div>
                    <div className="flex items-end gap-3 relative z-10">
                        <h3 className="text-4xl font-black text-white tracking-tight">{(d.failedCalls || 0).toLocaleString()}</h3>
                        <span className="text-rose-400 text-sm font-bold pb-1 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {failureRate}%
                        </span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group hover:border-amber-500/30 transition-all">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/20 rounded-full blur-[30px]" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <span className="text-slate-400 text-sm font-medium">Avg Token Usage</span>
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-amber-400" />
                        </div>
                    </div>
                    <h3 className="text-4xl font-black text-white tracking-tight relative z-10">{(d.avgTokens || 0).toLocaleString()}</h3>
                    <div className="flex items-center gap-1.5 mt-3 relative z-10">
                        <Server className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">tokens / request</span>
                    </div>
                </motion.div>
            </div>

            {/* Recent AI Logs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="glass-panel rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative">

                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="p-6 border-b border-white/5 flex items-center gap-3 relative z-10 bg-black/20">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <Terminal className="w-4 h-4 text-slate-300" />
                    </div>
                    <h2 className="text-lg font-bold text-white">Execution Stream</h2>
                </div>

                <div className="relative z-10">
                    {(!d.recentLogs || d.recentLogs.length === 0) ? (
                        <div className="text-center py-20">
                            <Terminal className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">No Execution Logs</h3>
                            <p className="text-slate-500 text-sm font-medium">Awaiting incoming AI generation requests to the cluster.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            <AnimatePresence>
                                {d.recentLogs.map((log, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors border-l-2 border-transparent group"
                                        style={{ borderLeftColor: log.success ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)' }}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1.5">
                                                <span className="text-xs font-mono font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                                    {log.date ? new Date(log.date).toLocaleTimeString() : '00:00:00'}
                                                </span>
                                                <p className="text-white text-sm font-medium truncate group-hover:text-cyan-300 transition-colors">
                                                    {log.prompt || 'Unknown generation prompt'}
                                                </p>
                                            </div>
                                            <span className="text-slate-500 text-xs font-medium ml-1">
                                                {log.date ? new Date(log.date).toLocaleDateString() : '-'}
                                            </span>
                                        </div>
                                        <div className="shrink-0 flex items-center">
                                            {log.success ? (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Completed</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                                                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                                                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Failed</span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AIMonitor;
