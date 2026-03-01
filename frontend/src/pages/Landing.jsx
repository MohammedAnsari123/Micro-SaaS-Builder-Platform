import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, Database, Lock, CreditCard, BarChart3, Rocket,
    Globe, Check, Star, Minus, Plus, ChevronLeft, ChevronRight
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

import Scene from '../components/3d/Scene';

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
                <span key={i} className="wr-word inline-block mr-[0.3em]">{word}</span>
            ))}
        </span>
    );
};

/* ── Icon Micro-Animations ── */
const PulseIcon = ({ icon: Icon, color, className = '' }) => (
    <div className={`relative ${className}`}>
        <div className="absolute inset-0 rounded-2xl animate-ping opacity-20" style={{ backgroundColor: color }} />
        <Icon className="w-7 h-7 relative z-10" style={{ color }} />
    </div>
);

const FloatIcon = ({ icon: Icon, color, className = '' }) => (
    <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className={className}>
        <Icon className="w-7 h-7" style={{ color }} />
    </motion.div>
);

const SpinIcon = ({ icon: Icon, color, className = '' }) => (
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} className={className}>
        <Icon className="w-7 h-7" style={{ color }} />
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
        <div
            ref={ref}
            className="bg-[#16213E] border border-white/5 rounded-2xl p-7 sm:p-8 group cursor-default relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(67,97,238,0.08)]"
        >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700" style={{ backgroundColor: color }} />
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border border-white/10 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${color}15` }}>
                <AnimIcon icon={Icon} color={color} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
        </div>
    );
};

const FeaturesSection = () => (
    <section id="features" className="py-20 sm:py-28 md:py-36 px-6 bg-[#1A1A2E]">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14 sm:mb-20">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                    <WordReveal>Everything You Need to Ship</WordReveal>
                </h2>
                <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto">Each tool you saw attach in the animation is a real capability.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <section id="how-it-works" ref={sectionRef} className="py-20 sm:py-28 md:py-36 px-6 bg-[#1A1A2E]">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-14 sm:mb-20">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                        <WordReveal>How It Works</WordReveal>
                    </h2>
                    <p className="text-slate-400 text-base sm:text-lg">Three steps. Zero boilerplate.</p>
                </div>

                <div className="relative">
                    {/* Self-drawing line */}
                    <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-white/5">
                        <div ref={lineRef} className="w-full h-full bg-gradient-to-b from-[#4361EE] to-[#4CC9F0] origin-top" style={{ transform: 'scaleY(0)' }} />
                    </div>

                    <div className="space-y-16 md:space-y-20">
                        {STEPS.map((s, i) => (
                            <div key={s.step} className="flex gap-6 md:gap-8 items-start">
                                {/* Node */}
                                <div
                                    ref={el => nodeRefs.current[i] = el}
                                    className="shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#4361EE]/10 border-2 border-[#4361EE]/40 flex items-center justify-center z-10 relative"
                                    style={{ opacity: 0 }}
                                >
                                    <span className="text-[#4361EE] font-black text-lg md:text-xl">{s.step}</span>
                                    {/* Glow ring */}
                                    <div className="absolute inset-0 rounded-full border-2 border-[#4361EE]/20 animate-ping" />
                                </div>
                                {/* Text */}
                                <div ref={el => textRefs.current[i] = el} style={{ opacity: 0 }}>
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{s.title}</h3>
                                    <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-md">{s.desc}</p>
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
            className={`bg-[#16213E] border ${recommended ? 'border-[#4361EE] shadow-[0_0_50px_rgba(67,97,238,0.12)]' : 'border-white/5'} rounded-3xl p-8 sm:p-10 flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-[#4361EE]/40 hover:shadow-[0_0_30px_rgba(67,97,238,0.08)] cursor-default ${recommended ? 'md:scale-105 z-10' : ''}`}
            style={{ perspective: '1200px', opacity: 0 }}
        >
            {recommended && (
                <div className="absolute top-5 right-5 px-3 py-1 bg-[#4361EE] text-white text-[10px] font-black rounded-full tracking-widest uppercase animate-pulse">Popular</div>
            )}
            <h3 className="text-2xl font-bold text-white mb-1">{name}</h3>
            <p className="text-slate-500 text-sm mb-6">{description}</p>
            <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
                    <NumberRoll value={displayPrice} />
                </span>
                <span className="text-slate-500 text-sm font-medium">/{yearly ? 'yr' : 'mo'}</span>
            </div>
            <div className="space-y-3 mb-8 flex-1">
                {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                        <Check className="w-4 h-4 text-[#4361EE] shrink-0" />{f}
                    </div>
                ))}
            </div>
            <Link to="/register" className={`w-full py-4 rounded-xl font-bold text-sm text-center transition-all active:scale-95 block ${recommended ? 'bg-[#4361EE] hover:bg-[#3651DE] text-white shadow-lg shadow-[#4361EE]/20' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}>
                Get Started
            </Link>
        </div>
    );
};

const PricingSection = () => {
    const [yearly, setYearly] = useState(false);
    return (
        <section id="pricing" className="py-20 sm:py-28 md:py-36 px-6 bg-[#16213E]/50">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-14 sm:mb-20">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                        <WordReveal>Simple Transparent Pricing</WordReveal>
                    </h2>
                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-bold transition-colors ${!yearly ? 'text-white' : 'text-slate-600'}`}>Monthly</span>
                        <button onClick={() => setYearly(!yearly)} className="w-14 h-8 bg-[#1A1A2E] border border-slate-700 rounded-full p-1 relative hover:border-[#4361EE]/50 transition-colors">
                            <motion.div animate={{ x: yearly ? 24 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="w-6 h-6 bg-[#4361EE] rounded-full shadow-lg" />
                        </button>
                        <span className={`text-sm font-bold transition-colors ${yearly ? 'text-white' : 'text-slate-600'}`}>
                            Yearly <span className="text-emerald-400 text-[10px] ml-1 bg-emerald-400/10 px-1.5 py-0.5 rounded">-20%</span>
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8" style={{ perspective: '1200px' }}>
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
        <section ref={sectionRef} className="py-20 sm:py-28 md:py-36 px-6 bg-[#1A1A2E]">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-14 sm:mb-20">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                        <WordReveal>Loved by Builders</WordReveal>
                    </h2>
                </div>

                {/* Desktop: all 3 visible with alternating slide */}
                <div className="hidden md:grid grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} ref={el => cardRefs.current[i] = el} className="bg-[#16213E] border border-white/5 rounded-2xl p-8 relative" style={{ opacity: 0 }}>
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4361EE] to-[#4CC9F0] flex items-center justify-center text-white font-bold text-sm relative">
                                    {t.name[0]}
                                    <div className="absolute inset-0 rounded-full border-2 border-[#4361EE]/30 animate-ping" />
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm">{t.name}</div>
                                    <div className="text-slate-500 text-xs">{t.role}</div>
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
                            transition={{ duration: 0.4, ease: EASE }}
                            className="bg-[#16213E] border border-white/5 rounded-2xl p-8"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">"{TESTIMONIALS[active].quote}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4361EE] to-[#4CC9F0] flex items-center justify-center text-white font-bold text-sm">
                                    {TESTIMONIALS[active].name[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm">{TESTIMONIALS[active].name}</div>
                                    <div className="text-slate-500 text-xs">{TESTIMONIALS[active].role}</div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <button onClick={prev} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <div className="flex gap-2">
                            {TESTIMONIALS.map((_, i) => (
                                <button key={i} onClick={() => goTo(i)} className={`w-2 h-2 rounded-full transition-all ${i === active ? 'bg-[#4361EE] w-6' : 'bg-white/20'}`} />
                            ))}
                        </div>
                        <button onClick={next} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                            <ChevronRight className="w-5 h-5 text-white" />
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
    const contentRef = useRef(null);

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

    // Smooth max-height animation
    useEffect(() => {
        if (!contentRef.current) return;
        if (open) {
            contentRef.current.style.maxHeight = contentRef.current.scrollHeight + 'px';
            contentRef.current.style.opacity = '1';
        } else {
            contentRef.current.style.maxHeight = '0px';
            contentRef.current.style.opacity = '0';
        }
    }, [open]);

    return (
        <div ref={ref} className="border-b border-white/5" style={{ opacity: 0 }}>
            <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
                <span className="flex items-center gap-3">
                    <span className={`w-1 h-6 rounded-full transition-all duration-300 ${open ? 'bg-[#4361EE]' : 'bg-transparent'}`} />
                    <span className="text-white font-medium text-sm sm:text-base pr-4">{q}</span>
                </span>
                <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
                    <Plus className={`w-5 h-5 shrink-0 transition-colors ${open ? 'text-[#4361EE]' : 'text-slate-500 group-hover:text-[#4361EE]'}`} />
                </motion.span>
            </button>
            <div ref={contentRef} className="overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ maxHeight: 0, opacity: 0 }}>
                <p className="text-slate-400 text-sm leading-relaxed pb-5 pl-4 border-l-2 border-[#4361EE]/20 ml-3">{a}</p>
            </div>
        </div>
    );
};

const FAQSection = () => (
    <section className="py-20 sm:py-28 md:py-36 px-6 bg-[#16213E]/50">
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
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
    <section className="relative py-20 sm:py-28 md:py-36 px-6 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, #1A1A2E, #0F3460, #4361EE, #0F3460, #1A1A2E)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 12s ease infinite'
        }} />
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/20 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `floatParticle ${5 + Math.random() * 8}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 5}s`
                    }}
                />
            ))}
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
                <WordReveal delay={0}>Ready to Build</WordReveal><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CC9F0] to-white">
                    <WordReveal delay={0.3}>Your Next SaaS?</WordReveal>
                </span>
            </h2>
            <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="text-white/70 text-base sm:text-lg mb-10 max-w-lg mx-auto"
            >
                Join thousands of developers shipping faster with Micro SaaS Builder.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                viewport={{ once: true }}
            >
                <Link
                    to="/register"
                    className="inline-flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 bg-white text-[#1A1A2E] font-black rounded-2xl transition-all active:scale-95 text-sm sm:text-base uppercase tracking-widest relative overflow-hidden group"
                >
                    {/* Continuous glow pulse */}
                    <span className="absolute inset-0 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.3)] animate-pulse" />
                    <span className="relative z-10 flex items-center gap-3">Start Building Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
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
        <div ref={ref} className="text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter">{count}{suffix}</div>
            <div className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-2">{label}</div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════
   MOBILE 2D FALLBACK HERO
   ═══════════════════════════════════════════════════════ */
const MobileHeroFallback = () => (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 bg-[#1A1A2E] overflow-hidden">
        {/* Animated gradient orb */}
        <div className="absolute w-80 h-80 bg-[#4361EE]/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-20 right-10 w-40 h-40 bg-[#4CC9F0]/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Auto-playing tool animation */}
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE }}
            className="relative w-64 h-80 bg-[#0F3460] border border-white/10 rounded-3xl mb-10 overflow-hidden shadow-2xl"
        >
            {/* Panel content auto-builds */}
            {FEATURES.slice(0, 5).map((f, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -(i % 2 === 0 ? 40 : -40) }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + i * 0.5, duration: 0.6, ease: EASE }}
                    className="flex items-center gap-3 px-4 py-3 border-b border-white/5"
                >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${f.color}20` }}>
                        <f.icon className="w-4 h-4" style={{ color: f.color }} />
                    </div>
                    <span className="text-white text-xs font-medium">{f.title}</span>
                </motion.div>
            ))}
            {/* Glow effect  */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4, duration: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-[#4361EE]/10 to-transparent pointer-events-none rounded-3xl"
            />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-center relative z-10">
            <h1 className="text-4xl font-black text-white tracking-tight mb-4 leading-[1.1]">
                Build Your Micro SaaS<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4361EE] to-[#4CC9F0]">in Minutes</span>
            </h1>
            <p className="text-slate-400 text-base mb-8 max-w-xs mx-auto">From idea to deployed product — in one workflow</p>
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-[#4361EE] text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-[0_0_40px_rgba(67,97,238,0.3)]">
                Start Building Free <ArrowRight className="w-5 h-5" />
            </Link>
        </motion.div>
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
        <div className="bg-[#1A1A2E] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
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

            {/* Section 1 — Hero (3D or Mobile Fallback) */}
            {isMobile ? <MobileHeroFallback /> : <Scene />}

            {/* Section 2 — Features */}
            <FeaturesSection />

            {/* Stats Bar */}
            {/* <section className="py-14 sm:py-20 px-6 bg-[#0F3460]/30 border-y border-white/5">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    <Counter value={10000} suffix="+" label="Apps Generated" />
                    <Counter value={99} suffix="%" label="Uptime SLA" />
                    <Counter value={50} suffix="ms" label="Avg Response" />
                    <Counter value={150} suffix="+" label="Countries" />
                </div>
            </section> */}

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
            <footer className="py-12 sm:py-16 px-6 bg-[#0F172A] border-t border-white/5">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#4361EE] flex items-center justify-center font-black text-white shadow-lg shadow-[#4361EE]/20">C</div>
                        <span className="font-bold text-white text-sm tracking-widest uppercase">CodeAra</span>
                    </div>
                    <div className="flex gap-6 sm:gap-8 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        <a href="#features" className="hover:text-[#4361EE] transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-[#4361EE] transition-colors">Pricing</a>
                        <a href="#" className="hover:text-[#4361EE] transition-colors">Twitter</a>
                        <a href="#" className="hover:text-[#4361EE] transition-colors">GitHub</a>
                    </div>
                    <div className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">© 2026 CodeAra. All rights reserved.</div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
