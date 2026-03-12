import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, LayoutTemplate, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../styles/pages.css';

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
                navigate('/admin/manage');
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
        <div className="page-container" style={{ paddingTop: 'var(--spacing-20)' }}>
            <div style={{ maxWidth: '80rem', margin: '0 auto', width: '100%' }}>
                <div className="template-hero">
                    <LayoutTemplate className="template-hero-icon" />
                    <div>
                        <h1 className="template-hero-title">SaaS Template Library</h1>
                        <p className="template-hero-desc">Select a pre-configured architecture blueprint to instantly generate your SaaS backend.</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="data-empty">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--color-secondary)' }}></div>
                    </div>
                ) : (
                    <div className="template-grid">
                        {templates.map((template, idx) => {
                            // Map database colorTheme string to actual CSS gradients
                            const colorMap = {
                                "blue": "linear-gradient(to bottom right, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2))",
                                "indigo": "linear-gradient(to bottom right, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))",
                                "emerald": "linear-gradient(to bottom right, rgba(16, 185, 129, 0.2), rgba(20, 184, 166, 0.2))",
                                "rose": "linear-gradient(to bottom right, rgba(244, 63, 94, 0.2), rgba(236, 72, 153, 0.2))",
                                "violet": "linear-gradient(to bottom right, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.2))",
                                "teal": "linear-gradient(to bottom right, rgba(20, 184, 166, 0.2), rgba(16, 185, 129, 0.2))",
                                "fuchsia": "linear-gradient(to bottom right, rgba(217, 70, 239, 0.2), rgba(236, 72, 153, 0.2))",
                                "cyan": "linear-gradient(to bottom right, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))",
                                "orange": "linear-gradient(to bottom right, rgba(249, 115, 22, 0.2), rgba(245, 158, 11, 0.2))",
                                "amber": "linear-gradient(to bottom right, rgba(245, 158, 11, 0.2), rgba(234, 179, 8, 0.2))",
                                "slate": "linear-gradient(to bottom right, rgba(100, 116, 139, 0.2), rgba(107, 114, 128, 0.2))"
                            };

                            const iconColorMap = {
                                "blue": "rgb(96, 165, 250)",
                                "indigo": "rgb(129, 140, 248)",
                                "emerald": "rgb(52, 211, 153)",
                                "rose": "rgb(251, 113, 133)",
                                "violet": "rgb(167, 139, 250)",
                                "teal": "rgb(45, 212, 191)",
                                "fuchsia": "rgb(232, 121, 249)",
                                "cyan": "rgb(34, 211, 238)",
                                "orange": "rgb(251, 146, 60)",
                                "amber": "rgb(251, 191, 36)",
                                "slate": "rgb(148, 163, 184)"
                            };

                            const themeBg = colorMap[template.colorTheme] || colorMap["blue"];
                            const themeIconColor = iconColorMap[template.colorTheme] || iconColorMap["blue"];

                            return (
                                <motion.div
                                    key={template._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="template-card"
                                >
                                    {/* Dynamic Graphic Header instead of iframe */}
                                    <div className="template-graphic" style={{ background: themeBg, borderColor: themeIconColor }}>
                                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <LayoutTemplate className="template-graphic-icon" style={{ color: themeIconColor }} />
                                        </div>
                                        <div className="template-graphic-badges">
                                            <span className="template-badge">
                                                {template.defaultTools?.length || 0} Collections
                                            </span>
                                            <span className="template-badge">
                                                {template.pages?.length || 0} Pages
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="template-name">{template.name}</h3>
                                    <p className="template-desc">{template.description}</p>

                                    <div className="template-actions">
                                        <button
                                            onClick={() => navigate(`/templatePreview/${template.slug}`)}
                                            className="btn-template btn-template-preview"
                                        >
                                            <Monitor style={{ width: '16px', height: '16px' }} /> Preview
                                        </button>
                                        <button
                                            onClick={() => handleClone(template._id)}
                                            className="btn-template btn-template-use"
                                        >
                                            <Copy style={{ width: '16px', height: '16px' }} /> Use
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
