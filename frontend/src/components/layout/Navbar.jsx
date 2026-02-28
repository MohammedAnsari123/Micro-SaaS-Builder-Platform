import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, ChevronRight, LogOut } from 'lucide-react';

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
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md bg-slate-900/60 border-b border-slate-800"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
                        <Layers className="text-white w-6 h-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        SaaSForge<span className="text-blue-500">.ai</span>
                    </span>
                </Link>

                {/* Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <Link to="/templateSites" className="hover:text-white transition-colors duration-200">
                        Templates
                    </Link>
                    <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
                    <a href="#how-it-works" className="hover:text-white transition-colors duration-200">How it Works</a>
                    <a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</a>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200">
                                Sign In
                            </Link>
                            <Link to="/register" className="group relative px-5 py-2.5 rounded-full bg-white text-slate-900 text-sm font-semibold overflow-hidden transition-all hover:scale-105 active:scale-95">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative flex items-center gap-1">
                                    Get Started <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors duration-200"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                            <Link to="/dashboard" className="group relative px-5 py-2.5 rounded-full bg-white text-slate-900 text-sm font-semibold overflow-hidden transition-all hover:scale-105 active:scale-95">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative flex items-center gap-1">
                                    Dashboard <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
