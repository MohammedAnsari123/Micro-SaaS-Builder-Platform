import React, { useState, useEffect, useCallback } from 'react';
import { Columns, MoreHorizontal, Plus, RefreshCw, User, Calendar, Tag } from 'lucide-react';
import axios from 'axios';

const KanbanBoard = ({ instance }) => {
    const collectionName = instance?.collectionName || 'Tasks';
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { id: 'todo', title: 'To Do', color: 'bg-slate-500', border: 'border-slate-500/20' },
        { id: 'in_progress', title: 'In Progress', color: 'bg-blue-500', border: 'border-blue-500/20' },
        { id: 'review', title: 'Needs Review', color: 'bg-amber-500', border: 'border-amber-500/20' },
        { id: 'done', title: 'Completed', color: 'bg-emerald-500', border: 'border-emerald-500/20' }
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

    const getItemsByStatus = (status) => {
        return data.filter(item => (item.status || 'todo').toLowerCase() === status.toLowerCase());
    };

    return (
        <div className="h-full flex flex-col group/kanban">
            {/* Board Header */}
            <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center border border-white/10 shadow-xl shadow-blue-500/10">
                        <Columns className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">{instance?.config?.title || `${collectionName} Board`}</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] uppercase font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">Live Pipeline</span>
                            <span className="text-xs text-slate-500 font-medium">Synced with {collectionName} collection</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex -space-x-3 mr-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-9 h-9 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center overflow-hidden transition-transform hover:translate-y-[-2px] hover:z-10 cursor-pointer">
                                <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="User" />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={fetchData}
                        className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-white hover:border-slate-700 transition-all flex items-center justify-center"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                        <Plus className="w-4 h-4" /> New Task
                    </button>
                </div>
            </div>

            {/* Scrollable Board */}
            <div className="flex-1 overflow-x-auto custom-scrollbar pb-6 relative">
                <div className="flex gap-6 h-full min-w-max px-1">
                    {columns.map(col => {
                        const items = getItemsByStatus(col.id);
                        return (
                            <div key={col.id} className="w-80 flex flex-col bg-slate-900/30 border border-slate-800/50 rounded-[2rem] overflow-hidden backdrop-blur-sm">
                                {/* Column Header */}
                                <div className="p-5 flex items-center justify-between bg-slate-900/40 border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${col.color} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
                                        <h3 className="font-bold text-slate-200 tracking-tight">{col.title}</h3>
                                        <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-black text-slate-500">
                                            {items.length}
                                        </span>
                                    </div>
                                    <button className="text-slate-600 hover:text-white transition-colors p-1">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Cards Empty State */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar min-h-[500px] relative">
                                    {items.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center opacity-20 py-20 pointer-events-none">
                                            <Tag className="w-10 h-10 mb-4" />
                                            <p className="text-xs font-bold uppercase tracking-widest text-center">No Active<br />Entities</p>
                                        </div>
                                    ) : (
                                        items.map((item, idx) => (
                                            <div
                                                key={item._id}
                                                className="group bg-slate-800/80 border border-slate-700/50 p-5 rounded-2xl shadow-sm hover:shadow-2xl hover:border-blue-500/30 hover:bg-slate-800 transition-all cursor-grab active:cursor-grabbing relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/0 group-hover:bg-blue-500 transition-all" />

                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase tracking-tighter border border-blue-500/20">
                                                        REF-{item._id.slice(-4).toUpperCase()}
                                                    </div>
                                                    <select
                                                        value={item.status || 'todo'}
                                                        onChange={(e) => handleUpdateStatus(item._id, e.target.value)}
                                                        className="bg-transparent text-[10px] font-bold text-slate-500 border-none focus:ring-0 cursor-pointer hover:text-white"
                                                    >
                                                        {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                                    </select>
                                                </div>

                                                <h4 className="text-sm font-bold text-white mb-4 leading-relaxed line-clamp-2">
                                                    {item.name || item.title || 'Untitled Record'}
                                                </h4>

                                                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
                                                            <User className="w-3 h-3 text-indigo-400" />
                                                        </div>
                                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">System Agent</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-slate-600">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        <span className="text-[10px] font-bold">LATEST</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Footer Action */}
                                <div className="p-4 bg-slate-900/40">
                                    <button className="w-full py-3 flex justify-center items-center gap-2 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-800 hover:text-white transition-all border border-transparent hover:border-slate-700">
                                        <Plus className="w-3.5 h-3.5" /> Push Card
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

