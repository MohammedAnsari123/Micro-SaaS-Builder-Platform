import React, { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ContactSection = () => {
    const { tenantId, cloneId, fetchPageContent, getSectionData } = useContent();
    const [loaded, setLoaded] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPageContent('contact').then(() => setLoaded(true));
    }, []);

    const hero = getSectionData('contact', 'hero');
    const info = getSectionData('contact', 'info');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        setError('');
        try {
            await axios.post(`http://localhost:5000/api/v1/contact/${tenantId}/${cloneId}`, form);
            setSent(true);
            setForm({ name: '', email: '', phone: '', message: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    return (
        <section style={{ padding: '60px 0 80px' }}>
            {hero?.title && (
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '12px', color: 'var(--color-text)' }}>{hero.title}</h2>
                    {hero.description && <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '500px', margin: '0 auto' }}>{hero.description}</p>}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', maxWidth: '900px', margin: '0 auto' }} className="contact-grid">
                {/* Contact Info */}
                {info && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center' }}>
                        {info.email && (
                            <div>
                                <h4 style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--color-text)' }}>Email</h4>
                                <p style={{ color: '#64748b' }}>{info.email}</p>
                            </div>
                        )}
                        {info.phone && (
                            <div>
                                <h4 style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--color-text)' }}>Phone</h4>
                                <p style={{ color: '#64748b' }}>{info.phone}</p>
                            </div>
                        )}
                        {info.address && (
                            <div>
                                <h4 style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--color-text)' }}>Address</h4>
                                <p style={{ color: '#64748b' }}>{info.address}</p>
                            </div>
                        )}
                        {info.location && (
                            <div>
                                <h4 style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--color-text)' }}>Location</h4>
                                <p style={{ color: '#64748b' }}>{info.location}</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Contact Form */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    {sent ? (
                        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f0fdf4', borderRadius: '16px' }}>
                            <CheckCircle size={48} color="#22c55e" style={{ marginBottom: '16px' }} />
                            <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>Message Sent!</h3>
                            <p style={{ color: '#64748b' }}>We'll get back to you soon.</p>
                            <button onClick={() => setSent(false)} style={{ marginTop: '16px', padding: '10px 24px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'transparent' }}>Send Another</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input type="text" placeholder="Your Name" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
                            <input type="email" placeholder="Email Address" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={inputStyle} />
                            <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} style={inputStyle} />
                            <textarea placeholder="Your Message" required rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
                            {error && <p style={{ color: '#ef4444', fontSize: '14px' }}>{error}</p>}
                            <button type="submit" disabled={sending} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                padding: '14px', backgroundColor: 'var(--color-primary)', color: '#fff',
                                border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '15px',
                                cursor: 'pointer', opacity: sending ? 0.7 : 1
                            }}>
                                <Send size={16} />
                                {sending ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .contact-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </section>
    );
};

const inputStyle = {
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box'
};

export default ContactSection;
