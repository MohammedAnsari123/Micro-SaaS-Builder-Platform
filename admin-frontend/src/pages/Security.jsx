import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, Loader2, RefreshCw, Lock, Wifi, AlertCircle, ShieldAlert } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000/api/v1';

const Security = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data: res } = await axios.get(`${API}/admin/security`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.success) setData(res.data);
        } catch (err) {
            console.error('Failed to fetch security data', err);
        } finally { setLoading(false); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] relative z-10">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-t-2 border-brand-500 border-l-2 border-transparent animate-spin" />
                    <div className="w-16 h-16 rounded-full border-r-2 border-rose-500 border-b-2 border-transparent animate-spin absolute inset-0 animation-delay-500" />
                    <Shield className="w-6 h-6 text-brand-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
            </div>
        );
    }

    const d = data || {};

    return (
        <div className="space-y-8 relative z-10 pb-10">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-r from-brand-600/10 to-rose-600/10 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 mb-2"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-rose-500 p-[1px]">
                            <div className="w-full h-full bg-[#0f172a] rounded-[10px] flex items-center justify-center">
                                <Shield className="w-5 h-5 text-rose-400" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Security Center</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 font-medium ml-1"
                    >
                        Monitor audit logs, suspicious activities, and system access
                    </motion.p>
                </div>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={fetchData}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all flex items-center gap-2 group shadow-lg"
                >
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500 text-rose-400" />
                    <span className="text-sm font-bold">Refresh Security</span>
                </motion.button>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group hover:border-red-500/30 transition-all">
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-red-500/20 rounded-full blur-[40px]" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <span className="text-slate-400 text-sm font-medium">Failed Logins</span>
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-red-400" />
                        </div>
                    </div>
                    <h3 className="text-4xl font-black text-white tracking-tight relative z-10">{d.failedLogins || 0}</h3>
                    <div className="flex items-center gap-1.5 mt-3 relative z-10 bg-white/5 w-max px-2.5 py-1 rounded-lg border border-white/10">
                        <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Last 24 Hours</span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group hover:border-amber-500/30 transition-all">
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-500/20 rounded-full blur-[40px]" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <span className="text-slate-400 text-sm font-medium">Suspicious Activity</span>
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                        </div>
                    </div>
                    <h3 className="text-4xl font-black text-white tracking-tight relative z-10">{d.suspiciousActivity || 0}</h3>
                    <div className="flex items-center gap-1.5 mt-3 relative z-10 bg-white/5 w-max px-2.5 py-1 rounded-lg border border-white/10">
                        <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Flagged Events</span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group hover:border-orange-500/30 transition-all">
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-orange-500/20 rounded-full blur-[40px]" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <span className="text-slate-400 text-sm font-medium">Webhook Failures</span>
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                            <Wifi className="w-5 h-5 text-orange-400" />
                        </div>
                    </div>
                    <h3 className="text-4xl font-black text-white tracking-tight relative z-10">{d.webhookFailures || 0}</h3>
                    <div className="flex items-center gap-1.5 mt-3 relative z-10 bg-white/5 w-max px-2.5 py-1 rounded-lg border border-white/10">
                        <span className="text-orange-400 text-xs font-bold uppercase tracking-wider">Failed Dispatches</span>
                    </div>
                </motion.div>
            </div>

            {/* Audit Logs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="glass-panel rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative">

                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="p-6 border-b border-white/5 flex items-center gap-3 relative z-10 bg-black/20">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <ShieldAlert className="w-4 h-4 text-brand-400" />
                    </div>
                    <h2 className="text-lg font-bold text-white">System Audit Trail</h2>
                </div>

                <div className="relative z-10">
                    {(!d.auditLogs || d.auditLogs.length === 0) ? (
                        <div className="text-center py-20">
                            <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">No Audit Logs</h3>
                            <p className="text-slate-500 text-sm font-medium">System activity and security events will appear here.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto custom-scrollbar">
                            <AnimatePresence>
                                {d.auditLogs.map((log, i) => {
                                    const isWarning = log.action?.toLowerCase().includes('fail') || log.action?.toLowerCase().includes('delete');
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors border-l-2 border-transparent group"
                                            style={{ borderLeftColor: isWarning ? 'rgba(244, 63, 94, 0.4)' : 'rgba(139, 92, 246, 0.4)' }}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1.5">
                                                    <span className="text-xs font-mono font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                                        {log.date ? new Date(log.date).toLocaleTimeString() : '00:00:00'}
                                                    </span>
                                                    <p className="text-white text-sm font-medium truncate group-hover:text-brand-300 transition-colors">
                                                        {log.action || 'Unknown Action'}
                                                    </p>
                                                    {isWarning && (
                                                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-brand-400 text-xs font-bold uppercase tracking-wider bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                                                        {log.user || 'System'}
                                                    </span>
                                                    <span className="text-slate-500 text-xs font-medium">
                                                        • IP: {log.ip || '-'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="shrink-0 flex items-center">
                                                <span className="text-slate-400 font-medium text-xs">
                                                    {log.date ? new Date(log.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Security;
