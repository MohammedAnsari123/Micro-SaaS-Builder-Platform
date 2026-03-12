import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Palette, User, Bell, Shield, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

import '../styles/settings.css';

const GlobalSettings = () => {
    const [activeTab, setActiveTab] = useState('branding');
    const [branding, setBranding] = useState({ logoUrl: '', primaryColor: '#3b82f6', accentColor: '#10b981' });
    const [profile, setProfile] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [brandingRes, userRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/v1/tenant/branding', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/v1/auth/me', { headers: { Authorization: `Bearer ${token}` } })
                ]);

                if (brandingRes.data.success && brandingRes.data.data) setBranding(brandingRes.data.data);
                if (userRes.data.success && userRes.data.data) setProfile(userRes.data.data);
            } catch (err) {
                console.error("Failed to fetch settings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSaveBranding = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/v1/tenant/branding', branding, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Universal branding updated!");
        } catch {
            alert("Save failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

    return (
        <div>
            <div className="settings-tabs">
                <button
                    onClick={() => setActiveTab('branding')}
                    className={`settings-tab ${activeTab === 'branding' ? 'active' : ''}`}
                >
                    <Palette style={{ width: '16px', height: '16px' }} /> Branding
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
                >
                    <User style={{ width: '16px', height: '16px' }} /> Profile
                </button>
                <button disabled className="settings-tab">
                    <Shield style={{ width: '16px', height: '16px' }} /> Security
                </button>
            </div>

            {activeTab === 'branding' && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="settings-panel"
                >
                    <div className="settings-panel-header">
                        <h2 className="settings-panel-title">White-Label Branding</h2>
                        <p className="settings-panel-desc">Customize the universal aesthetic applied to all your micro-SaaS deployments.</p>
                    </div>

                    <form onSubmit={handleSaveBranding} className="settings-form">
                        <div className="settings-field">
                            <label className="settings-label">Master Logo URL</label>
                            <div className="settings-input-group">
                                <div className="settings-input-wrapper">
                                    <ImageIcon className="settings-input-icon" />
                                    <input
                                        type="url"
                                        placeholder="https://cloud.com/your-brand-logo.png"
                                        className="settings-input"
                                        value={branding.logoUrl}
                                        onChange={e => setBranding({ ...branding, logoUrl: e.target.value })}
                                    />
                                </div>
                                <div className="settings-preview-box">
                                    {branding.logoUrl ? <img src={branding.logoUrl} alt="Preview" /> : <Palette style={{ width: '24px', height: '24px', color: 'var(--color-text-muted)' }} />}
                                </div>
                            </div>
                        </div>

                        <div className="settings-color-grid">
                            <div className="settings-field">
                                <label className="settings-label">Primary Theme Color</label>
                                <div className="settings-color-picker">
                                    <input
                                        type="color"
                                        className="settings-color-input"
                                        value={branding.primaryColor}
                                        onChange={e => setBranding({ ...branding, primaryColor: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="settings-color-text"
                                        value={branding.primaryColor.toUpperCase()}
                                        onChange={e => setBranding({ ...branding, primaryColor: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="settings-field">
                                <label className="settings-label">Accent Color</label>
                                <div className="settings-color-picker">
                                    <input
                                        type="color"
                                        className="settings-color-input"
                                        value={branding.accentColor}
                                        onChange={e => setBranding({ ...branding, accentColor: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="settings-color-text"
                                        value={branding.accentColor.toUpperCase()}
                                        onChange={e => setBranding({ ...branding, accentColor: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-settings-save"
                            style={{ alignSelf: 'flex-start' }}
                        >
                            {saving ? <Loader2 className="animate-spin" style={{ width: '20px', height: '20px' }} /> : <Save style={{ width: '20px', height: '20px' }} />}
                            Commit Universal Brands
                        </button>
                    </form>
                </motion.div>
            )}

            {activeTab === 'profile' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="settings-panel"
                >
                    <div className="profile-header">
                        <div className="profile-avatar-container">
                            <div className="profile-avatar-inner">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} alt="user" />
                            </div>
                        </div>
                        <div>
                            <h2 className="profile-name">{profile.name}</h2>
                            <p className="profile-role">Tenant Owner & System Architect</p>
                        </div>
                    </div>

                    <div className="profile-info-grid">
                        <div className="settings-field">
                            <label className="settings-label">Full Identity</label>
                            <div className="profile-info-box">{profile.name}</div>
                        </div>
                        <div className="settings-field">
                            <label className="settings-label">Primary Contact</label>
                            <div className="profile-info-box">{profile.email}</div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default GlobalSettings;
