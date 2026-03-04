import React, { useEffect, useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import { motion } from 'framer-motion';

const HeroSection = ({ pageSlug }) => {
    const { fetchPageContent, getSectionData } = useContent();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        fetchPageContent(pageSlug).then(() => setLoaded(true));
    }, [pageSlug]);

    const data = getSectionData(pageSlug, 'hero');

    if (!loaded || !data.title) return null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                padding: '80px 0 40px',
                textAlign: 'center'
            }}
        >
            {data.subtitle && (
                <span style={{
                    display: 'inline-block',
                    padding: '6px 16px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--color-primary)15',
                    color: 'var(--color-primary)',
                    fontSize: '13px',
                    fontWeight: 600,
                    marginBottom: '16px',
                    letterSpacing: '0.5px'
                }}>
                    {data.subtitle}
                </span>
            )}
            <h1 style={{
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: '16px',
                color: 'var(--color-text)'
            }}>
                {data.title}
            </h1>
            {data.description && (
                <p style={{
                    fontSize: '18px',
                    lineHeight: 1.6,
                    color: '#64748b',
                    maxWidth: '640px',
                    margin: '0 auto 32px'
                }}>
                    {data.description}
                </p>
            )}
            {data.cta && (
                <button style={{
                    padding: '14px 32px',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                }}>
                    {data.cta}
                </button>
            )}
        </motion.section>
    );
};

export default HeroSection;
