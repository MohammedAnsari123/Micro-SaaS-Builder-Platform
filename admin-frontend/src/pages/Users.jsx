import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users as UsersIcon, Search, Ban, Trash2, RefreshCw, Loader2, ShieldAlert, CheckCircle2, UserX, Mail, Download, Filter } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000/api/v1';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterPlan, setFilterPlan] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) setUsers(data.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSuspend = async (userId) => {
        if (!confirm('Suspend this user account?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`${API}/admin/users/${userId}/suspend`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (err) {
            alert('Failed to suspend user');
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm('Permanently delete this user? This action cannot be undone.')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`${API}/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const filtered = users.filter(u => {
        const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
        const matchPlan = filterPlan === 'all' || u.plan === filterPlan;
        return matchSearch && matchPlan;
    });

    const handleExport = () => {
        if (!users || users.length === 0) return;
        const headers = ["Name", "Email", "Role", "Plan", "Status", "Joined"];
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + users.map(u => {
                return [
                    `"${u.name || ''}"`,
                    `"${u.email || ''}"`,
                    u.role,
                    u.plan,
                    u.suspended ? "Suspended" : "Active",
                    new Date(u.createdAt).toLocaleDateString()
                ].join(",");
            }).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "users_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleNewUser = () => {
        alert("Manual user creation from the admin panel is restricted. Users must register via the public portal.");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] relative z-10">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-t-2 border-brand-500 border-l-2 border-transparent animate-spin" />
                    <div className="w-16 h-16 rounded-full border-r-2 border-blue-500 border-b-2 border-transparent animate-spin absolute inset-0 animation-delay-500" />
                    <UsersIcon className="w-6 h-6 text-brand-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
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
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-blue-600 p-[1px]">
                            <div className="w-full h-full bg-[#0f172a] rounded-[10px] flex items-center justify-center">
                                <UsersIcon className="w-5 h-5 text-brand-400" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 font-medium ml-1"
                    >
                        Monitor and manage all platform users ({users.length} total)
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-3"
                >
                    <button onClick={fetchUsers} className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all flex items-center gap-2 group">
                        <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                    <button onClick={handleExport} className="px-5 py-2.5 flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl border border-white/10 transition-all">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button onClick={handleNewUser} className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                        + New User
                    </button>
                </motion.div>
            </div>

            {/* Filters & Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-between items-center"
            >
                <div className="relative w-full sm:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 focus:bg-white/5 transition-all text-sm shadow-inner"
                    />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <select
                            value={filterPlan}
                            onChange={e => setFilterPlan(e.target.value)}
                            className="w-full sm:w-auto appearance-none bg-black/20 border border-white/10 rounded-2xl pl-10 pr-10 py-3.5 text-white text-sm focus:outline-none focus:border-brand-500/50 focus:bg-white/5 transition-all shadow-inner font-medium capitalize"
                        >
                            <option value="all" className="bg-slate-900">All Plans</option>
                            <option value="free" className="bg-slate-900">Free</option>
                            <option value="basic" className="bg-slate-900">Basic</option>
                            <option value="pro" className="bg-slate-900">Pro</option>
                        </select>
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                </div>
            </motion.div>

            {/* Premium Glass Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-panel rounded-3xl overflow-hidden shadow-2xl relative"
            >
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="overflow-x-auto relative z-10 custom-scrollbar pb-2">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-black/20 border-b border-white/5 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                                <th className="p-5 font-semibold">User Content</th>
                                <th className="p-5 font-semibold">Role & Access</th>
                                <th className="p-5 font-semibold">Subscription</th>
                                <th className="p-5 font-semibold">Status</th>
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
                                                    <Search className="w-8 h-8 text-slate-500" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2">No users found</h3>
                                                <p className="text-slate-400 text-sm">We couldn't find any users matching your criteria.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((user, index) => (
                                        <motion.tr
                                            key={user._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="hover:bg-white/[0.03] transition-colors group cursor-pointer border-l-[3px] border-transparent hover:border-brand-500"
                                        >
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600/50 to-blue-500/50 p-[2px] shadow-lg flex-shrink-0">
                                                        <div className="w-full h-full bg-[#0f172a] rounded-full overflow-hidden flex items-center justify-center">
                                                            <span className="text-white font-bold text-sm">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-[15px] group-hover:text-brand-300 transition-colors">{user.name || 'Unknown User'}</div>
                                                        <div className="text-slate-400 text-xs flex items-center gap-1.5 mt-0.5 font-medium">
                                                            <Mail className="w-3 h-3" /> {user.email || 'No email provided'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                    }`}>
                                                    {user.role === 'admin' ? <ShieldAlert className="w-3.5 h-3.5" /> : <UsersIcon className="w-3.5 h-3.5" />}
                                                    {user.role || 'user'}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest ${user.plan === 'pro' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                    user.plan === 'basic' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                                                        'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                                    }`}>
                                                    {user.plan || 'free'}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${!user.suspended ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                    }`}>
                                                    {!user.suspended ? <CheckCircle2 className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                                                    {!user.suspended ? 'ACTIVE' : 'SUSPENDED'}
                                                </span>
                                            </td>
                                            <td className="p-5 text-center relative">
                                                <div className="flex items-center justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleSuspend(user._id); }}
                                                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors border ${user.suspended ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                                                            }`}
                                                        title={user.suspended ? 'Restore User' : 'Suspend User'}
                                                    >
                                                        {user.suspended ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(user._id); }}
                                                        className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 flex items-center justify-center transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
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

export default Users;
