import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, ChevronLeft, Save, Eye, X, FileText } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

const CptManager = ({ token, tenantId }) => {
    // Definition list and loading states
    const [definitions, setDefinitions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Create CPT state
    const [showDefForm, setShowDefForm] = useState(false);
    const [defForm, setDefForm] = useState({ name: '', slug: '', fields: [] });
    const [newField, setNewField] = useState({ name: '', type: 'string', required: false });
    
    // Manage entries state
    const [selectedCpt, setSelectedCpt] = useState(null);
    const [entries, setEntries] = useState([]);
    const [entriesLoading, setEntriesLoading] = useState(false);
    const [showEntryForm, setShowEntryForm] = useState(false);
    const [editingEntryId, setEditingEntryId] = useState(null);
    const [entryForm, setEntryForm] = useState({});

    const [message, setMessage] = useState('');
    const [saving, setSaving] = useState(false);

    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchDefinitions();
    }, []);

    const fetchDefinitions = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/cpt/definitions`, { headers });
            if (res.data.success) {
                setDefinitions(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch CPT definitions:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEntries = async (cpt) => {
        try {
            setEntriesLoading(true);
            const res = await axios.get(`${API_BASE}/cpt/entries/${cpt.slug}`, { headers });
            if (res.data.success) {
                setEntries(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch CPT entries:', err);
        } finally {
            setEntriesLoading(false);
        }
    };

    const selectCptForContent = (cpt) => {
        setSelectedCpt(cpt);
        fetchEntries(cpt);
        setShowEntryForm(false);
        setEditingEntryId(null);
    };

    // ============================================
    // Definition Actions
    // ============================================
    const handleAddField = () => {
        if (!newField.name) return;
        const cleanFieldName = newField.name.replace(/[^a-zA-Z0-9_]/g, '');
        if (defForm.fields.some(f => f.name === cleanFieldName)) {
            alert('Field name already exists');
            return;
        }
        setDefForm(prev => ({
            ...prev,
            fields: [...prev.fields, { ...newField, name: cleanFieldName }]
        }));
        setNewField({ name: '', type: 'string', required: false });
    };

    const handleRemoveField = (index) => {
        setDefForm(prev => ({
            ...prev,
            fields: prev.fields.filter((_, i) => i !== index)
        }));
    };

    const handleSaveDefinition = async () => {
        if (!defForm.name || !defForm.slug) {
            alert('Please provide name and slug');
            return;
        }
        if (defForm.fields.length === 0) {
            alert('Please add at least one field');
            return;
        }
        try {
            setSaving(true);
            const res = await axios.post(`${API_BASE}/cpt/definitions`, defForm, { headers });
            if (res.data.success) {
                setMessage('Custom Post Type created successfully!');
                setDefForm({ name: '', slug: '', fields: [] });
                setShowDefForm(false);
                fetchDefinitions();
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create CPT');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteDefinition = async (id) => {
        if (!window.confirm('Are you sure you want to delete this Custom Post Type? This only deletes the metadata definition.')) return;
        try {
            await axios.delete(`${API_BASE}/cpt/definitions/${id}`, { headers });
            fetchDefinitions();
        } catch (err) {
            alert('Failed to delete CPT definition');
        }
    };

    // ============================================
    // Entry Actions
    // ============================================
    const openAddEntry = () => {
        const initial = {};
        selectedCpt.fields.forEach(f => {
            if (f.type === 'boolean') initial[f.name] = false;
            else if (f.type === 'number') initial[f.name] = 0;
            else initial[f.name] = '';
        });
        setEntryForm(initial);
        setEditingEntryId(null);
        setShowEntryForm(true);
    };

    const openEditEntry = (entry) => {
        const initial = {};
        selectedCpt.fields.forEach(f => {
            initial[f.name] = entry[f.name] !== undefined ? entry[f.name] : '';
        });
        setEntryForm(initial);
        setEditingEntryId(entry._id);
        setShowEntryForm(true);
    };

    const handleSaveEntry = async () => {
        try {
            setSaving(true);
            if (editingEntryId) {
                await axios.put(`${API_BASE}/cpt/entries/${selectedCpt.slug}/${editingEntryId}`, entryForm, { headers });
                setMessage('Entry updated successfully!');
            } else {
                await axios.post(`${API_BASE}/cpt/entries/${selectedCpt.slug}`, entryForm, { headers });
                setMessage('Entry created successfully!');
            }
            setShowEntryForm(false);
            fetchEntries(selectedCpt);
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            alert('Failed to save entry');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteEntry = async (id) => {
        if (!window.confirm('Delete this entry?')) return;
        try {
            await axios.delete(`${API_BASE}/cpt/entries/${selectedCpt.slug}/${id}`, { headers });
            fetchEntries(selectedCpt);
        } catch (err) {
            alert('Failed to delete entry');
        }
    };

    if (loading) return <div style={{ color: '#64748b' }}>Loading Custom Post Types...</div>;

    return (
        <div>
            {/* Header section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
                        {selectedCpt ? `${selectedCpt.name} Manager` : 'Custom Post Types (CMS)'}
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
                        {selectedCpt 
                            ? `Manage database records for the custom post type "${selectedCpt.slug}".` 
                            : 'Define WordPress-style custom schemas and fields with dynamic dashboard support.'
                        }
                    </p>
                </div>
                {message && (
                    <span style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#f0fdf4', color: '#22c55e', fontSize: '13px', fontWeight: 500 }}>
                        {message}
                    </span>
                )}
            </div>

            {/* MAIN ROUTER SWITCH BETWEEN LIST & ENTRY EDITOR */}
            {!selectedCpt ? (
                /* ─── CPT DEFINITIONS VIEW ─── */
                <div>
                    {!showDefForm ? (
                        <div>
                            <button onClick={() => setShowDefForm(true)} 
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: 600, marginBottom: '24px' }}>
                                <Plus size={16} /> Create Custom Post Type
                            </button>

                            {definitions.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '48px', border: '1px dashed #cbd5e1', borderRadius: '12px', backgroundColor: '#f8fafc', color: '#64748b' }}>
                                    <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                                    <h3>No Custom Post Types yet</h3>
                                    <p style={{ fontSize: '13px', marginTop: '4px' }}>Create your first CPT schema (e.g. Testimonials, Team Members) to get started.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                    {definitions.map(cpt => (
                                        <div key={cpt._id} style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: '18px' }}>{cpt.name}</h3>
                                                <code style={{ fontSize: '12px', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#3b82f6', marginTop: '4px', display: 'inline-block' }}>{cpt.slug}</code>
                                                
                                                <div style={{ marginTop: '16px' }}>
                                                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Fields ({cpt.fields.length})</span>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                                                        {cpt.fields.map((f, idx) => (
                                                            <span key={idx} style={{ fontSize: '11px', padding: '3px 8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#475569' }}>
                                                                {f.name} ({f.type})
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '8px', marginTop: '24px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                                                <button onClick={() => selectCptForContent(cpt)}
                                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px 12px', borderRadius: '6px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                                                    <Eye size={14} /> Entries
                                                </button>
                                                <button onClick={() => handleDeleteDefinition(cpt._id)}
                                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '6px', border: '1px solid #fecdd3', backgroundColor: '#fff1f2', color: '#e11d48', cursor: 'pointer' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ─── CREATE CPT DEFINITION FORM ─── */
                        <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', maxWidth: '600px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Define Custom Schema</h3>
                            
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Singular/Plural Name (e.g. Testimonials)</label>
                                <input type="text" value={defForm.name} onChange={(e) => setDefForm(prev => ({ ...prev, name: e.target.value }))}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} placeholder="Testimonials" />
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Slug (lowercase, alphanumeric - e.g. testimonials)</label>
                                <input type="text" value={defForm.slug} onChange={(e) => setDefForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} placeholder="testimonials" />
                            </div>

                            {/* Dynamic Fields List */}
                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginBottom: '24px' }}>
                                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Fields Configurations</h4>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                                    {defForm.fields.map((f, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 600 }}>{f.name} <code style={{ fontSize: '11px', color: '#94a3b8' }}>({f.type})</code></span>
                                            <button onClick={() => handleRemoveField(i)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}><X size={16} /></button>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <input type="text" placeholder="Field Name (e.g. rating)" value={newField.name} onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                                        style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
                                    
                                    <select value={newField.type} onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value }))}
                                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                                        <option value="string">Text String</option>
                                        <option value="richtext">Rich Text Content</option>
                                        <option value="number">Number</option>
                                        <option value="boolean">Boolean Checkbox</option>
                                        <option value="date">Date picker</option>
                                    </select>

                                    <button onClick={handleAddField}
                                        style={{ padding: '8px 14px', border: 'none', backgroundColor: '#0f172a', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                                        Add
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button onClick={() => setShowDefForm(false)}
                                    style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                                    Cancel
                                </button>
                                <button onClick={handleSaveDefinition} disabled={saving}
                                    style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                                    {saving ? 'Creating...' : 'Create Schema'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* ─── CPT ENTRIES DATA VIEW ─── */
                <div>
                    <div style={{ marginBottom: '24px' }}>
                        <button onClick={() => setSelectedCpt(null)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', border: '1px solid #e2e8f0', backgroundColor: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                            <ChevronLeft size={16} /> Back to CPT Schemas
                        </button>
                    </div>

                    {!showEntryForm ? (
                        <div>
                            <button onClick={openAddEntry}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: 600, marginBottom: '24px' }}>
                                <Plus size={16} /> Add {selectedCpt.name} Entry
                            </button>

                            {entriesLoading ? (
                                <div style={{ color: '#64748b' }}>Loading entries...</div>
                            ) : entries.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '48px', border: '1px dashed #cbd5e1', borderRadius: '12px', backgroundColor: '#f8fafc', color: '#64748b' }}>
                                    <h3>No records found</h3>
                                    <p style={{ fontSize: '13px', marginTop: '4px' }}>Add your first record for this content type.</p>
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                                {selectedCpt.fields.map(f => (
                                                    <th key={f.name} style={{ padding: '14px 16px', fontWeight: 700, color: '#475569', textTransform: 'capitalize' }}>{f.name}</th>
                                                ))}
                                                <th style={{ padding: '14px 16px', fontWeight: 700, color: '#475569', width: '100px' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entries.map(item => (
                                                <tr key={item._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                    {selectedCpt.fields.map(f => (
                                                        <td key={f.name} style={{ padding: '14px 16px', color: '#334155' }}>
                                                            {f.type === 'boolean' 
                                                                ? (item[f.name] ? 'Yes' : 'No') 
                                                                : String(item[f.name] || '-')
                                                            }
                                                        </td>
                                                    ))}
                                                    <td style={{ padding: '14px 16px', display: 'flex', gap: '8px' }}>
                                                        <button onClick={() => openEditEntry(item)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit2 size={16} /></button>
                                                        <button onClick={() => handleDeleteEntry(item._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ─── DYNAMIC ENTRY CREATE / EDIT FORM ─── */
                        <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', maxWidth: '600px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>
                                {editingEntryId ? `Edit ${selectedCpt.name} Entry` : `New ${selectedCpt.name} Entry`}
                            </h3>

                            {selectedCpt.fields.map(f => {
                                const handleFieldChange = (val) => {
                                    setEntryForm(prev => ({ ...prev, [f.name]: val }));
                                };

                                return (
                                    <div key={f.name} style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'capitalize' }}>
                                            {f.name} {f.required && <span style={{ color: '#ef4444' }}>*</span>}
                                        </label>

                                        {f.type === 'richtext' ? (
                                            <textarea value={entryForm[f.name] || ''} onChange={(e) => handleFieldChange(e.target.value)}
                                                style={{ width: '100%', minHeight: '120px', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} />
                                        ) : f.type === 'boolean' ? (
                                            <input type="checkbox" checked={!!entryForm[f.name]} onChange={(e) => handleFieldChange(e.target.checked)}
                                                style={{ width: '18px', height: '18px', accentColor: '#3b82f6', cursor: 'pointer' }} />
                                        ) : f.type === 'number' ? (
                                            <input type="number" value={entryForm[f.name] !== undefined ? entryForm[f.name] : ''} onChange={(e) => handleFieldChange(Number(e.target.value))}
                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} />
                                        ) : f.type === 'date' ? (
                                            <input type="date" value={entryForm[f.name] ? entryForm[f.name].split('T')[0] : ''} onChange={(e) => handleFieldChange(e.target.value)}
                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} />
                                        ) : (
                                            <input type="text" value={entryForm[f.name] || ''} onChange={(e) => handleFieldChange(e.target.value)}
                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} />
                                        )}
                                    </div>
                                );
                            })}

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                                <button onClick={() => setShowEntryForm(false)}
                                    style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                                    Cancel
                                </button>
                                <button onClick={handleSaveEntry} disabled={saving}
                                    style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                                    {saving ? 'Saving...' : 'Save Entry'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CptManager;
