import React, { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import { motion } from 'framer-motion';
import { Clock, DollarSign } from 'lucide-react';
import axios from 'axios';
import HeroSection from '../sections/HeroSection';

const ServiceListPage = () => {
    const { tenantId, cloneId, template } = useContent();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const fetch = async () => {
            if (!tenantId || !cloneId || tenantId === 'undefined' || cloneId === 'undefined') return;
            try {
                const url = tenantId === 'preview'
                    ? `http://localhost:5000/api/v1/services/public/preview?template=${template.slug}`
                    : `http://localhost:5000/api/v1/services/public/${tenantId}/${cloneId}`;
                const res = await axios.get(url);
                if (res.data.success) setServices(res.data.data);
            } catch (err) {
                console.error('Failed to fetch services:', err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [tenantId, cloneId]);

    const categories = ['All', ...new Set(services.map(s => s.category))];
    const filtered = activeCategory === 'All' ? services : services.filter(s => s.category === activeCategory);

    return (
        <div>
            <HeroSection pageSlug="services" />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '32px' }}>
                {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                        style={{
                            padding: '8px 20px', borderRadius: '999px', border: 'none', cursor: 'pointer',
                            backgroundColor: activeCategory === cat ? 'var(--color-primary)' : '#f1f5f9',
                            color: activeCategory === cat ? '#fff' : '#64748b', fontWeight: 500, fontSize: '14px'
                        }}>
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading services...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', paddingBottom: '60px' }}>
                    {filtered.map((service, i) => (
                        <motion.div key={service._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            style={{ padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
                            <span style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 500 }}>{service.category}</span>
                            <h3 style={{ fontWeight: 700, margin: '6px 0 8px', fontSize: '18px' }}>{service.name}</h3>
                            {service.description && <p style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>{service.description}</p>}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '13px' }}>
                                    <Clock size={14} /> {service.duration}
                                </span>
                                <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '18px' }}>${service.price}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServiceListPage;
