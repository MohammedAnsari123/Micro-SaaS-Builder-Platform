import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, LayoutList, Plus, Edit2, Trash2, Search, RefreshCw, X } from 'lucide-react';
import axios from 'axios';

const CrudTable = ({ instance }) => {
    const collectionName = instance.collectionName || 'Unknown';
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newRecord, setNewRecord] = useState({});

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
        if (!window.confirm("Are you sure?")) return;
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

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col group/table">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-900/50 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                        <Table className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white capitalize">{collectionName} Management</h3>
                        <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold">Dynamic Data Protocol</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Filter records..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-48 transition-all"
                        />
                    </div>
                    <button
                        onClick={fetchData}
                        className="p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-700/50 transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> New Entry
                    </button>
                </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-auto custom-scrollbar relative min-h-[400px]">
                {loading && data.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm z-20">
                        <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-3" />
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Hydrating Collection...</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-20 opacity-40">
                        <LayoutList className="w-12 h-12 mb-4 text-slate-600" />
                        <p className="text-sm font-medium">No results found in {collectionName}</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="text-[10px] uppercase bg-slate-800/30 text-slate-500 border-b border-slate-800 font-bold sticky top-0 z-10 backdrop-blur-md">
                            <tr>
                                <th className="px-6 py-4">Identity</th>
                                <th className="px-6 py-4">Data Payload</th>
                                <th className="px-6 py-4 text-right">Interaction</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredData.map((item) => (
                                <tr key={item._id} className="hover:bg-blue-500/5 transition-colors group/row">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-mono text-slate-500">ID: ...{item._id.slice(-6)}</span>
                                            <span className="text-[10px] text-blue-500/60 font-medium">Auto-Generated</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(item).map(([key, val]) => (
                                                !['_id', 'tenantId', '__v', 'createdAt', 'updatedAt'].includes(key) && (
                                                    <div key={key} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg">
                                                        <span className="text-[10px] text-slate-500 font-bold uppercase">{key}:</span>
                                                        <span className="text-xs text-slate-200">{String(val)}</span>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 rounded-lg transition-all">
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination/Status */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Total: {filteredData.length} records in <span className="text-blue-500">{collectionName}</span>
                </p>
                <div className="flex gap-2 text-[10px] font-bold uppercase">
                    <button className="px-3 py-1.5 bg-slate-800 text-slate-500 rounded-lg cursor-not-allowed">First</button>
                    <button className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700">1</button>
                    <button className="px-3 py-1.5 bg-slate-800 text-slate-500 rounded-lg cursor-not-allowed">Last</button>
                </div>
            </div>

            {/* Add Record Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Add to {collectionName}</h3>
                                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddRecord} className="space-y-4">
                                <p className="text-xs text-slate-400 italic mb-4">* Enter fields as key-value pairs (JSON format coming soon)</p>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Title / Name</label>
                                        <input
                                            type="text"
                                            required
                                            onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Example entry..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Status</label>
                                        <input
                                            type="text"
                                            onChange={(e) => setNewRecord({ ...newRecord, status: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="active / pending..."
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all mt-4"
                                >
                                    Commit Record
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

