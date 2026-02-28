import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Activity, ListTodo, Calendar, BarChart3, Package, ShoppingCart, Database as DatabaseIcon, Zap as ZapIcon, AlertTriangle } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
    >
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium">{title}</h3>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Icon className="w-5 h-5" />
            </div>
        </div>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
    </motion.div>
);

const TableWidget = ({ title, columns, data, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
    >
        <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-sm">
                    <tr>
                        {columns.map((col, i) => (
                            <th key={i} className="px-6 py-4 font-medium">{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                            {row.map((cell, j) => (
                                <td key={j} className="px-6 py-4 text-slate-700">{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </motion.div>
);

const KanbanBoard = () => {
    const columns = [
        { title: 'To Do', color: 'bg-slate-100', items: ['Design Homepage', 'Setup Database', 'Write API Docs'] },
        { title: 'In Progress', color: 'bg-blue-50', items: ['Implement Auth', 'Stripe Integration'] },
        { title: 'Done', color: 'bg-emerald-50', items: ['Project Setup', 'GitHub Repo Init'] }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((col, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`${col.color} p-4 rounded-2xl border border-slate-200/50 min-h-[500px]`}
                >
                    <h3 className="font-bold text-slate-700 mb-4 px-2">{col.title} <span className="text-slate-400 text-sm ml-2 font-normal">{col.items.length}</span></h3>
                    <div className="space-y-3">
                        {col.items.map((item, j) => (
                            <div key={j} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-shadow">
                                <p className="font-medium text-slate-800">{item}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white"></div>
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white"></div>
                                    </div>
                                    <span className="text-xs text-slate-400">Mar {12 + j}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const CalendarView = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex items-center justify-center min-h-[500px]"
    >
        <div className="text-center text-slate-400 space-y-4">
            <Calendar className="w-16 h-16 mx-auto text-blue-100" />
            <h3 className="text-lg font-bold text-slate-600">Interactive Calendar Engine</h3>
            <p className="max-w-md mx-auto">This template features a full-scale interactive booking calendar. Once cloned, you can map it dynamically to any temporal collection.</p>
        </div>
    </motion.div>
);

const ChartWidget = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
    >
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Event Volume</h3>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">+24%</span>
        </div>
        <div className="h-64 flex items-end justify-between gap-2">
            {[40, 70, 45, 90, 65, 85, 120, 95, 110, 80, 130, 100].map((h, i) => (
                <div key={i} className="w-full bg-blue-100 rounded-t-lg relative group transition-all hover:bg-blue-500 cursor-pointer" style={{ height: `${(h / 130) * 100}%` }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg transition-opacity whitespace-nowrap">
                        {h} Events
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
);

const TemplateUIEngine = ({ template }) => {
    if (!template || !template.layout) return null;

    const layoutType = template.layout.type;

    return (
        <div className="w-full h-full p-8 font-sans">
            {layoutType === 'dashboard' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <MetricCard title="Total Contacts" value="2,845" icon={Users} delay={0.1} />
                        <MetricCard title="Active Leads" value="142" icon={Activity} delay={0.2} />
                        <MetricCard title="Revenue Pipe" value="$450k" icon={ShoppingCart} delay={0.3} />
                    </div>
                    <TableWidget
                        title="Recent Leads"
                        columns={['Name', 'Status', 'Value', 'Closing']}
                        data={[
                            ['Acme Corp', 'New', '$45,000', 'Oct 24'],
                            ['TechFlow Inc', 'Negotiation', '$120,000', 'Nov 12'],
                            ['Global Widgets', 'Contacted', '$15,500', 'Oct 30']
                        ]}
                        delay={0.4}
                    />
                </div>
            )}

            {layoutType === 'kanban' && <KanbanBoard />}

            {layoutType === 'inventory_dashboard' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <MetricCard title="Total Products" value="15,201" icon={Package} delay={0.1} />
                        <MetricCard title="Low Stock Alerts" value="23" icon={AlertTriangle} delay={0.2} />
                        <MetricCard title="Warehouses" value="4" icon={LayoutDashboard} delay={0.3} />
                    </div>
                    <TableWidget
                        title="Low Stock Alerts"
                        columns={['SKU', 'Product', 'Warehouse', 'Current Stock']}
                        data={[
                            ['IPH-15-PRO', 'iPhone 15 Pro Max', 'East Coast', '4'],
                            ['MKB-M3-14', 'MacBook Pro M3 14"', 'West Coast', '2'],
                            ['SONY-XM5', 'Sony WH-1000XM5', 'Central', '0']
                        ]}
                        delay={0.4}
                    />
                </div>
            )}

            {layoutType === 'calendar' && <CalendarView />}

            {layoutType === 'analytics' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <MetricCard title="Total Events" value="1.2M" icon={Activity} delay={0.1} />
                        <MetricCard title="API Calls" value="845k" icon={DatabaseIcon} delay={0.2} />
                        <MetricCard title="Avg Latency" value="42ms" icon={ZapIcon} delay={0.3} />
                        <MetricCard title="Error Rate" value="0.01%" icon={AlertTriangle} delay={0.4} />
                    </div>
                    <ChartWidget />
                </div>
            )}

            {/* Fallback */}
            {!['dashboard', 'kanban', 'inventory_dashboard', 'calendar', 'analytics'].includes(layoutType) && (
                <div className="flex h-full items-center justify-center text-slate-500 flex-col gap-4 bg-white rounded-2xl border border-slate-200 p-12">
                    <LayoutDashboard className="w-12 h-12 opacity-50" />
                    <p>No visual preview mockup designed for this layout type ({layoutType}).</p>
                </div>
            )}
        </div>
    );
};

export default TemplateUIEngine;
