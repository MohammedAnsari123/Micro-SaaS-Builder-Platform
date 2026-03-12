import React, { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import { motion } from 'framer-motion';
import { UserPlus, CheckCircle } from 'lucide-react';
import axios from 'axios';
import HeroSection from '../sections/HeroSection';

const RegisterEventPage = () => {
    const { tenantId, cloneId, template } = useContent();
    const [events, setEvents] = useState([]);
    const [form, setForm] = useState({ eventId: '', name: '', email: '', phone: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetch = async () => {
            if (!tenantId || !cloneId || tenantId === 'undefined' || cloneId === 'undefined') return;
            try {
                const url = tenantId === 'preview'
                    ? `http://localhost:5000/api/v1/events/public/preview?template=${template.slug}`
                    : `http://localhost:5000/api/v1/events/public/${tenantId}/${cloneId}`;
                const res = await axios.get(url);
                if (res.data.success) setEvents(res.data.data);
            } catch (err) {
                console.error('Failed to fetch events:', err);
            }
        };
        fetch();
    }, [tenantId, cloneId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await axios.post(`http://localhost:5000/api/v1/registrations/${tenantId}/${cloneId}`, form);
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <CheckCircle size={64} color="#22c55e" style={{ marginBottom: '24px' }} />
                <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>Registered!</h2>
                <p style={{ color: '#64748b' }}>You're all set. We'll send you event details via email.</p>
                <button onClick={() => { setSubmitted(false); setForm({ eventId: '', name: '', email: '', phone: '' }); }}
                    style={{ marginTop: '24px', padding: '12px 32px', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', backgroundColor: 'transparent', fontWeight: 600 }}>Register for Another</button>
            </div>
        );
    }

    return (
        <div>
            <HeroSection pageSlug="register" />

            <div style={{ maxWidth: '500px', margin: '0 auto', padding: '0 0 80px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <select required value={form.eventId} onChange={e => setForm(p => ({ ...p, eventId: e.target.value }))} style={inputStyle}>
                        <option value="">Select an Event</option>
                        {events.map(event => (
                            <option key={event._id} value={event._id} disabled={event.registeredCount >= event.capacity}>
                                {event.title} — {new Date(event.date).toLocaleDateString()} {event.registeredCount >= event.capacity ? '(Full)' : `(${event.capacity - event.registeredCount} spots left)`}
                            </option>
                        ))}
                    </select>

                    <input type="text" placeholder="Your Name" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
                    <input type="email" placeholder="Email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={inputStyle} />
                    <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} style={inputStyle} />

                    {error && <p style={{ color: '#ef4444', fontSize: '13px' }}>{error}</p>}

                    <button type="submit" disabled={submitting} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        padding: '14px', backgroundColor: 'var(--color-primary)', color: '#fff',
                        border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer'
                    }}>
                        <UserPlus size={16} /> {submitting ? 'Registering...' : 'Register Now'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const inputStyle = { padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', outline: 'none', width: '100%', boxSizing: 'border-box' };

export default RegisterEventPage;
