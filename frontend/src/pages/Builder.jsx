import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, LayoutTemplate, Settings, Plus, LayoutGrid, Box, Globe, ChevronRight, Save, LayoutDashboard, Trash2, X, ExternalLink, Rocket, Copy, Check, GripVertical } from 'lucide-react';
import axios from 'axios';

// Import our Physical React Module Interpreters
import CrudTable from '../components/modules/CrudTable';
import ChartDashboard from '../components/modules/ChartDashboard';
import KanbanBoard from '../components/modules/KanbanBoard';

// Map database slugs to React Components
const MODULE_REGISTRY = {
    // Core Modules
    'crud_table': CrudTable,
    'chart_dashboard': ChartDashboard,
    'kanban_board': KanbanBoard,
    'form_builder': CrudTable,
    'user_manager': CrudTable,
    'file_manager': CrudTable,
    'activity_log': CrudTable,
    'report_generator': CrudTable,
    'role_manager': CrudTable,
    'notification_center': CrudTable,
    'settings_page': CrudTable,
    'api_key_manager': CrudTable,
    'webhook_manager': CrudTable,
    'billing_page': CrudTable,
    'analytics_widget': ChartDashboard,
    'calendar_view': CrudTable,

    // Productivity
    'task_list': KanbanBoard,
    'gantt_chart': ChartDashboard,
    'sprint_board': KanbanBoard,
    'time_tracker': CrudTable,
    'milestone_tracker': CrudTable,
    'note_vault': CrudTable,
    'approval_flow': CrudTable,
    'asset_tracker': CrudTable,
    'daily_standup': CrudTable,
    'goal_tracker': ChartDashboard,

    // CRM & Sales
    'contact_manager': CrudTable,
    'sales_pipeline': KanbanBoard,
    'invoice_generator': CrudTable,
    'lead_capture_form': CrudTable,
    'quote_builder': CrudTable,
    'churn_radar': ChartDashboard,
    'referral_manager': CrudTable,
    'call_logger': CrudTable,
    'email_outreach': CrudTable,
    'territory_map': CrudTable,

    // Communication
    'chat_widget': CrudTable,
    'comment_thread': CrudTable,
    'announcement_board': CrudTable,
    'email_template_manager': CrudTable,
    'video_conference': CrudTable,
    'slack_integration': CrudTable,
    'sms_manager': CrudTable,
    'contact_widget': CrudTable,
    'poll_module': CrudTable,
    'news_feed': CrudTable,

    // Content & Media
    'blog_editor': CrudTable,
    'media_gallery': CrudTable,
    'document_vault': CrudTable,
    'knowledge_base': CrudTable,
    'page_builder': CrudTable,
    'seo_optimizer': CrudTable,
    'video_player': CrudTable,
    'audio_hub': CrudTable,
    'brand_font_kit': CrudTable,
    'code_vault': CrudTable,

    // E-commerce
    'product_catalog': CrudTable,
    'shopping_cart': CrudTable,
    'order_manager': CrudTable,
    'payment_gateway': CrudTable,
    'subscription_manager': CrudTable,
    'inventory_tracker': CrudTable,
    'coupon_manager': CrudTable,
    'review_aggregator': CrudTable,
    'wishlist_module': CrudTable,
    'vendor_manager': CrudTable,

    // Analytics
    'dashboard_widget_grid': ChartDashboard,
    'pivot_table': CrudTable,
    'data_import_export': CrudTable,
    'heatmap_viewer': ChartDashboard,
    'funnel_chart': ChartDashboard,
    'retention_cohort': ChartDashboard,
    'realtime_logs': CrudTable,
    'error_monitor': CrudTable,
    'variant_manager': CrudTable,
    'sql_playground': CrudTable,

    // HR
    'employee_directory': CrudTable,
    'leave_manager': CrudTable,
    'attendance_tracker': CrudTable,
    'payroll_calculator': CrudTable,
    'performance_review': CrudTable,
    'applicant_tracker': CrudTable,
    'benefits_portal': CrudTable,
    'hierarchy_viewer': CrudTable,
    'employee_feedback': CrudTable,
    'equipment_logs': CrudTable,

    // Tech & Automation
    'workflow_automator': CrudTable,
    'cron_scheduler': CrudTable,
    'integration_hub': CrudTable,
    'api_playground': CrudTable,
    'data_sync_bridge': CrudTable,
    'lambda_executor': CrudTable,
    'request_proxy': CrudTable,
    'stathat_push': CrudTable,
    'db_backups': CrudTable,
    'exception_tracker': CrudTable
};


const Builder = () => {
    const { id, templateName, emailPrefix } = useParams();
    const [tool, setTool] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [activePage, setActivePage] = useState('Dashboard');
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    // Module library state (from database)
    const [availableModules, setAvailableModules] = useState([]);
    const [moduleSearch, setModuleSearch] = useState('');

    // Add Page modal state
    const [showAddPage, setShowAddPage] = useState(false);
    const [newPageName, setNewPageName] = useState('');

    // Publish modal state
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [publishedUrl, setPublishedUrl] = useState('');
    const [urlCopied, setUrlCopied] = useState(false);

    // User and Plan state
    const [userEmail, setUserEmail] = useState('');
    const [userPlan, setUserPlan] = useState('free');

    useEffect(() => {
        const fetchTool = async () => {
            try {
                const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
                let url = `http://localhost:5000/api/v1/tools/${id}`;

                // If it's a vanity URL, use the resolve endpoint
                if (!id && templateName && emailPrefix) {
                    url = `http://localhost:5000/api/v1/tools/resolve/${templateName}/${emailPrefix}`;
                }

                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.success) {
                    setTool(res.data.data);
                    const pages = res.data.data.versions[res.data.data.currentVersion - 1]?.pages || [];
                    if (pages.length > 0 && !pages.includes('Dashboard')) {
                        setActivePage(pages[0]);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch tool configuration:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchUserMe = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await axios.get('http://localhost:5000/api/v1/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setUserEmail(res.data.data.email || '');
                    setUserPlan(res.data.data.tenantId?.plan || 'free');
                }
            } catch (err) {
                console.error("Could not fetch user context", err);
            }
        };

        const fetchModules = async () => {
            try {
                const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
                const res = await axios.get('http://localhost:5000/api/v1/tools/modules', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setAvailableModules(res.data.data);
                }
            } catch (err) {
                console.error("Could not fetch modules", err);
            }
        };

        // Only fetch existing tool if id is not 'new'
        if (id && id !== 'new') {
            fetchTool();
        } else {
            setLoading(false);
        }
        fetchUserMe();
        fetchModules();
    }, [id, templateName, emailPrefix]);

    // --- Save current state to backend ---
    const handleSave = async () => {
        if (!tool) return;
        try {
            setSaving(true);
            const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
            const currentVer = tool.versions[tool.currentVersion - 1];

            const res = await axios.put(`http://localhost:5000/api/v1/tools/${tool._id}`, {
                instances: currentVer.instances,
                pages: currentVer.pages,
                layoutConfig: currentVer.layoutConfig
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setTool(res.data.data);
            }
        } catch (err) {
            console.error("Save failed:", err);
            alert("Failed to save: " + (err.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    // --- Publish with Vanity URL ---
    const handlePublish = async () => {
        if (!tool) return;
        try {
            setPublishing(true);
            const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
            const currentVer = tool.versions[tool.currentVersion - 1];

            const res = await axios.put(`http://localhost:5000/api/v1/tools/${tool._id}`, {
                isPublic: true,
                instances: currentVer.instances,
                pages: currentVer.pages,
                layoutConfig: currentVer.layoutConfig
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setTool(res.data.data);

                // Build vanity URL: site/slug/emailPrefix
                const emailPrefix = userEmail.split('@')[0] || 'user';
                const toolSlug = tool.slug || tool.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                const vanityUrl = `${window.location.origin}/site/${toolSlug}/${emailPrefix}`;

                setPublishedUrl(vanityUrl);
                setShowPublishModal(true);
            }
        } catch (err) {
            console.error("Publishing failed:", err);
            alert("Failed to publish app: " + (err.response?.data?.message || err.message));
        } finally {
            setPublishing(false);
        }
    };

    // --- Add a new page ---
    const handleAddPage = () => {
        if (!newPageName.trim() || !tool) return;
        const pageName = newPageName.trim();

        const currentVer = tool.versions[tool.currentVersion - 1];
        if (currentVer.pages.includes(pageName)) {
            alert(`Page "${pageName}" already exists!`);
            return;
        }

        const updatedTool = { ...tool };
        updatedTool.versions[tool.currentVersion - 1] = {
            ...currentVer,
            pages: [...currentVer.pages, pageName]
        };

        setTool(updatedTool);
        setActivePage(pageName);
        setNewPageName('');
        setShowAddPage(false);

        // Auto-save
        saveToolToBackend(updatedTool);
    };

    // --- Delete a page ---
    const handleDeletePage = (pageName) => {
        if (!tool) return;
        if (!confirm(`Delete page "${pageName}" and all its components?`)) return;

        const currentVer = tool.versions[tool.currentVersion - 1];
        const updatedPages = currentVer.pages.filter(p => p !== pageName);
        const updatedInstances = (currentVer.instances || []).filter(inst => inst.pageName !== pageName);

        const updatedTool = { ...tool };
        updatedTool.versions[tool.currentVersion - 1] = {
            ...currentVer,
            pages: updatedPages,
            instances: updatedInstances
        };

        setTool(updatedTool);
        if (activePage === pageName) {
            setActivePage(updatedPages[0] || 'Dashboard');
        }

        saveToolToBackend(updatedTool);
    };

    // --- Add a module to the current page ---
    const handleAddModule = (mod) => {
        if (!tool) return;

        // Plan Restriction Check
        if (mod.isPremium && userPlan === 'free') {
            alert("This is a Premium Module. Please upgrade your plan to Pro or Enterprise to use it!");
            return;
        }

        const currentVer = tool.versions[tool.currentVersion - 1];
        const newInstance = {
            id: `${mod.slug}_${Date.now()}`,
            moduleSlug: mod.slug,
            pageName: activePage,
            collectionName: `${mod.slug.toLowerCase().replace(/\s+/g, '_')}_data`,
            config: mod.defaultConfig || {}
        };

        const updatedTool = { ...tool };
        updatedTool.versions[tool.currentVersion - 1] = {
            ...currentVer,
            instances: [...(currentVer.instances || []), newInstance]
        };

        setTool(updatedTool);
        setIsLibraryOpen(false);

        saveToolToBackend(updatedTool);
    };

    // --- Remove a module instance ---
    const handleRemoveModule = (instanceIdx) => {
        if (!tool) return;

        const currentVer = tool.versions[tool.currentVersion - 1];
        const activeInsts = currentVer.instances.filter(inst => inst.pageName === activePage);
        const instToRemove = activeInsts[instanceIdx];

        if (!instToRemove) return;

        const updatedInstances = currentVer.instances.filter(inst => inst !== instToRemove);

        const updatedTool = { ...tool };
        updatedTool.versions[tool.currentVersion - 1] = {
            ...currentVer,
            instances: updatedInstances
        };

        setTool(updatedTool);
        saveToolToBackend(updatedTool);
    };

    // --- Centralized save helper ---
    const saveToolToBackend = async (updatedTool) => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
            const ver = updatedTool.versions[updatedTool.currentVersion - 1];

            await axios.put(`http://localhost:5000/api/v1/tools/${updatedTool._id}`, {
                instances: ver.instances,
                pages: ver.pages,
                layoutConfig: ver.layoutConfig
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.error("Auto-save failed:", err);
        }
    };

    const copyUrl = (url) => {
        navigator.clipboard.writeText(url);
        setUrlCopied(true);
        setTimeout(() => setUrlCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mb-4" />
                <h2 className="text-xl font-bold text-white mb-2 tracking-tight">Loading Builder Architecture</h2>
                <p className="text-slate-400">Parsing JSON Layout Config...</p>
            </div>
        );
    }

    if (!tool) {
        return (
            <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-white">
                <h2>Tool not found or unauthorized.</h2>
                <Link to="/dashboard" className="mt-4 text-brand-400 hover:text-brand-300">Return to Dashboard</Link>
            </div>
        );
    }

    const currentVersion = tool.versions[tool.currentVersion - 1];
    const pages = currentVersion.pages || [];
    const activeInstances = currentVersion.instances?.filter(inst => inst.pageName === activePage) || [];

    return (
        <div className="h-screen w-full flex overflow-hidden bg-black text-slate-300 font-sans">

            {/* Left Sidebar - Pages & App Structure */}
            <div className="w-64 border-r border-white/5 bg-slate-950 flex flex-col z-20 shrink-0">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors bg-white/5 p-2 rounded-lg">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div className="flex flex-col items-end">
                        <span className="font-bold text-white text-sm line-clamp-1">{tool.name}</span>
                        <span className="text-[10px] uppercase tracking-wider text-brand-400 font-bold px-2 py-0.5 rounded bg-brand-500/10 border border-brand-500/20">v{tool.currentVersion}.0</span>
                    </div>
                </div>

                <div className="p-4 flex flex-col flex-1 overflow-y-auto custom-scrollbar relative">
                    <div className="flex items-center justify-between mb-4 mt-2">
                        <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Pages</div>
                        <button
                            onClick={() => setShowAddPage(true)}
                            className="text-slate-500 hover:text-brand-400 transition-colors p-1 rounded hover:bg-white/5"
                            title="Add new page"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Add Page Input */}
                    <AnimatePresence>
                        {showAddPage && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-3 overflow-hidden"
                            >
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newPageName}
                                        onChange={(e) => setNewPageName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddPage()}
                                        placeholder="Page name..."
                                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-brand-500 transition-colors placeholder-slate-500"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleAddPage}
                                        className="p-2 bg-brand-500/20 text-brand-400 rounded-lg hover:bg-brand-500/30 transition-colors"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => { setShowAddPage(false); setNewPageName(''); }}
                                        className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-1">
                        {pages.map(page => (
                            <div key={page} className="group flex items-center gap-1">
                                <button
                                    onClick={() => setActivePage(page)}
                                    className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${activePage === page ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}`}
                                >
                                    <LayoutDashboard className={`w-4 h-4 ${activePage === page ? 'text-brand-400' : 'text-slate-500'}`} />
                                    {page}
                                </button>
                                {pages.length > 1 && (
                                    <button
                                        onClick={() => handleDeletePage(page)}
                                        className="p-1.5 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded"
                                        title={`Delete ${page}`}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between mb-4 mt-8">
                        <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Components</div>
                    </div>
                    <div className="space-y-1">
                        <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors text-sm">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4" /> Navigation Bar
                            </div>
                        </button>
                        <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors text-sm">
                            <div className="flex items-center gap-2">
                                <LayoutTemplate className="w-4 h-4" /> App Layout
                            </div>
                        </button>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-white/5 bg-slate-900/50 space-y-2">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all ${saving ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>

                    <button
                        onClick={handlePublish}
                        disabled={publishing}
                        className={`w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(139,92,246,0.2)] ${publishing ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 active:scale-95'}`}
                    >
                        {publishing ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Rocket className="w-4 h-4" />
                        )}
                        {publishing ? 'Publishing...' : 'Publish & Get URL'}
                    </button>
                </div>
            </div>

            {/* Central Canvas - The Live Editor */}
            <div className="flex-1 bg-[#0a0f1c] relative flex flex-col overflow-hidden">
                {/* Canvas Header */}
                <div className="h-14 border-b border-white/5 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-slate-500 font-medium">Pages</span>
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                            <span className="text-white font-bold">{activePage}</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-600 bg-white/5 px-2 py-0.5 rounded">
                            {activeInstances.length} module{activeInstances.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {tool.isPublic && (
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                LIVE
                            </div>
                        )}
                        <button
                            onClick={() => setIsLibraryOpen(!isLibraryOpen)}
                            className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2"
                        >
                            <Box className="w-4 h-4" />
                            Add Module
                        </button>
                    </div>
                </div>

                {/* Canvas Workspace */}
                <div className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar relative">
                    <div className="max-w-7xl mx-auto min-h-full">

                        {activeInstances.length === 0 ? (
                            <div className="h-[60vh] border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center bg-slate-900/20">
                                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 border border-slate-700">
                                    <LayoutGrid className="w-8 h-8 text-slate-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Empty Page</h3>
                                <p className="text-slate-400 text-center max-w-sm mb-6">This page has no components yet. Add modules from the library to build your app.</p>
                                <button
                                    onClick={() => setIsLibraryOpen(true)}
                                    className="px-6 py-3 bg-brand-500/20 text-brand-400 rounded-xl text-sm font-bold border border-brand-500/20 hover:bg-brand-500/30 transition-all flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Add Your First Module
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {activeInstances.map((instance, idx) => {
                                    // Use registry or fallback to CrudTable if type is likely data-driven
                                    const Component = MODULE_REGISTRY[instance.moduleSlug] || CrudTable;

                                    if (!Component) {
                                        return (
                                            <div key={idx} className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center justify-between">
                                                <span>Unknown Module: {instance.moduleSlug}</span>
                                                <button onClick={() => handleRemoveModule(idx)} className="p-1.5 hover:bg-red-500/20 rounded transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        );
                                    }

                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="w-full relative group"
                                        >
                                            {/* Live Component Renderer */}
                                            <Component instance={instance} />

                                            {/* Editor Overlay Actions (Hover) */}
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                <div className="flex items-center gap-1 bg-slate-950/90 backdrop-blur-md rounded-lg border border-slate-700 p-1 shadow-xl">
                                                    <button className="p-1.5 text-white rounded-md hover:bg-slate-700 transition-colors" title="Drag to reorder">
                                                        <GripVertical className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1.5 text-white rounded-md hover:bg-slate-700 transition-colors" title="Settings">
                                                        <Settings className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleRemoveModule(idx)} className="p-1.5 text-red-400 rounded-md hover:bg-red-500/20 transition-colors" title="Remove module">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Right Sidebar - Module Library Drawer */}
            <AnimatePresence>
                {isLibraryOpen && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'circOut' }}
                        className="w-80 border-l border-white/5 bg-slate-900 border-l z-20 flex flex-col shadow-2xl absolute right-0 top-0 bottom-0"
                    >
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-white text-lg">Module Library</h3>
                                <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest">
                                    {availableModules.length} Modules Available
                                </p>
                            </div>
                            <button onClick={() => setIsLibraryOpen(false)} className="text-slate-500 hover:text-white p-1 rounded hover:bg-white/5 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="p-4 border-b border-white/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={moduleSearch}
                                    onChange={(e) => setModuleSearch(e.target.value)}
                                    placeholder="Search modules..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                                />
                                {moduleSearch && (
                                    <button
                                        onClick={() => setModuleSearch('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="p-4 overflow-y-auto flex-1 space-y-3 custom-scrollbar relative">
                            {availableModules
                                .filter(mod =>
                                    mod.name.toLowerCase().includes(moduleSearch.toLowerCase()) ||
                                    mod.description.toLowerCase().includes(moduleSearch.toLowerCase())
                                )
                                .map((mod, i) => {
                                    const isLocked = mod.isPremium && userPlan === 'free';
                                    return (
                                        <button
                                            key={mod._id || i}
                                            onClick={() => handleAddModule(mod)}
                                            className={`w-full p-4 border rounded-2xl transition-all flex items-start gap-4 text-left group ${isLocked ? 'bg-slate-900/50 border-slate-800 opacity-60 cursor-not-allowed' : 'bg-slate-800/50 border-slate-700/50 hover:border-brand-500 hover:bg-slate-800 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]'}`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shrink-0 border border-slate-800 ${!isLocked && 'group-hover:bg-brand-500/10'}`}>
                                                <Box className={`w-6 h-6 ${isLocked ? 'text-slate-600' : 'text-brand-400'}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className={`text-sm font-bold transition-colors truncate ${isLocked ? 'text-slate-500' : 'text-white group-hover:text-brand-400'}`}>{mod.name}</h4>
                                                    {mod.isPremium && (
                                                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase flex items-center gap-1 ${isLocked ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-brand-500/10 text-brand-400 border-brand-500/20'}`}>
                                                            {isLocked && <Settings className="w-2 h-2" />}
                                                            Pro
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{mod.description}</p>
                                            </div>
                                            {!isLocked && <Plus className="w-4 h-4 text-slate-600 group-hover:text-brand-400 shrink-0 mt-1 transition-colors" />}
                                        </button>
                                    );
                                })}

                            {availableModules.filter(mod =>
                                mod.name.toLowerCase().includes(moduleSearch.toLowerCase()) ||
                                mod.description.toLowerCase().includes(moduleSearch.toLowerCase())
                            ).length === 0 && (
                                    <div className="py-12 text-center">
                                        <Box className="w-12 h-12 text-slate-800 mx-auto mb-4 opacity-20" />
                                        <p className="text-slate-500 text-sm">No modules found matching "{moduleSearch}"</p>
                                    </div>
                                )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Publish Success Modal */}
            <AnimatePresence>
                {showPublishModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowPublishModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl"
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Rocket className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">App Published! 🎉</h2>
                                <p className="text-slate-400 text-sm mt-2">Your application is now live and accessible to anyone.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2 block">Your Vanity URL</label>
                                    <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl p-3">
                                        <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span className="text-white font-mono text-sm flex-1 break-all">{publishedUrl}</span>
                                        <button
                                            onClick={() => copyUrl(publishedUrl)}
                                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                                            title="Copy URL"
                                        >
                                            {urlCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2 block">Local Preview URL</label>
                                    <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl p-3">
                                        <ExternalLink className="w-4 h-4 text-blue-400 shrink-0" />
                                        <span className="text-slate-300 font-mono text-xs flex-1 break-all">
                                            {`${window.location.origin}/builder/${tool.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}/${userEmail.split('@')[0]}/minisaas.in`}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-[10px] text-slate-500 text-center">
                                    The vanity URL format is: <span className="text-slate-400 font-mono">{'{email-prefix}'}.minisaas.in</span>
                                </p>
                            </div>

                            <button
                                onClick={() => setShowPublishModal(false)}
                                className="w-full mt-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold border border-white/10 transition-all"
                            >
                                Done
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Builder;
