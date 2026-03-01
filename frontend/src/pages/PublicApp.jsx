import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import LayoutRenderer from '../components/dynamic/LayoutRenderer';

const PublicApp = () => {
    const { templateName, emailPrefix } = useParams();
    const [siteData, setSiteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPublicApp = async () => {
            try {
                setLoading(true);
                // No token needed for public view
                const url = `http://localhost:5000/api/v1/tools/resolve/${templateName}/${emailPrefix}`;
                const res = await axios.get(url);

                if (res.data.success) {
                    setSiteData(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch public app:", err);
                setError(err.response?.data?.message || "This application could not be loaded.");
            } finally {
                setLoading(false);
            }
        };

        if (templateName && emailPrefix) {
            fetchPublicApp();
        }
    }, [templateName, emailPrefix]);

    if (loading) {
        return (
            <div className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <h2 className="text-xl font-bold text-white tracking-tight">Initializing Application</h2>
                <p className="text-slate-400 mt-2">Connecting to CodeAra Infrastructure...</p>
            </div>
        );
    }

    if (error || !siteData) {
        return (
            <div className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Application Offline</h2>
                <p className="text-slate-400 max-w-md mb-8">{error || "The requested application was not found or is currently private."}</p>
                <Link to="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-bold">
                    Go to CodeAra Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <LayoutRenderer template={siteData.template} theme={siteData.theme} />

            {/* CodeAra Branding Overlay for Free Plans */}
            {siteData.plan === 'free' && (
                <div className="fixed bottom-4 right-4 z-[9999]">
                    <Link to="/" className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-full shadow-lg hover:shadow-xl transition-all group">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Powered by</span>
                        <span className="text-xs font-black text-blue-600">CodeAra</span>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default PublicApp;
