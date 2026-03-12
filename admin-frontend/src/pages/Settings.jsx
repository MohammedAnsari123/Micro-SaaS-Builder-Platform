import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save, Loader2, DollarSign, Check, X, Shield, Server, Activity } from 'lucide-react';
import axios from 'axios';
import './settings.css';

const API = 'http://localhost:5000/api/v1';

const ToggleButton = ({ enabled, onClick }) => (
    <button
        onClick={onClick}
        type="button"
        role="switch"
        aria-checked={enabled}
        className="toggle-switch-btn"
    >
        <span className="sr-only">Toggle setting</span>
        <span className="toggle-switch-knob">
            <span className={`knob-icon knob-icon-off`}>
                <X size={12} color="var(--color-text-muted)" />
            </span>
            <span className={`knob-icon knob-icon-on`}>
                <Check size={12} color="var(--color-primary-500)" />
            </span>
        </span>
    </button>
);

const SettingsRow = ({ label, description, enabled, onChange }) => (
    <div className="settings-row">
        <div className="settings-row-content">
            <p className="row-label">{label}</p>
            <p className="row-desc">{description}</p>
        </div>
        <ToggleButton enabled={enabled} onClick={onChange} />
    </div>
);

const Settings = () => {
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        commissionPercentage: 20,
        freePrice: 0,
        basicPrice: 9,
        proPrice: 29,
        rateLimitPerMinute: 100,
        enableRegistration: true,
    });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const { data } = await axios.get(`${API}/admin/settings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data.success) setSettings(prev => ({ ...prev, ...data.data }));
            } catch { /* Use defaults */ }
            finally { setLoading(false); }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setSuccessMsg('');
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`${API}/admin/settings`, settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMsg('Settings saved successfully');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch {
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '60vh' }}>
                <div className="admin-loader"></div>
            </div>
        );
    }

    return (
        <div className="settings-container">
            {/* Header Content */}
            <div className="settings-header">
                <div className="header-title-section">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="title-row"
                    >
                        <div className="settings-icon-wrapper">
                            <div className="settings-icon-inner">
                                <SettingsIcon className="title-icon" style={{ color: '#8b5cf6' }} />
                            </div>
                        </div>
                        <h1 className="dashboard-title">System Configuration</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="dashboard-subtitle"
                    >
                        Manage global platform behavior, pricing, and integrations limits
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="settings-actions-group"
                >
                    {successMsg && (
                        <span className="success-message">
                            {successMsg}
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-save-settings"
                    >
                        {saving ? <Loader2 className="icon-spin" size={16} /> : <Save size={16} />}
                        {saving ? 'Committing...' : 'Commit Changes'}
                    </button>
                </motion.div>
            </div>

            <div className="settings-panels-grid">

                {/* Feature Flags */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="settings-panel">
                    <div className="table-glow-1" style={{ backgroundColor: 'rgba(99, 102, 241, 0.05)', right: '-2.5rem', top: '-2.5rem', left: 'auto' }} />

                    <div className="panel-top-bar">
                        <div className="panel-icon-box" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                            <Shield size={16} color="#8b5cf6" />
                        </div>
                        <h2 className="panel-title">Access & Features</h2>
                    </div>

                    <div className="panel-content">
                        <SettingsRow
                            label="System Maintenance Mode"
                            description="Block all non-admin traffic and display the maintenance screen."
                            enabled={settings.maintenanceMode}
                            onChange={() => setSettings(s => ({ ...s, maintenanceMode: !s.maintenanceMode }))}
                        />
                        <SettingsRow
                            label="Open Registration"
                            description="Allow new users to sign up for accounts freely. When off, invites are required."
                            enabled={settings.enableRegistration}
                            onChange={() => setSettings(s => ({ ...s, enableRegistration: !s.enableRegistration }))}
                        />
                    </div>
                </motion.div>

                {/* Subscriptions */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="settings-panel">
                    <div className="table-glow-1" style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', right: '-2.5rem', bottom: '-2.5rem', top: 'auto', left: 'auto' }} />

                    <div className="panel-top-bar">
                        <div className="panel-icon-box" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <DollarSign size={16} color="#10b981" />
                        </div>
                        <h2 className="panel-title">Subscription Pricing</h2>
                    </div>

                    <div className="panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {[
                            { label: 'Free Tier (Monthly USD)', key: 'freePrice', icon: '0' },
                            { label: 'Basic Plan (Monthly USD)', key: 'basicPrice', icon: 'B' },
                            { label: 'Pro Plan (Monthly USD)', key: 'proPrice', icon: 'P' },
                        ].map((p, i) => (
                            <div key={p.key} className="pricing-row">
                                <div className="pricing-icon-box">
                                    {p.icon}
                                </div>
                                <div className="pricing-input-group">
                                    <label className="pricing-label">{p.label}</label>
                                    <div className="pricing-input-wrapper">
                                        <div className="currency-symbol">$</div>
                                        <input
                                            type="number"
                                            min="0"
                                            value={settings[p.key]}
                                            onChange={e => setSettings(s => ({ ...s, [p.key]: parseInt(e.target.value) || 0 }))}
                                            className="pricing-input"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Technical Configuration */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="settings-panel settings-panel-full-width">
                    <div className="table-glow-1" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', left: '50%', bottom: '0', top: 'auto', transform: 'translateX(-50%) translateY(50%)', width: '31.25rem', height: '18.75rem' }} />

                    <div className="panel-top-bar">
                        <div className="panel-icon-box" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                            <Server size={16} color="#f97316" />
                        </div>
                        <h2 className="panel-title">Technical Infrastructure</h2>
                    </div>

                    <div className="panel-content tech-config-grid">
                        <div className="tech-input-group">
                            <label className="tech-label">
                                <Activity size={16} color="#06b6d4" /> API Rate Limit
                            </label>
                            <input
                                type="number"
                                min="10"
                                value={settings.rateLimitPerMinute}
                                onChange={e => setSettings(s => ({ ...s, rateLimitPerMinute: parseInt(e.target.value) || 100 }))}
                                className="tech-input"
                            />
                            <p className="tech-desc">Requests permitted per minute per tenant</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Settings;
