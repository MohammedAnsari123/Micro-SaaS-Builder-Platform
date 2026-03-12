import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Building2, LayoutTemplate, Store,
    CreditCard, Bot, BarChart3, Shield, Settings, Menu, LogOut, Zap, Bell, Search, Globe
} from 'lucide-react';
import './admin-layout.css';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/users', label: 'Users', icon: Users },
    { path: '/tenants', label: 'Tenants', icon: Building2 },
    { path: '/ecosystem', label: 'All Sites', icon: Globe },
    { path: '/billing', label: 'Billing', icon: CreditCard },
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

    const currentNav = navItems.find(item => item.path === location.pathname);
    const pageTitle = currentNav ? currentNav.label : 'Admin Portal';

    return (
        <div className="admin-layout-wrapper">
            {/* Background Effects */}
            <div className="bg-glow-1" />
            <div className="bg-glow-2" />
            <div className="bg-pattern" />

            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="admin-sidebar"
                    >
                        <div className="sidebar-container">
                            {/* Logo */}
                            <div className="sidebar-logo">
                                <div className="logo-icon-wrapper">
                                    <Zap className="logo-icon" />
                                </div>
                                <div className="logo-text">
                                    <h1 className="font-heading">SaaS<span>Forge</span></h1>
                                    <p>Control Panel</p>
                                </div>
                            </div>

                            {/* Nav */}
                            <nav className="sidebar-nav">
                                {navItems.map(({ path, label, icon: Icon }) => (
                                    <NavLink
                                        key={path}
                                        to={path}
                                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                    >
                                        <div className="nav-link-content">
                                            <Icon className="nav-icon" />
                                            <span className="nav-text">{label}</span>
                                        </div>
                                    </NavLink>
                                ))}
                            </nav>

                            {/* Footer */}
                            <div className="sidebar-footer">
                                <button onClick={handleLogout} className="logout-btn">
                                    <LogOut className="logout-icon" />
                                    <span>Sign Out</span>
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
                        className="mobile-overlay"
                    />
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="admin-main">
                {/* Header Navbar */}
                <header className={`admin-header ${scrolled ? 'scrolled' : ''}`}>
                    <div className="header-left">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="mobile-menu-btn"
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="page-title font-heading">
                            {pageTitle}
                        </h2>
                    </div>

                    <div className="header-search">
                        <div className="search-icon-wrapper">
                            <Search className="search-icon" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="search-input"
                        />
                    </div>

                    <div className="header-actions">
                        <button className="notification-btn font-heading">
                            <Bell className="notification-icon" />
                            <span className="notification-badge" />
                        </button>

                        <div className="header-divider"></div>

                        <div className="user-profile">
                            <div className="avatar-wrapper">
                                <div className="avatar-image-container">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=0f172a" alt="Admin" className="avatar-img" />
                                </div>
                            </div>
                            <div className="user-info">
                                <div className="user-name font-heading">Super Admin</div>
                                <div className="user-role">Platform Owner</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content Window */}
                <div className="page-content-wrapper">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="admin-page-container"
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
