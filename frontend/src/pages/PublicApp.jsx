import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Globe, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

// Import our Physical React Module Interpreters
import CrudTable from '../components/modules/CrudTable';
import ChartDashboard from '../components/modules/ChartDashboard';
import KanbanBoard from '../components/modules/KanbanBoard';

// Map database slugs to React Components
const MODULE_REGISTRY = {
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
    'task_list': KanbanBoard,
    'sales_pipeline': KanbanBoard,
    'sprint_board': KanbanBoard,
    'contact_manager': CrudTable,
    'product_catalog': CrudTable,
    'order_manager': CrudTable,
    'inventory_tracker': CrudTable,
    'employee_directory': CrudTable,
    'bug_tracker': CrudTable
};

const PublicApp = () => {
    const { templateName, emailPrefix } = useParams();
    const [tool, setTool] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activePage, setActivePage] = useState('Dashboard');

    useEffect(() => {
        const fetchPublicApp = async () => {
            try {
                setLoading(true);
                // No token needed for public view
                const url = `http://localhost:5000/api/v1/tools/resolve/${templateName}/${emailPrefix}`;
                const res = await axios.get(url);

                if (res.data.success) {
                    setTool(res.data.data);
                    const pages = res.data.data.versions[res.data.data.currentVersion - 1]?.pages || [];
                    if (pages.length > 0 && !pages.includes('Dashboard')) {
                        setActivePage(pages[0]);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch public app:", err);
                setError(err.response?.data?.message || "This application could not be loaded.");
            } finally {
                setLoading(false);
            }
        };

        if (templateName && emailPrefix) {
            fetchPublicApp();
        }
    }, [templateName, emailPrefix]);

    if (loading) {
        return (
            <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <h2 className="text-xl font-bold text-white tracking-tight">Initializing Application</h2>
                <p className="text-slate-400 mt-2">Connecting to SaaS Engine...</p>
            </div>
        );
    }

    if (error || !tool) {
        return (
            <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Application Offline</h2>
                <p className="text-slate-400 max-w-md mb-8">{error || "The requested application was not found or is currently private."}</p>
                <Link to="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-bold">
                    Go to SaaSForge Home
                </Link>
            </div>
        );
    }

    const currentVersion = tool.versions[tool.currentVersion - 1];
    const pages = currentVersion?.pages || [];
    const activeInstances = currentVersion?.instances?.filter(inst => inst.pageName === activePage) || [];

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-slate-300 font-sans flex flex-col">
            {/* Minimal Header */}
            <header className="h-16 bg-slate-900 shadow-lg border-b border-white/5 flex items-center justify-between px-6 shrink-0 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                        {tool.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-white font-bold leading-tight">{tool.name}</h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Powered by SaaSForge.ai</p>
                    </div>
                </div>

                <nav className="hidden md:flex items-center gap-1">
                    {pages.map(page => (
                        <button
                            key={page}
                            onClick={() => setActivePage(page)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activePage === page ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            {page}
                        </button>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <button className="p-2 text-slate-400 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/5">
                        <Globe className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Mobile Nav */}
            <div className="md:hidden flex overflow-x-auto bg-slate-900/50 backdrop-blur-md border-b border-white/5 px-2 py-2 gap-2 custom-scrollbar">
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => setActivePage(page)}
                        className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-sm font-medium transition-all shrink-0 ${activePage === page ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400'}`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activePage}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            {activeInstances.length === 0 ? (
                                <div className="py-20 text-center">
                                    <LayoutDashboard className="w-16 h-16 text-slate-800 mx-auto mb-4 opacity-30" />
                                    <h3 className="text-xl font-bold text-slate-500">Nothing here yet</h3>
                                    <p className="text-slate-600">The application owner hasn't added any content to this page.</p>
                                </div>
                            ) : (
                                activeInstances.map((instance, idx) => {
                                    const Component = MODULE_REGISTRY[instance.moduleSlug] || CrudTable;
                                    return (
                                        <div key={idx} className="w-full">
                                            <Component instance={instance} />
                                        </div>
                                    );
                                })
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Subtle Footer */}
            <footer className="py-8 px-6 border-t border-white/5 bg-slate-900/30 text-center">
                <p className="text-slate-600 text-xs">
                    This is a generated Micro-SaaS instance.
                    <Link to="/" className="text-blue-500/50 hover:text-blue-500 ml-1 transition-colors underline underline-offset-4">
                        Build your own for free →
                    </Link>
                </p>
            </footer>
        </div>
    );
};

export default PublicApp;
