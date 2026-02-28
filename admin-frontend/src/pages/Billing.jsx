import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, TrendingUp, ArrowUpRight, Loader2, RefreshCw, DollarSign, ListOrdered, Wallet, Receipt } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000/api/v1';

const Billing = () => {
    const [billing, setBilling] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchBilling(); }, []);

    const fetchBilling = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API}/admin/billing`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) setBilling(data.data);
        } catch (err) {
            console.error('Failed to fetch billing data', err);
        } finally { setLoading(false); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] relative z-10">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-t-2 border-brand-500 border-l-2 border-transparent animate-spin" />
                    <div className="w-16 h-16 rounded-full border-r-2 border-emerald-500 border-b-2 border-transparent animate-spin absolute inset-0 animation-delay-500" />
                    <CreditCard className="w-6 h-6 text-brand-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
            </div>
        );
    }

    const b = billing || {};

    return (
        <div className="space-y-8 relative z-10 pb-10">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-r from-brand-600/10 to-emerald-600/10 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 mb-2"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-emerald-500 p-[1px]">
                            <div className="w-full h-full bg-[#0f172a] rounded-[10px] flex items-center justify-center">
                                <Wallet className="w-5 h-5 text-emerald-400" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Revenue Operations</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 font-medium ml-1"
                    >
                        Monitor platform revenue, active subscriptions, and cash flow
                    </motion.p>
                </div>

                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={fetchBilling}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all flex items-center gap-2 group shadow-lg"
                >
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500 text-emerald-400" />
                    <span className="text-sm font-bold">Refresh Finances</span>
                </motion.button>
            </div>

            {/* Revenue Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-[40px]" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <span className="text-slate-400 text-sm font-medium">Platform Total Volume</span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-emerald-400" />
                        </div>
                    </div>
                    <h3 className="text-4xl font-black text-white tracking-tight relative z-10 flex items-start gap-1">
                        <span className="text-2xl text-emerald-500 mt-1">$</span>
                        {((b.totalRevenue || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-3 relative z-10 bg-white/5 w-max px-2.5 py-1 rounded-lg border border-white/10">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Lifetime Gross</span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/20 rounded-full blur-[40px]" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <span className="text-slate-400 text-sm font-medium">Monthly Recuring (MRR)</span>
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                        </div>
                    </div>
                    <h3 className="text-4xl font-black text-white tracking-tight relative z-10 flex items-start gap-1">
                        <span className="text-2xl text-blue-500 mt-1">$</span>
                        {((b.monthlyRevenue || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-3 relative z-10 bg-white/5 w-max px-2.5 py-1 rounded-lg border border-white/10">
                        <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Current Month</span>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group hover:border-brand-500/30 transition-all">
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-brand-500/20 rounded-full blur-[40px]" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <span className="text-slate-400 text-sm font-medium">Active Subscriptions</span>
                        <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-brand-400" />
                        </div>
                    </div>
                    <h3 className="text-4xl font-black text-white tracking-tight relative z-10">
                        {(b.activeSubscriptions || 0).toLocaleString()}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-3 relative z-10 bg-white/5 w-max px-2.5 py-1 rounded-lg border border-white/10">
                        <ListOrdered className="w-3.5 h-3.5 text-brand-400" />
                        <span className="text-brand-400 text-xs font-bold uppercase tracking-wider">Paid Tiers</span>
                    </div>
                </motion.div>
            </div>

            {/* Transactions Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-panel rounded-3xl overflow-hidden shadow-2xl relative"
            >
                <div className="absolute top-0 right-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="p-6 border-b border-white/5 flex items-center gap-3 relative z-10 bg-black/20">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        <Receipt className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Latest Transactions</h2>
                </div>

                <div className="overflow-x-auto relative z-10 custom-scrollbar pb-2">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-black/40 border-b border-white/5 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                                <th className="p-5 font-semibold">Customer / Alias</th>
                                <th className="p-5 font-semibold">Payment Amount</th>
                                <th className="p-5 font-semibold">Subscribed Plan</th>
                                <th className="p-5 font-semibold text-right">Settlement Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {(!b.transactions || b.transactions.length === 0) ? (
                                    <tr>
                                        <td colSpan="4">
                                            <div className="py-20 text-center">
                                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                                                    <CreditCard className="w-8 h-8 text-slate-500" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2">No Transactions Found</h3>
                                                <p className="text-slate-400 font-medium">When tenants make payments, they will appear here.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    b.transactions.map((tx, index) => (
                                        <motion.tr
                                            key={tx.id || index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="hover:bg-white/[0.03] transition-colors group relative"
                                        >
                                            <td className="p-5">
                                                <span className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                                                    {tx.user || '-'}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <div className="font-bold text-emerald-400 text-base">
                                                    ${((tx.amount || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                                                    {tx.plan || '-'}
                                                </span>
                                            </td>
                                            <td className="p-5 text-slate-400 font-medium text-right text-xs">
                                                {tx.date ? new Date(tx.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
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

export default Billing;
