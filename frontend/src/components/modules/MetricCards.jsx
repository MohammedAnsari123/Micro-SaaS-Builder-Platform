import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import axios from 'axios';

const MetricCards = ({ instance }) => {
    const collectionName = instance?.collectionName || 'orders';
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
                const res = await axios.get(`http://localhost:5000/api/v1/dynamic/${collectionName}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch metrics:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [collectionName]);

    // Derived Metrics
    const totalCount = data.length;
    const recentCount = data.filter(item => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return new Date(item.createdAt) > sevenDaysAgo;
    }).length;

    const metrics = [
        {
            label: 'Total Volumetric',
            value: totalCount.toLocaleString(),
            change: '+14%',
            isUp: true,
            icon: Zap,
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/10'
        },
        {
            label: 'Cycle Velocity',
            value: recentCount.toLocaleString(),
            change: '+5.2%',
            isUp: true,
            icon: TrendingUp,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10'
        },
        {
            label: 'Active Entities',
            value: Math.floor(totalCount * 0.85).toLocaleString(),
            change: '-2%',
            isUp: false,
            icon: Users,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10'
        },
        {
            label: 'Value Index',
            value: (totalCount * 125).toLocaleString('en-US', { style: 'currency', currency: 'USD' }).split('.')[0],
            change: '+12%',
            isUp: true,
            icon: DollarSign,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {metrics.map((metric, i) => (
                <div key={i} className="relative group overflow-hidden bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 transition-all hover:bg-slate-900 hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/5 active:scale-[0.98]">
                    {/* Decorative Background Element */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-start justify-between relative z-10">
                        <div className={`p-4 rounded-3xl ${metric.bg} ${metric.color} transition-transform group-hover:scale-110 shadow-lg`}>
                            <metric.icon className="h-7 w-7" />
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${metric.isUp ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                            {metric.isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                            {metric.change}
                        </div>
                    </div>

                    <div className="mt-8 relative z-10">
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{metric.label}</p>
                        <div className="flex items-baseline gap-2">
                            <h4 className="text-4xl font-black text-white tracking-tighter tabular-nums leading-none">
                                {loading ? '---' : metric.value}
                            </h4>
                        </div>
                    </div>

                    <div className="mt-6 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${metric.color.replace('text', 'bg')} opacity-40 transition-all duration-1000`} style={{ width: metric.isUp ? '75%' : '45%' }} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MetricCards;
