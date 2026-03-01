import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, LayoutList, Plus, Edit2, Trash2, Search, RefreshCw, X, Eye, Code, ChevronRight, FileJson } from 'lucide-react';
import axios from 'axios';

const CrudTable = ({ instance }) => {
    const collectionName = instance?.collectionName || 'Data';
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newRecord, setNewRecord] = useState({});
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'json'

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
            console.error(`Failed to fetch ${collectionName} data:`, err);
        } finally {
            setLoading(false);
        }
    }, [collectionName]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddRecord = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
            const res = await axios.post(`http://localhost:5000/api/v1/dynamic/${collectionName}`, newRecord, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setData([...data, res.data.data]);
                setShowAddModal(false);
                setNewRecord({});
            }
        } catch (err) {
            console.error("Add record failed:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Permanent deletion - process with caution?")) return;
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:5000/api/v1/dynamic/${collectionName}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(data.filter(item => item._id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const filteredData = data.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Filter out internal MongoDB / System fields
    const getVisibleFields = (item) => {
        return Object.keys(item).filter(key =>
            !['_id', 'tenantId', '__v', 'createdAt', 'updatedAt'].includes(key)
        );
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl h-full flex flex-col group/table">
            {/* Action Bar */}
            <div className="p-6 border-b border-slate-800 bg-slate-950/20 backdrop-blur-xl sticky top-0 z-20 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20 transition-transform group-hover/table:rotate-3 shadow-lg shadow-indigo-500/10">
                        <Table className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white capitalize">{collectionName} Engine</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Dynamic Data Matrix</span>
                            {loading && <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group/search">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/search:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search records..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 pr-4 py-2.5 bg-slate-800/40 border border-slate-700/50 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64 transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> New Record
                    </button>
                    <div className="flex bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <LayoutList className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('json')}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'json' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <FileJson className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* List View */}
            <div className="flex-1 overflow-auto custom-scrollbar relative">
                {loading && data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px]">
                        <div className="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest animate-pulse">Synchronizing Cluster...</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-slate-600">
                        <Code className="w-16 h-16 mb-4 opacity-10" />
                        <p className="text-sm font-black uppercase tracking-widest opacity-30">No Data Signatures Found</p>
                    </div>
                ) : viewMode === 'list' ? (
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/40 border-b border-slate-800/50">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Descriptor</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Attributes</th>
                                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {filteredData.map((item) => (
                                <tr key={item._id} className="hover:bg-blue-500/5 transition-all group/row">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono text-blue-400">
                                                {item._id.slice(-2)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-200">{item.name || item.title || 'Record #' + item._id.slice(-4)}</span>
                                                <span className="text-[10px] font-mono text-slate-600 uppercase tracking-tighter">HEX: {item._id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 flex-wrap max-w-lg">
                                            {getVisibleFields(item).map(key => (
                                                <div key={key} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/40 border border-slate-800 rounded-lg group/pill hover:border-slate-700 transition-colors">
                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight">{key}:</span>
                                                    <span className="text-xs text-slate-300 tabular-nums">
                                                        {typeof item[key] === 'object' ? '{...}' : String(item[key])}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover/row:opacity-100 transition-all scale-95 group-hover/row:scale-100">
                                            <button onClick={() => setSelectedRecord(item)} className="p-2 hover:bg-slate-800 text-slate-500 hover:text-white rounded-lg transition-all" title="Inspect">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-blue-500/10 text-slate-500 hover:text-blue-400 rounded-lg transition-all">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(item._id)} className="p-2 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-lg transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-8 bg-slate-950/30 h-full font-mono text-xs text-blue-400/80 overflow-auto">
                        <pre className="custom-scrollbar">{JSON.stringify(filteredData, null, 4)}</pre>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">
                        Showing {filteredData.length} records in active memory
                    </span>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-600 hover:text-white transition-colors">Export .JSON</button>
                    <button className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-600 hover:text-white transition-colors">Clear Cache</button>
                </div>
            </div>

            {/* Inspect Modal */}
            <AnimatePresence>
                {selectedRecord && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedRecord(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-3xl overflow-hidden">
                            <div className="absolute top-0 right-0 p-8">
                                <button onClick={() => setSelectedRecord(null)} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                    <FileJson className="w-8 h-8 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white leading-tight">Record Inspection</h3>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">ID: {selectedRecord._id}</p>
                                </div>
                            </div>

                            <div className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2 font-mono">
                                {Object.entries(selectedRecord).map(([key, val]) => (
                                    <div key={key} className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50 group/prop">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{key}</span>
                                            <span className="text-[10px] text-slate-600 font-bold">{typeof val}</span>
                                        </div>
                                        <div className="text-sm text-slate-300 break-all leading-relaxed bg-slate-800/30 p-3 rounded-xl border border-transparent group-hover/prop:border-slate-700 transition-all">
                                            {typeof val === 'object' ? (
                                                <pre className="text-xs text-indigo-400 overflow-x-auto">{JSON.stringify(val, null, 2)}</pre>
                                            ) : (
                                                String(val)
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Record Modal - Placeholder, would use same theme */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-3xl">
                            <h3 className="text-2xl font-black text-white mb-8 tracking-tighter">Commit New Record</h3>
                            <form onSubmit={handleAddRecord} className="space-y-5">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">Title / Name</label>
                                        <input required onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">Status Code</label>
                                        <input onChange={(e) => setNewRecord({ ...newRecord, status: e.target.value })} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none" />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/20 active:scale-95 transition-all mt-4">
                                    Initialize Entry
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CrudTable;
