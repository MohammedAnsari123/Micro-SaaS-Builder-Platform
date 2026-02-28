import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Palette, User, Bell, Shield, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

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
        <div className="space-y-8">
            <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-1 rounded-2xl w-fit shadow-xl">
                <button
                    onClick={() => setActiveTab('branding')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'branding' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
                >
                    <Palette className="w-4 h-4" /> Branding
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
                >
                    <User className="w-4 h-4" /> Profile
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-slate-700 cursor-not-allowed">
                    <Shield className="w-4 h-4" /> Security
                </button>
            </div>

            {activeTab === 'branding' && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl"
                >
                    <div className="mb-10 border-b border-white/5 pb-6">
                        <h2 className="text-3xl font-bold text-white mb-2">White-Label Branding</h2>
                        <p className="text-slate-500 font-medium">Customize the universal aesthetic applied to all your micro-SaaS deployments.</p>
                    </div>

                    <form onSubmit={handleSaveBranding} className="max-w-xl space-y-8">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Master Logo URL</label>
                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <ImageIcon className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <input
                                        type="url"
                                        placeholder="https://cloud.com/your-brand-logo.png"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3.5 pl-11 pr-4 text-white focus:border-blue-500 transition-all outline-none"
                                        value={branding.logoUrl}
                                        onChange={e => setBranding({ ...branding, logoUrl: e.target.value })}
                                    />
                                </div>
                                <div className="w-14 h-14 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center p-2 overflow-hidden shadow-inner">
                                    {branding.logoUrl ? <img src={branding.logoUrl} alt="Preview" className="max-w-full h-auto" /> : <Palette className="w-6 h-6 text-slate-600" />}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Primary Theme Color</label>
                                <div className="flex items-center gap-4 bg-slate-800 p-3 rounded-2xl border border-slate-700">
                                    <input
                                        type="color"
                                        className="w-10 h-10 bg-transparent border-0 cursor-pointer rounded-lg"
                                        value={branding.primaryColor}
                                        onChange={e => setBranding({ ...branding, primaryColor: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="bg-transparent text-sm font-bold text-white outline-none w-24 tracking-tighter"
                                        value={branding.primaryColor.toUpperCase()}
                                        onChange={e => setBranding({ ...branding, primaryColor: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Accent Accent Color</label>
                                <div className="flex items-center gap-4 bg-slate-800 p-3 rounded-2xl border border-slate-700">
                                    <input
                                        type="color"
                                        className="w-10 h-10 bg-transparent border-0 cursor-pointer rounded-lg"
                                        value={branding.accentColor}
                                        onChange={e => setBranding({ ...branding, accentColor: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="bg-transparent text-sm font-bold text-white outline-none w-24 tracking-tighter"
                                        value={branding.accentColor.toUpperCase()}
                                        onChange={e => setBranding({ ...branding, accentColor: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Commit Universal Brands
                        </button>
                    </form>
                </motion.div>
            )}

            {activeTab === 'profile' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl"
                >
                    <div className="mb-10 flex items-center gap-8">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 to-blue-500 p-[3px] shadow-2xl shadow-blue-500/10">
                            <div className="w-full h-full bg-slate-900 rounded-[21px] flex items-center justify-center p-4">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} alt="user" className="w-full h-auto drop-shadow-xl" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white">{profile.name}</h2>
                            <p className="text-slate-500 font-medium">Tenant Owner & System Architect</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Identity</label>
                            <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 text-slate-300 font-medium">{profile.name}</div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Primary Contact</label>
                            <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 text-slate-300 font-medium">{profile.email}</div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default GlobalSettings;
