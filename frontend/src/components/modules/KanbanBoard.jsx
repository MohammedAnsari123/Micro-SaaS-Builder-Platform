import React, { useState, useEffect, useCallback } from 'react';
import { Columns, MoreHorizontal, Plus, RefreshCw, User, Calendar, Tag, Search, GripVertical, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const KanbanBoard = ({ instance }) => {
    const collectionName = instance?.collectionName || 'tasks';
    const title = instance?.config?.title || `${collectionName} Board`;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const columns = [
        { id: 'todo', title: 'Backlog', color: 'bg-slate-500', glow: 'shadow-slate-500/20' },
        { id: 'in-progress', title: 'In Flight', color: 'bg-blue-500', glow: 'shadow-blue-500/20' },
        { id: 'review', title: 'Audit', color: 'bg-amber-500', glow: 'shadow-amber-500/20' },
        { id: 'done', title: 'Deployed', color: 'bg-emerald-500', glow: 'shadow-emerald-500/20' }
    ];

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
            const res = await axios.get(`http://localhost:5000/api/v1/dynamic/${collectionName}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setData(res.data.data);
            }
        } catch (err) {
            console.error(`Failed to fetch Kanban ${collectionName}:`, err);
        } finally {
            setLoading(false);
        }
    }, [collectionName]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
            const res = await axios.put(`http://localhost:5000/api/v1/dynamic/${collectionName}/${id}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                setData(data.map(item => item._id === id ? res.data.data : item));
            }
        } catch (err) {
            console.error("Status update failed:", err);
        }
    };

    const getFilteredItems = (status) => {
        return data.filter(item => {
            const itemStatus = (item.status || 'todo').toLowerCase().replace('_', '-');
            const matchesStatus = itemStatus === status;
            const matchesSearch = (item.name || item.title || '').toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    };

    return (
        <div className="h-full flex flex-col group/kanban select-none">
            {/* Board Controls */}
            <div className="flex flex-wrap items-center justify-between mb-10 gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center border border-white/20 shadow-2xl shadow-indigo-500/20">
                        <Columns className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">{title}</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                                <Activity className="w-3 h-3" /> PIPELINE ACTIVE
                            </span>
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-widest tabular-nums">{data.length} Total Nodes</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Find records..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white focus:ring-2 focus:ring-indigo-500/50 w-64 transition-all"
                        />
                    </div>
                    <button onClick={fetchData} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-white transition-all">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                        <Plus className="w-4 h-4" /> Push Entry
                    </button>
                </div>
            </div>

            {/* The Board */}
            <div className="flex-1 overflow-x-auto custom-scrollbar-h pb-8">
                <div className="flex gap-8 h-full min-w-max px-2">
                    {columns.map(col => {
                        const items = getFilteredItems(col.id);
                        return (
                            <div key={col.id} className="w-80 flex flex-col bg-slate-900/40 border border-slate-800/80 rounded-[2.5rem] backdrop-blur-md overflow-hidden relative">
                                {/* Column Header */}
                                <div className="p-6 flex items-center justify-between border-b border-white/5 bg-slate-950/20">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2.5 h-2.5 rounded-full ${col.color} ${col.glow} shadow-sm`} />
                                        <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest">{col.title}</h3>
                                        <span className="ml-2 px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-black text-slate-500">
                                            {items.length}
                                        </span>
                                    </div>
                                    <motion.button whileHover={{ rotate: 90 }} className="text-slate-600 hover:text-white transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </motion.button>
                                </div>

                                {/* Cards List */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5 min-h-[500px]">
                                    {items.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center opacity-10 pointer-events-none">
                                            <Tag className="w-12 h-12 mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-center leading-loose">Void Cluster<br />Ready for Data</p>
                                        </div>
                                    ) : (
                                        <AnimatePresence mode='popLayout'>
                                            {items.map((item, idx) => (
                                                <motion.div
                                                    layout
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    key={item._id}
                                                    className="group bg-slate-800/60 border border-slate-700/40 p-5 rounded-3xl hover:bg-slate-800 hover:border-indigo-500/30 transition-all cursor-grab active:cursor-grabbing relative overflow-hidden"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <GripVertical className="w-3 h-3 text-slate-700 group-hover:text-slate-500" />
                                                            <span className="text-[10px] font-mono text-indigo-500/80 font-black">NODE-{item._id.slice(-4).toUpperCase()}</span>
                                                        </div>
                                                        <select
                                                            value={(item.status || 'todo').toLowerCase().replace('_', '-')}
                                                            onChange={(e) => handleUpdateStatus(item._id, e.target.value)}
                                                            className="bg-transparent text-[10px] font-black text-slate-600 border-none focus:ring-0 cursor-pointer hover:text-white uppercase transition-colors"
                                                        >
                                                            {columns.map(c => <option key={c.id} value={c.id} className="bg-slate-900 text-white font-sans">{c.title}</option>)}
                                                        </select>
                                                    </div>

                                                    <h4 className="text-[13px] font-bold text-slate-100 leading-relaxed mb-6 group-hover:text-white">
                                                        {item.name || item.title || 'Nameless Record'}
                                                    </h4>

                                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-black text-blue-500">
                                                                {item.assignedTo ? item.assignedTo.slice(0, 1) : 'S'}
                                                            </div>
                                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">System Alloc</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-slate-700">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            <span className="text-[9px] font-black uppercase">Recent</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    )}
                                </div>

                                {/* Footer Action */}
                                <div className="p-5 bg-slate-950/10">
                                    <button className="w-full py-3.5 flex justify-center items-center gap-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 hover:bg-slate-800 hover:text-white transition-all border border-transparent hover:border-slate-700 shadow-inner">
                                        <Plus className="w-4 h-4" /> Drop Payload
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default KanbanBoard;
