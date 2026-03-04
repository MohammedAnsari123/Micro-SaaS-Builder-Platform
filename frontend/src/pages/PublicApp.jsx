import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { ContentProvider } from '../context/ContentContext';
import ThemeProvider from '../context/ThemeProvider';
import TemplateRenderer from '../components/templates/TemplateRenderer';

const PublicApp = () => {
    const { templateName, emailPrefix, cloneId } = useParams();
    const [siteData, setSiteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPublicApp = async () => {
            try {
                setLoading(true);
                // Use the new template-based resolve endpoint
                const url = `http://localhost:5000/api/v1/templates/resolve/${templateName}/${emailPrefix}${cloneId ? `/${cloneId}` : ''}`;
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
            <div style={{
                height: '100vh', width: '100%', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            }}>
                <Loader2 style={{ width: '48px', height: '48px', color: '#3b82f6', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>Initializing Site</h2>
                <p style={{ color: '#94a3b8', marginTop: '8px' }}>Loading your experience...</p>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (error || !siteData) {
        return (
            <div style={{
                height: '100vh', width: '100%', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '999px',
                    backgroundColor: 'rgba(239,68,68,0.1)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', marginBottom: '24px'
                }}>
                    <AlertCircle style={{ width: '32px', height: '32px', color: '#ef4444' }} />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Site Not Found</h2>
                <p style={{ color: '#94a3b8', maxWidth: '400px', marginBottom: '32px' }}>
                    {error || "The requested site was not found or is currently offline."}
                </p>
                <Link to="/" style={{
                    padding: '12px 24px', backgroundColor: '#3b82f6', color: '#fff',
                    borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '14px'
                }}>
                    Go to CodeAra Home
                </Link>
            </div>
        );
    }

    return (
        <ContentProvider
            tenantId={siteData.tenantId}
            cloneId={siteData.cloneId}
            template={siteData.template}
            theme={siteData.theme}
            siteSettings={siteData.siteSettings}
            plan={siteData.plan}
        >
            <ThemeProvider>
                <TemplateRenderer />

                {/* CodeAra Branding for Free Plans */}
                {siteData.plan === 'free' && (
                    <div style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: 9999 }}>
                        <Link to="/" style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
                            border: '1px solid #e2e8f0', padding: '6px 14px',
                            borderRadius: '999px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            textDecoration: 'none', transition: 'all 0.2s'
                        }}>
                            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Powered by</span>
                            <span style={{ fontSize: '12px', fontWeight: 800, color: '#3b82f6' }}>CodeAra</span>
                        </Link>
                    </div>
                )}
            </ThemeProvider>
        </ContentProvider>
    );
};

export default PublicApp;
