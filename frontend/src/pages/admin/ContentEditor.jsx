import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ChevronDown, ChevronRight, Sparkles, Wand2, Eye, Layout, Type, List } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

/* ─── Dynamic Form Field with AI Copywriter integration ─── */
const DynamicField = ({ label, value, path, onChange, onAiAssist }) => {
    const isColor = typeof value === 'string' && (value.startsWith('#') || value.startsWith('rgb'));
    const isLongText = typeof value === 'string' && value.length > 50;
    const showAiBtn = typeof value === 'string' && !isColor && label.toLowerCase() !== 'icon' && label.toLowerCase() !== 'link';

    const handleChange = (e) => {
        let newValue = e.target.value;
        if (typeof value === 'number') newValue = Number(newValue);
        if (typeof value === 'boolean') newValue = e.target.checked;
        onChange(path, newValue);
    };

    if (typeof value === 'boolean') {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <input type="checkbox" checked={value} onChange={handleChange} style={{ width: '16px', height: '16px', accentColor: '#3b82f6', cursor: 'pointer' }} />
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#334155', cursor: 'pointer' }}>{label}</label>
            </div>
        );
    }

    return (
        <div style={{ marginBottom: '12px' }}>
            {label && <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label.replace(/([A-Z])/g, ' $1').trim()}</label>}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                {isLongText ? (
                    <textarea 
                        value={value} 
                        onChange={handleChange} 
                        style={{ flex: 1, minHeight: '80px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical', outline: 'none', backgroundColor: '#f8fafc' }} 
                    />
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                        {isColor && <input type="color" value={value} onChange={handleChange} style={{ width: '36px', height: '36px', padding: '0', border: 'none', borderRadius: '6px', cursor: 'pointer' }} />}
                        <input 
                            type={typeof value === 'number' ? 'number' : 'text'}
                            value={value} 
                            onChange={handleChange} 
                            style={{ flex: 1, width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', backgroundColor: '#f8fafc' }} 
                        />
                    </div>
                )}
                {showAiBtn && onAiAssist && (
                    <button 
                        onClick={() => onAiAssist(path, value)}
                        title="AI Copywriter"
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #bae6fd',
                            backgroundColor: '#e0f2fe',
                            color: '#0284c7',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f0f9ff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#e0f2fe'; }}
                    >
                        <Sparkles size={14} />
                    </button>
                )}
            </div>
        </div>
    );
};

const DynamicForm = ({ data, path = [], onChange, onAdd, onRemove, onAiAssist }) => {
    if (Array.isArray(data)) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {data.map((item, index) => (
                    <div key={index} style={{ padding: '16px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '20px', height: '2px', backgroundColor: '#cbd5e1' }}></span> Item {index + 1}
                            </div>
                            <button onClick={() => onRemove(path, index)} 
                                style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
                                Delete
                            </button>
                        </div>
                        {typeof item === 'object' && item !== null ? (
                            <DynamicForm data={item} path={[...path, index]} onChange={onChange} onAdd={onAdd} onRemove={onRemove} onAiAssist={onAiAssist} />
                        ) : (
                            <DynamicField value={item} path={[...path, index]} onChange={onChange} onAiAssist={onAiAssist} label="" />
                        )}
                    </div>
                ))}
                <button onClick={() => onAdd(path, data.length > 0 ? data[data.length - 1] : '')} 
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', borderRadius: '8px', border: '1px dashed #cbd5e1', backgroundColor: '#f8fafc', color: '#3b82f6', cursor: 'pointer', fontSize: '13px', fontWeight: 600, width: '100%' }}>
                    <Plus size={16} /> Add New Item
                </button>
            </div>
        );
    }

    if (typeof data === 'object' && data !== null) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.keys(data).map(key => {
                    const val = data[key];
                    if (typeof val === 'object' && val !== null) {
                        return (
                            <div key={key} style={{ paddingLeft: '16px', borderLeft: '2px solid #e2e8f0', marginTop: '12px', marginBottom: '8px' }}>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '12px', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                <DynamicForm data={val} path={[...path, key]} onChange={onChange} onAdd={onAdd} onRemove={onRemove} onAiAssist={onAiAssist} />
                            </div>
                        );
                    }
                    return <DynamicField key={key} label={key} value={val} path={[...path, key]} onChange={onChange} onAiAssist={onAiAssist} />;
                })}
            </div>
        );
    }

    return null;
};

/* ─── Gutenberg Mock Live Preview Component ─── */
const SectionMockPreview = ({ sectionKey, data }) => {
    if (sectionKey === 'hero') {
        return (
            <div style={{ padding: '32px', backgroundColor: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd', textAlign: 'center', margin: '16px 0' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0369a1', marginBottom: '8px' }}>{data.title || 'Hero Title'}</h1>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0284c7', marginBottom: '12px' }}>{data.subtitle || 'Hero Subtitle'}</h4>
                <p style={{ fontSize: '12px', color: '#0369a1', margin: '0 auto 16px', maxWidth: '300px', lineHeight: 1.5 }}>{data.description || 'Hero description text.'}</p>
                <button style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: '#0284c7', color: '#fff', fontSize: '12px', fontWeight: 600 }}>{data.cta || 'Get Started'}</button>
            </div>
        );
    }

    if (sectionKey === 'skills') {
        return (
            <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', margin: '16px 0' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: '#475569' }}>{data.title || 'Skills'}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {(data.items || []).map((item, i) => (
                        <span key={i} style={{ fontSize: '11px', padding: '4px 10px', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '999px', fontWeight: 600 }}>
                            {typeof item === 'string' ? item : item.name || 'Skill tag'}
                        </span>
                    ))}
                </div>
            </div>
        );
    }

    if (sectionKey === 'featured_projects' || sectionKey === 'list') {
        return (
            <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', margin: '16px 0' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: '#475569' }}>{data.title || 'List Section'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {(data.items || []).map((item, i) => (
                        <div key={i} style={{ padding: '12px', border: '1px solid #f1f5f9', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 4px', color: '#1e293b' }}>{item.name || item.title || item.company || 'Item Title'}</h4>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 8px', lineHeight: 1.4 }}>{item.description || 'Description of this list item.'}</p>
                            <span style={{ fontSize: '10px', color: '#3b82f6', fontWeight: 600 }}>{item.role || item.tech || item.price || 'Link →'}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', margin: '16px 0', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>{sectionKey} Block Preview</span>
            <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#64748b' }}>Custom schema layout configured</p>
        </div>
    );
};

const ContentEditor = ({ token, cloneId, pages = [] }) => {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expandedPage, setExpandedPage] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [editData, setEditData] = useState(null);
    const [message, setMessage] = useState('');

    // AI copilot dialog states
    const [aiGenerating, setAiGenerating] = useState(false);
    const [aiPromptHint, setAiPromptHint] = useState('');
    const [aiActivePath, setAiActivePath] = useState(null);
    const [aiActiveVal, setAiActiveVal] = useState('');

    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        if (cloneId && cloneId !== 'undefined') fetchContent();
    }, [cloneId]);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/content/all?cloneId=${cloneId}`, { headers });
            if (res.data.success) setContent(res.data.data);
        } catch (err) {
            console.error('Failed to fetch content:', err);
        } finally {
            setLoading(false);
        }
    };

    const pageNames = [...new Set(content.map(c => c.page))];
    const getPageSections = (page) => content.filter(c => c.page === page).sort((a, b) => a.order - b.order);

    const startEditing = (item) => {
        setEditingItem(item._id);
        setEditData(JSON.parse(JSON.stringify(item.data)));
    };

    const handleFieldChange = (path, value) => {
        setEditData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            let current = newData;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }
            if (path.length > 0) {
                current[path[path.length - 1]] = value;
            }
            return newData;
        });
    };

    const handleAddArrayItem = (path, templateItem) => {
        setEditData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            let current = newData;
            for (let i = 0; i < path.length; i++) {
                current = current[path[i]];
            }
            let newItem = typeof templateItem === 'object' && templateItem !== null 
                ? JSON.parse(JSON.stringify(templateItem)) 
                : typeof templateItem === 'string' ? '' : templateItem;
            
            if (typeof newItem === 'object' && newItem !== null) {
               Object.keys(newItem).forEach(key => {
                   if (typeof newItem[key] === 'string') newItem[key] = '';
                   if (typeof newItem[key] === 'number') newItem[key] = 0;
               });
            }
            current.push(newItem);
            return newData;
        });
    };

    const handleRemoveArrayItem = (path, index) => {
        setEditData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            let current = newData;
            for (let i = 0; i < path.length; i++) {
                current = current[path[i]];
            }
            current.splice(index, 1);
            return newData;
        });
    };

    // ============================================
    // Hugging Face AI Copywriter Call
    // ============================================
    const handleOpenAiAssist = (path, val) => {
        setAiActivePath(path);
        setAiActiveVal(val);
        setAiPromptHint('');
        setAiGenerating(false);
    };

    const triggerAiGeneration = async () => {
        if (!aiPromptHint) return;
        try {
            setAiGenerating(true);
            const fieldName = aiActivePath[aiActivePath.length - 1];
            const prompt = `Write a high-converting, professional copywriting text for a website field named "${fieldName}". Context/current value: "${aiActiveVal}". Additional instruction details: ${aiPromptHint}`;
            
            const res = await axios.post(`${API_BASE}/ai/generate`, { prompt }, { headers });
            if (res.data.success) {
                handleFieldChange(aiActivePath, res.data.data);
                setAiActivePath(null);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Hugging Face LLM loading or busy. Please try again.');
        } finally {
            setAiGenerating(false);
        }
    };

    const saveContent = async (item) => {
        try {
            setSaving(true);
            await axios.put(`${API_BASE}/content/${item._id}`, { data: editData }, { headers });
            setMessage('Content saved successfully!');
            setEditingItem(null);
            fetchContent();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Failed to save content');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ color: '#94a3b8' }}>Loading content editor...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Gutenberg Block Editor</h2>
                    <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Edit blocks visually with side-by-side layout rendering and Hugging Face AI assist.</p>
                </div>
                {message && <span style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#f0fdf4', color: '#22c55e', fontSize: '13px', fontWeight: 500 }}>{message}</span>}
            </div>

            {/* AI ASSIST DIALOG IFRAME POPUP */}
            {aiActivePath && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '450px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                            <Sparkles size={16} color="#0284c7" /> Hugging Face Copywriter
                        </h3>
                        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Provide writing suggestions or constraints below (e.g. "make it short and exciting", "focus on tech clients").</p>
                        
                        <textarea 
                            value={aiPromptHint} 
                            onChange={(e) => setAiPromptHint(e.target.value)} 
                            placeholder='Write instruction (e.g., "Write a funny tagline about pizza")'
                            style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', marginBottom: '20px', outline: 'none' }}
                        />

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setAiActivePath(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
                            <button onClick={triggerAiGeneration} disabled={aiGenerating || !aiPromptHint}
                                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#0284c7', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {aiGenerating ? 'Generating...' : 'Auto-write'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TWO-COLUMN SIDE-BY-SIDE LAYOUT */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', alignItems: 'start' }}>
                
                {/* LEFT COLUMN: EDIT FORM */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {pageNames.map(page => {
                        const sections = getPageSections(page);
                        const isExpanded = expandedPage === page;

                        return (
                            <div key={page} style={{ borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', backgroundColor: '#fff' }}>
                                <button onClick={() => setExpandedPage(isExpanded ? null : page)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                                        padding: '16px 20px', border: 'none', cursor: 'pointer',
                                        backgroundColor: isExpanded ? '#f8fafc' : '#fff',
                                        textAlign: 'left', fontSize: '15px', fontWeight: 700,
                                        color: '#0f172a'
                                    }}>
                                    <span style={{ textTransform: 'capitalize' }}>{page} Page ({sections.length} blocks)</span>
                                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                </button>

                                {isExpanded && (
                                    <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9' }}>
                                        {sections.map(item => (
                                            <div key={item._id} style={{ marginBottom: '16px', padding: '16px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                    <span style={{ fontWeight: 700, textTransform: 'capitalize', color: '#334155', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <Layout size={14} color="#64748b" /> {item.section}
                                                    </span>
                                                    {editingItem === item._id ? (
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button onClick={() => saveContent(item)} disabled={saving}
                                                                style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', backgroundColor: '#22c55e', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                                                                {saving ? 'Saving...' : 'Save'}
                                                            </button>
                                                            <button onClick={() => setEditingItem(null)}
                                                                style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', fontSize: '12px' }}>
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => startEditing(item)}
                                                            style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                                                            Edit Content
                                                        </button>
                                                    )}
                                                </div>

                                                {editingItem === item._id ? (
                                                    <div style={{ marginTop: '12px', padding: '16px', backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                                        <DynamicForm data={editData} onChange={handleFieldChange} onAdd={handleAddArrayItem} onRemove={handleRemoveArrayItem} onAiAssist={handleOpenAiAssist} />
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px', marginTop: '12px' }}>
                                                        {Object.entries(item.data || {}).map(([key, val]) => {
                                                            if (typeof val === 'object') return null;
                                                            return (
                                                                <div key={key} style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                                                    <div style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>{key}</div>
                                                                    <div style={{ fontSize: '12px', color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                        {typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val)}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* RIGHT COLUMN: INTERACTIVE GOCK MOCKUP VIEW */}
                <div style={{ position: 'sticky', top: '24px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', minHeight: '400px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
                        <Eye size={16} color="#3b82f6" />
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Live Gutenberg Mockup</h3>
                    </div>

                    {editingItem ? (
                        <div>
                            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>Currently Editing Preview</span>
                            <SectionMockPreview 
                                sectionKey={content.find(c => c._id === editingItem)?.section} 
                                data={editData} 
                            />
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#94a3b8', textAlign: 'center' }}>
                            <Layout size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
                            <p style={{ fontSize: '13px' }}>Click "Edit Content" on any block to see its live mockup rendering here.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ContentEditor;
