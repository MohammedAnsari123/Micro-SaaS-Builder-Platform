import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import './auth.css';

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
        <div className="auth-container">
            {/* Animated Background Elements */}
            <div className="auth-bg-blob-1" style={{ top: '-20%', left: 'auto', right: '-10%', backgroundColor: 'rgba(99, 102, 241, 0.2)' }} />
            <div className="auth-bg-blob-2" style={{ bottom: '-20%', right: 'auto', left: '-10%' }} />
            <div className="auth-bg-blob-3" style={{ top: '20%', right: 'auto', left: '20%', backgroundColor: 'rgba(13, 148, 136, 0.2)' }} />
            <div className="auth-bg-grid" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="auth-card-wrapper auth-card-register"
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
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Apply for CodeAra Administrator Access</p>
                    </motion.div>
                </div>

                {/* Register Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="auth-panel auth-panel-register"
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

                    <form onSubmit={handleSubmit} className="auth-form auth-form-register">
                        <div className="form-group">
                            <label className="form-label" style={{ marginLeft: '0.25rem' }}>Full Name</label>
                            <div className="input-wrapper">
                                <div className="input-icon-box">
                                    <User className="input-icon" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="Admin Name"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="auth-input"
                                />
                            </div>
                        </div>

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
                            <label className="form-label" style={{ marginLeft: '0.25rem' }}>Password</label>
                            <div className="input-wrapper">
                                <div className="input-icon-box">
                                    <Lock className="input-icon" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    className="auth-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ marginLeft: '0.25rem' }}>Admin Secret Key</label>
                            <div className="input-wrapper">
                                <div className="input-icon-box">
                                    <Lock className="input-icon" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    placeholder="Enter the platform secret key"
                                    value={form.secretKey}
                                    onChange={e => setForm({ ...form, secretKey: e.target.value })}
                                    className="auth-input auth-input-secret"
                                />
                            </div>
                            <p className="input-help-text">Required to authorize new admin registration.</p>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-auth-submit btn-auth-submit-register"
                        >
                            {loading ? (
                                <Loader2 className="btn-icon-arrow icon-spin" />
                            ) : (
                                <>
                                    Complete Registration
                                    <ArrowRight className="btn-icon-arrow" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            Already have an account?{' '}
                            <Link to="/login" className="auth-footer-link">
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
