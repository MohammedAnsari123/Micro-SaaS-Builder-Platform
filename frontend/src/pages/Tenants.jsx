import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutDashboard, Loader2, Share2, ArrowUpRight, Copy, Database, Search, Globe, Palette, Clock, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import '../styles/pages.css';

// Color theme map for template badges
const themeColors = {
    blue: 'background: linear-gradient(to bottom right, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2)); border: 1px solid rgba(59, 130, 246, 0.3); color: rgb(96, 165, 250);',
    emerald: 'background: linear-gradient(to bottom right, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2)); border: 1px solid rgba(16, 185, 129, 0.3); color: rgb(52, 211, 153);',
    amber: 'background: linear-gradient(to bottom right, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2)); border: 1px solid rgba(245, 158, 11, 0.3); color: rgb(251, 191, 36);',
    violet: 'background: linear-gradient(to bottom right, rgba(139, 92, 246, 0.2), rgba(109, 40, 217, 0.2)); border: 1px solid rgba(139, 92, 246, 0.3); color: rgb(167, 139, 250);',
    rose: 'background: linear-gradient(to bottom right, rgba(244, 63, 94, 0.2), rgba(225, 29, 72, 0.2)); border: 1px solid rgba(244, 63, 94, 0.3); color: rgb(251, 113, 133);',
    teal: 'background: linear-gradient(to bottom right, rgba(20, 184, 166, 0.2), rgba(13, 148, 136, 0.2)); border: 1px solid rgba(20, 184, 166, 0.3); color: rgb(45, 212, 191);',
    lime: 'background: linear-gradient(to bottom right, rgba(132, 204, 22, 0.2), rgba(101, 163, 13, 0.2)); border: 1px solid rgba(132, 204, 22, 0.3); color: rgb(163, 230, 53);',
    cyan: 'background: linear-gradient(to bottom right, rgba(6, 182, 212, 0.2), rgba(8, 145, 178, 0.2)); border: 1px solid rgba(6, 182, 212, 0.3); color: rgb(34, 211, 238);',
    orange: 'background: linear-gradient(to bottom right, rgba(249, 115, 22, 0.2), rgba(234, 88, 12, 0.2)); border: 1px solid rgba(249, 115, 22, 0.3); color: rgb(251, 146, 60);',
    sky: 'background: linear-gradient(to bottom right, rgba(14, 165, 233, 0.2), rgba(2, 132, 199, 0.2)); border: 1px solid rgba(14, 165, 233, 0.3); color: rgb(56, 189, 248);',
    fuchsia: 'background: linear-gradient(to bottom right, rgba(217, 70, 239, 0.2), rgba(192, 38, 211, 0.2)); border: 1px solid rgba(217, 70, 239, 0.3); color: rgb(232, 121, 249);',
    pink: 'background: linear-gradient(to bottom right, rgba(236, 72, 153, 0.2), rgba(219, 39, 119, 0.2)); border: 1px solid rgba(236, 72, 153, 0.3); color: rgb(244, 114, 182);',
    indigo: 'background: linear-gradient(to bottom right, rgba(99, 102, 241, 0.2), rgba(79, 70, 229, 0.2)); border: 1px solid rgba(99, 102, 241, 0.3); color: rgb(129, 140, 248);',
    red: 'background: linear-gradient(to bottom right, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2)); border: 1px solid rgba(239, 68, 68, 0.3); color: rgb(248, 113, 113);',
    slate: 'background: linear-gradient(to bottom right, rgba(100, 116, 139, 0.2), rgba(71, 85, 105, 0.2)); border: 1px solid rgba(100, 116, 139, 0.3); color: rgb(148, 163, 184);',
};

const getTheme = (color) => themeColors[color] || themeColors['blue'];

const Tenants = () => {
    const [websites, setWebsites] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                // Fetch cloned websites
                const cloneRes = await axios.get('http://localhost:5000/api/v1/user/cloned-websites', { headers });
                if (cloneRes.data.success) setWebsites(cloneRes.data.data);

                // Fetch user profile for vanity URL
                const userRes = await axios.get('http://localhost:5000/api/v1/auth/me', { headers });
                if (userRes.data.success) setUser(userRes.data.data);

            } catch (err) {
                console.error("Failed to fetch ecosystem data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filtered = filter
        ? websites.filter(a => a.name.toLowerCase().includes(filter.toLowerCase()) || a.category?.toLowerCase().includes(filter.toLowerCase()))
        : websites;

    const formatDate = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getPublicUrl = (app) => {
        const slug = app.templateId?.slug || app.slug;
        if (!user || !slug) return '#';
        const emailPrefix = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        return `/site/${slug}/${emailPrefix}/${app._id}`;
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h2 className="page-title">Your Deployed Ecosystem</h2>
                    <p className="page-subtitle">Manage your cloned websites and custom SaaS apps</p>
                </div>
                <div className="page-actions">
                    <Link to="/templates" className="btn-action btn-secondary">
                        <Layers style={{ width: '16px', height: '16px' }} /> Browse Templates
                    </Link>
                    <Link to="/templates" className="btn-action btn-primary">
                        <Plus style={{ width: '16px', height: '16px' }} /> New App
                    </Link>
                </div>
            </div>

            {/* Stats Row */}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-label">Total Apps</div>
                    <div className="stat-value">{websites.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Cloned</div>
                    <div className="stat-value text-blue-400" style={{ color: 'var(--color-secondary)' }}>{websites.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Modules Used</div>
                    <div className="stat-value text-emerald-400" style={{ color: 'var(--color-success)' }}>
                        {websites.reduce((acc, curr) => acc + (curr.collections || 0), 0)}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Published</div>
                    <div className="stat-value text-violet-400" style={{ color: 'rgb(167, 139, 250)' }}>{websites.filter(a => a.isPublic).length}</div>
                </div>
            </div>

            {/* App Grid */}
            <div className="data-container">
                <div className="data-toolbar">
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--border-radius-xl)', padding: '4px', border: '1px solid var(--color-border)' }}>
                        <button style={{ padding: '6px 16px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: 'var(--border-radius-lg)', border: 'none', cursor: 'pointer' }}>All ({websites.length})</button>
                    </div>
                    <div className="data-filter">
                        <Search className="data-filter-icon" />
                        <input
                            type="text"
                            placeholder="Filter apps..."
                            className="data-filter-input"
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="data-empty">
                        <Loader2 className="animate-spin mb-4" style={{ width: '32px', height: '32px', color: 'var(--color-secondary)' }} />
                        <p style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '11px', color: 'var(--color-text-muted)' }}>Scanning Deployed Websites...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="data-empty">
                        <div className="data-empty-icon">
                            <Globe />
                        </div>
                        <h3 className="page-title" style={{ fontSize: '1.125rem', marginBottom: '8px' }}>No websites yet</h3>
                        <p className="page-subtitle" style={{ maxWidth: '320px', marginBottom: '24px' }}>Clone a template from the gallery or build a custom app to get started.</p>
                        <Link to="/templates" className="btn-action btn-secondary" style={{ color: 'var(--color-secondary)', background: 'rgba(0, 212, 255, 0.1)', borderColor: 'rgba(0, 212, 255, 0.2)' }}>
                            <Layers style={{ width: '16px', height: '16px' }} /> Browse Templates
                        </Link>
                    </div>
                ) : (
                    <div className="app-grid">
                        <AnimatePresence>
                            {filtered.map((app, i) => (
                                <motion.div
                                    key={app._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    className="app-card"
                                >
                                    <div className="app-header">
                                        <div className="app-identity">
                                            <div className="app-icon" style={app.colorTheme && getTheme(app.colorTheme).includes('gradient') ? {} : { cssText: getTheme(app.colorTheme) }}>
                                                <LayoutDashboard style={{ width: '20px', height: '20px' }} />
                                            </div>
                                            <div>
                                                <h3 className="app-name">{app.name}</h3>
                                                <div className="app-tags">
                                                    {app.source === 'clone' && app.templateName && (
                                                        <span className="app-tag" style={{ color: 'var(--color-secondary)', background: 'rgba(0, 212, 255, 0.1)', borderColor: 'rgba(0, 212, 255, 0.2)' }}>
                                                            {app.templateName}
                                                        </span>
                                                    )}
                                                    <span className="app-tag" style={{ color: 'var(--color-text-muted)' }}>{app.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`app-tag ${app.status === 'active' ? '' : ''}`} style={app.status === 'active' ? { background: 'rgba(34, 197, 94, 0.1)', color: 'rgb(74, 222, 128)', borderColor: 'rgba(34, 197, 94, 0.2)' } : { background: 'rgba(244, 63, 94, 0.1)', color: 'rgb(251, 113, 133)', borderColor: 'rgba(244, 63, 94, 0.2)' }}>
                                            {app.status || 'Active'}
                                        </span>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="app-meta">
                                        <span className="app-meta-item">
                                            <Database /> {app.collections} Modules
                                        </span>
                                        <span className="app-meta-item">
                                            <Layers /> {app.pages?.length || 0} Pages
                                        </span>
                                        <span className="app-meta-item">
                                            <Clock /> {formatDate(app.clonedAt)}
                                        </span>
                                    </div>

                                    {/* Pages Preview */}
                                    {app.pages && app.pages.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px', borderLeft: '2px solid var(--color-border)', paddingLeft: '12px' }}>
                                            {app.pages.slice(0, 5).map((page, j) => (
                                                <span key={j} className="app-tag" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'var(--color-border)' }}>
                                                    {page}
                                                </span>
                                            ))}
                                            {app.pages.length > 5 && (
                                                <span className="app-tag" style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'var(--color-border)' }}>
                                                    +{app.pages.length - 5} more
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="app-actions">
                                        <Link
                                            to={`/admin/manage/${app._id}`}
                                            className="btn-app-action btn-app-manage group"
                                        >
                                            <Palette style={{ width: '14px', height: '14px' }} className="group-hover:rotate-12 transition-transform" /> Manage Site
                                        </Link>
                                        <a
                                            href={getPublicUrl(app)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-app-action btn-app-preview group"
                                        >
                                            <Globe style={{ width: '14px', height: '14px' }} className="group-hover:scale-110 transition-transform" /> Preview Site
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tenants;
