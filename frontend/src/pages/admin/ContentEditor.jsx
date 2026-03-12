import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ChevronDown, ChevronRight, Edit2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

/* ─── Dynamic Form Components ─── */
const DynamicField = ({ label, value, path, onChange }) => {
    const isColor = typeof value === 'string' && (value.startsWith('#') || value.startsWith('rgb'));
    const isLongText = typeof value === 'string' && value.length > 50;

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
            {isLongText ? (
                <textarea 
                    value={value} 
                    onChange={handleChange} 
                    style={{ width: '100%', minHeight: '100px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical', outline: 'none', transition: 'border-color 0.2s', backgroundColor: '#f8fafc' }} 
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isColor && <input type="color" value={value} onChange={handleChange} style={{ width: '36px', height: '36px', padding: '0', border: 'none', borderRadius: '6px', cursor: 'pointer' }} />}
                    <input 
                        type={typeof value === 'number' ? 'number' : 'text'}
                        value={value} 
                        onChange={handleChange} 
                        style={{ flex: 1, width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s', backgroundColor: '#f8fafc' }} 
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                </div>
            )}
        </div>
    );
};

const DynamicForm = ({ data, path = [], onChange, onAdd, onRemove }) => {
    if (Array.isArray(data)) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {data.map((item, index) => (
                    <div key={index} style={{ padding: '16px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '20px', height: '2px', backgroundColor: '#cbd5e1' }}></span> Item {index + 1}
                        </div>
                        {typeof item === 'object' && item !== null ? (
                            <DynamicForm data={item} path={[...path, index]} onChange={onChange} onAdd={onAdd} onRemove={onRemove} />
                        ) : (
                            <DynamicField value={item} path={[...path, index]} onChange={onChange} />
                        )}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                            <button onClick={() => onRemove(path, index)} 
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '6px', border: '1px solid #fecdd3', backgroundColor: '#fff1f2', color: '#e11d48', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                                <Trash2 size={12} /> Remove Item
                            </button>
                        </div>
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
                                <DynamicForm data={val} path={[...path, key]} onChange={onChange} onAdd={onAdd} onRemove={onRemove} />
                            </div>
                        );
                    }
                    return <DynamicField key={key} label={key} value={val} path={[...path, key]} onChange={onChange} />;
                })}
            </div>
        );
    }

    return null;
};
const ContentEditor = ({ token, cloneId, pages = [] }) => {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expandedPage, setExpandedPage] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [editData, setEditData] = useState(null);
    const [message, setMessage] = useState('');

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
            // Clone the template item to avoid reference issues
            let newItem = typeof templateItem === 'object' && templateItem !== null 
                ? JSON.parse(JSON.stringify(templateItem)) 
                : typeof templateItem === 'string' ? '' : templateItem;
            
            // Clear out values if it's an object to start fresh for the user
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

    if (loading) return <div style={{ color: '#94a3b8' }}>Loading content...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Content Editor</h2>
                    <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Edit your website content section by section.</p>
                </div>
                {message && <span style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: message.includes('saved') ? '#f0fdf4' : '#fef2f2', color: message.includes('saved') ? '#22c55e' : '#ef4444', fontSize: '13px', fontWeight: 500 }}>{message}</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                                    textAlign: 'left', fontSize: '16px', fontWeight: 600,
                                    color: '#0f172a'
                                }}>
                                <span style={{ textTransform: 'capitalize' }}>{page} Page ({sections.length} sections)</span>
                                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>

                            {isExpanded && (
                                <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9' }}>
                                    {sections.map(item => (
                                        <div key={item._id} style={{ marginBottom: '16px', padding: '16px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                <span style={{ fontWeight: 600, textTransform: 'capitalize', color: '#334155' }}>
                                                    {item.section}
                                                </span>
                                                {editingItem === item._id ? (
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => saveContent(item)} disabled={saving}
                                                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 14px', borderRadius: '6px', border: 'none', backgroundColor: '#22c55e', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                                                            <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                                                        </button>
                                                        <button onClick={() => setEditingItem(null)}
                                                            style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px' }}>
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => startEditing(item)}
                                                        style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                                                        Edit
                                                    </button>
                                                )}
                                            </div>

                                            {editingItem === item._id ? (
                                                <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                                    <DynamicForm data={editData} onChange={handleFieldChange} onAdd={handleAddArrayItem} onRemove={handleRemoveArrayItem} />
                                                </div>
                                            ) : (
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginTop: '12px' }}>
                                                    {Object.entries(item.data || {}).map(([key, val]) => {
                                                        if (typeof val === 'object') return null; // Skip deep objects in preview
                                                        return (
                                                            <div key={key} style={{ padding: '12px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                                                <div style={{ fontSize: '13px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
        </div>
    );
};

export default ContentEditor;
