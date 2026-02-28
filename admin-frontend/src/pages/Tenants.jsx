import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Search, Eye, Loader2, RefreshCw, Zap, Rocket, Box, Database, ExternalLink, ArrowRight } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000/api/v1';

const Tenants = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchTenants(); }, []);

    const fetchTenants = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API}/admin/tenants`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) setTenants(data.data);
        } catch (err) {
            console.error('Failed to fetch tenants', err);
        }
        finally { setLoading(false); }
    };

    const filtered = tenants.filter(t => t.name?.toLowerCase().includes(search.toLowerCase()));

    const getPlanConfig = (plan) => {
        switch (plan) {
            case 'pro': return { icon: Rocket, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Pro' };
            case 'basic': return { icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', label: 'Basic' };
            default: return { icon: Box, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-white/10', label: 'Free' };
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] relative z-10">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-t-2 border-brand-500 border-l-2 border-transparent animate-spin" />
                    <div className="w-16 h-16 rounded-full border-r-2 border-blue-500 border-b-2 border-transparent animate-spin absolute inset-0 animation-delay-500" />
                    <Building2 className="w-6 h-6 text-brand-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 relative z-10 pb-10">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-r from-brand-600/10 to-blue-600/10 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 mb-2"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-emerald-600 p-[1px]">
                            <div className="w-full h-full bg-[#0f172a] rounded-[10px] flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-emerald-400" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Tenant Organizations</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 font-medium ml-1"
                    >
                        Manage workspaces and platform subscribers ({tenants.length} total)
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-3"
                >
                    <button onClick={fetchTenants} className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all flex items-center gap-2 group">
                        <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                    <button onClick={() => alert("Tenant deployments must be initiated via the public onboarding flow.")} className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                        + Deploy Tenant
                    </button>
                </motion.div>
            </div>

            {/* Filters & Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center"
            >
                <div className="relative w-full max-w-lg group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search tenants by name or domain..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 focus:bg-white/5 transition-all text-sm shadow-inner"
                    />
                </div>
            </motion.div>

            {/* Premium Glass Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-panel rounded-3xl overflow-hidden shadow-2xl relative"
            >
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="overflow-x-auto relative z-10 custom-scrollbar pb-2">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-black/20 border-b border-white/5 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                                <th className="p-5 font-semibold">Workspace</th>
                                <th className="p-5 font-semibold">Active Plan</th>
                                <th className="p-5 font-semibold">Resources</th>
                                <th className="p-5 font-semibold">Provisioned</th>
                                <th className="p-5 text-center font-semibold text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="5">
                                            <div className="py-20 text-center">
                                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                                                    <Building2 className="w-8 h-8 text-slate-500" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2">No organizations found</h3>
                                                <p className="text-slate-400 text-sm">Deploy your first tenant or broaden your search.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((t, index) => {
                                        const planCfg = getPlanConfig(t.plan);
                                        const PlanIcon = planCfg.icon;

                                        return (
                                            <motion.tr
                                                key={t._id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                className="hover:bg-white/[0.03] transition-colors group cursor-pointer border-l-[3px] border-transparent hover:border-emerald-500"
                                            >
                                                <td className="p-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-emerald-500/30 transition-colors shadow-lg">
                                                            <Building2 className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white text-[16px] group-hover:text-emerald-300 transition-colors">{t.name}</div>
                                                            <div className="text-slate-500 text-xs flex items-center gap-1 mt-1 font-medium">
                                                                <ExternalLink className="w-3 h-3" /> {t.name.toLowerCase().replace(/\s+/g, '-')}.microsaas.dev
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${planCfg.bg} ${planCfg.color} border ${planCfg.border} shadow-[0_0_15px_rgba(0,0,0,0.1)]`}>
                                                        <PlanIcon className="w-3.5 h-3.5" />
                                                        {planCfg.label}
                                                    </span>
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex items-center gap-2">
                                                        <Database className="w-4 h-4 text-slate-400" />
                                                        <span className="text-slate-300 font-semibold">{t.toolCount || 0} Tools Deployed</span>
                                                    </div>
                                                    {/* Fake progress bar depicting tool usage */}
                                                    <div className="w-32 h-1.5 bg-black/30 rounded-full mt-2 overflow-hidden border border-white/5">
                                                        <div
                                                            className={`h-full rounded-full ${t.plan === 'pro' ? 'bg-amber-400 w-3/4' : t.plan === 'basic' ? 'bg-cyan-400 w-1/2' : 'bg-slate-400 w-1/4'}`}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-5 text-slate-400 font-medium">
                                                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                                </td>
                                                <td className="p-5 text-center relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open(`http://${t.name.toLowerCase().replace(/\s+/g, '-')}.microsaas.dev`, '_blank');
                                                        }}
                                                        className="w-10 h-10 mx-auto rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 border border-transparent hover:border-emerald-500/30 flex items-center justify-center transition-all group/btn"
                                                        title="Launch Workspace"
                                                    >
                                                        <ArrowRight className="w-4 h-4 group-hover/btn:-rotate-45 transition-transform" />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        );
                                    })
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Tenants;
