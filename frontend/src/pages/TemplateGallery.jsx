import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, LayoutTemplate } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TemplateGallery = () => {
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/templates');
                setTemplates(res.data.data);
            } catch (err) {
                console.error("Failed to fetch templates", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTemplates();
    }, []);

    const handleClone = async (id) => {
        const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const res = await axios.post(`http://localhost:5000/api/v1/templates/clone/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                navigate(`/builder/${res.data.data._id}`);
            }
        } catch (err) {
            console.error("Clone Error:", err);
            if (err.response?.status === 401) {
                alert('Your session has expired. Please log in again.');
                navigate('/login');
            } else {
                alert(err.response?.data?.message || 'Failed to clone template');
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <LayoutTemplate className="w-10 h-10 text-blue-500" />
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
                            SaaS Template Library
                        </h1>
                        <p className="text-slate-400">Select a pre-configured architecture blueprint to instantly generate your SaaS backend.</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {templates.map((template, idx) => {
                            // Map database colorTheme string to actual Tailwind functional classes
                            const colorMap = {
                                "blue": "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
                                "indigo": "from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30",
                                "emerald": "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
                                "rose": "from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30",
                                "violet": "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30",
                                "teal": "from-teal-500/20 to-emerald-500/20 text-teal-400 border-teal-500/30",
                                "fuchsia": "from-fuchsia-500/20 to-pink-500/20 text-fuchsia-400 border-fuchsia-500/30",
                                "cyan": "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
                                "orange": "from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/30",
                                "amber": "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30",
                                "slate": "from-slate-500/20 to-gray-500/20 text-slate-400 border-slate-500/30"
                            };

                            const themeClass = colorMap[template.colorTheme] || colorMap["blue"];

                            return (
                                <motion.div
                                    key={template._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 group flex flex-col h-full"
                                >
                                    {/* Dynamic Graphic Header instead of iframe */}
                                    <div className={`h-40 rounded-xl mb-6 relative overflow-hidden bg-gradient-to-br ${themeClass.split(' ')[0]} ${themeClass.split(' ')[1]} border ${themeClass.split(' ')[3]} group-hover:brightness-110 transition-all`}>
                                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <LayoutTemplate className={`w-16 h-16 ${themeClass.split(' ')[2]} opacity-80 group-hover:scale-110 transition-transform duration-500`} />
                                        </div>
                                        <div className="absolute bottom-3 left-3 flex gap-2">
                                            <span className={`px-2 py-1 rounded bg-black/40 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white/90`}>
                                                {Object.keys(template.schemaConfig || {}).length} Collections
                                            </span>
                                            <span className={`px-2 py-1 rounded bg-black/40 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white/90`}>
                                                {template.defaultPages?.length || 0} Pages
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-2 text-white">{template.name}</h3>
                                    <p className="text-slate-400 mb-6 flex-grow text-sm leading-relaxed">{template.description}</p>

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                                        <button
                                            onClick={() => handleClone(template._id)}
                                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl transition-colors font-medium shadow-lg shadow-blue-500/25"
                                        >
                                            <Copy className="w-4 h-4" /> Use Blueprint
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplateGallery;
