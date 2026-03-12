import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, ChevronRight, LogOut } from 'lucide-react';
import '../../styles/navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem('token'));
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="navbar"
        >
            <div className="navbar-container">

                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <div className="navbar-logo-icon">
                        <Layers size={24} color="#ffffff" />
                    </div>
                    <span className="navbar-logo-text">
                        CodeAra
                    </span>
                </Link>

                {/* Links */}
                <div className="navbar-links">
                    <Link to="/templates" className="navbar-link">
                        Templates
                    </Link>
                    <a href="#features" className="navbar-link">Features</a>
                    <a href="#how-it-works" className="navbar-link">How it Works</a>
                    <a href="#pricing" className="navbar-link">Pricing</a>
                </div>

                {/* Actions */}
                <div className="navbar-actions">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" className="navbar-link">
                                Sign In
                            </Link>
                            <Link to="/register" className="btn-primary">
                                <span className="btn-primary-content">
                                    Get Started <ChevronRight size={16} className="icon-transition" />
                                </span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleLogout}
                                className="navbar-logout"
                            >
                                <LogOut size={16} /> Sign Out
                            </button>
                            <Link to="/dashboard" className="btn-primary">
                                <span className="btn-primary-content">
                                    Dashboard <ChevronRight size={16} className="icon-transition" />
                                </span>
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </motion.nav>
    );
};

export default Navbar;
