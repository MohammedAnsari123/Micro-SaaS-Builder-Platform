import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Copy, Star, Download, Tag, Calendar, LayoutTemplate, LayoutDashboard, Edit3, Eye, Loader2 } from 'lucide-react';
import axios from 'axios';

// Import the same module registry used in Builder.jsx for live rendering
import CrudTable from '../components/modules/CrudTable';
import ChartDashboard from '../components/modules/ChartDashboard';
import KanbanBoard from '../components/modules/KanbanBoard';

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

const ToolDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tool, setTool] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cloning, setCloning] = useState(false);

    // Live Preview states
    const [previewPage, setPreviewPage] = useState(null);

    // User and Plan state
    const [userPlan, setUserPlan] = useState('free');
    const [userCloneId, setUserCloneId] = useState(null);
    const [checkingClone, setCheckingClone] = useState(true);

    useEffect(() => {
        fetchToolDetails();
    }, [id]);

    // Run clone check only after tool data is available
    useEffect(() => {
        if (tool) {
            checkUserClone();
        }
    }, [tool]);

    const fetchToolDetails = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:5000/api/v1/marketplace/${id}`);
            setTool(res.data.data);

            // Set the default preview page to the first page
            const latestVersion = res.data.data.versions[res.data.data.versions.length - 1];
            if (latestVersion && latestVersion.pages && latestVersion.pages.length > 0) {
                setPreviewPage(latestVersion.pages[0]);
            }
        } catch (error) {
            console.error("Error fetching tool details", error);
        } finally {
            setLoading(false);
        }
    };

    // Check if the logged-in user already owns a clone of this tool
    const checkUserClone = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setCheckingClone(false);
                return;
            }
            const { data } = await axios.get('http://localhost:5000/api/v1/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                const user = data.data;
                setUserPlan(user.tenantId?.plan || 'free');

                // Now fetch tools to check for clones
                const toolsRes = await axios.get('http://localhost:5000/api/v1/tools', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (toolsRes.data.success && tool) {
                    const clone = toolsRes.data.data.find(t =>
                        t.name === `${tool.name} (Clone)` ||
                        t.name.startsWith(tool.name) && t.name.includes('(Clone)')
                    );
                    if (clone) {
                        setUserCloneId(clone._id);
                    }
                }
            }
        } catch (err) {
            console.error("Could not check clone ownership", err);
        } finally {
            setCheckingClone(false);
        }
    };

    const handleClone = async () => {
        try {
            setCloning(true);
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `http://localhost:5000/api/v1/marketplace/clone/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                navigate(`/builder/${res.data.data._id}`);
            }
        } catch (error) {
            alert(error.response?.data?.error || "Error cloning template. You might have already cloned this or you need to log in.");
            console.error(error);
        } finally {
            setCloning(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[50vh] flex flex-col justify-center items-center gap-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">Loading template details...</p>
            </div>
        );
    }

    if (!tool) {
        return (
            <div className="h-[60vh] bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-center items-center py-20 text-white shadow-lg relative">
                <button onClick={() => navigate('/marketplace')} className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest bg-slate-800/50 p-2 rounded-xl">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <LayoutTemplate className="w-16 h-16 text-slate-600 mb-4" />
                <h2 className="text-2xl font-bold">Template Not Found</h2>
                <p className="text-slate-400 mt-2">This tool may have been made private or deleted.</p>
            </div>
        );
    }

    // Extract live preview data
    const latestVersion = tool.versions[tool.versions.length - 1];
    const pages = latestVersion?.pages || [];
    const instances = latestVersion?.instances || [];
    const activeInstances = instances.filter(inst => inst.pageName === previewPage);

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate('/marketplace')}
                className="flex items-center text-xs font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2 rounded-xl w-fit"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Ecosystem
            </button>

            {/* Header / Hero */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-lg">
                <div className="flex flex-col xl:flex-row justify-between items-start gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">{tool.name}</h1>
                            <div className="flex flex-col gap-2">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${tool.price === 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                    {tool.price === 0 ? 'FREE' : `$${(tool.price / 100).toFixed(2)}`}
                                </span>
                                {tool.isPremium && (
                                    <span className="bg-brand-500/10 text-brand-400 text-[10px] font-black px-3 py-1 rounded-full border border-brand-500/20 uppercase tracking-widest text-center flex items-center justify-center gap-1">
                                        <Settings className="w-3 h-3" />
                                        Premium Tool
                                    </span>
                                )}
                            </div>
                        </div>

                        <p className="text-xl text-slate-400 leading-relaxed mb-6 max-w-3xl">
                            {tool.description || 'No description provided for this template architecture.'}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-400 mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700"></div>
                                <span className="text-slate-300">By {tool.tenantId?.name}</span>
                            </div>
                            <div className="flex items-center gap-2" title="Popularity">
                                <Download className="w-4 h-4" />
                                <span>{tool.clonesCount} Clones</span>
                            </div>
                            <div className="flex items-center gap-2" title="Rating">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>{tool.rating.toFixed(1)} / 5.0 ({tool.reviewsCount} Reviews)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Updated {new Date(tool.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {tool.tags && tool.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tool.tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 text-xs px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
                                        <Tag className="w-3 h-3" /> {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Card */}
                    <div className="w-full lg:w-96 shrink-0 space-y-4">
                        <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
                            <h3 className="text-lg font-bold text-white mb-2">Clone Architecture</h3>
                            <p className="text-sm text-slate-400 mb-6">Create a live, independent copy of this engine in your own tenant space instantly.</p>

                            <button
                                onClick={handleClone}
                                disabled={cloning}
                                className={`w-full py-4 rounded-xl flex justify-center items-center gap-3 font-bold transition-all shadow-lg ${cloning
                                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                    : tool.isPremium && userPlan === 'free'
                                        ? 'bg-slate-800 border border-slate-700 cursor-not-allowed text-slate-500'
                                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25 hover:shadow-blue-500/40'
                                    }`}
                            >
                                {cloning ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        {tool.isPremium && userPlan === 'free' ? (
                                            <Settings className="w-5 h-5 text-slate-600" />
                                        ) : (
                                            <Copy className="w-5 h-5" />
                                        )}
                                        {tool.isPremium && userPlan === 'free'
                                            ? 'Upgrade to Clone'
                                            : tool.price === 0 ? 'Clone Template (Free)' : `Purchase & Clone ($${(tool.price / 100).toFixed(2)})`}
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-center text-slate-500 mt-4">
                                {tool.price > 0 && "Purchases directly support the creator. "}
                                Requires an active account.
                            </p>
                        </div>

                        {/* Edit Clone Button - Only visible to clone owners */}
                        {!checkingClone && userCloneId && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 p-5 rounded-2xl"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">You own a clone</span>
                                </div>
                                <p className="text-sm text-slate-400 mb-4">Open your cloned version in the drag-and-drop Builder to customize pages, modules, and data.</p>
                                <button
                                    onClick={() => navigate(`/builder/${userCloneId}`)}
                                    className="w-full py-3 rounded-xl flex justify-center items-center gap-2 font-bold transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-[0.98]"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Open in Builder (Drag & Drop)
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Live Preview Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                <div className="xl:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Eye className="w-6 h-6 text-blue-400" /> Live Preview
                        </h2>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            READ-ONLY
                        </div>
                    </div>

                    {/* Page Tabs */}
                    {pages.length > 0 && (
                        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl mb-6 overflow-x-auto">
                            {pages.map(page => (
                                <button
                                    key={page}
                                    onClick={() => setPreviewPage(page)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${previewPage === page
                                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20 shadow-inner'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                                        }`}
                                >
                                    <LayoutDashboard className={`w-3.5 h-3.5 ${previewPage === page ? 'text-blue-400' : 'text-slate-500'}`} />
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Live Rendered Modules */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden min-h-[500px] relative">
                        {/* Preview Container */}
                        <div className="p-6">
                            {pages.length === 0 && instances.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[400px] text-slate-500 gap-4">
                                    <LayoutTemplate className="w-16 h-16 opacity-30" />
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-white mb-2">No Preview Available</p>
                                        <p className="text-sm">This template's architecture doesn't have visual modules to render yet.</p>
                                        <p className="text-xs mt-2 text-slate-600">Clone this template and add modules through the Builder.</p>
                                    </div>
                                </div>
                            ) : activeInstances.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[400px] text-slate-500 gap-4">
                                    <LayoutDashboard className="w-12 h-12 opacity-30" />
                                    <div className="text-center">
                                        <p className="font-bold text-white mb-1">Empty Page: {previewPage}</p>
                                        <p className="text-sm">No components have been added to this page yet.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 pointer-events-none select-none">
                                    <AnimatePresence>
                                        {activeInstances.map((instance, idx) => {
                                            const Component = MODULE_REGISTRY[instance.moduleSlug] || CrudTable;
                                            if (!Component) {
                                                return (
                                                    <div key={idx} className="p-4 bg-blue-500/5 border border-blue-500/10 text-blue-400 rounded-xl text-sm flex items-center gap-3">
                                                        <LayoutTemplate className="w-5 h-5 shrink-0" />
                                                        <div>
                                                            <span className="font-bold">Module: </span>
                                                            <span className="text-slate-300">{instance.moduleSlug}</span>
                                                            <span className="text-slate-500 ml-2">— Clone to interact with this component</span>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <motion.div
                                                    key={`${previewPage}-${idx}`}
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -15 }}
                                                    transition={{ delay: idx * 0.08 }}
                                                    className="w-full relative"
                                                >
                                                    <Component instance={instance} />
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Read-only overlay indicator */}
                        <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-lg border border-slate-800 text-xs font-bold text-slate-400 shadow-xl flex items-center gap-2 uppercase tracking-widest">
                            <Eye className="w-3.5 h-3.5 text-blue-400" />
                            Preview Mode
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="xl:col-span-1">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Community Reviews</h2>
                    </div>

                    <div className="space-y-4">
                        {tool.reviews && tool.reviews.length > 0 ? (
                            tool.reviews.map(review => (
                                <div key={review._id} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-semibold text-white">{review.tenantId?.name || 'Anonymous User'}</span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-700'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-sm">{review.comment}</p>
                                    <p className="text-slate-600 text-xs mt-3">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))
                        ) : (
                            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl text-center text-slate-500">
                                <Star className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">No reviews yet.</p>
                                <p className="text-xs mt-1">Clone this tool to be the first to review it!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolDetail;
