import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

const presetThemes = [
    { name: 'Ocean Blue', primary: '#2563eb', secondary: '#64748b', accent: '#10b981', background: '#ffffff', text: '#0f172a' },
    { name: 'Deep Purple', primary: '#7c3aed', secondary: '#64748b', accent: '#ec4899', background: '#ffffff', text: '#0f172a' },
    { name: 'Emerald Green', primary: '#059669', secondary: '#64748b', accent: '#14b8a6', background: '#f0fdf4', text: '#0f172a' },
    { name: 'Warm Sunset', primary: '#dc2626', secondary: '#78350f', accent: '#f59e0b', background: '#fffbeb', text: '#1c1917' },
    { name: 'Midnight Dark', primary: '#3b82f6', secondary: '#64748b', accent: '#f59e0b', background: '#0f172a', text: '#f8fafc' },
    { name: 'Rose Pink', primary: '#be185d', secondary: '#64748b', accent: '#f472b6', background: '#fdf2f8', text: '#0f172a' },
    { name: 'Sky Light', primary: '#0ea5e9', secondary: '#475569', accent: '#f97316', background: '#f0f9ff', text: '#0f172a' },
    { name: 'Monochrome', primary: '#0f172a', secondary: '#475569', accent: '#3b82f6', background: '#f8fafc', text: '#0f172a' },
];

const ThemeEditor = ({ token, cloneId }) => {
    const [theme, setTheme] = useState({ primary: '#3b82f6', secondary: '#64748b', accent: '#10b981', background: '#ffffff', text: '#0f172a', font: 'Inter, sans-serif' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchTheme = async () => {
            if (!cloneId || cloneId === 'undefined') return;
            try {
                const res = await axios.get(`${API_BASE}/templates/my/clones`, { headers });
                if (res.data.success) {
                    const currentClone = res.data.data.find(c => c._id === cloneId);
                    if (currentClone && currentClone.theme) {
                        setTheme(prev => ({ ...prev, ...currentClone.theme }));
                    }
                }
            } catch (err) { /* use defaults */ }
        };
        fetchTheme();
    }, [cloneId]);

    const applyPreset = (preset) => {
        setTheme(prev => ({ ...prev, ...preset }));
    };

    const saveTheme = async () => {
        try {
            setSaving(true);
            await axios.put(`${API_BASE}/templates/theme/${cloneId}`, theme, { headers });
            setMessage('Theme saved! Refresh your site to see changes.');
            setTimeout(() => setMessage(''), 4000);
        } catch (err) {
            setMessage('Failed to save theme');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>Theme Editor</h2>
                <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Customize your site's colors with one click or fine-tune each color.</p>
            </div>

            {/* Preset Themes */}
            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Quick Presets</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                    {presetThemes.map(preset => (
                        <button key={preset.name} onClick={() => applyPreset(preset)}
                            style={{
                                padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0',
                                cursor: 'pointer', backgroundColor: '#fff', textAlign: 'left', transition: 'all 0.2s'
                            }}>
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                                {[preset.primary, preset.secondary, preset.accent].map((c, i) => (
                                    <div key={i} style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: c }} />
                                ))}
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{preset.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Pickers */}
            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#0f172a' }}>Custom Colors</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                    {['primary', 'secondary', 'accent', 'background', 'text'].map(key => (
                        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
                            <input type="color" value={theme[key]} onChange={e => setTheme(p => ({ ...p, [key]: e.target.value }))}
                                style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                            <div>
                                <p style={{ fontWeight: 600, fontSize: '13px', textTransform: 'capitalize', color: '#0f172a' }}>{key}</p>
                                <p style={{ color: '#94a3b8', fontSize: '12px' }}>{theme[key]}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Font */}
            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Font Family</h3>
                <select value={theme.font} onChange={e => setTheme(p => ({ ...p, font: e.target.value }))}
                    style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', width: '300px' }}>
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="Roboto, sans-serif">Roboto</option>
                    <option value="Outfit, sans-serif">Outfit</option>
                    <option value="Poppins, sans-serif">Poppins</option>
                    <option value="DM Sans, sans-serif">DM Sans</option>
                    <option value="Georgia, serif">Georgia (Serif)</option>
                </select>
            </div>

            {/* Preview */}
            <div style={{ marginBottom: '32px', padding: '32px', borderRadius: '16px', backgroundColor: theme.background, color: theme.text, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontFamily: theme.font, fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Theme Preview</h3>
                <p style={{ fontFamily: theme.font, color: theme.secondary, marginBottom: '16px' }}>This is how your site will look with these colors.</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: theme.primary, color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Primary</button>
                    <button style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: theme.accent, color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Accent</button>
                </div>
            </div>

            {message && <p style={{ marginBottom: '16px', padding: '10px 16px', borderRadius: '8px', backgroundColor: message.includes('saved') ? '#f0fdf4' : '#fef2f2', color: message.includes('saved') ? '#22c55e' : '#ef4444', fontSize: '13px' }}>{message}</p>}

            <button onClick={saveTheme} disabled={saving}
                style={{ padding: '12px 32px', borderRadius: '10px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Save Theme'}
            </button>
        </div>
    );
};

export default ThemeEditor;
