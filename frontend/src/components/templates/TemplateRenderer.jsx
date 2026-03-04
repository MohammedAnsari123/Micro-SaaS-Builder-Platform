import React, { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

// Shared Sections
import HeroSection from './sections/HeroSection';
import ContactSection from './sections/ContactSection';
import FooterSection from './sections/FooterSection';

// Page components for different content types
import GenericPage from './pages/GenericPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import ProductsPage from './pages/ProductsPage';
import BookingPage from './pages/BookingPage';
import ServiceListPage from './pages/ServiceListPage';
import EventsPage from './pages/EventsPage';
import RegisterEventPage from './pages/RegisterEventPage';

const TemplateRenderer = () => {
    const { template, theme, siteSettings, tenantId } = useContent();
    const [activePage, setActivePage] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    const pages = template?.pages || [];

    useEffect(() => {
        if (pages.length > 0 && !activePage) {
            setActivePage(pages[0].slug);
        }
    }, [pages, activePage]);

    const addToCart = (product, qty = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                return prev.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + qty } : item
                );
            }
            return [...prev, { ...product, quantity: qty }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item._id !== productId));
    };

    const updateCartQty = (productId, qty) => {
        if (qty <= 0) return removeFromCart(productId);
        setCartItems(prev =>
            prev.map(item => item._id === productId ? { ...item, quantity: qty } : item)
        );
    };

    const clearCart = () => setCartItems([]);

    const getIcon = (iconName) => {
        const Icon = LucideIcons[iconName];
        return Icon || LucideIcons.Circle;
    };

    // Determine which component to render for each page
    const renderPage = (pageSlug) => {
        const pageConfig = pages.find(p => p.slug === pageSlug);
        if (!pageConfig) return null;

        // Special functional pages
        switch (pageSlug) {
            case 'menu':
                return <MenuPage addToCart={addToCart} />;
            case 'cart':
                return <CartPage items={cartItems} updateQty={updateCartQty} removeItem={removeFromCart} clearCart={clearCart} />;
            case 'products':
            case 'cars':
                return <ProductsPage addToCart={template.modules?.includes('order') ? addToCart : null} />;
            case 'booking':
            case 'book':
                return <BookingPage />;
            case 'services':
                if (template.type === 'functional') {
                    return <ServiceListPage />;
                }
                return <GenericPage pageSlug={pageSlug} />;
            case 'events':
                return <EventsPage />;
            case 'register':
                return <RegisterEventPage />;
            case 'contact':
                return <ContactSection />;
            default:
                return <GenericPage pageSlug={pageSlug} />;
        }
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="template-site" style={{ minHeight: '100vh' }}>
            {/* Navigation Bar */}
            <nav style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                backdropFilter: 'blur(12px)',
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderBottom: '1px solid #e2e8f0',
                padding: '0 24px'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
                    {/* Logo / Site Name */}
                    <button
                        onClick={() => setActivePage(pages[0]?.slug)}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                            fontWeight: 800, fontSize: '20px', color: 'var(--color-primary, #3b82f6)'
                        }}
                    >
                        {siteSettings?.siteName || template?.name || 'My Site'}
                    </button>

                    {/* Desktop Nav */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
                        {pages.map(page => {
                            const Icon = getIcon(page.icon);
                            const isActive = activePage === page.slug;
                            return (
                                <button
                                    key={page.slug}
                                    onClick={() => { setActivePage(page.slug); setMobileMenuOpen(false); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '8px 16px', borderRadius: '8px',
                                        border: 'none', cursor: 'pointer',
                                        fontSize: '14px', fontWeight: isActive ? 600 : 400,
                                        color: isActive ? 'var(--color-primary)' : '#64748b',
                                        backgroundColor: isActive ? 'var(--color-primary)11' : 'transparent',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Icon size={16} />
                                    {page.name}
                                    {page.slug === 'cart' && cartCount > 0 && (
                                        <span style={{
                                            backgroundColor: 'var(--color-primary)',
                                            color: '#fff',
                                            borderRadius: '999px',
                                            padding: '1px 7px',
                                            fontSize: '11px',
                                            fontWeight: 700
                                        }}>{cartCount}</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="mobile-nav-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{
                            display: 'none', background: 'none', border: 'none', cursor: 'pointer',
                            padding: '8px', color: '#334155'
                        }}
                    >
                        {mobileMenuOpen ? <LucideIcons.X size={24} /> : <LucideIcons.Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="mobile-nav-menu" style={{
                        padding: '8px 0 16px',
                        borderTop: '1px solid #e2e8f0'
                    }}>
                        {pages.map(page => {
                            const Icon = getIcon(page.icon);
                            return (
                                <button
                                    key={page.slug}
                                    onClick={() => { setActivePage(page.slug); setMobileMenuOpen(false); }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                                        padding: '12px 16px', border: 'none', cursor: 'pointer',
                                        backgroundColor: activePage === page.slug ? 'var(--color-primary)11' : 'transparent',
                                        color: activePage === page.slug ? 'var(--color-primary)' : '#334155',
                                        fontWeight: activePage === page.slug ? 600 : 400,
                                        fontSize: '15px', textAlign: 'left', borderRadius: '8px'
                                    }}
                                >
                                    <Icon size={18} />
                                    {page.name}
                                </button>
                            );
                        })}
                    </div>
                )}
            </nav>

            {/* Page Content */}
            <motion.main
                key={activePage}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}
            >
                {renderPage(activePage)}
            </motion.main>

            {/* Footer */}
            <FooterSection />

            {/* Responsive CSS */}
            <style>{`
                @media (max-width: 768px) {
                    .desktop-nav { display: none !important; }
                    .mobile-nav-toggle { display: block !important; }
                }
                @media (min-width: 769px) {
                    .mobile-nav-menu { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default TemplateRenderer;
