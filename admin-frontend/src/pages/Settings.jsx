import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save, Loader2, DollarSign, Gauge, Check, X, Shield, Server, ArrowRight, Activity, BrainCircuit } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000/api/v1';

const ToggleButton = ({ enabled, onClick }) => (
    <button
        onClick={onClick}
        type="button"
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${enabled ? 'bg-brand-500' : 'bg-slate-700'}`}
    >
        <span className="sr-only">Toggle setting</span>
        <span
            className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
        >
            <span
                className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-out ${enabled ? 'opacity-0 duration-100 ease-out flex' : 'opacity-100 duration-200 ease-in flex'}`}
                aria-hidden="true"
            >
                <X className="h-3 w-3 text-slate-400" />
            </span>
            <span
                className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity duration-200 ease-out ${enabled ? 'opacity-100 duration-200 ease-in flex' : 'opacity-0 duration-100 ease-out flex'}`}
                aria-hidden="true"
            >
                <Check className="h-3 w-3 text-brand-500" />
            </span>
        </span>
    </button>
);

const SettingsRow = ({ label, description, enabled, onChange }) => (
    <div className="flex items-center justify-between py-5 border-b border-white/5 last:border-0 group">
        <div>
            <p className="text-white text-sm font-bold group-hover:text-brand-300 transition-colors">{label}</p>
            <p className="text-slate-400 text-xs mt-1 max-w-[80%]">{description}</p>
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
        aiModelName: 'Qwen/Qwen2.5-3B-Instruct',
        enableRegistration: true,
        enableMarketplace: true,
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
            <div className="flex items-center justify-center min-h-[60vh] relative z-10">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-t-2 border-brand-500 border-l-2 border-transparent animate-spin" />
                    <div className="w-16 h-16 rounded-full border-r-2 border-indigo-500 border-b-2 border-transparent animate-spin absolute inset-0 animation-delay-500" />
                    <SettingsIcon className="w-6 h-6 text-brand-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 relative z-10 pb-20">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-r from-brand-600/10 to-indigo-600/10 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3 mb-2"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-500 p-[1px]">
                            <div className="w-full h-full bg-[#0f172a] rounded-[10px] flex items-center justify-center">
                                <SettingsIcon className="w-5 h-5 text-indigo-400" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">System Configuration</h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 font-medium ml-1"
                    >
                        Manage global platform behavior, pricing, and integrations limits
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-3"
                >
                    {successMsg && (
                        <span className="text-emerald-400 text-sm font-bold animate-pulse px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            {successMsg}
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2.5 bg-gradient-to-r from-brand-500 to-indigo-500 hover:from-brand-600 hover:to-indigo-600 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] flex items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />}
                        {saving ? 'Committing...' : 'Commit Changes'}
                    </button>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Feature Flags */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden h-full flex flex-col">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-[40px] pointer-events-none" />

                    <div className="flex items-center gap-3 mb-6 relative z-10 pb-4 border-b border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-indigo-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Access & Features</h2>
                    </div>

                    <div className="flex-1 relative z-10">
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
                        <SettingsRow
                            label="Public Marketplace"
                            description="Enable public browsing of the template marketplace for unauthenticated users."
                            enabled={settings.enableMarketplace}
                            onChange={() => setSettings(s => ({ ...s, enableMarketplace: !s.enableMarketplace }))}
                        />
                    </div>
                </motion.div>

                {/* Subscriptions */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden h-full flex flex-col">
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none" />

                    <div className="flex items-center gap-3 mb-6 relative z-10 pb-4 border-b border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Subscription Pricing</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-5 relative z-10 flex-1">
                        {[
                            { label: 'Free Tier (Monthly USD)', key: 'freePrice', icon: '0' },
                            { label: 'Basic Plan (Monthly USD)', key: 'basicPrice', icon: 'B' },
                            { label: 'Pro Plan (Monthly USD)', key: 'proPrice', icon: 'P' },
                        ].map((p, i) => (
                            <div key={p.key} className="flex items-center gap-4 bg-white/[0.02] p-3 rounded-xl border border-white/5 hover:border-brand-500/30 transition-colors">
                                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center font-bold text-slate-400 border border-slate-700">
                                    {p.icon}
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-400 mb-1">{p.label}</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-slate-500 font-bold">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            min="0"
                                            value={settings[p.key]}
                                            onChange={e => setSettings(s => ({ ...s, [p.key]: parseInt(e.target.value) || 0 }))}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-4 py-2 text-white font-bold text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Technical Configuration */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden lg:col-span-2">
                    <div className="absolute left-1/2 bottom-0 w-[500px] h-[300px] bg-brand-500/5 -translate-x-1/2 translate-y-1/2 rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex items-center gap-3 mb-6 relative z-10 pb-4 border-b border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                            <Server className="w-4 h-4 text-orange-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Technical Infrastructure</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-2">
                                <Gauge className="w-4 h-4 text-brand-400" /> Marketplace Commission
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={settings.commissionPercentage}
                                    onChange={e => setSettings(s => ({ ...s, commissionPercentage: parseInt(e.target.value) || 0 }))}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-bold tracking-wide focus:outline-none focus:border-brand-500 focus:bg-slate-900 transition-all"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <span className="text-slate-500 font-bold">%</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-2 font-medium">Cut taken from marketplace sales</p>
                        </div>

                        <div className="group">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-2">
                                <Activity className="w-4 h-4 text-cyan-400" /> API Rate Limit
                            </label>
                            <input
                                type="number"
                                min="10"
                                value={settings.rateLimitPerMinute}
                                onChange={e => setSettings(s => ({ ...s, rateLimitPerMinute: parseInt(e.target.value) || 100 }))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-bold tracking-wide focus:outline-none focus:border-cyan-500 focus:bg-slate-900 transition-all"
                            />
                            <p className="text-xs text-slate-500 mt-2 font-medium">Requests permitted per minute per tenant</p>
                        </div>

                        <div className="group">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-2">
                                <BrainCircuit className="w-4 h-4 text-fuchsia-400" /> Default AI Model
                            </label>
                            <input
                                type="text"
                                value={settings.aiModelName}
                                onChange={e => setSettings(s => ({ ...s, aiModelName: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm tracking-wide focus:outline-none focus:border-fuchsia-500 focus:bg-slate-900 transition-all placeholder:text-slate-600"
                                placeholder="e.g. gpt-4-turbo"
                            />
                            <p className="text-xs text-slate-500 mt-2 font-medium">Primary LLM used for app generators</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Settings;
