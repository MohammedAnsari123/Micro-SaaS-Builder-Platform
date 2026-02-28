import React, { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Database, Settings, Menu, X,
    CreditCard, LogOut, ChevronRight, Zap, Bell, Search, Store
} from 'lucide-react';
import axios from 'axios';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tenants', label: 'Tenants', icon: Users },
    { path: '/marketplace', label: 'Ecosystem', icon: Store },
    { path: '/analytics', label: 'Analytics', icon: Database },
    { path: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { path: '/settings', label: 'Global Settings', icon: Settings },
];

const UserLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const { data } = await axios.get('http://localhost:5000/api/v1/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data.success) {
                    setUser(data.data);
                }
            } catch (err) {
                console.error("Auth failed", err);
                localStorage.removeItem('token');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="h-screen bg-slate-950 flex items-center justify-center text-white font-sans">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-t-2 border-blue-500 border-r-2 border-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 font-medium animate-pulse">Initializing SaaS Forge...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex overflow-hidden bg-slate-950 font-sans text-slate-300 relative">
            {/* Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 overflow-hidden relative z-50"
                    >
                        {/* Sidebar Header */}
                        <Link to='/'>
                            <div className="p-6 border-b border-slate-800 flex items-center gap-3 shrink-0">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <Zap className="w-5 h-5 text-white fill-white" />
                                </div>
                                <span className="font-bold text-xl text-white tracking-tight">SaaS<span className="text-blue-500">Forge</span>.ai</span>
                            </div>
                        </Link>

                        {/* Nav Items */}
                        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar relative">
                            {navItems.map(({ path, label, icon: Icon }) => (
                                <NavLink
                                    key={path}
                                    to={path}
                                    className={({ isActive }) =>
                                        `group flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-300 relative ${isActive
                                            ? 'bg-blue-500/10 text-white border border-blue-500/20 shadow-inner'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-400' : 'group-hover:text-blue-400/70'}`} />
                                                <span className="text-[15px]">{label}</span>
                                            </div>
                                            {isActive && (
                                                <motion.div layoutId="nav-indicator">
                                                    <ChevronRight className="w-4 h-4 text-blue-500" />
                                                </motion.div>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Sidebar Footer (Dynamic User Info) */}
                        <div className="p-4 border-t border-slate-800 shrink-0 bg-slate-900/50 backdrop-blur-md">
                            <div className="flex items-center gap-3 mb-4 p-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 p-[2px] shadow-lg shadow-indigo-500/10">
                                    <div className="w-full h-full bg-slate-800 rounded-[8px] overflow-hidden flex items-center justify-center">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Owner'}`} alt="Avatar" className="w-8 h-8" />
                                    </div>
                                </div>
                                <div className="overflow-hidden">
                                    <div className="text-sm font-bold text-white truncate">{user?.name || 'Admin User'}</div>
                                    <div className="text-[11px] text-slate-500 font-medium truncate uppercase tracking-wider">{user?.email || 'Owner Role'}</div>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl text-sm font-semibold transition-all border border-transparent hover:border-rose-500/10"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Header Navbar */}
                <header className="h-20 px-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 backdrop-blur-xl sticky top-0 z-40 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all border border-slate-700/50 group"
                        >
                            {sidebarOpen ? <X className="w-5 h-5 group-hover:rotate-90 transition-transform" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <div>
                            <h2 className="text-white font-bold text-lg leading-tight uppercase tracking-widest text-[11px] text-blue-500 mb-0.5">Control Panel</h2>
                            <h1 className="text-xl font-bold text-white tracking-tight">Platform Overview</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex items-center h-10 bg-slate-900 border border-slate-800 rounded-xl px-4 text-slate-500 hover:border-slate-700 transition-colors cursor-pointer group w-64 mr-4">
                            <Search className="w-4 h-4 mr-3 group-hover:text-blue-500 transition-colors" />
                            <span className="text-sm font-medium">Search records...</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="relative p-2.5 text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-800 rounded-xl transition-all border border-slate-800">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-950 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page View Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
                    <div className="max-w-[1400px] mx-auto min-h-full">
                        <AnimatePresence>
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserLayout;
