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
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
                <p style={{ color: '#94a3b8' }}>Loading admin panel...</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f8fafc', color: '#1e293b' }}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarCollapsed ? '64px' : '240px',
                backgroundColor: '#0f172a',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 0.3s',
                overflow: 'hidden',
                flexShrink: 0
            }}>
                {/* Header */}
                <div style={{ padding: '20px 16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {!sidebarCollapsed && (
                        <div>
                            <h3 style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>Admin Panel</h3>
                            {template && <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{template.name}</p>}
                        </div>
                    )}
                    <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>

                {/* Nav Items */}
                <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {/* Public Site Link */}
                    {template && (
                        <a href={publicUrl} target="_blank" rel="noopener noreferrer"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: sidebarCollapsed ? '10px' : '10px 12px',
                                borderRadius: '12px', border: '1px solid #1e293b',
                                cursor: 'pointer', backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                color: '#60a5fa', marginBottom: '12px', textDecoration: 'none',
                                transition: 'all 0.2s', fontSize: '14px', fontWeight: 700,
                                justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
                            }}>
                            <Globe size={18} />
                            {!sidebarCollapsed && 'See Live Site'}
                        </a>
                    )}
                    {menuItems.map(item => {
                        const Icon = item.icon;
                        const isActive = activePage === item.key;
                        return (
                            <button key={item.key} onClick={() => setActivePage(item.key)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: sidebarCollapsed ? '10px' : '10px 12px',
                                    borderRadius: '8px', border: 'none', cursor: 'pointer',
                                    backgroundColor: isActive ? '#1e293b' : 'transparent',
                                    color: isActive ? '#fff' : '#94a3b8',
                                    fontWeight: isActive ? 600 : 400,
                                    fontSize: '14px', textAlign: 'left', width: '100%',
                                    transition: 'all 0.2s',
                                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
                                }}>
                                <Icon size={18} />
                                {!sidebarCollapsed && item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Dashboard & Logout */}
                <div style={{ padding: '12px 8px', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Link to="/sites"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '10px 12px', borderRadius: '8px', border: 'none',
                            cursor: 'pointer', backgroundColor: 'transparent',
                            color: '#94a3b8', fontSize: '14px', width: '100%', textAlign: 'left',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                            justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
                        }}>
                        <LayoutDashboard size={18} />
                        {!sidebarCollapsed && 'Back to Dashboard'}
                    </Link>

                    {onLogout && (
                        <button onClick={onLogout}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '10px 12px', borderRadius: '8px', border: 'none',
                                cursor: 'pointer', backgroundColor: 'transparent',
                                color: '#ef4444', fontSize: '14px', width: '100%', textAlign: 'left',
                                justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
                            }}>
                            <LogOut size={18} />
                            {!sidebarCollapsed && 'Logout'}
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
                <motion.div key={activePage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    {renderPage()}
                </motion.div>
            </main>
        </div>
    );
};

export default TenantAdminLayout;
