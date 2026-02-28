import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, Layers, LayoutDashboard, Database, Clock, Plus, Loader2, ArrowUpRight, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Color theme map for template icon badges
const themeColors = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
    emerald: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-400',
    violet: 'from-violet-500/20 to-violet-600/20 border-violet-500/30 text-violet-400',
    rose: 'from-rose-500/20 to-rose-600/20 border-rose-500/30 text-rose-400',
    teal: 'from-teal-500/20 to-teal-600/20 border-teal-500/30 text-teal-400',
    lime: 'from-lime-500/20 to-lime-600/20 border-lime-500/30 text-lime-400',
    cyan: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-400',
    orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-400',
    sky: 'from-sky-500/20 to-sky-600/20 border-sky-500/30 text-sky-400',
    fuchsia: 'from-fuchsia-500/20 to-fuchsia-600/20 border-fuchsia-500/30 text-fuchsia-400',
    pink: 'from-pink-500/20 to-pink-600/20 border-pink-500/30 text-pink-400',
    indigo: 'from-indigo-500/20 to-indigo-600/20 border-indigo-500/30 text-indigo-400',
    red: 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400',
    slate: 'from-slate-500/20 to-slate-600/20 border-slate-500/30 text-slate-400',
};

const getTheme = (color) => themeColors[color] || themeColors['blue'];

const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const Marketplace = () => {
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchClonedWebsites = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('http://localhost:5000/api/v1/user/cloned-websites', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data.success) {
                    setWebsites(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch cloned websites", err);
            } finally {
                setLoading(false);
            }
        };
        fetchClonedWebsites();
    }, []);

    const filtered = filter
        ? websites.filter(w =>
            w.name.toLowerCase().includes(filter.toLowerCase()) ||
            w.templateName?.toLowerCase().includes(filter.toLowerCase()) ||
            w.category?.toLowerCase().includes(filter.toLowerCase())
        )
        : websites;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">My Cloned Websites</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">All the templates you've cloned and customized</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/templateSites" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-xl font-bold transition-all text-sm border border-white/5">
                        <Layers className="w-4 h-4" /> Browse Templates
                    </Link>
                    <Link to="/builder/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                        <Plus className="w-4 h-4" /> Build with AI
                    </Link>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search your cloned websites..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                    />
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
                    {websites.length} Website{websites.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Loading your websites...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24 bg-slate-900/50 rounded-3xl border border-slate-800">
                    <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-5 border border-white/5">
                        <Globe className="w-9 h-9 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No cloned websites yet</h3>
                    <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
                        Browse the template gallery and clone one to see it appear here.
                    </p>
                    <Link to="/templateSites" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
                        <Layers className="w-4 h-4" /> Browse Templates
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    <AnimatePresence>
                        {filtered.map((site, i) => (
                            <motion.div
                                key={site._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition-all flex flex-col"
                            >
                                {/* Card Header with Theme Color Strip */}
                                <div className={`h-1.5 bg-gradient-to-r ${getTheme(site.colorTheme).replace('border-', 'to-').replace('text-', 'from-')}`} />

                                <div className="p-6 flex-grow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTheme(site.colorTheme)} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <LayoutDashboard className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-[16px] leading-tight group-hover:text-blue-400 transition-colors">{site.name}</h3>
                                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                                    Cloned from <span className="text-blue-400">{site.templateName}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shrink-0">
                                            Active
                                        </span>
                                    </div>

                                    {/* Description */}
                                    {site.description && (
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">{site.description}</p>
                                    )}

                                    {/* Meta Info */}
                                    <div className="flex items-center gap-4 mb-4 text-[11px] text-slate-500 font-medium">
                                        <span className="flex items-center gap-1.5">
                                            <Database className="w-3.5 h-3.5 text-blue-400/50" /> {site.collections} Collections
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Layers className="w-3.5 h-3.5 text-violet-400/50" /> {site.pages?.length || 0} Pages
                                        </span>
                                    </div>

                                    {/* Page Tags */}
                                    {site.pages && site.pages.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {site.pages.slice(0, 4).map((page, j) => (
                                                <span key={j} className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-white/5">
                                                    {page}
                                                </span>
                                            ))}
                                            {site.pages.length > 4 && (
                                                <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-md border border-white/5">
                                                    +{site.pages.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Tags */}
                                    {site.tags && site.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {site.tags.map(tag => (
                                                <span key={tag} className="text-[10px] px-2 py-0.5 bg-blue-500/5 text-blue-400/70 rounded-md border border-blue-500/10">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Card Footer */}
                                <div className="bg-slate-800/30 p-4 border-t border-slate-800 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{formatDate(site.clonedAt)}</span>
                                        <span className="mx-1 text-slate-700">•</span>
                                        <Palette className="w-3.5 h-3.5" />
                                        <span className="capitalize">{site.colorTheme}</span>
                                    </div>
                                    <Link
                                        to={`/builder/${site.toolId}`}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl font-bold transition-all text-xs border border-blue-500/20"
                                    >
                                        Open <ArrowUpRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
