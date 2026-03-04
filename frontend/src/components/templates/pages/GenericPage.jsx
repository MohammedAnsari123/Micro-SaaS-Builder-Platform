import React, { useEffect, useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import HeroSection from '../sections/HeroSection';

const GenericPage = ({ pageSlug }) => {
    const { fetchPageContent, getPageContent } = useContent();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        fetchPageContent(pageSlug).then(() => setLoaded(true));
    }, [pageSlug]);

    const sections = getPageContent(pageSlug);

    const renderSection = (sectionKey, data) => {
        if (sectionKey === 'hero') return null; // HeroSection handles this

        switch (sectionKey) {
            case 'skills':
            case 'categories':
                return (
                    <motion.section key={sectionKey} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '40px 0' }}>
                        {data.title && <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>{data.title}</h2>}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                            {(data.items || []).map((item, i) => (
                                <span key={i} style={{ padding: '10px 20px', backgroundColor: 'var(--color-primary)10', color: 'var(--color-primary)', borderRadius: '999px', fontWeight: 500, fontSize: '14px' }}>
                                    {typeof item === 'string' ? item : item.name || item}
                                </span>
                            ))}
                        </div>
                    </motion.section>
                );

            case 'featured_projects':
            case 'list':
            case 'services_preview':
            case 'highlights':
                return (
                    <motion.section key={sectionKey} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '40px 0' }}>
                        {data.title && <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px', textAlign: 'center' }}>{data.title}</h2>}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                            {(data.items || []).map((item, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                    style={{ padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#fff', transition: 'box-shadow 0.2s' }}>
                                    <h3 style={{ fontWeight: 700, marginBottom: '8px', color: 'var(--color-text)' }}>{item.name || item.title || item.company}</h3>
                                    {item.description && <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, marginBottom: '12px' }}>{item.description}</p>}
                                    {item.role && <p style={{ color: 'var(--color-primary)', fontWeight: 500, fontSize: '14px' }}>{item.role}</p>}
                                    {item.tech && <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>{item.tech}</p>}
                                    {item.duration && <p style={{ color: '#94a3b8', fontSize: '13px' }}>{item.duration}</p>}
                                    {item.price && <p style={{ color: 'var(--color-primary)', fontWeight: 600, marginTop: '8px' }}>{item.price}</p>}
                                    {item.category && <span style={{ display: 'inline-block', padding: '4px 10px', backgroundColor: 'var(--color-accent)15', color: 'var(--color-accent)', borderRadius: '6px', fontSize: '12px', fontWeight: 500, marginTop: '8px' }}>{item.category}</span>}
                                    {item.bio && <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>{item.bio}</p>}
                                    {item.highlights && (
                                        <ul style={{ marginTop: '8px', paddingLeft: '16px' }}>
                                            {item.highlights.map((h, j) => (
                                                <li key={j} style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>{h}</li>
                                            ))}
                                        </ul>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                );

            case 'stats':
                return (
                    <motion.section key={sectionKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '40px 0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '24px', textAlign: 'center' }}>
                            {(data.items || []).map((item, i) => (
                                <div key={i} style={{ padding: '24px' }}>
                                    <p style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '4px' }}>{item.value}</p>
                                    <p style={{ color: '#64748b', fontSize: '14px' }}>{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                );

            case 'summary':
                return (
                    <motion.section key={sectionKey} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '40px 0', maxWidth: '700px', margin: '0 auto' }}>
                        {data.title && <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>{data.title}</h2>}
                        {data.description && <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '16px' }}>{data.description}</p>}
                    </motion.section>
                );

            case 'experience':
                return (
                    <motion.section key={sectionKey} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '40px 0' }}>
                        {data.title && <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px', textAlign: 'center' }}>{data.title}</h2>}
                        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                            {(data.items || []).map((item, i) => (
                                <div key={i} style={{ padding: '20px 0', borderBottom: i < data.items.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <h3 style={{ fontWeight: 700 }}>{item.company || item.name}</h3>
                                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>{item.duration}</span>
                                    </div>
                                    {item.role && <p style={{ color: 'var(--color-primary)', fontWeight: 500, fontSize: '14px' }}>{item.role}</p>}
                                </div>
                            ))}
                        </div>
                    </motion.section>
                );

            case 'team':
                return (
                    <motion.section key={sectionKey} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '40px 0' }}>
                        {data.title && <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px', textAlign: 'center' }}>{data.title}</h2>}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
                            {(data.items || []).map((item, i) => (
                                <div key={i} style={{ textAlign: 'center', padding: '32px 24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '999px', backgroundColor: 'var(--color-primary)20', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <LucideIcons.User size={28} color="var(--color-primary)" />
                                    </div>
                                    <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>{item.name}</h3>
                                    <p style={{ color: 'var(--color-primary)', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>{item.role}</p>
                                    {item.bio && <p style={{ color: '#94a3b8', fontSize: '13px' }}>{item.bio}</p>}
                                </div>
                            ))}
                        </div>
                    </motion.section>
                );

            case 'plans':
                return (
                    <motion.section key={sectionKey} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '40px 0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                            {(data.items || []).map((plan, i) => (
                                <div key={i} style={{ padding: '32px', borderRadius: '16px', border: plan.popular ? '2px solid var(--color-primary)' : '1px solid #e2e8f0', backgroundColor: '#fff', position: 'relative' }}>
                                    {plan.popular && <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', padding: '4px 16px', backgroundColor: 'var(--color-primary)', color: '#fff', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>Most Popular</span>}
                                    <h3 style={{ fontWeight: 700, fontSize: '20px', marginBottom: '8px' }}>{plan.name}</h3>
                                    <p style={{ fontSize: '36px', fontWeight: 800, marginBottom: '24px' }}>{plan.price}<span style={{ fontSize: '14px', fontWeight: 400, color: '#94a3b8' }}>{plan.period}</span></p>
                                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '24px' }}>
                                        {(plan.features || []).map((f, j) => (
                                            <li key={j} style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569' }}>
                                                <LucideIcons.Check size={16} color="var(--color-accent)" /> {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <button style={{ width: '100%', padding: '12px', borderRadius: '10px', border: plan.popular ? 'none' : '1px solid #e2e8f0', backgroundColor: plan.popular ? 'var(--color-primary)' : 'transparent', color: plan.popular ? '#fff' : 'var(--color-text)', fontWeight: 600, cursor: 'pointer' }}>{plan.cta}</button>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                );

            case 'hours':
                return (
                    <motion.section key={sectionKey} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '40px 0', textAlign: 'center' }}>
                        {data.title && <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>{data.title}</h2>}
                        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                            {(data.items || []).map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                                    <span style={{ fontWeight: 500 }}>{item.day}</span>
                                    <span style={{ color: '#64748b' }}>{item.hours}</span>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                );

            case 'logos':
                return (
                    <motion.section key={sectionKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '40px 0', textAlign: 'center' }}>
                        {data.title && <p style={{ color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>{data.title}</p>}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center' }}>
                            {(data.items || []).map((name, i) => (
                                <span key={i} style={{ color: '#cbd5e1', fontWeight: 700, fontSize: '18px' }}>{name}</span>
                            ))}
                        </div>
                    </motion.section>
                );

            case 'images':
                return (
                    <motion.section key={sectionKey} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '40px 0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                            {(data.items || []).map((item, i) => (
                                <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: 'var(--color-primary)08', padding: '48px 24px', textAlign: 'center' }}>
                                    <LucideIcons.Image size={32} color="var(--color-primary)" style={{ marginBottom: '12px', opacity: 0.5 }} />
                                    <h4 style={{ fontWeight: 600, marginBottom: '4px' }}>{item.title}</h4>
                                    <p style={{ color: '#94a3b8', fontSize: '13px' }}>{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                );

            case 'info':
                return null; // Handled by ContactSection

            default:
                return null;
        }
    };

    return (
        <div>
            <HeroSection pageSlug={pageSlug} />
            {loaded && Object.entries(sections).map(([key, data]) => renderSection(key, data))}
        </div>
    );
};

export default GenericPage;
