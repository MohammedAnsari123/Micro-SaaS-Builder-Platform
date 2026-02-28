import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check, ShieldCheck, Zap, ArrowRight, Wallet } from 'lucide-react';

const PlanCard = ({ name, price, features, recommended, current }) => (
    <div className={`bg-slate-900 border ${recommended ? 'border-blue-500' : 'border-slate-800'} rounded-3xl p-8 flex flex-col relative overflow-hidden group shadow-2xl transition-all hover:-translate-y-1`}>
        {recommended && (
            <div className="absolute top-4 right-[-30px] bg-blue-500 text-white text-[10px] font-bold py-1 px-10 rotate-45 shadow-lg">
                BEST VALUE
            </div>
        )}
        <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
        <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-bold text-white">${price}</span>
            <span className="text-slate-500 font-medium font-sans">/mo</span>
        </div>
        <ul className="space-y-4 mb-8 flex-1">
            {features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    {f}
                </li>
            ))}
        </ul>
        <button
            disabled={current}
            className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${current
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 active:scale-95'
                }`}
        >
            {current ? 'Currently Active' : 'Upgrade Now'} {!current && <ArrowRight className="w-4 h-4" />}
        </button>
    </div>
);

const Subscriptions = () => {
    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900 border border-slate-800 p-10 rounded-[32px] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-bold uppercase tracking-widest border border-amber-500/20 mb-4">
                        <Zap className="w-3 h-3" /> Free Tier Active
                    </div>
                    <h2 className="text-4xl font-bold text-white tracking-tight mb-4 leading-[1.1]">Infrastructure <br /><span className="text-slate-500 italic">Subscription Control</span></h2>
                    <p className="text-slate-400 font-medium max-w-md leading-relaxed">Scaling your SaaS portfolio is easy. Upgrade to remove usage limits and unlock premium AI features.</p>
                </div>
                <div className="bg-slate-800/80 border border-white/5 p-8 rounded-3xl w-full md:w-80 backdrop-blur-xl relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <Wallet className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Billing Cycle</div>
                            <div className="text-white font-bold">Monthly Pre-pay</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-slate-400">Next Payment</span>
                            <span className="text-white">N/A (Free)</span>
                        </div>
                        <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[10%]" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <PlanCard
                    name="Starter"
                    price="0"
                    current={true}
                    features={['3 SaaS App Slots', '50 MB Data Storage', 'Community Support', 'Standard AI Engine']}
                />
                <PlanCard
                    name="Pro Scaler"
                    price="29"
                    recommended={true}
                    features={['Unlimited App Slots', '5 GB Managed Storage', 'Priority AI Queue', 'White-label Branding', 'Advanced Analytics']}
                />
                <PlanCard
                    name="Enterprise"
                    price="199"
                    features={['Multi-tenant Reseller', '100 GB Storage', 'Dedicated GPU Node', 'Custom AI Fine-tuning', '24/7 Human Support']}
                />
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-4">
                    <ShieldCheck className="w-10 h-10 text-blue-500" />
                    <div>
                        <h4 className="text-white font-bold">Secure Billing</h4>
                        <p className="text-slate-500 text-sm font-medium">All payments are encrypted and processed via Stripe Secure.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6 opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0" />
                </div>
            </div>
        </div>
    );
};

export default Subscriptions;
