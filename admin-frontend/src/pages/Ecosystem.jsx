import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, ShieldAlert, Trash2, Loader2, RefreshCw, ExternalLink, User, LayoutTemplate, CheckCircle, Ban } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000/api/v1';

const Ecosystem = () => {
    const [clones, setClones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchClones(); }, []);

    const fetchClones = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API}/admin/clones`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                console.log('Fetched Clones:', data.data);
                setClones(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch ecosystem clones', err);
        }
        finally { setLoading(false); }
    };

    const handleUpdateStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'archived' : 'active';
        const actionLabel = currentStatus === 'active' ? 'Ban/Archive' : 'Activate';

        if (!window.confirm(`Are you sure you want to ${actionLabel} this site?`)) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`${API}/admin/clones/${id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchClones();
        } catch (err) {
            alert('Failed to update site status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("CRITICAL: Are you sure you want to permanently REMOVE this site from the ecosystem? This action cannot be undone.")) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${API}/admin/clones/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchClones();
        } catch (err) {
            alert('Failed to remove site');
        }
    };

    const filtered = clones.filter(c =>
        c.siteName?.toLowerCase().includes(search.toLowerCase()) ||
        c.owner?.toLowerCase().includes(search.toLowerCase()) ||
        c.domain?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] relative z-10">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-t-2 border-brand-500 border-l-2 border-transparent animate-spin" />
                    <div className="w-16 h-16 rounded-full border-r-2 border-emerald-500 border-b-2 border-transparent animate-spin absolute inset-0 animation-delay-500" />
                    <Globe className="w-6 h-6 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 relative z-10 pb-10">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-r from-emerald-600/10 to-blue-600/10 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 mb-2"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-600 p-[1px]">
                            <div className="w-full h-full bg-[#0f172a] rounded-[10px] flex items-center justify-center">
                                <Globe className="w-5 h-5 text-emerald-400" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">All Deployed Sites</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 font-medium ml-1"
                    >
                        Monitor and manage all provisioned Micro-SaaS instances ({clones.length} total)
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-3"
                >
                    <button onClick={fetchClones} className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all flex items-center gap-2 group">
                        <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
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
                        <Search className="w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by site name, owner, or domain..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/5 transition-all text-sm shadow-inner"
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
                <div className="overflow-x-auto relative z-10 custom-scrollbar pb-2">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-black/20 border-b border-white/5 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                                <th className="p-5 font-semibold">Instance / Site</th>
                                <th className="p-5 font-semibold">Owner & Domain</th>
                                <th className="p-5 font-semibold">Template</th>
                                <th className="p-5 font-semibold">Status</th>
                                <th className="p-5 text-center font-semibold text-slate-500">Global Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="5">
                                            <div className="py-20 text-center">
                                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                                                    <Globe className="w-8 h-8 text-slate-500" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2">No provisioned sites found</h3>
                                                <p className="text-slate-400 text-sm">Deploy templates from the user dashboard to see them here.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((c, index) => {
                                        return (
                                            <motion.tr
                                                key={c._id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                className="hover:bg-white/[0.03] transition-colors group cursor-pointer border-l-[3px] border-transparent hover:border-emerald-500"
                                            >
                                                <td className="p-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-emerald-500/30 transition-colors shadow-lg">
                                                            <LayoutTemplate className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white text-[16px] group-hover:text-emerald-300 transition-colors">{c.siteName}</div>
                                                            <div className="text-slate-500 text-[11px] mt-1 font-bold uppercase tracking-widest">
                                                                Cloned {new Date(c.clonedAt).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex items-center gap-2 text-white font-medium">
                                                        <User className="w-3.5 h-3.5 text-slate-500" /> {c.owner}
                                                    </div>
                                                    <div className="text-emerald-400/80 text-xs flex items-center gap-1 mt-1 font-medium italic">
                                                        <ExternalLink className="w-3 h-3" />
                                                        <a
                                                            href={`http://localhost:5173/site/${c.templateSlug || 'unknown-template'}/${c.emailPrefix || 'unknown-user'}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hover:underline"
                                                        >
                                                            {c.domain} (Preview)
                                                        </a>
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-bold text-[11px] uppercase tracking-wider">
                                                        {c.template}
                                                    </span>
                                                </td>
                                                <td className="p-5">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                                        {c.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                                                        {c.status}
                                                    </span>
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(c._id, c.status); }}
                                                            className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-all group/btn border border-transparent ${c.status === 'active' ? 'hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30' : 'hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30'}`}
                                                            title={c.status === 'active' ? 'Ban Site' : 'Restore Site'}
                                                        >
                                                            {c.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(c._id); }}
                                                            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-rose-600/30 text-slate-400 hover:text-rose-500 border border-transparent hover:border-rose-600/30 flex items-center justify-center transition-all"
                                                            title="Permanent Remove"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-rose-500" />
                                                        </button>
                                                    </div>
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

export default Ecosystem;
