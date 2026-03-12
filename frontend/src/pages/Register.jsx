import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Mail, Lock, User, Building, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';

import '../styles/auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        tenantName: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post('http://localhost:5000/api/v1/auth/register', formData);

            if (data.success) {
                localStorage.setItem('token', data.accessToken);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
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
                        Create your workspace
                    </h2>
                    <p className="auth-subtitle">
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">
                            Sign in
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
                                    Full Name
                                </label>
                                <div className="form-input-wrap">
                                    <div className="form-icon">
                                        <User />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

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
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
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
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="••••••••"
                                        minLength="6"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Workspace Name <span className="form-label-hint">(Your Tenant ID)</span>
                                </label>
                                <div className="form-input-wrap">
                                    <div className="form-icon">
                                        <Building />
                                    </div>
                                    <input
                                        type="text"
                                        name="tenantName"
                                        required
                                        value={formData.tenantName}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="AcmeCorp"
                                    />
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
                                            Create Workspace
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

export default Register;
