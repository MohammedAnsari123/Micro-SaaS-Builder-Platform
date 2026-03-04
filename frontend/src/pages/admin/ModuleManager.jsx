import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, RefreshCw } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

const ModuleManager = ({ token, module, title, cloneId }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);

    const headers = { Authorization: `Bearer ${token}` };

    const fetchItems = async () => {
        if (!cloneId || cloneId === 'undefined') return;
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/${module}?cloneId=${cloneId}`, { headers });
            if (res.data.success) setItems(res.data.data);
        } catch (err) {
            console.error(`Failed to fetch ${module}:`, err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchItems(); }, [module, cloneId]);

    // Get editable fields based on module type
    const getFields = () => {
        switch (module) {
            case 'products':
                return [
                    { key: 'name', label: 'Name', type: 'text', required: true },
                    { key: 'description', label: 'Description', type: 'textarea' },
                    { key: 'price', label: 'Price', type: 'number', required: true },
                    { key: 'category', label: 'Category', type: 'text' },
                    { key: 'isAvailable', label: 'Available', type: 'checkbox' }
                ];
            case 'services':
                return [
                    { key: 'name', label: 'Name', type: 'text', required: true },
                    { key: 'description', label: 'Description', type: 'textarea' },
                    { key: 'price', label: 'Price', type: 'number', required: true },
                    { key: 'duration', label: 'Duration', type: 'text' },
                    { key: 'category', label: 'Category', type: 'text' },
                    { key: 'isAvailable', label: 'Available', type: 'checkbox' }
                ];
            case 'events':
                return [
                    { key: 'title', label: 'Title', type: 'text', required: true },
                    { key: 'description', label: 'Description', type: 'textarea' },
                    { key: 'date', label: 'Date', type: 'date', required: true },
                    { key: 'venue', label: 'Venue', type: 'text' },
                    { key: 'capacity', label: 'Capacity', type: 'number' },
                    { key: 'category', label: 'Category', type: 'text' },
                    { key: 'isActive', label: 'Active', type: 'checkbox' }
                ];
            case 'orders':
            case 'bookings':
            case 'registrations':
                return []; // Read-only with status updates
            default:
                return [];
        }
    };

    const fields = getFields();
    const isReadOnly = fields.length === 0;

    const openCreate = () => {
        const initial = {};
        fields.forEach(f => {
            if (f.type === 'checkbox') initial[f.key] = true;
            else if (f.type === 'number') initial[f.key] = 0;
            else initial[f.key] = '';
        });
        setForm(initial);
        setEditing(null);
        setShowForm(true);
    };

    const openEdit = (item) => {
        const data = {};
        fields.forEach(f => {
            data[f.key] = f.type === 'date' && item[f.key] ? new Date(item[f.key]).toISOString().split('T')[0] : item[f.key] || '';
        });
        setForm(data);
        setEditing(item._id);
        setShowForm(true);
    };

    const saveItem = async () => {
        try {
            setSaving(true);
            if (editing) {
                await axios.put(`${API_BASE}/${module}/${editing}`, form, { headers });
            } else {
                await axios.post(`${API_BASE}/${module}`, { ...form, cloneId }, { headers });
            }
            setShowForm(false);
            fetchItems();
        } catch (err) {
            console.error('Save error:', err);
        } finally {
            setSaving(false);
        }
    };

    const deleteItem = async (id) => {
        if (!confirm('Are you sure?')) return;
        await axios.delete(`${API_BASE}/${module}/${id}`, { headers });
        fetchItems();
    };

    const updateStatus = async (id, status) => {
        await axios.put(`${API_BASE}/${module}/${id}`, { status }, { headers });
        fetchItems();
    };

    // Get display columns based on module
    const getDisplayFields = () => {
        switch (module) {
            case 'products': return ['name', 'category', 'price', 'isAvailable'];
            case 'services': return ['name', 'category', 'price', 'duration'];
            case 'events': return ['title', 'date', 'venue', 'registeredCount', 'capacity'];
            case 'orders': return ['customerName', 'customerEmail', 'total', 'status', 'createdAt'];
            case 'bookings': return ['customerName', 'item', 'bookingDate', 'timeSlot', 'status'];
            case 'registrations': return ['name', 'email', 'status'];
            default: return [];
        }
    };

    const getStatusOptions = () => {
        switch (module) {
            case 'orders': return ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'];
            case 'bookings': return ['pending', 'confirmed', 'completed', 'cancelled'];
            case 'registrations': return ['registered', 'attended', 'cancelled'];
            default: return [];
        }
    };

    const displayFields = getDisplayFields();
    const statusOptions = getStatusOptions();

    const formatCell = (item, key) => {
        const val = item[key];
        if (key === 'isAvailable' || key === 'isActive') return val ? '✅' : '❌';
        if (key === 'price' || key === 'total') return `$${val}`;
        if (key === 'date' || key === 'bookingDate' || key === 'createdAt') return val ? new Date(val).toLocaleDateString() : '-';
        if (key === 'status') {
            const colors = { pending: '#f59e0b', confirmed: '#3b82f6', preparing: '#8b5cf6', delivered: '#22c55e', completed: '#22c55e', cancelled: '#ef4444', registered: '#3b82f6', attended: '#22c55e' };
            return <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, backgroundColor: `${colors[val] || '#94a3b8'}20`, color: colors[val] || '#94a3b8' }}>{val}</span>;
        }
        return val || '-';
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{title}</h2>
                    <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>{items.length} total items</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={fetchItems} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer' }}><RefreshCw size={16} /></button>
                    {!isReadOnly && (
                        <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                            <Plus size={16} /> Add New
                        </button>
                    )}
                </div>
            </div>

            {loading ? <p style={{ color: '#94a3b8' }}>Loading...</p> : items.length === 0 ? <p style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>No items yet</p> : (
                <div style={{ borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc' }}>
                                {displayFields.map(key => (
                                    <th key={key} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'capitalize', borderBottom: '1px solid #e2e8f0' }}>
                                        {key.replace(/([A-Z])/g, ' $1')}
                                    </th>
                                ))}
                                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    {displayFields.map(key => (
                                        <td key={key} style={{ padding: '12px 16px', fontSize: '14px', color: '#334155' }}>
                                            {key === 'status' && statusOptions.length > 0 ? (
                                                <select value={item.status} onChange={e => updateStatus(item._id, e.target.value)}
                                                    style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', cursor: 'pointer' }}>
                                                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            ) : formatCell(item, key)}
                                        </td>
                                    ))}
                                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                                            {!isReadOnly && <button onClick={() => openEdit(item)} style={iconBtnStyle}><Edit size={14} /></button>}
                                            <button onClick={() => deleteItem(item._id)} style={{ ...iconBtnStyle, color: '#ef4444' }}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create/Edit Form Modal */}
            {showForm && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px', width: '480px', maxHeight: '80vh', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontWeight: 700, color: '#0f172a' }}>{editing ? 'Edit' : 'Create'} {title.slice(0, -1)}</h3>
                            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {fields.map(field => (
                                <div key={field.key}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#334155' }}>{field.label}</label>
                                    {field.type === 'textarea' ? (
                                        <textarea value={form[field.key] || ''} onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))} rows={3}
                                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', resize: 'vertical', boxSizing: 'border-box' }} />
                                    ) : field.type === 'checkbox' ? (
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                            <input type="checkbox" checked={form[field.key] || false} onChange={e => setForm(p => ({ ...p, [field.key]: e.target.checked }))} />
                                            <span style={{ fontSize: '14px' }}>{form[field.key] ? 'Yes' : 'No'}</span>
                                        </label>
                                    ) : (
                                        <input type={field.type} required={field.required} value={form[field.key] || ''} onChange={e => setForm(p => ({ ...p, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value }))}
                                            style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                                    )}
                                </div>
                            ))}
                        </div>

                        <button onClick={saveItem} disabled={saving}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontWeight: 700, cursor: 'pointer', marginTop: '24px' }}>
                            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const iconBtnStyle = { padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer', color: '#64748b' };

export default ModuleManager;
