import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';

const API = 'http://localhost:5000/api/v1';

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', secretKey: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post(`${API}/auth/admin/register`, form);
            if (data.success) {
                localStorage.setItem('adminToken', data.accessToken);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Check your Secret Key.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Animated Background Elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-600/20 blur-[120px] animate-blob" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] animate-blob animation-delay-2000" />
            <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] rounded-full bg-teal-600/20 blur-[100px] animate-blob animation-delay-4000" />
            <div className="absolute inset-0 bg-grid-pattern opacity-50" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-[460px] relative z-10 my-8"
            >
                {/* Logo Area */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center justify-center relative group"
                    >
                        <div className="absolute inset-0 bg-brand-500/20 rounded-2xl blur-xl transition-all duration-500 group-hover:bg-brand-500/40 opacity-0 group-hover:opacity-100" />
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-blue-600 p-[1px] shadow-lg shadow-brand-500/20 relative z-10">
                            <div className="w-full h-full bg-[#0f172a] rounded-[15px] flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-brand-500/10"></div>
                                <Zap className="w-8 h-8 text-brand-400 relative z-10 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mt-6 space-y-2"
                    >
                        <h1 className="text-3xl font-bold tracking-tight text-white">Create Account</h1>
                        <p className="text-slate-400 text-sm font-medium">Apply for SaaSForge Administrator Access</p>
                    </motion.div>
                </div>

                {/* Register Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="glass-panel p-8 sm:p-10 !rounded-[2.5rem]"
                >
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl font-medium flex items-start gap-3 overflow-hidden"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="Admin Name"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 focus:bg-white/5 transition-all text-[15px] shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    placeholder="admin@saasforge.ai"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 focus:bg-white/5 transition-all text-[15px] shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 focus:bg-white/5 transition-all text-[15px] shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Admin Secret Key</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    placeholder="Enter the platform secret key"
                                    value={form.secretKey}
                                    onChange={e => setForm({ ...form, secretKey: e.target.value })}
                                    className="w-full bg-black/20 border border-brand-500/30 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:bg-brand-500/5 transition-all text-[15px] shadow-inner"
                                />
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium px-1">Required to authorize new admin registration.</p>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none mt-4 group"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Complete Registration
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-sm text-slate-400 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-bold transition-colors">
                                Sign In securely
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Register;
