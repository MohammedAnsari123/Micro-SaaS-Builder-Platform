import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';

import '../styles/auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post('http://localhost:5000/api/v1/auth/login', {
                email,
                password
            });

            if (data.success) {
                localStorage.setItem('token', data.accessToken);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <Layers />
                    </Link>
                    <h2 className="auth-title">
                        Welcome back
                    </h2>
                    <p className="auth-subtitle">
                        Or{' '}
                        <Link to="/register" className="auth-link">
                            start your 14-day free trial
                        </Link>
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="auth-card">

                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">
                                    Email address
                                </label>
                                <div className="form-input-wrap">
                                    <div className="form-icon">
                                        <Mail />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-input"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Password
                                </label>
                                <div className="form-input-wrap">
                                    <div className="form-icon">
                                        <Lock />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-input"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="form-options">
                                <div className="form-checkbox-wrap">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="form-checkbox"
                                    />
                                    <label htmlFor="remember-me" className="form-checkbox-label">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="auth-link">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-submit"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" style={{ width: '20px', height: '20px' }} />
                                    ) : (
                                        <>
                                            Sign in
                                            <ArrowRight style={{ width: '16px', height: '16px' }} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
