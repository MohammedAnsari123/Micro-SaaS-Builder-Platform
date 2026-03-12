import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Database, Lock, CreditCard, BarChart3, Rocket,
    Globe, Check, Star, Minus, Plus, ChevronLeft, ChevronRight
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

import '../styles/landing.css';

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.16, 1, 0.3, 1]; // cubic-bezier fast-in smooth-out

/* ═══════════════════════════════════════════════════════
   ANIMATION PRIMITIVES
   ═══════════════════════════════════════════════════════ */

/* ── Word-by-Word Reveal ── */
const WordReveal = ({ children, className = '', delay = 0 }) => {
    const ref = useRef(null);
    useEffect(() => {
        if (!ref.current) return;
        const words = ref.current.querySelectorAll('.wr-word');
        const anim = gsap.fromTo(words,
            { opacity: 0, y: 20 },
            {
                opacity: 1, y: 0, duration: 0.5, stagger: 0.08,
                delay, ease: 'power3.out',
                scrollTrigger: { trigger: ref.current, start: 'top 85%', toggleActions: 'play none none none' }
            }
        );
        return () => { anim.scrollTrigger?.kill(); anim.kill(); };
    }, [delay]);

    const text = typeof children === 'string' ? children : '';
    return (
        <span ref={ref} className={className}>
            {text.split(' ').map((word, i) => (
                <span key={i} className="wr-word" style={{ display: 'inline-block', marginRight: '0.3em' }}>{word}</span>
            ))}
        </span>
    );
};

/* ── Icon Micro-Animations ── */
const PulseIcon = ({ icon: Icon, color, className = '' }) => (
    <div className={`relative ${className}`} style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '16px', animation: 'auroraPulse 2s infinite', opacity: 0.2, backgroundColor: color }} />
        <Icon style={{ width: '28px', height: '28px', position: 'relative', zIndex: 10, color }} />
    </div>
);

const FloatIcon = ({ icon: Icon, color, className = '' }) => (
    <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className={className}>
        <Icon style={{ width: '28px', height: '28px', color }} />
    </motion.div>
);

const SpinIcon = ({ icon: Icon, color, className = '' }) => (
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} className={className}>
        <Icon style={{ width: '28px', height: '28px', color }} />
    </motion.div>
);

const ICON_ANIMATIONS = [PulseIcon, FloatIcon, SpinIcon, PulseIcon, FloatIcon, SpinIcon];

/* ═══════════════════════════════════════════════════════
   SECTION 2 — FEATURES
   ═══════════════════════════════════════════════════════ */
const FEATURES = [
    { icon: Database, title: 'MongoDB Integration', desc: 'Production-ready database layer with automatic schema generation and relationship mapping.', color: '#10B981' },
    { icon: Lock, title: 'Authentication', desc: 'JWT and OAuth-based auth system with role management and secure session handling.', color: '#8B5CF6' },
    { icon: CreditCard, title: 'Stripe Payments', desc: 'Integrated payment processing with subscription management and invoicing.', color: '#3B82F6' },
    { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Real-time usage metrics, revenue tracking, and user behavior analytics.', color: '#F59E0B' },
    { icon: Rocket, title: 'One-Click Deploy', desc: 'CI/CD deployment pipeline with automatic scaling and zero-downtime updates.', color: '#EF4444' },
    { icon: Globe, title: 'Custom Domains', desc: 'White-label your SaaS with custom domains and SSL certificates out of the box.', color: '#4CC9F0' },
];

const FeatureCard = ({ icon: Icon, title, desc, color, index }) => {
    const ref = useRef(null);
    const AnimIcon = ICON_ANIMATIONS[index % ICON_ANIMATIONS.length];

    useEffect(() => {
        if (!ref.current) return;
        const anim = gsap.fromTo(ref.current,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0, duration: 0.7, delay: index * 0.1,
                ease: 'power3.out',
                scrollTrigger: { trigger: ref.current, start: 'top 88%', toggleActions: 'play none none none' }
            }
        );
        return () => { anim.scrollTrigger?.kill(); anim.kill(); };
    }, [index]);

    return (
        <div ref={ref} className="feature-card group" style={{ opacity: 0 }}>
            <div className="feature-glow" style={{ backgroundColor: color }} />
            <div className="feature-icon-wrapper" style={{ backgroundColor: `${color}15`, borderColor: `${color}30` }}>
                <AnimIcon icon={Icon} color={color} />
            </div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-desc">{desc}</p>
        </div>
    );
};

const FeaturesSection = () => (
    <section id="features" className="landing-section">
        <div className="landing-container">
            <div className="section-header">
                <h2 className="section-title">
                    <WordReveal>Everything You Need to Ship</WordReveal>
                </h2>
                <p className="section-subtitle">Each tool you saw attach in the animation is a real capability.</p>
            </div>
            <div className="features-grid">
                {FEATURES.map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
            </div>
        </div>
    </section>
);

/* ═══════════════════════════════════════════════════════
   SECTION 3 — HOW IT WORKS (Self-Drawing Timeline)
   ═══════════════════════════════════════════════════════ */
const STEPS = [
    { step: '1', title: 'Start', desc: 'Describe your SaaS concept. Define your data models, features, and integrations.' },
    { step: '2', title: 'Build', desc: 'Our engine compiles your blueprint into a working backend with APIs, auth, and database.' },
    { step: '3', title: 'Launch', desc: 'Deploy your SaaS product with one click. Start onboarding users immediately.' },
];

const HowItWorksSection = () => {
    const sectionRef = useRef(null);
    const lineRef = useRef(null);
    const nodeRefs = useRef([]);
    const textRefs = useRef([]);

    useEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            // Draw the timeline line
            if (lineRef.current) {
                gsap.fromTo(lineRef.current, { scaleY: 0 }, {
                    scaleY: 1, ease: 'none',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', end: 'bottom 70%', scrub: 1 }
                });
            }
            // Pop nodes and slide text
            nodeRefs.current.forEach((node, i) => {
                if (node) {
                    gsap.fromTo(node, { scale: 0, opacity: 0 }, {
                        scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)',
                        scrollTrigger: { trigger: node, start: 'top 80%', toggleActions: 'play none none none' }
                    });
                }
            });
            textRefs.current.forEach((txt, i) => {
                if (txt) {
                    gsap.fromTo(txt, { x: 30, opacity: 0 }, {
                        x: 0, opacity: 1, duration: 0.7, delay: 0.15,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: txt, start: 'top 82%', toggleActions: 'play none none none' }
                    });
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="how-it-works" ref={sectionRef} className="landing-section">
            <div className="landing-container" style={{ maxWidth: '800px' }}>
                <div className="section-header">
                    <h2 className="section-title">
                        <WordReveal>How It Works</WordReveal>
                    </h2>
                    <p className="section-subtitle">Three steps. Zero boilerplate.</p>
                </div>

                <div className="timeline-line-container">
                    {/* Self-drawing line */}
                    <div className="timeline-line">
                        <div ref={lineRef} className="timeline-progress" style={{ transform: 'scaleY(0)' }} />
                    </div>

                    <div>
                        {STEPS.map((s, i) => (
                            <div key={s.step} className="timeline-step">
                                {/* Node */}
                                <div
                                    ref={el => nodeRefs.current[i] = el}
                                    className="timeline-node"
                                    style={{ opacity: 0 }}
                                >
                                    <span>{s.step}</span>
                                </div>
                                {/* Text */}
                                <div ref={el => textRefs.current[i] = el} style={{ opacity: 0 }}>
                                    <h3 className="timeline-content-title">{s.title}</h3>
                                    <p className="timeline-content-desc">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ═══════════════════════════════════════════════════════
   SECTION 4 — PRICING (Flip-in + Number Roll)
   ═══════════════════════════════════════════════════════ */
const NumberRoll = ({ value }) => (
    <AnimatePresence mode="popLayout">
        <motion.span
            key={value}
            initial={{ y: 20, opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: -20, opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: EASE }}
            className="inline-block"
        >
            ${value}
        </motion.span>
    </AnimatePresence>
);

const PricingCard = ({ name, price, description, features, recommended, yearly, index }) => {
    const ref = useRef(null);
    const displayPrice = yearly ? Math.floor(price * 0.8) : price;

    useEffect(() => {
        if (!ref.current) return;
        const anim = gsap.fromTo(ref.current,
            { rotateY: 90, opacity: 0 },
            {
                rotateY: 0, opacity: 1, duration: 0.8, delay: index * 0.15,
                ease: 'power3.out',
                scrollTrigger: { trigger: ref.current, start: 'top 88%', toggleActions: 'play none none none' }
            }
        );
        return () => { anim.scrollTrigger?.kill(); anim.kill(); };
    }, [index]);

    return (
        <div
            ref={ref}
            className={`pricing-card ${recommended ? 'recommended' : ''}`}
            style={{ opacity: 0 }}
        >
            {recommended && (
                <div className="pricing-badge">Popular</div>
            )}
            <h3 className="pricing-name">{name}</h3>
            <p className="pricing-desc">{description}</p>
            <div className="pricing-price-wrap">
                <span className="pricing-price">
                    <NumberRoll value={displayPrice} />
                </span>
                <span className="pricing-period">/{yearly ? 'yr' : 'mo'}</span>
            </div>
            <div className="pricing-features">
                {features.map((f, i) => (
                    <div key={i} className="pricing-feature">
                        <Check className="w-4 h-4 pricing-check shrink-0" />{f}
                    </div>
                ))}
            </div>
            <Link to="/register" className={`pricing-btn ${recommended ? 'primary' : 'outline'}`}>
                Get Started
            </Link>
        </div>
    );
};

const PricingSection = () => {
    const [yearly, setYearly] = useState(false);
    return (
        <section id="pricing" className="landing-section">
            <div className="landing-container" style={{ maxWidth: '1000px' }}>
                <div className="section-header">
                    <h2 className="section-title">
                        <WordReveal>Simple Transparent Pricing</WordReveal>
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, transition: 'color 0.2s', color: !yearly ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>Monthly</span>
                        <button onClick={() => setYearly(!yearly)} style={{ width: '56px', height: '32px', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: '9999px', padding: '4px', position: 'relative', transition: 'border-color 0.2s' }}>
                            <motion.div animate={{ x: yearly ? 24 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} style={{ width: '22px', height: '22px', backgroundColor: 'var(--color-primary)', borderRadius: '50%', boxShadow: '0 4px 10px rgba(255, 32, 121, 0.4)' }} />
                        </button>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, transition: 'color 0.2s', color: yearly ? 'var(--color-text-main)' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Yearly <span style={{ color: 'var(--color-secondary)', fontSize: '10px', backgroundColor: 'rgba(0, 212, 255, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>-20%</span>
                        </span>
                    </div>
                </div>
                <div className="pricing-grid">
                    <PricingCard name="Free" price={0} description="Test your first idea." features={['3 SaaS Projects', '50MB Storage', 'Community Support', 'Standard Deploy']} yearly={yearly} index={0} />
                    <PricingCard name="Pro" price={49} description="Scale your product." features={['Unlimited Projects', '5GB Storage', 'White-label', 'Priority Support', 'Analytics']} recommended yearly={yearly} index={1} />
                    <PricingCard name="Team" price={149} description="Build multiple products." features={['Everything in Pro', '50GB Storage', 'Team Collab', '24/7 Support', 'Custom Domains']} yearly={yearly} index={2} />
                </div>
            </div>
        </section>
    );
};

/* ═══════════════════════════════════════════════════════
   SECTION 5 — TESTIMONIALS (Carousel + Alternating Slide)
   ═══════════════════════════════════════════════════════ */
const TESTIMONIALS = [
    { name: 'Alex Chen', role: 'Indie Hacker', quote: 'I launched my SaaS MVP in 2 hours. What used to take me 2 weeks of boilerplate is now handled by the platform.' },
    { name: 'Sarah Kumar', role: 'Startup Founder', quote: 'The auto-generated APIs and auth system saved us months of development. We focused on our unique value proposition instead.' },
    { name: 'Marcus Wright', role: 'Full-Stack Developer', quote: 'Finally, a no-code platform that doesn\'t feel like no-code. The generated code is clean, maintainable, and production-ready.' },
];

const TestimonialsSection = () => {
    const [active, setActive] = useState(0);
    const timerRef = useRef(null);
    const sectionRef = useRef(null);
    const cardRefs = useRef([]);

    // Auto-cycle every 4s
    const resetTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => setActive(p => (p + 1) % TESTIMONIALS.length), 4000);
    }, []);

    useEffect(() => { resetTimer(); return () => clearInterval(timerRef.current); }, [resetTimer]);

    const goTo = (i) => { setActive(i); resetTimer(); };
    const prev = () => goTo((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    const next = () => goTo((active + 1) % TESTIMONIALS.length);

    // Alternating slide-in
    useEffect(() => {
        if (!sectionRef.current) return;
        const ctx = gsap.context(() => {
            cardRefs.current.forEach((card, i) => {
                if (card) {
                    gsap.fromTo(card,
                        { x: i % 2 === 0 ? -60 : 60, opacity: 0 },
                        {
                            x: 0, opacity: 1, duration: 0.7, delay: i * 0.15,
                            ease: 'power3.out',
                            scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' }
                        }
                    );
                }
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="landing-section">
            <div className="landing-container">
                <div className="section-header">
                    <h2 className="section-title">
                        <WordReveal>Loved by Builders</WordReveal>
                    </h2>
                </div>

                {/* Desktop: all 3 visible with alternating slide */}
                <div className="features-grid hidden md:grid" style={{ display: 'none' }}>
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} ref={el => cardRefs.current[i] = el} className="testimonial-card" style={{ opacity: 0 }}>
                            <div className="testi-stars">
                                {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400" />)}
                            </div>
                            <p className="testi-quote">"{t.quote}"</p>
                            <div className="testi-author">
                                <div className="testi-avatar shrink-0 relative">
                                    {t.name[0]}
                                    <div className="absolute inset-0 rounded-full border-2 border-[var(--color-primary)] animate-ping opacity-30" />
                                </div>
                                <div>
                                    <div className="testi-name">{t.name}</div>
                                    <div className="testi-role">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile: carousel with crossfade */}
                <div className="md:hidden relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="testimonial-card"
                        >
                            <div className="testi-stars">
                                {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400" />)}
                            </div>
                            <p className="testi-quote">"{TESTIMONIALS[active].quote}"</p>
                            <div className="testi-author">
                                <div className="testi-avatar shrink-0">
                                    {TESTIMONIALS[active].name[0]}
                                </div>
                                <div>
                                    <div className="testi-name">{TESTIMONIALS[active].name}</div>
                                    <div className="testi-role">{TESTIMONIALS[active].role}</div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                        <button onClick={prev} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                            <ChevronLeft style={{ width: '20px', height: '20px' }} />
                        </button>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {TESTIMONIALS.map((_, i) => (
                                <button key={i} onClick={() => goTo(i)} style={{ width: i === active ? '24px' : '8px', height: '8px', borderRadius: '4px', background: i === active ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)', transition: 'all 0.3s', border: 'none', cursor: 'pointer' }} />
                            ))}
                        </div>
                        <button onClick={next} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                            <ChevronRight style={{ width: '20px', height: '20px' }} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ═══════════════════════════════════════════════════════
   SECTION 6 — FAQ (Smooth Accordion)
   ═══════════════════════════════════════════════════════ */
const FAQS = [
    { q: 'Do I need to know how to code?', a: 'No! Our platform generates production-ready code from your configuration. Developers can access and customize the generated codebase at any time.' },
    { q: 'Can I export my generated code?', a: 'Yes. Pro and Team plans allow full Node.js codebase export. You own your code — no vendor lock-in.' },
    { q: 'What databases are supported?', a: 'Currently we support MongoDB with Mongoose. PostgreSQL and MySQL support are on our roadmap.' },
    { q: 'How does deployment work?', a: 'One-click deploy to our managed infrastructure. Custom domain support is included on Pro and Team plans.' },
    { q: 'Is there a free trial?', a: 'The Free plan is free forever with 3 projects. No credit card required. Upgrade anytime.' },
];

const FAQItem = ({ q, a, index }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current) return;
        const anim = gsap.fromTo(ref.current,
            { opacity: 0, y: 20 },
            {
                opacity: 1, y: 0, duration: 0.5, delay: index * 0.08,
                ease: 'power3.out',
                scrollTrigger: { trigger: ref.current, start: 'top 90%', toggleActions: 'play none none none' }
            }
        );
        return () => { anim.scrollTrigger?.kill(); anim.kill(); };
    }, [index]);

    return (
        <div ref={ref} className="faq-item" style={{ opacity: 0 }}>
            <button onClick={() => setOpen(!open)} className="faq-btn group">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ width: '4px', height: '24px', borderRadius: '9999px', transition: 'all 0.3s', backgroundColor: open ? 'var(--color-primary)' : 'transparent' }} />
                    <span className="faq-q">{q}</span>
                </span>
                <Plus className={`faq-icon ${open ? 'open' : ''}`} style={{ width: '20px', height: '20px' }} />
            </button>
            <div className="faq-a-wrapper" style={{ maxHeight: open ? '200px' : '0px', opacity: open ? 1 : 0 }}>
                <p className="faq-a">{a}</p>
            </div>
        </div>
    );
};

const FAQSection = () => (
    <section className="landing-section">
        <div className="landing-container" style={{ maxWidth: '800px' }}>
            <div className="section-header">
                <h2 className="section-title">
                    <WordReveal>Frequently Asked Questions</WordReveal>
                </h2>
            </div>
            <div>{FAQS.map((f, i) => <FAQItem key={i} {...f} index={i} />)}</div>
        </div>
    </section>
);

/* ═══════════════════════════════════════════════════════
   SECTION 7 — FINAL CTA (Animated Gradient + Word Reveal + Glow Pulse)
   ═══════════════════════════════════════════════════════ */
const FinalCTA = () => (
    <section className="cta-section">
        {/* Animated gradient background */}
        <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, var(--color-bg-base), var(--color-bg-surface), var(--color-primary), var(--color-bg-surface), var(--color-bg-base))',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 12s ease infinite',
            opacity: 0.15
        }} />
        {/* Floating particles */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {[...Array(15)].map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute', width: '4px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `floatParticle ${5 + Math.random() * 8}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 5}s`
                    }}
                />
            ))}
        </div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="cta-title">
                <WordReveal delay={0}>Ready to Build</WordReveal><br />
                <span className="cta-title-highlight">
                    <WordReveal delay={0.3}>Your Next SaaS?</WordReveal>
                </span>
            </h2>
            <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="cta-desc"
            >
                Join thousands of developers shipping faster with Micro SaaS Builder.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                viewport={{ once: true }}
            >
                <Link to="/register" className="cta-btn group relative">
                    {/* Continuous glow pulse */}
                    <span style={{ position: 'absolute', inset: 0, borderRadius: 'var(--border-radius-lg)', boxShadow: '0 0 40px rgba(255,255,255,0.3)', animation: 'auroraPulse 2s infinite', opacity: 0.5 }} />
                    <span style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        Start Building Free <ArrowRight style={{ width: '20px', height: '20px' }} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </Link>
            </motion.div>
        </div>
    </section>
);

/* ═══════════════════════════════════════════════════════
   COUNTER (Stats Bar)
   ═══════════════════════════════════════════════════════ */
const Counter = ({ value, suffix = '', label }) => {
    const ref = useRef(null);
    const [count, setCount] = useState(0);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                let start = 0;
                const step = (ts) => {
                    if (!start) start = ts;
                    const p = Math.min((ts - start) / 2000, 1);
                    setCount(Math.floor((1 - Math.pow(1 - p, 3)) * value));
                    if (p < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
                obs.disconnect();
            }
        }, { threshold: 0.5 });
        obs.observe(el);
        return () => obs.disconnect();
    }, [value]);

    return (
        <div ref={ref} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.05em', color: 'var(--color-text-main)' }}>{count}{suffix}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>{label}</div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════════ */
const HeroSection = () => (
    <section className="landing-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: '100px' }}>
        <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'var(--color-primary)', borderRadius: '50%', opacity: 0.05, filter: 'blur(100px)', top: '-20%', left: '-10%', animation: 'auroraPulse 8s infinite alternate' }} />
        <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'var(--color-secondary)', borderRadius: '50%', opacity: 0.05, filter: 'blur(100px)', bottom: '-20%', right: '-10%', animation: 'auroraPulse 6s infinite alternate-reverse' }} />
        
        <div className="landing-container" style={{ textAlign: 'center', zIndex: 10, position: 'relative' }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'var(--color-bg-elevated)', borderRadius: '9999px', border: '1px solid var(--color-border)', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)', animation: 'pulse 2s infinite' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>Micro SaaS Builder Platform</span>
                </div>
            </motion.div>

            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em', color: 'var(--color-text-main)' }}>
                <WordReveal delay={0.2}>Build Your Micro SaaS</WordReveal><br />
                <span className="cta-title-highlight">
                    <WordReveal delay={0.6}>in Minutes</WordReveal>
                </span>
            </h1>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                style={{ fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}
            >
                From idea to deployed product — in one seamless workflow. Skip the boilerplate and focus on your unique value.
            </motion.p>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}
            >
                <Link to="/register" className="cta-btn primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px', fontSize: '1.125rem' }}>
                    Start Building Free <ArrowRight style={{ width: '20px', height: '20px' }} />
                </Link>
                <a href="#features" className="cta-btn outline" style={{ padding: '16px 32px', fontSize: '1.125rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)', borderRadius: 'var(--border-radius-xl)', fontWeight: 700, textDecoration: 'none' }}>
                    Explore Features
                </a>
            </motion.div>
        </div>
    </section>
);

/* ═══════════════════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════════════════ */
const Landing = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    return (
        <div className="landing-page">
            {/* CSS Keyframes */}
            <style>{`
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes floatParticle {
                    0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
                    50% { transform: translateY(-30px) translateX(15px); opacity: 0.6; }
                }
            `}</style>
            
            {/* Aurora Background Effects (Global) */}
            <div className="aurora-bg">
                <div className="aurora-orb aurora-orb-1" />
                <div className="aurora-orb aurora-orb-2" />
                <div className="aurora-orb aurora-orb-3" />
            </div>

            {/* Section 1 — Hero */}
            <HeroSection />

            {/* Section 2 — Features */}
            <FeaturesSection />

            {/* Section 3 — How It Works */}
            <HowItWorksSection />

            {/* Section 4 — Pricing */}
            <PricingSection />

            {/* Section 5 — Testimonials */}
            <TestimonialsSection />

            {/* Section 6 — FAQ */}
            <FAQSection />

            {/* Section 7 — Final CTA */}
            <FinalCTA />

            {/* Footer */}
            <footer className="footer relative z-10">
                <div className="footer-container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', boxShadow: '0 4px 20px rgba(255, 32, 121, 0.4)' }}>C</div>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>CodeAra</span>
                    </div>
                    <div className="footer-links">
                        <a href="#features" className="footer-link">Features</a>
                        <a href="#pricing" className="footer-link">Pricing</a>
                        <a href="#" className="footer-link">Twitter</a>
                        <a href="#" className="footer-link">GitHub</a>
                    </div>
                    <div className="footer-copyright">© 2026 CodeAra. All rights reserved.</div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
