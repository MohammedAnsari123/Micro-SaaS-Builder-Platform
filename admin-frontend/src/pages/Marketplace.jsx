import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, CheckCircle, XCircle, Loader2, RefreshCw, Star, Layers, ShieldCheck, Tag } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000/api/v1';

const Marketplace = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API}/admin/marketplace`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) setItems(data.data);
        } catch (err) {
            console.error('Failed to fetch marketplace items', err);
        } finally { setLoading(false); }
    };

    const handleAction = async (id, action) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`${API}/admin/marketplace/${id}/${action}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchItems();
        } catch { alert(`Failed to ${action}`); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] relative z-10">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-t-2 border-brand-500 border-l-2 border-transparent animate-spin" />
                    <div className="w-16 h-16 rounded-full border-r-2 border-emerald-500 border-b-2 border-transparent animate-spin absolute inset-0 animation-delay-500" />
                    <Store className="w-6 h-6 text-brand-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 relative z-10 pb-10">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-r from-brand-600/10 to-teal-600/10 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 mb-2"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-teal-500 p-[1px]">
                            <div className="w-full h-full bg-[#0f172a] rounded-[10px] flex items-center justify-center">
                                <Store className="w-5 h-5 text-teal-400" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Marketplace Moderation</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 font-medium ml-1"
                    >
                        Approve, reject, and curate third-party published assets
                    </motion.p>
                </div>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={fetchItems}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all flex items-center gap-2 group shadow-lg"
                >
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500 text-teal-400" />
                    <span className="text-sm font-bold">Refresh Submissions</span>
                </motion.button>
            </div>

            {/* Premium Table Layout */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-panel rounded-3xl overflow-hidden shadow-2xl relative"
            >
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="overflow-x-auto relative z-10 custom-scrollbar pb-2">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-black/20 border-b border-white/5 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                                <th className="p-5 font-semibold">Published Asset</th>
                                <th className="p-5 font-semibold">Creator details</th>
                                <th className="p-5 font-semibold">Pricing model</th>
                                <th className="p-5 font-semibold">Quality score</th>
                                <th className="p-5 text-right font-semibold text-slate-500">Moderation Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan="5">
                                            <div className="py-24 text-center">
                                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-5 border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
                                                    <ShieldCheck className="w-10 h-10 text-slate-500" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2">Queue is Empty</h3>
                                                <p className="text-slate-400 font-medium">All marketplace submissions have been moderated.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item, index) => (
                                        <motion.tr
                                            key={item._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="hover:bg-white/[0.03] transition-colors group relative"
                                        >
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-teal-500/30 transition-colors shadow-lg">
                                                        <Layers className="w-6 h-6 text-teal-400" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-[16px] group-hover:text-teal-300 transition-colors">{item.name}</div>
                                                        <div className="text-slate-500 text-xs mt-1 font-medium flex items-center gap-1.5">
                                                            <Tag className="w-3.5 h-3.5" /> Core feature extension
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-medium">
                                                    {item.creatorName || 'Unknown Studio'}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                {item.price === 0 ? (
                                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wider">Free</span>
                                                ) : (
                                                    <span className="text-white font-bold text-lg tracking-tight">
                                                        ${((item.price || 0) / 100).toFixed(2)}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full w-max">
                                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                    <span className="text-amber-400 font-bold">{item.rating?.toFixed(1) || '0.0'}</span>
                                                </div>
                                            </td>
                                            <td className="p-5 text-right relative">
                                                <div className="flex items-center justify-end gap-2">
                                                    {item.isPublic ? (
                                                        <>
                                                            <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center gap-1.5 text-xs font-bold uppercase">
                                                                <CheckCircle className="w-4 h-4" /> Approved
                                                            </div>
                                                            <button
                                                                onClick={() => handleAction(item._id, 'reject')}
                                                                className="px-3.5 py-2 hover:bg-white/5 text-slate-400 hover:text-rose-400 rounded-xl transition-all flex items-center gap-2 text-xs font-bold uppercase opacity-0 group-hover:opacity-100 absolute right-32"
                                                                title="Revoke Approval"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl flex items-center gap-1.5 text-xs font-bold uppercase">
                                                                <XCircle className="w-4 h-4" /> Rejected
                                                            </div>
                                                            <button
                                                                onClick={() => handleAction(item._id, 'approve')}
                                                                className="px-3.5 py-2 hover:bg-white/5 text-slate-400 hover:text-emerald-400 rounded-xl transition-all flex items-center gap-2 text-xs font-bold uppercase opacity-0 group-hover:opacity-100 absolute right-32"
                                                                title="Approve Asset"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Marketplace;
