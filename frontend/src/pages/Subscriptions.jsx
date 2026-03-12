import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check, ShieldCheck, Zap, ArrowRight, Wallet } from 'lucide-react';

import '../styles/billing.css';
import '../styles/pages.css';

const PlanCard = ({ name, price, features, recommended, current }) => (
    <div className={`pricing-card ${recommended ? 'recommended' : ''}`}>
        {recommended && (
            <div className="pricing-best-value">
                BEST VALUE
            </div>
        )}
        <h3 className="pricing-name">{name}</h3>
        <div className="pricing-price-container">
            <span className="pricing-amount">${price}</span>
            <span className="pricing-period">/mo</span>
        </div>
        <ul className="pricing-features">
            {features.map((f, i) => (
                <li key={i} className="pricing-feature">
                    <div className="pricing-icon">
                        <Check style={{ width: '12px', height: '12px' }} />
                    </div>
                    {f}
                </li>
            ))}
        </ul>
        <button
            disabled={current}
            className={`btn-pricing ${current ? 'current' : 'upgrade'}`}
        >
            {current ? 'Currently Active' : 'Upgrade Now'} {!current && <ArrowRight style={{ width: '16px', height: '16px' }} />}
        </button>
    </div>
);

const Subscriptions = () => {
    return (
        <div className="page-container">
            <div className="billing-hero">
                <div className="billing-glow" />
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <div className="billing-badge">
                        <Zap style={{ width: '12px', height: '12px' }} /> Free Tier Active
                    </div>
                    <h2 className="page-title" style={{ fontSize: '2.25rem', marginBottom: '16px' }}>
                        Infrastructure <br /><span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Subscription Control</span>
                    </h2>
                    <p className="page-subtitle" style={{ maxWidth: '400px', lineHeight: '1.6' }}>
                        Scaling your SaaS portfolio is easy. Upgrade to remove usage limits and unlock premium infrastructure features.
                    </p>
                </div>
                <div className="billing-current">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'rgba(0, 212, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
                            <Wallet style={{ width: '24px', height: '24px', color: 'var(--color-secondary)' }} />
                        </div>
                        <div>
                            <div className="metric-label" style={{ marginBottom: 0 }}>Billing Cycle</div>
                            <div style={{ color: 'white', fontWeight: 800 }}>Monthly Pre-pay</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 500 }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>Next Payment</span>
                            <span style={{ color: 'white' }}>N/A (Free)</span>
                        </div>
                        <div style={{ height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', backgroundColor: 'var(--color-secondary)', width: '10%' }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pricing-grid">
                <PlanCard
                    name="Starter"
                    price="0"
                    current={true}
                    features={['3 SaaS App Slots', '50 MB Data Storage', 'Community Support', 'Standard Build Engine']}
                />
                <PlanCard
                    name="Pro Scaler"
                    price="29"
                    recommended={true}
                    features={['Unlimited App Slots', '5 GB Managed Storage', 'Priority Build Queue', 'White-label Branding', 'Advanced Analytics']}
                />
                <PlanCard
                    name="Enterprise"
                    price="199"
                    features={['Multi-tenant Reseller', '100 GB Storage', 'Dedicated Clusters', 'Custom Architecture Review', '24/7 Human Support']}
                />
            </div>

            <div className="billing-secure">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <ShieldCheck style={{ width: '40px', height: '40px', color: 'var(--color-secondary)' }} />
                    <div>
                        <h4 style={{ color: 'white', fontWeight: 800, margin: 0 }}>Secure Billing</h4>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', margin: '4px 0 0 0' }}>All payments are encrypted and processed via Stripe Secure.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" style={{ height: '24px', opacity: 0.8, filter: 'grayscale(100%)', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.filter = 'grayscale(0%)' }} onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.8; e.currentTarget.style.filter = 'grayscale(100%)' }} />
                </div>
            </div>
        </div>
    );
};

export default Subscriptions;
