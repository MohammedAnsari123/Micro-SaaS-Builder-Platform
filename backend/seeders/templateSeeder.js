const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Template = require('../models/Template');
const Tenant = require('../models/Tenant');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Theme = require('../models/Theme');
const Tool = require('../models/Tool');

const templates = [
    { name: 'Enterprise CRM', slug: 'enterprise-crm', category: 'Sales', description: 'End-to-end sales management.', layoutType: 'sidebar', pages: [{ name: 'Leads', slug: 'leads', icon: 'Target', sections: ['lead-tracker'] }, { name: 'Contacts', slug: 'contacts', icon: 'Users', sections: ['customer-directory'] }], version: 1, isPublic: true, colorTheme: 'blue' },
    { name: 'Agency Suite', slug: 'agency-suite', category: 'Service', description: 'For modern creative agencies.', layoutType: 'navbar', pages: [{ name: 'Projects', slug: 'projects', icon: 'Briefcase', sections: ['kanban-board'] }, { name: 'Billing', slug: 'billing', icon: 'CreditCard', sections: ['invoice-generator'] }], version: 1, isPublic: true, colorTheme: 'indigo' },
    { name: 'Inventory OS', slug: 'inventory-os', category: 'Operations', description: 'Stock tracking and logistics.', layoutType: 'sidebar', pages: [{ name: 'Warehouse', slug: 'warehouse', icon: 'Library', sections: ['inventory-manager'] }, { name: 'Staff', slug: 'staff', icon: 'UserCheck', sections: ['employee-directory'] }], version: 1, isPublic: true, colorTheme: 'emerald' },
    { name: 'Startup Metrics', slug: 'startup-metrics', category: 'Analytics', description: 'Growth tracking for startups.', layoutType: 'sidebar', pages: [{ name: 'Growth', slug: 'growth', icon: 'TrendingUp', sections: ['sales-dashboard'] }, { name: 'Traffic', slug: 'traffic', icon: 'Globe', sections: ['web-traffic-monitor'] }], version: 1, isPublic: true, colorTheme: 'rose' },
    { name: 'HR Portal', slug: 'hr-portal', category: 'Operations', description: 'Employee management system.', layoutType: 'navbar', pages: [{ name: 'Employees', slug: 'employees', icon: 'Users', sections: ['employee-directory'] }, { name: 'Attendance', slug: 'attendance', icon: 'Calendar', sections: ['event-calendar'] }], version: 1, isPublic: true, colorTheme: 'violet' },
    { name: 'E-commerce ERP', slug: 'ecommerce-erp', category: 'Business', description: 'Manage shop orders and stock.', layoutType: 'sidebar', pages: [{ name: 'Orders', slug: 'orders', icon: 'ShoppingCart', sections: ['invoice-generator'] }, { name: 'Products', slug: 'products', icon: 'Box', sections: ['inventory-manager'] }], version: 1, isPublic: true, colorTheme: 'teal' },
    { name: 'Freelancer Kit', slug: 'freelancer-kit', category: 'Service', description: 'Project tracking for individuals.', layoutType: 'navbar', pages: [{ name: 'Tasks', slug: 'tasks', icon: 'CheckSquare', sections: ['task-list'] }, { name: 'Timeline', slug: 'timeline', icon: 'Clock', sections: ['gantt-chart'] }], version: 1, isPublic: true, colorTheme: 'orange' },
    { name: 'Support Center', slug: 'support-center', category: 'Support', description: 'Help desk and ticketing system.', layoutType: 'sidebar', pages: [{ name: 'Tickets', slug: 'tickets', icon: 'MessageSquare', sections: ['ticket-system'] }, { name: 'Users', slug: 'users', icon: 'Shield', sections: ['customer-directory'] }], version: 1, isPublic: true, colorTheme: 'cyan' },
    { name: 'Marketing Hub', slug: 'marketing-hub', category: 'Marketing', description: 'Ads and campaign management.', layoutType: 'navbar', pages: [{ name: 'SEO', slug: 'seo', icon: 'Search', sections: ['seo-tracker'] }, { name: 'Campaigns', slug: 'campaigns', icon: 'Mail', sections: ['email-campaigner'] }], version: 1, isPublic: true, colorTheme: 'fuchsia' },
    { name: 'Finance OS', slug: 'finance-os', category: 'Business', description: 'Corporate finance dashboard.', layoutType: 'sidebar', pages: [{ name: 'Revenue', slug: 'revenue', icon: 'DollarSign', sections: ['sales-dashboard'] }, { name: 'Expenses', slug: 'expenses', icon: 'CreditCard', sections: ['expense-tracker'] }], version: 1, isPublic: true, colorTheme: 'amber' }
];

const seedTemplates = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Template Seeding...');

        const themes = await Theme.find();
        const tools = await Tool.find();

        await Template.deleteMany({});
        console.log('Cleared all templates.');

        const templatesWithRefs = templates.map((t, index) => {
            const theme = themes[index % themes.length];
            const tTools = tools.slice(0, 3).map(tool => tool._id);
            return {
                ...t,
                themeId: theme ? theme._id : null,
                defaultTools: tTools
            };
        });

        await Template.insertMany(templatesWithRefs);
        console.log(`${templates.length} Templates successfully imported.`);

        process.exit();
    } catch (err) {
        console.error('Error seeding templates:', err);
        process.exit(1);
    }
};

seedTemplates();
