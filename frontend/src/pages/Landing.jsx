import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    ArrowRight, Bot, Database, Zap, Shield, Layout, Users,
    Check, Globe, Cpu, Sparkles, MessageSquare, Code,
    BarChart3, Layers, Lock, MousePointer2
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

import Scene from '../components/3d/Scene';

gsap.registerPlugin(ScrollTrigger);

const FeatureBento = ({ icon: Icon, title, description, className, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        viewport={{ once: true }}
        className={`bg-slate-900/50 border border-slate-800 rounded-3xl p-8 hover:bg-slate-800/80 transition-all group relative overflow-hidden ${className}`}
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-colors" />
        <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-500">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-[15px] font-medium">{description}</p>

        {/* Abstract pattern decoration */}
        <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none">
            <Icon className="w-24 h-24" />
        </div>
    </motion.div>
);

const PricingCard = ({ name, price, description, features, recommended, yearly }) => (
    <div className={`bg-slate-900 border ${recommended ? 'border-blue-500 shadow-2xl shadow-blue-500/10 scale-105 z-10' : 'border-slate-800'} rounded-[2.5rem] p-10 flex flex-col relative overflow-hidden group transition-all`}>
        {recommended && (
            <div className="absolute top-6 right-6 px-4 py-1.5 bg-blue-500 text-white text-[10px] font-black rounded-full tracking-widest uppercase shadow-lg">
                Recommended
            </div>
        )}
        <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
            <p className="text-slate-500 text-sm font-medium">{description}</p>
        </div>
        <div className="flex items-baseline gap-1 mb-10">
            <span className="text-5xl font-bold text-white tracking-tighter">${yearly ? Math.floor(price * 0.8) : price}</span>
            <span className="text-slate-500 font-bold text-sm">/{yearly ? 'year' : 'mo'}</span>
        </div>
        <div className="space-y-5 mb-12 flex-1">
            {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                        <Check className="w-3 h-3 text-blue-400" />
                    </div>
                    {f}
                </div>
            ))}
        </div>
        <Link
            to="/register"
            className={`w-full py-4 rounded-2x font-bold transition-all text-center flex items-center justify-center gap-2 rounded-2xl ${recommended
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
        >
            Get Started <ArrowRight className="w-4 h-4" />
        </Link>
    </div>
);

const Landing = () => {
    const [yearly, setYearly] = useState(false);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <div ref={containerRef} className="relative w-full bg-slate-950 overflow-hidden">
            {/* Interactive 3D Scroll Hero Scene */}
            <Scene />

            {/* Platform Values / Bento Grid */}
            <section id="features" className="py-64 px-6 relative z-10 bg-slate-950">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl mb-24 capitalize">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-none italic">
                            Infinite Infrastructure. <br />
                            <span className="text-blue-500">Zero Configuration.</span>
                        </h2>
                        <p className="text-xl text-slate-500 font-medium">SaaSForge isn't a low-code builder. It's an autonomous backend engineer that lives in your browser.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                        <FeatureBento
                            className="md:col-span-3 h-[400px]"
                            icon={Bot}
                            title="LLM Native Architect"
                            description="Our engine treats your prompt as a source of truth. It doesn't just generate text; it compiles data models, index strategies, and relationship graphs into production-ready Mongoose schemas."
                            delay={0.1}
                        />
                        <FeatureBento
                            className="md:col-span-3 h-[400px]"
                            icon={Database}
                            title="Self-Compiling DB"
                            description="Dynamic schema generation allows you to pivot your entire architecture in real-time. Add a new 'Collection' simply by describing it. No migrations, no migrations, no downtime."
                            delay={0.2}
                        />
                        <FeatureBento
                            className="md:col-span-2 h-[450px]"
                            icon={Zap}
                            title="Auto-Wired APIs"
                            description="Every model creates a full RESTful CRUD interface with integrated validation hooks, error handlers, and tenant isolation layers."
                            delay={0.3}
                        />
                        <FeatureBento
                            className="md:col-span-4 h-[450px]"
                            icon={Globe}
                            title="Universal Edge Scalability"
                            description="Deploy to our managed clusters or export your generated Node.js core. SaaSForge architectures are built on industry standards, ensuring you never have vendor lock-in."
                            delay={0.4}
                        />
                    </div>
                </div>
            </section>

            {/* How It Works - Premium Timeline */}
            <section id="how-it-works" className="py-64 px-6 bg-slate-950 relative z-10 border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-32">
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 uppercase">The Generation Protocol</h2>
                        <p className="text-slate-500 text-lg font-bold uppercase tracking-[0.3em]">Three Steps to Production</p>
                    </div>

                    <div className="space-y-64 relative">
                        {/* Connecting Line */}
                        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-slate-800 hidden lg:block" />

                        {/* Step 1 */}
                        <div className="flex flex-col lg:flex-row items-center gap-20 relative">
                            <div className="flex-1 text-right hidden lg:block">
                                <motion.div
                                    whileInView={{ x: [100, 0], opacity: [0, 1] }}
                                    className="p-10 bg-slate-900/50 rounded-3xl border border-white/5"
                                >
                                    <MessageSquare className="w-12 h-12 text-blue-500 ml-auto mb-6" />
                                    <h4 className="text-lg font-mono text-blue-400 mb-2">INPUT_RAW</h4>
                                    <p className="text-slate-500 text-sm font-medium italic">"I need an enterprise CRM with automated lead scoring and pipeline management..."</p>
                                </motion.div>
                            </div>
                            <div className="w-20 h-20 rounded-full bg-blue-600 border-[8px] border-slate-950 relative z-10 flex items-center justify-center text-white font-black text-2xl shadow-[0_0_30px_rgba(59,130,246,0.5)]">1</div>
                            <div className="flex-1 space-y-6">
                                <h3 className="text-4xl font-black text-white italic">Conceptual Synthesis</h3>
                                <p className="text-slate-400 text-lg font-medium leading-relaxed">Simply speak your intent. Our LLM-based parser extracts entities, attributes, and relationships, creating a logical blueprint for your entire software system.</p>
                                <div className="lg:hidden p-6 bg-slate-900/50 rounded-2xl border border-white/5 italic text-slate-500 text-sm">"I need an enterprise CRM with lead scoring..."</div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col lg:flex-row-reverse items-center gap-20 relative">
                            <div className="flex-1 text-left hidden lg:block">
                                <motion.div
                                    whileInView={{ x: [-100, 0], opacity: [0, 1] }}
                                    className="p-10 bg-slate-900/50 rounded-3xl border border-white/5"
                                >
                                    <Code className="w-12 h-12 text-emerald-500 mb-6" />
                                    <h4 className="text-lg font-mono text-emerald-400 mb-2">KERNEL_COMPILE</h4>
                                    <p className="text-slate-500 text-sm font-medium font-mono">
                                        Compiling Mongoose Models... <br />
                                        Registers /api/v1/dynamic/leads...
                                    </p>
                                </motion.div>
                            </div>
                            <div className="w-20 h-20 rounded-full bg-emerald-600 border-[8px] border-slate-950 relative z-10 flex items-center justify-center text-white font-black text-2xl shadow-[0_0_30px_rgba(16,185,129,0.5)]">2</div>
                            <div className="flex-1 space-y-6 text-right lg:text-left">
                                <h3 className="text-4xl font-black text-white italic">Dynamic Compilation</h3>
                                <p className="text-slate-400 text-lg font-medium leading-relaxed">The blueprint hits our dynamic engine. It compiles schemas on-the-fly, enforces complex validation, and registers API endpoints without a single server restart.</p>
                                <div className="lg:hidden p-6 bg-slate-900/50 rounded-2xl border border-white/5 italic text-slate-500 text-sm">KERNEL_COMPILE: Registering API endpoints...</div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col lg:flex-row items-center gap-20 relative">
                            <div className="flex-1 text-right hidden lg:block">
                                <motion.div
                                    whileInView={{ x: [100, 0], opacity: [0, 1] }}
                                    className="p-10 bg-slate-900/50 rounded-3xl border border-white/5"
                                >
                                    <Layout className="w-12 h-12 text-blue-500 ml-auto mb-6" />
                                    <h4 className="text-lg font-mono text-blue-400 mb-2">UI_SYNC</h4>
                                    <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Dashboard Live @ 127.0.0.1:5000</p>
                                </motion.div>
                            </div>
                            <div className="w-20 h-20 rounded-full bg-blue-600 border-[8px] border-slate-950 relative z-10 flex items-center justify-center text-white font-black text-2xl shadow-[0_0_30px_rgba(59,130,246,0.5)]">3</div>
                            <div className="flex-1 space-y-6">
                                <h3 className="text-4xl font-black text-white italic">Dashboard Deployment</h3>
                                <p className="text-slate-400 text-lg font-medium leading-relaxed">Your backend is live. Access your dedicated Control Panel to view data, manage tenants, and refine your visual UI through our modular component library.</p>
                                <div className="lg:hidden p-6 bg-slate-900/50 rounded-2xl border border-white/5 italic text-slate-500 text-sm font-bold uppercase">UI Live: Control Panel Ready.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-64 px-6 relative z-10 bg-slate-950">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 uppercase">Pricing Integrity</h2>

                        {/* Toggle */}
                        <div className="flex items-center justify-center gap-4">
                            <span className={`text-sm font-bold transition-colors ${!yearly ? 'text-white' : 'text-slate-600'}`}>Monthly</span>
                            <button
                                onClick={() => setYearly(!yearly)}
                                className="w-14 h-8 bg-slate-900 border border-slate-800 rounded-full p-1 relative transition-colors hover:border-slate-700"
                            >
                                <motion.div
                                    animate={{ x: yearly ? 24 : 0 }}
                                    className="w-6 h-6 bg-blue-500 rounded-full shadow-lg shadow-blue-500/20"
                                />
                            </button>
                            <span className={`text-sm font-bold transition-colors ${yearly ? 'text-white' : 'text-slate-600'}`}>
                                Yearly <span className="text-emerald-400 text-[10px] ml-1 bg-emerald-400/10 px-1.5 py-0.5 rounded">Save 20%</span>
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <PricingCard
                            name="Starter"
                            price="0"
                            description="For architects testing their first SaaS concept."
                            features={['3 Generated SaaS Apps', '50MB Data Storage', 'Standard AI Queue', 'Public Community Support']}
                            yearly={yearly}
                        />
                        <PricingCard
                            name="Pro Scaler"
                            price="49"
                            description="The complete engine for growing software businesses."
                            features={['Unlimited SaaS Apps', '5GB Persistent Storage', 'Priority AI Ingress', 'White-label Branding', 'Advanced Tenant Analytics']}
                            recommended={true}
                            yearly={yearly}
                        />
                        <PricingCard
                            name="Enterprise"
                            price="199"
                            description="Infrastructure for high-volume SaaS teams."
                            features={['Dedicated DB Nodes', '100GB Data Storage', 'Private AI Fine-tuning', '24/7 Priority Support', 'Multi-tenant Reselling']}
                            yearly={yearly}
                        />
                    </div>

                    <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-8 p-10 bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <Lock className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white mb-1">Looking for On-Premise?</h4>
                                <p className="text-slate-500 font-medium">Deploy SaaSForge on your VPC for ultimate data sovereignty.</p>
                            </div>
                        </div>
                        <button className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-white/5 transition-all">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>

            {/* Ecosystem CTA */}
            <section className="py-64 relative bg-slate-950 border-t border-white/5">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        whileInView={{ scale: [0.9, 1], opacity: [0, 1] }}
                        className="p-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[4rem] shadow-2xl shadow-blue-500/20 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10 leading-tight">Stop Building Boilerplate. <br /> Start Generating Value.</h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                            <Link to="/register" className="px-10 py-5 bg-white text-slate-950 font-black rounded-3xl hover:bg-blue-50 transition-all flex items-center gap-3 active:scale-95">
                                Forge Your First SaaS <MousePointer2 className="w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Modern Footer */}
            <footer className="py-20 px-6 border-t border-white/5 bg-slate-950">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center font-black text-white italic">S</div>
                        <span className="font-bold text-white tracking-widest uppercase text-sm">SaaSForge.ai</span>
                    </div>

                    <div className="flex gap-8 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        <a href="#" className="hover:text-blue-500 transition-colors">Twitter</a>
                        <a href="#" className="hover:text-blue-500 transition-colors">GitHub</a>
                        <a href="#" className="hover:text-blue-500 transition-colors">Documentation</a>
                        <a href="#" className="hover:text-blue-500 transition-colors">Status</a>
                    </div>

                    <div className="text-slate-600 text-xs font-medium">
                        © 2026 SaaSForge AI Engine. A Radical Experiment.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
