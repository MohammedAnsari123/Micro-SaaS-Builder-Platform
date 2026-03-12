import React, { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Database, Settings, Menu, X,
    CreditCard, LogOut, ChevronRight, Zap, Bell, Search, Store, Globe
} from 'lucide-react';
import axios from 'axios';
import '../../styles/user-layout.css';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/sites', label: 'My Websites', icon: Globe },
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
            <div className="admin-loading">
                <div className="admin-loading-content">
                    <div className="admin-loading-spinner" />
                    <p className="admin-loading-text">Initializing SaaS Forge...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="admin-sidebar"
                    >
                        {/* Sidebar Header */}
                        <Link to='/'>
                            <div className="admin-sidebar-header">
                                <div className="admin-logo-icon">
                                    <Zap size={20} color="#ffffff" fill="#ffffff" />
                                </div>
                                <span className="admin-logo-text">SaaS<span className="admin-logo-highlight">Forge</span></span>
                            </div>
                        </Link>

                        {/* Nav Items */}
                        <nav className="admin-nav custom-scrollbar">
                            {navItems.map(({ path, label, icon: Icon }) => (
                                <NavLink
                                    key={path}
                                    to={path}
                                    className={({ isActive }) =>
                                        `admin-nav-item ${isActive ? 'active' : ''}`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <div className="admin-nav-item-content">
                                                <Icon className="admin-nav-icon" />
                                                <span>{label}</span>
                                            </div>
                                            {isActive && (
                                                <motion.div layoutId="nav-indicator">
                                                    <ChevronRight size={16} color="var(--color-secondary)" />
                                                </motion.div>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Sidebar Footer (Dynamic User Info) */}
                        <div className="admin-sidebar-footer">
                            <div className="admin-user-profile">
                                <div className="admin-user-avatar">
                                    <div className="admin-user-avatar-inner">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Owner'}`} alt="Avatar" className="admin-user-avatar-img" />
                                    </div>
                                </div>
                                <div className="admin-user-info">
                                    <div className="admin-user-name">{user?.name || 'Admin User'}</div>
                                    <div className="admin-user-role">{user?.email || 'Owner Role'}</div>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="admin-logout-btn"
                            >
                                <LogOut className="admin-logout-btn-icon" /> Sign Out
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="admin-main">
                {/* Header Navbar */}
                <header className="admin-header">
                    <div className="admin-header-left">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="admin-menu-toggle"
                        >
                            {sidebarOpen ? <X className="admin-menu-icon admin-menu-icon-close" /> : <Menu className="admin-menu-icon" />}
                        </button>
                        <div className="admin-header-title-wrapper">
                            <h2 className="admin-header-subtitle">Control Panel</h2>
                            <h1 className="admin-header-title">Platform Overview</h1>
                        </div>
                    </div>

                    <div className="admin-header-right">
                        <div className="admin-search">
                            <Search className="admin-search-icon" />
                            <span className="admin-search-text">Search records...</span>
                        </div>

                        <div className="admin-header-actions">
                            <button className="admin-action-btn">
                                <Bell className="admin-action-icon" />
                                <span className="admin-action-badge" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page View Area */}
                <div className="admin-content-area custom-scrollbar">
                    <div className="admin-content-wrapper">
                        <AnimatePresence>
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                style={{ height: '100%' }}
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
