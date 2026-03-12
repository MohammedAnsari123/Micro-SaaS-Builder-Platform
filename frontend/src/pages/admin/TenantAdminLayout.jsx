import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, FileText, Palette, Settings, MessageSquare,
    ShoppingBag, Calendar, Package, Scissors, Users, ChevronLeft, ChevronRight, LogOut, Globe
} from 'lucide-react';
import axios from 'axios';

// Admin Pages
import ContentEditor from './ContentEditor';
import ThemeEditor from './ThemeEditor';
import SiteSettingsEditor from './SiteSettingsEditor';
import ContactMessages from './ContactMessages';
import ModuleManager from './ModuleManager';

import { useNavigate, useParams, Link } from 'react-router-dom';
import '../../styles/admin.css';

const API_BASE = 'http://localhost:5000/api/v1';

const TenantAdminLayout = ({ token, onLogout }) => {
    const { cloneId } = useParams();
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState('content');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [tenantInfo, setTenantInfo] = useState(null);
    const [template, setTemplate] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}` };

                // Fetch user for URL generation
                const userRes = await axios.get(`${API_BASE}/auth/me`, { headers });
                if (userRes.data.success) setUser(userRes.data.data);

                const cloneRes = await axios.get(`${API_BASE}/templates/my/clones`, { headers });
                if (cloneRes.data.success && cloneRes.data.data.length > 0) {
                    let clone = null;
                    if (cloneId) {
                        clone = cloneRes.data.data.find(c => c._id === cloneId);
                    }

                    if (!clone) {
                        // If no specific cloneId in URL or invalid, pick the first one and navigate
                        const firstClone = cloneRes.data.data[0];
                        navigate(`/admin/manage/${firstClone._id}`, { replace: true });
                        clone = firstClone;
                    }

                    setTemplate(clone.templateId);
                    setTenantInfo(clone);
                }
            } catch (err) {
                console.error('Failed to load admin data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token, cloneId, navigate]);

    const modules = template?.modules || ['content', 'contact'];
    const emailPrefix = user?.email?.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const publicUrl = template && emailPrefix && cloneId ? `/site/${template.slug}/${emailPrefix}/${cloneId}` : '#';

    const menuItems = [
        { key: 'content', label: 'Content', icon: FileText, always: true },
        { key: 'theme', label: 'Theme', icon: Palette, always: true },
        { key: 'settings', label: 'Site Settings', icon: Settings, always: true },
        { key: 'contacts', label: 'Messages', icon: MessageSquare, always: true },
        { key: 'products', label: 'Products', icon: ShoppingBag, module: 'product' },
        { key: 'orders', label: 'Orders', icon: Package, module: 'order' },
        { key: 'bookings', label: 'Bookings', icon: Calendar, module: 'booking' },
        { key: 'services', label: 'Services', icon: Scissors, module: 'service' },
        { key: 'events', label: 'Events', icon: Calendar, module: 'event' },
        { key: 'registrations', label: 'Registrations', icon: Users, module: 'registration' }
    ].filter(item => item.always || modules.includes(item.module));

    const renderPage = () => {
        switch (activePage) {
            case 'content': return <ContentEditor token={token} cloneId={cloneId} pages={template?.pages || []} />;
            case 'theme': return <ThemeEditor token={token} cloneId={cloneId} />;
            case 'settings': return <SiteSettingsEditor token={token} cloneId={cloneId} />;
            case 'contacts': return <ContactMessages token={token} cloneId={cloneId} />;
            case 'products': return <ModuleManager token={token} cloneId={cloneId} module="products" title="Products" />;
            case 'orders': return <ModuleManager token={token} cloneId={cloneId} module="orders" title="Orders" />;
            case 'bookings': return <ModuleManager token={token} cloneId={cloneId} module="bookings" title="Bookings" />;
            case 'services': return <ModuleManager token={token} cloneId={cloneId} module="services" title="Services" />;
            case 'events': return <ModuleManager token={token} cloneId={cloneId} module="events" title="Events" />;
            case 'registrations': return <ModuleManager token={token} cloneId={cloneId} module="registrations" title="Registrations" />;
            default: return <ContentEditor token={token} cloneId={cloneId} pages={template?.pages || []} />;
        }
    };

    if (loading) {
        return (
            <div className="admin-layout-modern" style={{ alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#6b7280' }}>Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="admin-layout-modern">
            {/* Top Header */}
            <header className="admin-header-modern">
                <div className="admin-header-left">
                    <Link to="/sites" className="admin-header-logo" style={{ textDecoration: 'none' }}>
                        <LayoutDashboard size={20} />
                        CodeAra Admin
                    </Link>
                    <div className="admin-header-divider" />
                    <div className="admin-header-project">
                        {template ? template.name : 'Manage Site'}
                    </div>
                </div>
                
                <div className="admin-header-right">
                    {template && (
                        <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="admin-header-btn secondary">
                            <Globe size={16} /> Live Proof
                        </a>
                    )}
                    <Link to="/sites" className="admin-header-btn primary">
                        <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    {onLogout && (
                        <button onClick={onLogout} className="admin-header-btn danger">
                            <LogOut size={16} /> Logout
                        </button>
                    )}
                </div>
            </header>

            {/* Main Container */}
            <div className="admin-container-modern">
                {/* Left Sidebar Nav */}
                <aside className="admin-sidebar-modern">
                    {menuItems.map(item => {
                        const Icon = item.icon;
                        const isActive = activePage === item.key;
                        return (
                            <button 
                                key={item.key} 
                                onClick={() => setActivePage(item.key)}
                                className={`admin-nav-item-modern ${isActive ? 'active' : ''}`}
                            >
                                <Icon size={16} />
                                {item.label}
                            </button>
                        );
                    })}
                </aside>

                {/* Right Content */}
                <main className="admin-content-modern" style={{ overflowY: 'visible', padding: '0' }}>
                    <motion.div key={activePage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                        {renderPage()}
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default TenantAdminLayout;
