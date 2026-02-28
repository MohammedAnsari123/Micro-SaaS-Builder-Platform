import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutDashboard, Loader2, Share2, ArrowUpRight, Copy, Database, Search, Globe, Palette, Clock, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Color theme map for template badges
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

const Tenants = () => {
    const [websites, setWebsites] = useState([]);
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                // Fetch both cloned websites AND user's tools
                const [cloneRes, toolsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/v1/user/cloned-websites', { headers }).catch(() => ({ data: { data: [] } })),
                    axios.get('http://localhost:5000/api/v1/tools', { headers }).catch(() => ({ data: { data: [] } }))
                ]);

                if (cloneRes.data.success) setWebsites(cloneRes.data.data);
                if (toolsRes.data.success) setTools(toolsRes.data.data);
            } catch (err) {
                console.error("Failed to fetch ecosystem data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Combine cloned websites + standalone tools into one list
    const allApps = [
        ...websites.map(w => ({ ...w, source: 'clone' })),
        ...tools.filter(t => !websites.some(w => w.toolId === t._id)).map(t => ({
            _id: t._id,
            toolId: t._id,
            name: t.name,
            slug: t.slug,
            templateName: null,
            colorTheme: 'blue',
            category: t.category || 'Custom',
            tags: t.tags || [],
            description: t.description || '',
            collections: t.versions?.[t.currentVersion - 1]?.schemas?.length || 0,
            pages: t.versions?.[t.currentVersion - 1]?.pages || [],
            isPublic: t.isPublic,
            cloneSource: 'custom',
            clonedAt: t.createdAt,
            source: 'tool'
        }))
    ];

    const filtered = filter
        ? allApps.filter(a => a.name.toLowerCase().includes(filter.toLowerCase()) || a.category?.toLowerCase().includes(filter.toLowerCase()))
        : allApps;

    const formatDate = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Your Deployed Ecosystem</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">Manage your cloned websites and custom SaaS apps</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/templates" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-xl font-bold transition-all text-sm border border-white/5">
                        <Layers className="w-4 h-4" /> Browse Templates
                    </Link>
                    <Link to="/builder/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                        <Plus className="w-4 h-4" /> New AI Agent
                    </Link>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Apps</div>
                    <div className="text-2xl font-bold text-white">{allApps.length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Cloned</div>
                    <div className="text-2xl font-bold text-blue-400">{websites.length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Custom Built</div>
                    <div className="text-2xl font-bold text-emerald-400">{allApps.filter(a => a.source === 'tool').length}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Published</div>
                    <div className="text-2xl font-bold text-violet-400">{allApps.filter(a => a.isPublic).length}</div>
                </div>
            </div>

            {/* App Grid */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex bg-slate-800 rounded-xl p-1 border border-white/5">
                        <button className="px-4 py-1.5 text-xs font-bold bg-slate-700 text-white rounded-lg">All ({allApps.length})</button>
                        <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-300">Cloned ({websites.length})</button>
                        <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-300">Custom</button>
                    </div>
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Filter apps..."
                            className="bg-slate-800 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-blue-500/50 w-48 transition-all"
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 text-center text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                        <p className="font-bold uppercase tracking-widest text-[11px]">Scanning Deployed Websites...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                            <Globe className="w-8 h-8 text-slate-600" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">No websites yet</h3>
                        <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">Clone a template from the gallery or build one with AI to get started.</p>
                        <Link to="/templates" className="inline-flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-6 py-2.5 rounded-xl font-bold border border-blue-500/20 transition-all">
                            <Layers className="w-4 h-4" /> Browse Templates
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
                        <AnimatePresence>
                            {filtered.map((app, i) => (
                                <motion.div
                                    key={app._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    className="group bg-slate-800/40 border border-white/5 rounded-2xl p-5 hover:bg-slate-800/70 hover:border-slate-700 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${getTheme(app.colorTheme)} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <LayoutDashboard className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-[15px] leading-tight">{app.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {app.source === 'clone' && app.templateName && (
                                                        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                                                            {app.templateName}
                                                        </span>
                                                    )}
                                                    {app.source === 'tool' && (
                                                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                                            Custom Build
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] font-bold text-slate-500">{app.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                            Active
                                        </span>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="flex items-center gap-4 mb-4 text-[11px] text-slate-500 font-medium">
                                        <span className="flex items-center gap-1">
                                            <Database className="w-3 h-3" /> {app.collections} Collections
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Layers className="w-3 h-3" /> {app.pages?.length || 0} Pages
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {formatDate(app.clonedAt)}
                                        </span>
                                    </div>

                                    {/* Pages Preview */}
                                    {app.pages && app.pages.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {app.pages.slice(0, 4).map((page, j) => (
                                                <span key={j} className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-white/5">
                                                    {page}
                                                </span>
                                            ))}
                                            {app.pages.length > 4 && (
                                                <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-md border border-white/5">
                                                    +{app.pages.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                                        <Link
                                            to={`/builder/${app.toolId}`}
                                            className="flex-1 text-center py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl font-bold transition-all text-xs border border-blue-500/20"
                                        >
                                            Open Builder
                                        </Link>
                                        {app.isPublic && (
                                            <span className="py-2 px-3 bg-slate-800 text-slate-400 rounded-xl font-bold text-xs border border-white/5 flex items-center gap-1">
                                                <Globe className="w-3 h-3" /> Live
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tenants;
