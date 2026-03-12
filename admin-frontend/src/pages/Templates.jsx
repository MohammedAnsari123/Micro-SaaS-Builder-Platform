import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutTemplate, Plus, Edit, Trash2, RefreshCw, Sparkles, Box, Copy, Star, X, Code, Type } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000/api/v1';

const Templates = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createMode, setCreateMode] = useState('json'); // 'json' or 'form'
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [createForm, setCreateForm] = useState({
        name: '', slug: '', description: '', type: 'informational', category: 'General',
        jsonPayload: '{\n  "name": "",\n  "slug": "",\n  "description": "",\n  "type": "informational",\n  "category": "General",\n  "modules": [],\n  "pages": []\n}'
    });

    useEffect(() => { fetchTemplates(); }, []);

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API}/admin/templates`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) setTemplates(data.data);
        } catch (err) {
            console.error('Failed to fetch templates', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (id, field, value) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`${API}/admin/templates/${id}`, { [field]: value }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTemplates();
        } catch { alert('Failed to update template'); }
    };

    const filtered = templates.filter(t => {
        if (filter === 'functional') return t.type === 'functional';
        if (filter === 'informational') return t.type !== 'functional';
        return true;
    });

    const handleCreate = () => {
        setIsEditing(false);
        setEditingId(null);
        setCreateForm({
            name: '', slug: '', description: '', type: 'informational', category: 'General',
            jsonPayload: '{\n  "name": "",\n  "slug": "",\n  "description": "",\n  "type": "informational",\n  "category": "General",\n  "modules": [],\n  "pages": []\n}'
        });
        setShowCreateModal(true);
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            let payload = {};
            if (createMode === 'json') {
                try {
                    payload = JSON.parse(createForm.jsonPayload);
                } catch (err) {
                    alert('Invalid JSON format');
                    return;
                }
            } else {
                payload = {
                    name: createForm.name,
                    slug: createForm.slug,
                    description: createForm.description,
                    type: createForm.type,
                    category: createForm.category,
                    modules: [],
                    pages: []
                };
            }

            let requestUrl = `${API}/admin/templates`;
            let requestMethod = axios.post;

            if (isEditing && editingId) {
                requestUrl = `${API}/admin/templates/${editingId}`;
                requestMethod = axios.put;
            }

            const { data } = await requestMethod(requestUrl, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setShowCreateModal(false);
                fetchTemplates();
                setCreateForm({
                    name: '', slug: '', description: '', type: 'informational', category: 'General',
                    jsonPayload: '{\n  "name": "",\n  "slug": "",\n  "description": "",\n  "type": "informational",\n  "category": "General",\n  "modules": [],\n  "pages": []\n}'
                });
            }
        } catch (err) {
            console.error(err);
            alert(`Failed to ${isEditing ? 'update' : 'create'} template: ` + (err.response?.data?.message || err.message));
        }
    };

    const handleEdit = (e, template) => {
        e.stopPropagation();
        setIsEditing(true);
        setEditingId(template._id);

        // Strip out Mongoose internals and keep it clean for the JSON editor
        const cleanTemplate = { ...template };
        delete cleanTemplate._id;
        delete cleanTemplate.__v;
        delete cleanTemplate.createdAt;

        setCreateForm({
            name: template.name || '',
            slug: template.slug || '',
            description: template.description || '',
            type: template.type || 'informational',
            category: template.category || 'General',
            jsonPayload: JSON.stringify(cleanTemplate, null, 2)
        });

        setShowCreateModal(true);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this template? This cannot be undone.")) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`${API}/admin/templates/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchTemplates();
            } catch (err) {
                alert('Failed to delete template: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] relative z-10">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-t-2 border-brand-500 border-l-2 border-transparent animate-spin" />
                    <div className="w-16 h-16 rounded-full border-r-2 border-blue-500 border-b-2 border-transparent animate-spin absolute inset-0 animation-delay-500" />
                    <LayoutTemplate className="w-6 h-6 text-brand-600 absolute top-1/2 left-1/2 -tranindigo-x-1/2 -tranindigo-y-1/2 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 relative z-10 pb-10">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-r from-brand-600/10 to-blue-600/10 p-6 rounded-3xl border border-indigo-200 backdrop-blur-md">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 mb-2"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-pink-600 p-[1px]">
                            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                                <LayoutTemplate className="w-5 h-5 text-pink-400" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-indigo-900 tracking-tight">Template Library</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-indigo-500 font-medium ml-1"
                    >
                        Manage, curate, and configure platform starter templates ({templates.length} total)
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-3"
                >
                    <div className="flex bg-indigo-50 rounded-xl p-1 border border-indigo-200 shadow-inner mr-2">
                        {['all', 'functional', 'informational'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${filter === f ? 'bg-indigo-100 text-indigo-900 shadow-sm' : 'text-indigo-500 hover:text-indigo-600'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <button onClick={fetchTemplates} className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl border border-indigo-300 transition-all flex items-center gap-2 group">
                        <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                    <button onClick={handleCreate} className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-indigo-900 text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.5)] flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Create Template
                    </button>
                </motion.div>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filtered.map((t, i) => {
                        // Admin Dashboard Color Map
                        const colorMap = {
                            "blue": "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30 bg-blue-500",
                            "indigo": "from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30 bg-indigo-500",
                            "emerald": "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30 bg-emerald-500",
                            "rose": "from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30 bg-rose-500",
                            "violet": "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30 bg-violet-500",
                            "teal": "from-teal-500/20 to-emerald-500/20 text-teal-400 border-teal-500/30 bg-teal-500",
                            "fuchsia": "from-fuchsia-500/20 to-pink-500/20 text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500",
                            "cyan": "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30 bg-cyan-500",
                            "orange": "from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/30 bg-orange-500",
                            "amber": "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30 bg-amber-500",
                            "slate": "from-indigo-500/20 to-indigo-500/20 text-indigo-500 border-indigo-500/30 bg-indigo-500"
                        };
                        const themeClass = colorMap[t.colorTheme] || colorMap["blue"];
                        const cArr = themeClass.split(' ');

                        return (
                            <motion.div
                                key={t._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                className="glass-panel rounded-3xl overflow-hidden group hover:-tranindigo-y-1 transition-all duration-300"
                            >
                                {/* Graphic Header */}
                                <div className={`h-40 relative overflow-hidden bg-white border-b ${cArr[3]}`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${cArr[0]} ${cArr[1]} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative">
                                            <div className={`absolute inset-0 blur-xl opacity-40 ${cArr[4]}`} />
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-xl relative z-10 ${cArr[0]} ${cArr[3]} ${cArr[2]}`}>
                                                <LayoutTemplate className="w-8 h-8" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Top Badges */}
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                        <div className="flex gap-2">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border shadow-sm ${t.type === 'functional' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'}`}>
                                                {t.type || 'informational'}
                                            </span>
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border shadow-sm bg-black/40 text-indigo-900/90 border-indigo-300`}>
                                                {t.modules?.length || 0} Modules
                                            </span>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity -tranindigo-y-2 group-hover:tranindigo-y-0">
                                            <button onClick={(e) => handleEdit(e, t)} className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-indigo-900 border border-indigo-300 flex items-center justify-center transition-colors">
                                                <Edit className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={(e) => handleDelete(e, t._id)} className="w-8 h-8 rounded-full bg-black/40 hover:bg-rose-500/40 backdrop-blur-md text-indigo-900 border border-indigo-300 flex items-center justify-center transition-colors">
                                                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 relative">
                                    <h3 className="text-xl font-bold text-indigo-900 mb-2 group-hover:text-brand-300 transition-colors line-clamp-1">{t.name}</h3>
                                    <p className="text-indigo-500 text-sm mb-6 line-clamp-2 h-10 leading-relaxed font-medium">
                                        {t.description || "No description provided. This template needs details before publishing."}
                                    </p>

                                    <div className="flex items-center justify-between pt-5 border-t border-indigo-200">
                                        <div className="flex items-center gap-1.5 text-indigo-500 text-xs font-semibold">
                                            <Copy className="w-3.5 h-3.5 text-brand-600" />
                                            <span className="text-indigo-900">{t.pages?.length || 0}</span>
                                            <span className="uppercase tracking-wider">Pages</span>
                                        </div>
                                        <button
                                            onClick={() => handleToggle(t._id, 'type', t.type === 'functional' ? 'informational' : 'functional')}
                                            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${t.type === 'functional'
                                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                                }`}
                                        >
                                            {t.type === 'functional' ? <Box className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
                                            {t.type === 'functional' ? 'Make Info' : 'Make Functional'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>

                {filtered.length === 0 && (
                    <div className="col-span-full py-20 text-center glass-panel rounded-3xl border border-indigo-200">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-300">
                            <LayoutTemplate className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-bold text-indigo-900 mb-2">No templates found</h3>
                        <p className="text-indigo-500 text-sm">Create a new template or adjust your filters to see more.</p>
                    </div>
                )}
            </div>

            {/* Create Template Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: -20 }}
                            className="bg-white border border-indigo-300 rounded-3xl p-6 w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="absolute top-0 right-0 p-4 z-20">
                                <button onClick={() => setShowCreateModal(false)} className="text-indigo-500 hover:text-indigo-900 p-2 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
                                    {isEditing ? <Edit className="w-6 h-6 text-brand-600" /> : <Plus className="w-6 h-6 text-brand-600" />}
                                    {isEditing ? 'Edit Template' : 'Create New Template'}
                                </h2>
                                <p className="text-sm text-indigo-500 mt-1">
                                    {isEditing ? 'Modify an existing foundation template.' : 'Add a new foundation template to the marketplace.'}
                                </p>
                            </div>

                            {/* Mode Toggle */}
                            <div className="flex bg-black/30 p-1 rounded-xl mb-6 w-fit border border-indigo-200">
                                <button
                                    onClick={() => setCreateMode('json')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${createMode === 'json' ? 'bg-indigo-100 text-indigo-900 shadow' : 'text-indigo-500 hover:text-indigo-600'
                                        }`}
                                >
                                    <Code className="w-4 h-4" /> JSON Format
                                </button>
                                <button
                                    onClick={() => setCreateMode('form')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${createMode === 'form' ? 'bg-indigo-100 text-indigo-900 shadow' : 'text-indigo-500 hover:text-indigo-600'
                                        }`}
                                >
                                    <Type className="w-4 h-4" /> Text Fields
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                {createMode === 'json' ? (
                                    <div className="space-y-4">
                                        <p className="text-xs text-brand-600 font-mono bg-brand-500/10 p-3 rounded-xl border border-brand-500/20">
                                            Paste your valid JSON template payload. Ensure fields like name, slug, and schemaConfig are properly formatted.
                                        </p>
                                        <textarea
                                            value={createForm.jsonPayload}
                                            onChange={(e) => setCreateForm(prev => ({ ...prev, jsonPayload: e.target.value }))}
                                            className="w-full h-80 bg-black/40 border border-indigo-300 rounded-xl p-4 text-emerald-400 font-mono text-sm focus:outline-none focus:border-brand-500/50 resize-none transition-colors"
                                            placeholder="{}"
                                            spellCheck="false"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-indigo-600">Template Name</label>
                                            <input
                                                type="text"
                                                value={createForm.name}
                                                onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full bg-black/40 border border-indigo-300 rounded-xl px-4 py-3 text-indigo-900 focus:outline-none focus:border-brand-500/50 transition-colors"
                                                placeholder="e.g. E-Commerce Starter"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-indigo-600">Slug (URL identifier)</label>
                                            <input
                                                type="text"
                                                value={createForm.slug}
                                                onChange={(e) => setCreateForm(prev => ({ ...prev, slug: e.target.value }))}
                                                className="w-full bg-black/40 border border-indigo-300 rounded-xl px-4 py-3 text-indigo-900 focus:outline-none focus:border-brand-500/50 transition-colors lowercase"
                                                placeholder="e-commerce-starter"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-indigo-600">Description</label>
                                            <textarea
                                                value={createForm.description}
                                                onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                                                className="w-full bg-black/40 border border-indigo-300 rounded-xl px-4 py-3 text-indigo-900 focus:outline-none focus:border-brand-500/50 resize-none h-24 transition-colors"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-indigo-600">Template Type</label>
                                                <select
                                                    value={createForm.type}
                                                    onChange={(e) => setCreateForm(prev => ({ ...prev, type: e.target.value }))}
                                                    className="w-full bg-black/40 border border-indigo-300 rounded-xl px-4 py-3 text-indigo-900 focus:outline-none focus:border-brand-500/50 transition-colors"
                                                >
                                                    <option value="informational">Informational</option>
                                                    <option value="functional">Functional</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-indigo-600">Category</label>
                                                <input
                                                    type="text"
                                                    value={createForm.category}
                                                    onChange={(e) => setCreateForm(prev => ({ ...prev, category: e.target.value }))}
                                                    className="w-full bg-black/40 border border-indigo-300 rounded-xl px-4 py-3 text-indigo-900 focus:outline-none focus:border-brand-500/50 transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-indigo-200 flex items-center justify-end gap-3 shrink-0">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateSubmit}
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-indigo-900 bg-brand-500 hover:bg-brand-600 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                                >
                                    {isEditing ? 'Save Changes' : 'Submit Template'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Templates;
