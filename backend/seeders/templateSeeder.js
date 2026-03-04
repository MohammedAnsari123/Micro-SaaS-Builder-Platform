const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Template = require('../models/Template');

dotenv.config({ path: path.join(__dirname, '../.env') });

const templates = [
    // ============================================
    // INFORMATIONAL TEMPLATES (5)
    // ============================================
    {
        name: 'Portfolio',
        slug: 'portfolio',
        category: 'Personal',
        type: 'informational',
        description: 'Showcase your work, skills, and experience with a beautiful portfolio website.',
        pages: [
            { name: 'Home', slug: 'home', icon: 'Home', sections: ['hero', 'skills', 'featured_projects'] },
            { name: 'About', slug: 'about', icon: 'User', sections: ['hero', 'experience'] },
            { name: 'Projects', slug: 'projects', icon: 'Briefcase', sections: ['hero', 'list'] },
            { name: 'Contact', slug: 'contact', icon: 'Mail', sections: ['hero', 'info'] }
        ],
        modules: ['content', 'contact'],
        theme: { primary: '#6366f1', secondary: '#64748b', accent: '#f59e0b', background: '#ffffff', text: '#0f172a', font: 'Inter, sans-serif' },
        version: 1,
        isPublic: true
    },
    {
        name: 'Personal Resume',
        slug: 'resume',
        category: 'Personal',
        type: 'informational',
        description: 'Professional resume website to showcase your career, skills, and achievements.',
        pages: [
            { name: 'Home', slug: 'home', icon: 'Home', sections: ['hero', 'summary'] },
            { name: 'Experience', slug: 'experience', icon: 'Briefcase', sections: ['hero', 'list'] },
            { name: 'Skills', slug: 'skills', icon: 'Award', sections: ['hero', 'list'] },
            { name: 'Contact', slug: 'contact', icon: 'Mail', sections: ['hero', 'info'] }
        ],
        modules: ['content', 'contact'],
        theme: { primary: '#0f172a', secondary: '#475569', accent: '#3b82f6', background: '#f8fafc', text: '#0f172a', font: 'Inter, sans-serif' },
        version: 1,
        isPublic: true
    },
    {
        name: 'Agency',
        slug: 'agency',
        category: 'Business',
        type: 'informational',
        description: 'Modern agency website with services, portfolio, and team sections.',
        pages: [
            { name: 'Home', slug: 'home', icon: 'Home', sections: ['hero', 'stats', 'services_preview'] },
            { name: 'About', slug: 'about', icon: 'Users', sections: ['hero', 'team'] },
            { name: 'Services', slug: 'services', icon: 'Layers', sections: ['hero', 'list'] },
            { name: 'Projects', slug: 'projects', icon: 'Briefcase', sections: ['hero', 'list'] },
            { name: 'Contact', slug: 'contact', icon: 'Mail', sections: ['hero', 'info'] }
        ],
        modules: ['content', 'contact'],
        theme: { primary: '#7c3aed', secondary: '#64748b', accent: '#ec4899', background: '#ffffff', text: '#0f172a', font: 'Inter, sans-serif' },
        version: 1,
        isPublic: true
    },
    {
        name: 'Startup Landing Page',
        slug: 'startup-landing',
        category: 'Business',
        type: 'informational',
        description: 'High-converting landing page for startups with features, pricing, and FAQ.',
        pages: [
            { name: 'Home', slug: 'home', icon: 'Rocket', sections: ['hero', 'logos'] },
            { name: 'Features', slug: 'features', icon: 'Zap', sections: ['hero', 'list'] },
            { name: 'Pricing', slug: 'pricing', icon: 'CreditCard', sections: ['hero', 'plans'] },
            { name: 'FAQ', slug: 'faq', icon: 'HelpCircle', sections: ['hero', 'list'] },
            { name: 'Contact', slug: 'contact', icon: 'Mail', sections: ['hero', 'info'] }
        ],
        modules: ['content', 'contact'],
        theme: { primary: '#2563eb', secondary: '#64748b', accent: '#10b981', background: '#ffffff', text: '#0f172a', font: 'Inter, sans-serif' },
        version: 1,
        isPublic: true
    },
    {
        name: 'Product Showcase',
        slug: 'product-showcase',
        category: 'Business',
        type: 'informational',
        description: 'Showcase your product with a sleek landing page, features, and gallery.',
        pages: [
            { name: 'Home', slug: 'home', icon: 'Home', sections: ['hero', 'highlights'] },
            { name: 'Features', slug: 'features', icon: 'Star', sections: ['hero', 'list'] },
            { name: 'Gallery', slug: 'gallery', icon: 'Image', sections: ['hero', 'images'] },
            { name: 'Contact', slug: 'contact', icon: 'Mail', sections: ['hero', 'info'] }
        ],
        modules: ['content', 'contact'],
        theme: { primary: '#0ea5e9', secondary: '#475569', accent: '#f97316', background: '#ffffff', text: '#0f172a', font: 'Inter, sans-serif' },
        version: 1,
        isPublic: true
    },

    // ============================================
    // FUNCTIONAL TEMPLATES (5)
    // ============================================
    {
        name: 'Restaurant Ordering',
        slug: 'restaurant',
        category: 'Food & Beverage',
        type: 'functional',
        description: 'Restaurant website with menu display, online ordering, and contact.',
        pages: [
            { name: 'Home', slug: 'home', icon: 'Home', sections: ['hero', 'highlights', 'hours'] },
            { name: 'Menu', slug: 'menu', icon: 'UtensilsCrossed', sections: ['hero'] },
            { name: 'Cart', slug: 'cart', icon: 'ShoppingCart', sections: [] },
            { name: 'Contact', slug: 'contact', icon: 'Mail', sections: ['hero', 'info'] }
        ],
        modules: ['content', 'contact', 'product', 'order'],
        theme: { primary: '#dc2626', secondary: '#78350f', accent: '#f59e0b', background: '#fffbeb', text: '#1c1917', font: 'Inter, sans-serif' },
        version: 1,
        isPublic: true
    },
    {
        name: 'Car Booking',
        slug: 'car-booking',
        category: 'Automotive',
        type: 'functional',
        description: 'Vehicle rental website with fleet display and online booking.',
        pages: [
            { name: 'Home', slug: 'home', icon: 'Home', sections: ['hero', 'highlights'] },
            { name: 'Cars', slug: 'cars', icon: 'Car', sections: ['hero'] },
            { name: 'Book', slug: 'booking', icon: 'Calendar', sections: ['hero'] },
            { name: 'Contact', slug: 'contact', icon: 'Mail', sections: ['hero', 'info'] }
        ],
        modules: ['content', 'contact', 'product', 'booking'],
        theme: { primary: '#1e40af', secondary: '#334155', accent: '#0ea5e9', background: '#f0f9ff', text: '#0f172a', font: 'Inter, sans-serif' },
        version: 1,
        isPublic: true
    },
    {
        name: 'Service Booking',
        slug: 'service-booking',
        category: 'Services',
        type: 'functional',
        description: 'Service booking website for salons, repair shops, and appointment-based businesses.',
        pages: [
            { name: 'Home', slug: 'home', icon: 'Home', sections: ['hero', 'highlights'] },
            { name: 'Services', slug: 'services', icon: 'Scissors', sections: ['hero'] },
            { name: 'Book', slug: 'book', icon: 'Calendar', sections: ['hero'] },
            { name: 'Contact', slug: 'contact', icon: 'Mail', sections: ['hero', 'info'] }
        ],
        modules: ['content', 'contact', 'service', 'booking'],
        theme: { primary: '#be185d', secondary: '#64748b', accent: '#f472b6', background: '#fdf2f8', text: '#0f172a', font: 'Inter, sans-serif' },
        version: 1,
        isPublic: true
    },
    {
        name: 'Event Management',
        slug: 'event-management',
        category: 'Events',
        type: 'functional',
        description: 'Event management website with event listings, registration, and contact.',
        pages: [
            { name: 'Home', slug: 'home', icon: 'Home', sections: ['hero', 'highlights'] },
            { name: 'Events', slug: 'events', icon: 'Calendar', sections: ['hero'] },
            { name: 'Register', slug: 'register', icon: 'UserPlus', sections: ['hero'] },
            { name: 'Contact', slug: 'contact', icon: 'Mail', sections: ['hero', 'info'] }
        ],
        modules: ['content', 'contact', 'event', 'registration'],
        theme: { primary: '#7c3aed', secondary: '#64748b', accent: '#a78bfa', background: '#faf5ff', text: '#0f172a', font: 'Inter, sans-serif' },
        version: 1,
        isPublic: true
    },
    {
        name: 'Small Marketplace',
        slug: 'marketplace',
        category: 'E-Commerce',
        type: 'functional',
        description: 'Simple marketplace catalog with product listings and ordering.',
        pages: [
            { name: 'Home', slug: 'home', icon: 'Home', sections: ['hero', 'categories'] },
            { name: 'Products', slug: 'products', icon: 'ShoppingBag', sections: ['hero'] },
            { name: 'Contact', slug: 'contact', icon: 'Mail', sections: ['hero', 'info'] }
        ],
        modules: ['content', 'contact', 'product', 'order'],
        theme: { primary: '#059669', secondary: '#64748b', accent: '#14b8a6', background: '#f0fdf4', text: '#0f172a', font: 'Inter, sans-serif' },
        version: 1,
        isPublic: true
    }
];

const seedTemplates = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Template Seeding...');

        // Load seed data for defaultContent
        const seedData = require('./seedData');

        await Template.deleteMany({});
        console.log('Cleared all templates.');

        // Attach defaultContent from seedData to each template
        const templatesWithContent = templates.map(t => {
            const data = seedData[t.slug];
            return {
                ...t,
                defaultContent: data ? data.content : []
            };
        });

        await Template.insertMany(templatesWithContent);
        console.log(`✅ ${templates.length} Templates successfully seeded.`);

        process.exit();
    } catch (err) {
        console.error('Error seeding templates:', err);
        process.exit(1);
    }
};

seedTemplates();
