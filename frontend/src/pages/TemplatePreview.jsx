import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Monitor, Smartphone, Tablet } from 'lucide-react';
import axios from 'axios';
import ContentContext from '../context/ContentContext';
import ThemeProvider from '../context/ThemeProvider';
import TemplateRenderer from '../components/templates/TemplateRenderer';

const TemplatePreview = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('desktop'); // desktop, tablet, mobile

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/v1/templates/${slug}`);
                if (res.data.success) {
                    setTemplate(res.data.data);
                }
            } catch (err) {
                console.error("Failed to load template preview:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTemplate();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <h2 className="text-xl font-bold text-white">Loading Preview...</h2>
            </div>
        );
    }

    if (!template) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-white mb-4">Template Not Found</h2>
                <Link to="/templates" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors">
                    Back to Gallery
                </Link>
            </div>
        );
    }

    // Mock ContentContext values using the template's defaultContent
    const mockContentMap = {};
    if (template.defaultContent) {
        template.defaultContent.forEach(item => {
            if (!mockContentMap[item.page]) mockContentMap[item.page] = {};
            mockContentMap[item.page][item.section] = item.data;
        });
    }

    const mockContextValue = {
        tenantId: 'preview',
        template: template,
        theme: template.theme,
        siteSettings: { siteName: template.name + ' Preview', tagline: template.description },
        plan: 'premium',
        loading: false,
        contentMap: mockContentMap,
        fetchPageContent: async (page) => mockContentMap[page] || {},
        getPageContent: (page) => mockContentMap[page] || {},
        getSectionData: (page, section) => mockContentMap[page]?.[section] || {}
    };

    const getViewStyle = () => {
        switch (viewMode) {
            case 'mobile': return { width: '375px', height: '812px', margin: '0 auto', border: '12px solid #1e293b', borderRadius: '36px', overflow: 'hidden' };
            case 'tablet': return { width: '768px', height: '1024px', margin: '0 auto', border: '12px solid #1e293b', borderRadius: '24px', overflow: 'hidden' };
            default: return { width: '100%', height: 'calc(100vh - 64px)', border: 'none', borderRadius: 0 };
        }
    };

    return (
        <div className="bg-slate-900 min-h-screen flex flex-col">
            {/* Top Toolbar */}
            <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/templates')} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-medium hidden sm:inline">Back to Gallery</span>
                    </button>
                    <div className="h-6 w-px bg-slate-700 mx-2"></div>
                    <h1 className="text-white font-bold">{template.name} <span className="text-slate-400 font-normal ml-2 hidden sm:inline">Preview</span></h1>
                </div>

                {/* Viewport Toggles */}
                <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-700 hidden md:flex">
                    <button onClick={() => setViewMode('desktop')} className={`p-2 rounded-md transition-colors ${viewMode === 'desktop' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}>
                        <Monitor size={18} />
                    </button>
                    <button onClick={() => setViewMode('tablet')} className={`p-2 rounded-md transition-colors ${viewMode === 'tablet' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}>
                        <Tablet size={18} />
                    </button>
                    <button onClick={() => setViewMode('mobile')} className={`p-2 rounded-md transition-colors ${viewMode === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}>
                        <Smartphone size={18} />
                    </button>
                </div>

                <div>
                    <button onClick={() => {
                        const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
                        if (!token) {
                            navigate('/login');
                            return;
                        }
                        axios.post(`http://localhost:5000/api/v1/templates/clone/${template._id}`, {}, {
                            headers: { Authorization: `Bearer ${token}` }
                        }).then(res => {
                            if (res.data.success) navigate('/admin/manage');
                        }).catch(err => {
                            alert(err.response?.data?.message || 'Failed to clone template');
                            if (err.response?.status === 401) navigate('/login');
                        });
                    }} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20">
                        Use Template
                    </button>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-slate-950 overflow-auto flex items-center justify-center p-4 sm:p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        ...getViewStyle(),
                        backgroundColor: '#fff',
                        boxShadow: viewMode !== 'desktop' ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative'
                    }}
                >
                    <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
                        <ContentContext.Provider value={mockContextValue}>
                            <ThemeProvider themeOverride={template.theme}>
                                <TemplateRenderer />
                            </ThemeProvider>
                        </ContentContext.Provider>
                    </div>
                </motion.div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 20px; }
            `}</style>
        </div>
    );
};

export default TemplatePreview;
