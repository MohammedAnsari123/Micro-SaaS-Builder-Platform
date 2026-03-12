import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import './auth.css';

const API = 'http://localhost:5000/api/v1';

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post(`${API}/auth/admin/login`, form);
            if (data.success) {
                localStorage.setItem('adminToken', data.accessToken);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* Animated Background Elements */}
            <div className="auth-bg-blob-1" />
            <div className="auth-bg-blob-2" />
            <div className="auth-bg-blob-3" />
            <div className="auth-bg-grid" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="auth-card-wrapper auth-card-login"
            >
                {/* Logo Area */}
                <div className="auth-header">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="auth-logo-group"
                    >
                        <div className="auth-logo-glow" />
                        <div className="auth-logo-box">
                            <div className="auth-logo-inner">
                                <div className="auth-logo-tint"></div>
                                <Zap className="auth-logo-icon" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="auth-title-section"
                    >
                        <h1 className="auth-title">Welcome Back</h1>
                        <p className="auth-subtitle">Log in to your CodeAra control panel</p>
                    </motion.div>
                </div>

                {/* Login Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="auth-panel"
                >
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className="auth-error-msg"
                            >
                                <div className="auth-error-dot" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label" style={{ marginLeft: '0.25rem' }}>Email Address</label>
                            <div className="input-wrapper">
                                <div className="input-icon-box">
                                    <Mail className="input-icon" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    placeholder="admin@codeara.com"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="auth-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="form-label-row">
                                <label className="form-label">Password</label>
                                <a href="#" className="form-label-link">Forgot password?</a>
                            </div>
                            <div className="input-wrapper">
                                <div className="input-icon-box">
                                    <Lock className="input-icon" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    className="auth-input"
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-auth-submit"
                        >
                            {loading ? (
                                <Loader2 className="btn-icon-arrow icon-spin" />
                            ) : (
                                <>
                                    Sign In securely
                                    <ArrowRight className="btn-icon-arrow" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            Don't have an admin account?{' '}
                            <Link to="/register" className="auth-footer-link">
                                Apply for access
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
