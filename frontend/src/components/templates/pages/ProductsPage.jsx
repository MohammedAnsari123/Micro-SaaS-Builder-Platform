import React, { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import axios from 'axios';
import HeroSection from '../sections/HeroSection';

const ProductsPage = ({ addToCart }) => {
    const { tenantId, cloneId, template } = useContent();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const fetch = async () => {
            if (!tenantId || !cloneId || tenantId === 'undefined' || cloneId === 'undefined') return;
            try {
                const url = tenantId === 'preview'
                    ? `http://localhost:5000/api/v1/products/public/preview?template=${template.slug}`
                    : `http://localhost:5000/api/v1/products/public/${tenantId}/${cloneId}`;
                const res = await axios.get(url);
                if (res.data.success) setProducts(res.data.data);
            } catch (err) {
                console.error('Failed to fetch products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [tenantId, cloneId]);

    const categories = ['All', ...new Set(products.map(p => p.category))];
    const filtered = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);

    return (
        <div>
            <HeroSection pageSlug="products" />

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
                <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px', paddingBottom: '60px' }}>
                    {filtered.map((product, i) => (
                        <motion.div key={product._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                            style={{ borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#fff', overflow: 'hidden' }}>
                            <div style={{ height: '160px', backgroundColor: 'var(--color-primary)08', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShoppingCart size={40} color="var(--color-primary)" style={{ opacity: 0.2 }} />
                            </div>
                            <div style={{ padding: '20px' }}>
                                <span style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 500 }}>{product.category}</span>
                                <h3 style={{ fontWeight: 700, margin: '6px 0 8px' }}>{product.name}</h3>
                                {product.description && <p style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>{product.description}</p>}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 800, fontSize: '20px', color: 'var(--color-primary)' }}>${product.price}</span>
                                    {addToCart && product.isAvailable && (
                                        <button onClick={() => addToCart(product)} style={{
                                            padding: '8px 16px', borderRadius: '8px', border: 'none',
                                            backgroundColor: 'var(--color-primary)', color: '#fff',
                                            fontWeight: 600, fontSize: '13px', cursor: 'pointer'
                                        }}>Add to Cart</button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
