import React, { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, CheckCircle } from 'lucide-react';
import axios from 'axios';

const CartPage = ({ items = [], updateQty, removeItem, clearCart }) => {
    const { tenantId, cloneId } = useContent();
    const [form, setForm] = useState({ customerName: '', customerEmail: '', customerPhone: '', notes: '' });
    const [placing, setPlacing] = useState(false);
    const [placed, setPlaced] = useState(false);
    const [error, setError] = useState('');

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleOrder = async (e) => {
        e.preventDefault();
        if (items.length === 0) return;
        setPlacing(true);
        setError('');

        try {
            const orderItems = items.map(item => ({
                productId: item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }));

            await axios.post(`http://localhost:5000/api/v1/orders/${tenantId}/${cloneId}`, {
                ...form,
                items: orderItems
            });

            setPlaced(true);
            clearCart();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setPlacing(false);
        }
    };

    if (placed) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <CheckCircle size={64} color="#22c55e" style={{ marginBottom: '24px' }} />
                <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>Order Placed!</h2>
                <p style={{ color: '#64748b', fontSize: '16px' }}>Thank you for your order. We'll get it ready for you.</p>
                <button onClick={() => setPlaced(false)} style={{ marginTop: '24px', padding: '12px 32px', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', backgroundColor: 'transparent', fontWeight: 600 }}>Continue Shopping</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px 0 80px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '32px' }}>
                <ShoppingBag size={28} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
                Your Cart ({items.length})
            </h2>

            {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                    <ShoppingBag size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                    <p>Your cart is empty</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }} className="cart-grid">
                    {/* Cart Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {items.map(item => (
                            <motion.div key={item._id} layout style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontWeight: 600, marginBottom: '4px' }}>{item.name}</h4>
                                    <p style={{ color: 'var(--color-primary)', fontWeight: 700 }}>${item.price}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button onClick={() => updateQty(item._id, item.quantity - 1)} style={qtyBtnStyle}><Minus size={14} /></button>
                                    <span style={{ fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                                    <button onClick={() => updateQty(item._id, item.quantity + 1)} style={qtyBtnStyle}><Plus size={14} /></button>
                                </div>
                                <p style={{ fontWeight: 700, minWidth: '70px', textAlign: 'right' }}>${(item.price * item.quantity).toFixed(2)}</p>
                                <button onClick={() => removeItem(item._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '8px' }}>
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Form */}
                    <div style={{ padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#fff', height: 'fit-content', position: 'sticky', top: '80px' }}>
                        <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>Order Summary</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9', marginBottom: '16px' }}>
                            <span style={{ fontWeight: 600 }}>Total</span>
                            <span style={{ fontWeight: 800, fontSize: '20px', color: 'var(--color-primary)' }}>${total.toFixed(2)}</span>
                        </div>
                        <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input type="text" placeholder="Your Name" required value={form.customerName} onChange={e => setForm(p => ({ ...p, customerName: e.target.value }))} style={inputStyle} />
                            <input type="email" placeholder="Email" required value={form.customerEmail} onChange={e => setForm(p => ({ ...p, customerEmail: e.target.value }))} style={inputStyle} />
                            <input type="tel" placeholder="Phone (optional)" value={form.customerPhone} onChange={e => setForm(p => ({ ...p, customerPhone: e.target.value }))} style={inputStyle} />
                            <textarea placeholder="Order notes (optional)" rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
                            {error && <p style={{ color: '#ef4444', fontSize: '13px' }}>{error}</p>}
                            <button type="submit" disabled={placing} style={{ padding: '14px', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', opacity: placing ? 0.7 : 1 }}>
                                {placing ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style>{`@media (max-width: 768px) { .cart-grid { grid-template-columns: 1fr !important; } }`}</style>
        </div>
    );
};

const qtyBtnStyle = { width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const inputStyle = { padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' };

export default CartPage;
