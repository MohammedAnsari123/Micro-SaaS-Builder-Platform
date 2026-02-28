import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertTriangle, Copy, LayoutTemplate, ArrowLeft, Eye } from 'lucide-react';
import TemplateUIEngine from '../components/dynamic/TemplateUIEngine';

const TemplatePreview = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCloning, setIsCloning] = useState(false);

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/v1/templates/${slug}`);
                setTemplate(res.data.data);
            } catch (err) {
                console.error(err);
                alert('Template not found');
                navigate('/templateSites');
            } finally {
                setLoading(false);
            }
        };
        fetchTemplate();
    }, [slug, navigate]);

    const handleClone = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        setIsCloning(true);
        try {
            const res = await axios.post(`http://localhost:5000/api/v1/templates/clone/${template._id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                navigate(`/builder/${res.data.data._id}`);
            }
        } catch (err) {
            console.error(err);
            alert('Clone failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsCloning(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative">
            {/* Sticky Preview Ribbon */}
            <div className="sticky top-0 z-50 bg-slate-900 border-b border-blue-500/30 text-white px-6 py-4 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-4">
                    <span className="bg-blue-500/20 text-blue-400 border border-blue-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Preview Mode
                    </span>
                    <h2 className="text-xl font-bold">{template.name}</h2>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/templateSites')} className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Back to Gallery
                    </button>
                    <button
                        onClick={handleClone}
                        disabled={isCloning}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 text-sm"
                    >
                        <Copy className="w-4 h-4" />
                        {isCloning ? 'Cloning Engine...' : 'Use This Template'}
                    </button>
                </div>
            </div>

            {/* Dynamic Layout Engine Render Surface */}
            <div className="flex-1 w-full bg-slate-50 overflow-y-auto">
                <TemplateUIEngine template={template.versions[0]} />
            </div>
        </div>
    );
};

export default TemplatePreview;
