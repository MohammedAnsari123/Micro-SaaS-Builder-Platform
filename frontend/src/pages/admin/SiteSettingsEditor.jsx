import React, { useState } from 'react';
import { Save } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

const SiteSettingsEditor = ({ token, cloneId }) => {
    const [settings, setSettings] = useState({ siteName: '', tagline: '', logo: '', favicon: '', socialLinks: { facebook: '', twitter: '', instagram: '', linkedin: '', github: '' } });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const headers = { Authorization: `Bearer ${token}` };

    React.useEffect(() => {
        const fetchSettings = async () => {
            if (!cloneId || cloneId === 'undefined') return;
            try {
                setLoading(true);
                const res = await axios.get(`${API_BASE}/templates/my/clones`, { headers });
                if (res.data.success) {
                    const currentClone = res.data.data.find(c => c._id === cloneId);
                    if (currentClone && currentClone.siteSettings) {
                        setSettings(prev => ({
                            ...prev,
                            ...currentClone.siteSettings,
                            socialLinks: {
                                ...prev.socialLinks,
                                ...(currentClone.siteSettings.socialLinks || {})
                            }
                        }));
                    }
                }
            } catch (err) {
                console.error("Failed to fetch settings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [cloneId]);

    const saveSettings = async () => {
        try {
            setSaving(true);
            await axios.put(`${API_BASE}/templates/settings/${cloneId}`, settings, { headers });
            setMessage('Settings saved!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>Site Settings</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>Configure your site name, tagline, and social links.</p>

            {loading ? <p style={{ color: '#94a3b8' }}>Loading settings...</p> : (
                <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={labelStyle}>Site Name</label>
                        <input type="text" value={settings.siteName} onChange={e => setSettings(p => ({ ...p, siteName: e.target.value }))} placeholder="My Awesome Site" style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Tagline</label>
                        <input type="text" value={settings.tagline} onChange={e => setSettings(p => ({ ...p, tagline: e.target.value }))} placeholder="Building the future" style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Logo URL</label>
                        <input type="text" value={settings.logo} onChange={e => setSettings(p => ({ ...p, logo: e.target.value }))} placeholder="https://example.com/logo.png" style={inputStyle} />
                    </div>

                    <h3 style={{ fontWeight: 600, marginTop: '16px' }}>Social Links</h3>
                    {Object.entries(settings.socialLinks).map(([platform, url]) => (
                        <div key={platform}>
                            <label style={labelStyle}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
                            <input type="text" value={url} onChange={e => setSettings(p => ({ ...p, socialLinks: { ...p.socialLinks, [platform]: e.target.value } }))} placeholder={`https://${platform}.com/...`} style={inputStyle} />
                        </div>
                    ))}

                    {message && <p style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#f0fdf4', color: '#22c55e', fontSize: '13px' }}>{message}</p>}

                    <button onClick={saveSettings} disabled={saving}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#0f172a', color: '#fff', fontWeight: 700, cursor: 'pointer', marginTop: '8px' }}>
                        <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            )}
        </div>
    );
};

const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 500, color: '#334155', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };

export default SiteSettingsEditor;
