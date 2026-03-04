import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

const ContentEditor = ({ token, cloneId, pages = [] }) => {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expandedPage, setExpandedPage] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [editData, setEditData] = useState('');
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
        setEditData(JSON.stringify(item.data, null, 2));
    };

    const saveContent = async (item) => {
        try {
            setSaving(true);
            const parsed = JSON.parse(editData);
            await axios.put(`${API_BASE}/content/${item._id}`, { data: parsed }, { headers });
            setMessage('Content saved!');
            setEditingItem(null);
            fetchContent();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage(err.message === 'Unexpected token' ? 'Invalid JSON format' : 'Failed to save');
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
                                                <textarea value={editData} onChange={e => setEditData(e.target.value)}
                                                    style={{
                                                        width: '100%', minHeight: '200px', padding: '12px', borderRadius: '8px',
                                                        border: '1px solid #e2e8f0', fontFamily: 'monospace', fontSize: '13px',
                                                        resize: 'vertical', outline: 'none', boxSizing: 'border-box'
                                                    }} />
                                            ) : (
                                                <pre style={{ fontSize: '12px', color: '#64748b', overflow: 'auto', maxHeight: '200px', padding: '12px', backgroundColor: '#fff', borderRadius: '8px', margin: 0 }}>
                                                    {JSON.stringify(item.data, null, 2)}
                                                </pre>
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
