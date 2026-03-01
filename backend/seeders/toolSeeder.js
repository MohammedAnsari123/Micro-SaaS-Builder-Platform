const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Tool = require('../models/Tool');
const Tenant = require('../models/Tenant');

dotenv.config({ path: path.join(__dirname, '../.env') });

const toolsData = [
    { name: 'Analytics Dashboard', slug: 'analytics-dashboard', category: 'Analytics', description: 'Real-time traffic monitor.', configSchema: { chartType: 'bar' }, isPremium: false, version: 1 },
    { name: 'CRM Manager', slug: 'crm-manager', category: 'Business', description: 'Manage contacts and deals.', configSchema: { fields: ['name', 'email'] }, isPremium: true, version: 1 },
    { name: 'Kanban Board', slug: 'kanban-board', category: 'Productivity', description: 'Agile task management.', configSchema: { columns: ['To Do', 'Done'] }, isPremium: false, version: 1 },
    { name: 'Invoice Generator', slug: 'invoice-generator', category: 'Business', description: 'Professional invoicing.', configSchema: { currency: 'USD' }, isPremium: true, version: 1 },
    { name: 'Event Calendar', slug: 'event-calendar', category: 'Productivity', description: 'Team scheduling.', configSchema: { defaultView: 'month' }, isPremium: false, version: 1 },
    { name: 'Lead Tracker', slug: 'lead-tracker', category: 'Business', description: 'Track sales leads.', configSchema: { source: 'web' }, isPremium: false, version: 1 },
    { name: 'Customer Directory', slug: 'customer-directory', category: 'Business', description: 'Centralized user database.', configSchema: { searchable: true }, isPremium: false, version: 1 },
    { name: 'Ticket System', slug: 'ticket-system', category: 'Support', description: 'Customer support ticketing.', configSchema: { priority: 'normal' }, isPremium: true, version: 1 },
    { name: 'Expense Tracker', slug: 'expense-tracker', category: 'Finance', description: 'Monitor company spending.', configSchema: { limit: 1000 }, isPremium: false, version: 1 },
    { name: 'Subscription Manager', slug: 'subscription-manager', category: 'Finance', description: 'Manage recurring billing.', configSchema: { interval: 'month' }, isPremium: true, version: 1 },
    { name: 'Gantt Chart', slug: 'gantt-chart', category: 'Productivity', description: 'Timeline project tracking.', configSchema: { scale: 'week' }, isPremium: true, version: 1 },
    { name: 'Task List', slug: 'task-list', category: 'Productivity', description: 'Simple checklist manager.', configSchema: { color: 'blue' }, isPremium: false, version: 1 },
    { name: 'Inventory Manager', slug: 'inventory-manager', category: 'Operations', description: 'Track stock and assets.', configSchema: { threshold: 5 }, isPremium: true, version: 1 },
    { name: 'Employee Directory', slug: 'employee-directory', category: 'Operations', description: 'Internal staff database.', configSchema: { department: 'All' }, isPremium: false, version: 1 },
    { name: 'Asset Tracker', slug: 'asset-tracker', category: 'Operations', description: 'Manage hardware and licenses.', configSchema: { type: 'hardware' }, isPremium: true, version: 1 },
    { name: 'Sales Dashboard', slug: 'sales-dashboard', category: 'Analytics', description: 'Revenue and growth metrics.', configSchema: { range: '30d' }, isPremium: true, version: 1 },
    { name: 'Web Traffic Monitor', slug: 'web-traffic-monitor', category: 'Analytics', description: 'Visitor statistics.', configSchema: { refresh: '5m' }, isPremium: false, version: 1 },
    { name: 'User Metrics', slug: 'user-metrics', category: 'Analytics', description: 'Behavioral analytics.', configSchema: { goal: 'conversion' }, isPremium: true, version: 1 },
    { name: 'Email Campaigner', slug: 'email-campaigner', category: 'Marketing', description: 'Bulk email system.', configSchema: { template: 'newsletter' }, isPremium: true, version: 1 },
    { name: 'SEO Tracker', slug: 'seo-tracker', category: 'Marketing', description: 'Keyword performance tool.', configSchema: { keywords: 10 }, isPremium: false, version: 1 }
];

const seedTools = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('1. MongoDB Connected for Tool Seeding...');

        console.log('2. Finding System Studio Tenant...');
        let systemTenant = await Tenant.findOne({ name: 'System Studio' });

        if (!systemTenant) {
            console.log('3. System Studio Tenant not found, creating...');
            systemTenant = await Tenant.create({
                name: 'System Studio',
                plan: 'enterprise'
            });
            console.log('✅ System Studio Tenant created:', systemTenant._id);
        } else {
            console.log('✅ System Studio Tenant found:', systemTenant._id);
        }

        console.log('4. Clearing existing Tools...');
        await Tool.deleteMany({});
        console.log('✅ Cleared all tools.');

        const toolsWithTenant = toolsData.map(t => ({
            ...t,
            tenantId: systemTenant._id,
            isPublic: true,
            versions: [{
                version: 1,
                pages: ['Dashboard'],
                layoutConfig: {},
                instances: [],
                schemas: []
            }]
        }));

        console.log('5. Inserting Tools...');
        await Tool.insertMany(toolsWithTenant);
        console.log(`✅ ${toolsData.length} Tools successfully imported.`);

        process.exit();
    } catch (err) {
        console.error('Error seeding tools:', err);
        process.exit(1);
    }
};

seedTools();
