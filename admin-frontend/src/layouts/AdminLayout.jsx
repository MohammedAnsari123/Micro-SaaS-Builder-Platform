import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Building2, LayoutTemplate, Store,
    CreditCard, Bot, BarChart3, Shield, Settings, Menu, X, LogOut, Zap, Bell, Search, ChevronRight
} from 'lucide-react';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/users', label: 'Users', icon: Users },
    { path: '/tenants', label: 'Tenants', icon: Building2 },
    { path: '/templates', label: 'Templates', icon: LayoutTemplate },
    { path: '/marketplace', label: 'Marketplace', icon: Store },
    { path: '/billing', label: 'Billing', icon: CreditCard },
    { path: '/ai-monitor', label: 'AI Engine', icon: Bot },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/security', label: 'Security', icon: Shield },
    { path: '/settings', label: 'Settings', icon: Settings },
];

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    if (!token) return null;

    // Get page title for header
    const currentNav = navItems.find(item => item.path === location.pathname);
    const pageTitle = currentNav ? currentNav.label : 'Admin Portal';

    return (
        <div className="min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] relative overflow-hidden flex">
            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-600/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />

            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="fixed z-50 md:relative h-screen w-72 p-4 shrink-0"
                    >
                        <div className="h-full w-full glass-panel rounded-3xl flex flex-col overflow-hidden relative border border-white/5">
                            {/* Logo */}
                            <div className="p-6 border-b border-white/5 flex items-center gap-4 shrink-0 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-blue-600 p-[1px]">
                                    <div className="w-full h-full bg-[#0f172a] rounded-xl flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-brand-500/20"></div>
                                        <div className="absolute w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45 animate-float" />
                                        <Zap className="w-5 h-5 text-brand-400 relative z-10 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="font-bold text-xl text-white tracking-tight leading-tight">SaaS<span className="text-brand-400">Forge</span></h1>
                                    <p className="text-[10px] text-brand-400/70 font-bold tracking-[0.2em] uppercase">Control Panel</p>
                                </div>
                            </div>

                            {/* Nav */}
                            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto relative z-10 custom-scrollbar">
                                {navItems.map(({ path, label, icon: Icon }) => (
                                    <NavLink
                                        key={path}
                                        to={path}
                                        className={({ isActive }) =>
                                            `group flex items-center justify-between px-4 py-3 rounded-2xl font-medium transition-all duration-300 relative overflow-hidden ${isActive
                                                ? 'text-white shadow-lg'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeTab"
                                                        className="absolute inset-0 bg-gradient-to-r from-brand-600/20 to-blue-600/10 border border-brand-500/30 rounded-2xl z-0"
                                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                    />
                                                )}
                                                <div className="flex items-center gap-3.5 relative z-10">
                                                    <Icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-brand-400' : 'group-hover:text-brand-400/70'}`} />
                                                    <span className={`text-[15px] ${isActive ? 'font-semibold' : 'font-medium'}`}>{label}</span>
                                                </div>
                                                {isActive && <ChevronRight className="w-4 h-4 text-brand-400 relative z-10" />}
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </nav>

                            {/* Footer */}
                            <div className="p-4 border-t border-white/5 shrink-0 relative z-10">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-slate-400 hover:text-white rounded-2xl font-medium transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors relative z-10" />
                                    <span className="relative z-10 group-hover:text-red-200">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen relative z-10">
                {/* Header Navbar */}
                <header
                    className={`h-24 px-6 md:px-10 flex items-center justify-between sticky top-0 z-30 transition-all duration-300 ${scrolled ? 'bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 shadow-sm' : 'bg-transparent'
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight hidden sm:block">
                            {pageTitle}
                        </h2>
                    </div>

                    <div className="hidden lg:flex flex-1 max-w-md mx-6 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-500/50 focus:bg-white/10 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 group">
                            <Bell className="w-5 h-5 group-hover:animate-swing" />
                            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_10px_rgba(139,92,246,0.8)] border-2 border-[#1e293b]" />
                        </button>

                        <div className="h-10 border-l border-white/10 mx-2 hidden sm:block"></div>

                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-500 p-[2px] shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
                                <div className="w-full h-full bg-[#0f172a] rounded-[10px] overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=0f172a" alt="Admin" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="hidden md:block text-right">
                                <div className="text-sm font-bold text-white leading-tight">Super Admin</div>
                                <div className="text-[11px] text-brand-400 font-medium">Platform Owner</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 md:px-10 pb-20 scroll-smooth">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="max-w-[1400px] mx-auto h-full"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
