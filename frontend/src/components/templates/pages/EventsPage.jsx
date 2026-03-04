import React, { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import axios from 'axios';
import HeroSection from '../sections/HeroSection';

const EventsPage = () => {
    const { tenantId, cloneId, template } = useContent();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const url = tenantId === 'preview'
                    ? `http://localhost:5000/api/v1/events/public/preview?template=${template.slug}`
                    : `http://localhost:5000/api/v1/events/public/${tenantId}/${cloneId}`;
                const res = await axios.get(url);
                if (res.data.success) setEvents(res.data.data);
            } catch (err) {
                console.error('Failed to fetch events:', err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [tenantId]);

    const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div>
            <HeroSection pageSlug="events" />

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading events...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px' }}>
                    {events.map((event, i) => (
                        <motion.div key={event._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                            style={{ display: 'flex', gap: '24px', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}
                            className="event-card">
                            {/* Date Badge */}
                            <div style={{ minWidth: '80px', textAlign: 'center', padding: '16px', borderRadius: '12px', backgroundColor: 'var(--color-primary)10' }}>
                                <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>{new Date(event.date).getDate()}</p>
                                <p style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 500, textTransform: 'uppercase' }}>{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                            </div>

                            <div style={{ flex: 1 }}>
                                {event.category && <span style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 500 }}>{event.category}</span>}
                                <h3 style={{ fontWeight: 700, fontSize: '18px', margin: '4px 0 8px' }}>{event.title}</h3>
                                {event.description && <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.5, marginBottom: '12px' }}>{event.description}</p>}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: '#94a3b8' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {formatDate(event.date)}</span>
                                    {event.venue && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {event.venue}</span>}
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> {event.registeredCount}/{event.capacity} registered</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventsPage;
