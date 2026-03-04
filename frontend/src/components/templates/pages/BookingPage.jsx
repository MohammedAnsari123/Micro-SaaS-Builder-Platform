import React, { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle } from 'lucide-react';
import axios from 'axios';
import HeroSection from '../sections/HeroSection';

const BookingPage = () => {
    const { tenantId, cloneId, template } = useContent();
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    const [form, setForm] = useState({ customerName: '', customerEmail: '', customerPhone: '', item: '', itemId: '', bookingDate: '', timeSlot: '', notes: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                if (template.modules?.includes('service')) {
                    const url = tenantId === 'preview'
                        ? `http://localhost:5000/api/v1/services/public/preview?template=${template.slug}`
                        : `http://localhost:5000/api/v1/services/public/${tenantId}/${cloneId}`;
                    const res = await axios.get(url);
                    if (res.data.success) setServices(res.data.data);
                }
                if (template.modules?.includes('product')) {
                    const url = tenantId === 'preview'
                        ? `http://localhost:5000/api/v1/products/public/preview?template=${template.slug}`
                        : `http://localhost:5000/api/v1/products/public/${tenantId}/${cloneId}`;
                    const res = await axios.get(url);
                    if (res.data.success) setProducts(res.data.data);
                }
            } catch (err) {
                console.error('Failed to fetch items:', err);
            }
        };
        fetchItems();
    }, [tenantId]);

    const bookableItems = services.length > 0 ? services : products;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await axios.post(`http://localhost:5000/api/v1/bookings/${tenantId}/${cloneId}`, form);
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create booking');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <CheckCircle size={64} color="#22c55e" style={{ marginBottom: '24px' }} />
                <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>Booking Confirmed!</h2>
                <p style={{ color: '#64748b' }}>We'll send you a confirmation email shortly.</p>
                <button onClick={() => { setSubmitted(false); setForm({ customerName: '', customerEmail: '', customerPhone: '', item: '', itemId: '', bookingDate: '', timeSlot: '', notes: '' }); }}
                    style={{ marginTop: '24px', padding: '12px 32px', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', backgroundColor: 'transparent', fontWeight: 600 }}>Make Another Booking</button>
            </div>
        );
    }

    const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

    return (
        <div>
            <HeroSection pageSlug={template.pages?.find(p => ['booking', 'book'].includes(p.slug))?.slug || 'booking'} />

            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 0 80px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input type="text" placeholder="Your Name" required value={form.customerName} onChange={e => setForm(p => ({ ...p, customerName: e.target.value }))} style={inputStyle} />
                    <input type="email" placeholder="Email" required value={form.customerEmail} onChange={e => setForm(p => ({ ...p, customerEmail: e.target.value }))} style={inputStyle} />
                    <input type="tel" placeholder="Phone" value={form.customerPhone} onChange={e => setForm(p => ({ ...p, customerPhone: e.target.value }))} style={inputStyle} />

                    {bookableItems.length > 0 && (
                        <select required value={form.item} onChange={e => {
                            const selected = bookableItems.find(i => i.name === e.target.value);
                            setForm(p => ({ ...p, item: e.target.value, itemId: selected?._id || '' }));
                        }} style={inputStyle}>
                            <option value="">Select {services.length > 0 ? 'Service' : 'Vehicle'}</option>
                            {bookableItems.map(item => (
                                <option key={item._id} value={item.name}>{item.name} — ${item.price}{services.length > 0 ? ` (${item.duration})` : '/day'}</option>
                            ))}
                        </select>
                    )}

                    <input type="date" required value={form.bookingDate} onChange={e => setForm(p => ({ ...p, bookingDate: e.target.value }))} style={inputStyle} min={new Date().toISOString().split('T')[0]} />

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {timeSlots.map(slot => (
                            <button type="button" key={slot} onClick={() => setForm(p => ({ ...p, timeSlot: slot }))}
                                style={{
                                    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                                    border: form.timeSlot === slot ? '2px solid var(--color-primary)' : '1px solid #e2e8f0',
                                    backgroundColor: form.timeSlot === slot ? 'var(--color-primary)10' : '#fff',
                                    color: form.timeSlot === slot ? 'var(--color-primary)' : '#64748b',
                                    fontWeight: 500, fontSize: '13px'
                                }}>
                                {slot}
                            </button>
                        ))}
                    </div>

                    <textarea placeholder="Additional notes (optional)" rows={3} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />

                    {error && <p style={{ color: '#ef4444', fontSize: '13px' }}>{error}</p>}

                    <button type="submit" disabled={submitting} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        padding: '14px', backgroundColor: 'var(--color-primary)', color: '#fff',
                        border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer'
                    }}>
                        <Calendar size={16} /> {submitting ? 'Booking...' : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const inputStyle = { padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', outline: 'none', width: '100%', boxSizing: 'border-box' };

export default BookingPage;
