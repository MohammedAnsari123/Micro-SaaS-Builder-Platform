import React, { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import HeroSection from '../sections/HeroSection';

const MenuPage = ({ addToCart }) => {
    const { tenantId, cloneId, template } = useContent();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const fetchProducts = async () => {
            if (!tenantId || !cloneId || tenantId === 'undefined' || cloneId === 'undefined') return;
            try {
                const url = tenantId === 'preview'
                    ? `http://localhost:5000/api/v1/products/public/preview?template=${template.slug}`
                    : `http://localhost:5000/api/v1/products/public/${tenantId}/${cloneId}`;
                const res = await axios.get(url);
                if (res.data.success) setProducts(res.data.data);
            } catch (err) {
                console.error('Failed to fetch menu:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [tenantId, cloneId]);

    const categories = ['All', ...new Set(products.map(p => p.category))];
    const filtered = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);

    return (
        <div>
            <HeroSection pageSlug="menu" />

            {/* Category Filter */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '32px' }}>
                {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                        style={{
                            padding: '8px 20px', borderRadius: '999px', border: 'none', cursor: 'pointer',
                            backgroundColor: activeCategory === cat ? 'var(--color-primary)' : '#f1f5f9',
                            color: activeCategory === cat ? '#fff' : '#64748b',
                            fontWeight: 500, fontSize: '14px', transition: 'all 0.2s'
                        }}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* Products Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading menu...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px', paddingBottom: '60px' }}>
                    {filtered.map((product, i) => (
                        <motion.div key={product._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            style={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', backgroundColor: '#fff' }}>
                            <div style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <h3 style={{ fontWeight: 700, fontSize: '16px', flex: 1 }}>{product.name}</h3>
                                    <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '18px', whiteSpace: 'nowrap', marginLeft: '12px' }}>${product.price}</span>
                                </div>
                                {product.description && <p style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>{product.description}</p>}
                                {!product.isAvailable ? (
                                    <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: 500 }}>Not Available</span>
                                ) : addToCart ? (
                                    <button onClick={() => addToCart(product)} style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '10px 20px', borderRadius: '10px', border: 'none',
                                        backgroundColor: 'var(--color-primary)', color: '#fff',
                                        fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s'
                                    }}>
                                        <ShoppingCart size={14} /> Add to Cart
                                    </button>
                                ) : null}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuPage;
