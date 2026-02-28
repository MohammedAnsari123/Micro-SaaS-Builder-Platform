const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Tool = require('../models/Tool');
const Tenant = require('../models/Tenant');

dotenv.config({ path: path.join(__dirname, '../.env') });

const toolsData = [
    // ── AI & Machine Learning (1-5) ──
    {
        name: 'AI Content Writer', description: 'Generate blog posts, social copy, and ad headlines using AI-powered language models.', category: 'AI Tool', tags: ['AI', 'Writing', 'GPT', 'Marketing'], isPublic: true, isPremium: false, price: 0, rating: 4.8, reviewsCount: 312, clonesCount: 5420,
        versions: [{ version: 1, schemas: [{ tableName: 'Generations', fields: [{ name: 'prompt', type: 'string', required: true }, { name: 'output', type: 'string', required: true }, { name: 'type', type: 'string', required: true }] }], pages: ['Generator', 'History'], instances: [{ moduleType: 'custom', moduleSlug: 'ai_gen', pageName: 'Generator', collectionName: 'generations', config: {} }] }]
    },

    {
        name: 'Image Classifier Pro', description: 'Upload images and get AI-powered classification, tagging, and object detection results.', category: 'AI Tool', tags: ['AI', 'Vision', 'ML', 'Images'], isPublic: true, isPremium: true, price: 3900, rating: 4.5, reviewsCount: 87, clonesCount: 1230,
        versions: [{ version: 1, schemas: [{ tableName: 'Classifications', fields: [{ name: 'imageUrl', type: 'string', required: true }, { name: 'labels', type: 'string', required: true }, { name: 'confidence', type: 'number', required: true }] }], pages: ['Upload', 'Results'], instances: [{ moduleType: 'custom', moduleSlug: 'classifier', pageName: 'Upload', collectionName: 'classifications', config: {} }] }]
    },

    {
        name: 'Chatbot Builder', description: 'Design conversational AI chatbots with flow diagrams, intent matching, and deployment widgets.', category: 'AI Tool', tags: ['Chatbot', 'NLP', 'Conversational', 'Automation'], isPublic: true, isPremium: true, price: 5900, rating: 4.7, reviewsCount: 156, clonesCount: 2890,
        versions: [{ version: 1, schemas: [{ tableName: 'Flows', fields: [{ name: 'name', type: 'string', required: true }, { name: 'nodes', type: 'number', required: false }, { name: 'status', type: 'string', required: true }] }], pages: ['Flow Builder', 'Intents', 'Deploy'], instances: [{ moduleType: 'custom', moduleSlug: 'flow_builder', pageName: 'Flow Builder', collectionName: 'flows', config: {} }] }]
    },

    {
        name: 'Sentiment Analyzer', description: 'Analyze customer feedback, reviews, and social mentions for sentiment scoring and trend detection.', category: 'AI Tool', tags: ['NLP', 'Sentiment', 'Reviews', 'Analytics'], isPublic: true, isPremium: false, price: 0, rating: 4.3, reviewsCount: 64, clonesCount: 980,
        versions: [{ version: 1, schemas: [{ tableName: 'Analyses', fields: [{ name: 'text', type: 'string', required: true }, { name: 'sentiment', type: 'string', required: true }, { name: 'score', type: 'number', required: true }] }], pages: ['Analyze', 'Reports'], instances: [{ moduleType: 'custom', moduleSlug: 'analyzer', pageName: 'Analyze', collectionName: 'analyses', config: {} }] }]
    },

    {
        name: 'AI Resume Screener', description: 'Automatically parse and rank resumes using AI to find the best candidates faster.', category: 'AI Tool', tags: ['AI', 'HR', 'Recruitment', 'Resume'], isPublic: true, isPremium: true, price: 4900, rating: 4.6, reviewsCount: 98, clonesCount: 1540,
        versions: [{ version: 1, schemas: [{ tableName: 'Resumes', fields: [{ name: 'candidateName', type: 'string', required: true }, { name: 'skills', type: 'string', required: true }, { name: 'matchScore', type: 'number', required: true }, { name: 'status', type: 'string', required: true }] }], pages: ['Upload', 'Rankings', 'Shortlist'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Rankings', collectionName: 'resumes', config: {} }] }]
    },

    // ── Sales & CRM (6-10) ──
    {
        name: 'Startup CRM', description: 'Lightweight CRM for startups. Manage contacts, track deals, and close more sales.', category: 'Sales', tags: ['CRM', 'B2B', 'Contacts', 'Deals'], isPublic: true, isPremium: false, price: 0, rating: 4.4, reviewsCount: 245, clonesCount: 4120,
        versions: [{ version: 1, schemas: [{ tableName: 'Contacts', fields: [{ name: 'name', type: 'string', required: true }, { name: 'email', type: 'string', required: true, unique: true }, { name: 'company', type: 'string', required: false }] }], pages: ['Dashboard', 'Contacts', 'Deals'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Contacts', collectionName: 'contacts', config: {} }] }]
    },

    {
        name: 'Lead Magnet Pro', description: 'Capture, score, and nurture leads with smart forms, email drips, and conversion tracking.', category: 'Sales', tags: ['Leads', 'Funnel', 'Capture', 'Nurture'], isPublic: true, isPremium: true, price: 2900, rating: 4.2, reviewsCount: 78, clonesCount: 1650,
        versions: [{ version: 1, schemas: [{ tableName: 'Leads', fields: [{ name: 'name', type: 'string', required: true }, { name: 'email', type: 'string', required: true }, { name: 'source', type: 'string', required: true }, { name: 'score', type: 'number', required: false }] }], pages: ['Dashboard', 'Leads', 'Forms'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Leads', collectionName: 'leads', config: {} }] }]
    },

    {
        name: 'Sales Pipeline Tracker', description: 'Visual pipeline management with drag-and-drop deal stages, forecasting, and win-rate analytics.', category: 'Sales', tags: ['Pipeline', 'Forecast', 'Revenue', 'Deals'], isPublic: true, isPremium: true, price: 3900, rating: 4.6, reviewsCount: 134, clonesCount: 2780,
        versions: [{ version: 1, schemas: [{ tableName: 'Deals', fields: [{ name: 'title', type: 'string', required: true }, { name: 'value', type: 'number', required: true }, { name: 'stage', type: 'string', required: true }, { name: 'owner', type: 'string', required: false }] }], pages: ['Pipeline', 'Deals', 'Forecast'], instances: [{ moduleType: 'kanban_board', moduleSlug: 'kanban', pageName: 'Pipeline', collectionName: 'deals', config: {} }] }]
    },

    {
        name: 'Proposal Generator', description: 'Create professional proposals with templates, e-signatures, real-time tracking, and client portals.', category: 'Sales', tags: ['Proposals', 'Quotes', 'Documents', 'E-Sign'], isPublic: true, isPremium: false, price: 0, rating: 4.1, reviewsCount: 56, clonesCount: 890,
        versions: [{ version: 1, schemas: [{ tableName: 'Proposals', fields: [{ name: 'title', type: 'string', required: true }, { name: 'client', type: 'string', required: true }, { name: 'amount', type: 'number', required: true }, { name: 'status', type: 'string', required: true }] }], pages: ['Dashboard', 'Proposals', 'Templates'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Proposals', collectionName: 'proposals', config: {} }] }]
    },

    {
        name: 'Commission Calculator', description: 'Track sales rep performance, calculate commissions, and manage payout schedules automatically.', category: 'Sales', tags: ['Commission', 'Payouts', 'Sales Reps', 'Performance'], isPublic: true, isPremium: true, price: 1900, rating: 4.0, reviewsCount: 42, clonesCount: 670,
        versions: [{ version: 1, schemas: [{ tableName: 'SalesReps', fields: [{ name: 'name', type: 'string', required: true }, { name: 'totalSales', type: 'number', required: true }, { name: 'commissionRate', type: 'number', required: true }, { name: 'payout', type: 'number', required: false }] }], pages: ['Dashboard', 'Reps', 'Payouts'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Reps', collectionName: 'salesreps', config: {} }] }]
    },

    // ── Marketing & Content (11-15) ──
    {
        name: 'Email Campaign Manager', description: 'Design, schedule, and track email marketing campaigns with drag-and-drop editor and analytics.', category: 'Marketing', tags: ['Email', 'Campaigns', 'Newsletter', 'Automation'], isPublic: true, isPremium: true, price: 2900, rating: 4.5, reviewsCount: 189, clonesCount: 3450,
        versions: [{ version: 1, schemas: [{ tableName: 'Campaigns', fields: [{ name: 'name', type: 'string', required: true }, { name: 'subject', type: 'string', required: true }, { name: 'sentCount', type: 'number', required: false }, { name: 'openRate', type: 'number', required: false }] }], pages: ['Dashboard', 'Campaigns', 'Analytics'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Campaigns', collectionName: 'campaigns', config: {} }] }]
    },

    {
        name: 'SEO Rank Tracker', description: 'Monitor keyword rankings, track SERP positions, analyze competitors, and get optimization suggestions.', category: 'Marketing', tags: ['SEO', 'Keywords', 'Rankings', 'SERP'], isPublic: true, isPremium: true, price: 3900, rating: 4.4, reviewsCount: 112, clonesCount: 2100,
        versions: [{ version: 1, schemas: [{ tableName: 'Keywords', fields: [{ name: 'keyword', type: 'string', required: true }, { name: 'position', type: 'number', required: true }, { name: 'volume', type: 'number', required: false }, { name: 'difficulty', type: 'number', required: false }] }], pages: ['Dashboard', 'Keywords', 'Competitors'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Keywords', collectionName: 'keywords', config: {} }] }]
    },

    {
        name: 'Social Media Scheduler', description: 'Schedule posts across multiple platforms with visual content calendar and engagement tracking.', category: 'Marketing', tags: ['Social', 'Scheduler', 'Content', 'Calendar'], isPublic: true, isPremium: false, price: 0, rating: 4.3, reviewsCount: 167, clonesCount: 2890,
        versions: [{ version: 1, schemas: [{ tableName: 'ScheduledPosts', fields: [{ name: 'content', type: 'string', required: true }, { name: 'platform', type: 'string', required: true }, { name: 'scheduledDate', type: 'date', required: true }, { name: 'status', type: 'string', required: true }] }], pages: ['Calendar', 'Posts', 'Analytics'], instances: [{ moduleType: 'kanban_board', moduleSlug: 'kanban', pageName: 'Calendar', collectionName: 'scheduledposts', config: {} }] }]
    },

    {
        name: 'Blog CMS', description: 'Headless blog content management with rich editor, categories, SEO meta, and publishing workflows.', category: 'Marketing', tags: ['Blog', 'CMS', 'Content', 'Publishing'], isPublic: true, isPremium: false, price: 0, rating: 4.6, reviewsCount: 234, clonesCount: 4560,
        versions: [{ version: 1, schemas: [{ tableName: 'Articles', fields: [{ name: 'title', type: 'string', required: true }, { name: 'slug', type: 'string', required: true, unique: true }, { name: 'status', type: 'string', required: true }, { name: 'author', type: 'string', required: true }] }], pages: ['Dashboard', 'Articles', 'Categories'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Articles', collectionName: 'articles', config: {} }] }]
    },

    {
        name: 'Link Shortener', description: 'Custom branded short links with click analytics, QR code generation, and UTM parameter tracking.', category: 'Marketing', tags: ['Links', 'URL', 'Analytics', 'QR Code'], isPublic: true, isPremium: false, price: 0, rating: 4.2, reviewsCount: 89, clonesCount: 1780,
        versions: [{ version: 1, schemas: [{ tableName: 'Links', fields: [{ name: 'originalUrl', type: 'string', required: true }, { name: 'shortCode', type: 'string', required: true, unique: true }, { name: 'clicks', type: 'number', required: false }, { name: 'createdAt', type: 'date', required: false }] }], pages: ['Dashboard', 'Links', 'Analytics'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Links', collectionName: 'links', config: {} }] }]
    },

    // ── Finance & Accounting (16-20) ──
    {
        name: 'Invoice Generator', description: 'Create professional invoices, track payments, handle recurring billing, and export financial reports.', category: 'Finance', tags: ['Invoice', 'Billing', 'Payments', 'Accounting'], isPublic: true, isPremium: true, price: 2900, rating: 4.7, reviewsCount: 278, clonesCount: 4890,
        versions: [{ version: 1, schemas: [{ tableName: 'Invoices', fields: [{ name: 'invoiceNo', type: 'string', required: true, unique: true }, { name: 'client', type: 'string', required: true }, { name: 'amount', type: 'number', required: true }, { name: 'status', type: 'string', required: true }] }], pages: ['Dashboard', 'Invoices', 'Clients'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Invoices', collectionName: 'invoices', config: {} }] }]
    },

    {
        name: 'Expense Tracker', description: 'Log expenses, categorize spending, scan receipts, and visualize monthly budget breakdowns.', category: 'Finance', tags: ['Expenses', 'Budget', 'Receipts', 'Spending'], isPublic: true, isPremium: false, price: 0, rating: 4.4, reviewsCount: 198, clonesCount: 3560,
        versions: [{ version: 1, schemas: [{ tableName: 'Expenses', fields: [{ name: 'title', type: 'string', required: true }, { name: 'amount', type: 'number', required: true }, { name: 'category', type: 'string', required: true }, { name: 'date', type: 'date', required: true }] }], pages: ['Dashboard', 'Expenses', 'Reports'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Expenses', collectionName: 'expenses', config: {} }] }]
    },

    {
        name: 'Subscription Billing', description: 'Manage subscription plans, process recurring payments, handle upgrades/downgrades, and track MRR.', category: 'Finance', tags: ['SaaS', 'Subscription', 'MRR', 'Billing'], isPublic: true, isPremium: true, price: 4900, rating: 4.5, reviewsCount: 145, clonesCount: 2340,
        versions: [{ version: 1, schemas: [{ tableName: 'Subscriptions', fields: [{ name: 'customerEmail', type: 'string', required: true }, { name: 'plan', type: 'string', required: true }, { name: 'amount', type: 'number', required: true }, { name: 'status', type: 'string', required: true }] }], pages: ['Dashboard', 'Subscribers', 'Plans'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Subscribers', collectionName: 'subscriptions', config: {} }] }]
    },

    {
        name: 'Tax Calculator', description: 'Calculate income tax, GST, and deductions with configurable tax slabs and downloadable reports.', category: 'Finance', tags: ['Tax', 'GST', 'Calculator', 'Compliance'], isPublic: true, isPremium: false, price: 0, rating: 4.1, reviewsCount: 67, clonesCount: 1120,
        versions: [{ version: 1, schemas: [{ tableName: 'TaxRecords', fields: [{ name: 'income', type: 'number', required: true }, { name: 'deductions', type: 'number', required: false }, { name: 'taxPayable', type: 'number', required: true }, { name: 'year', type: 'string', required: true }] }], pages: ['Calculator', 'Records', 'Reports'], instances: [{ moduleType: 'custom', moduleSlug: 'calculator', pageName: 'Calculator', collectionName: 'taxrecords', config: {} }] }]
    },

    {
        name: 'Crypto Portfolio', description: 'Track cryptocurrency holdings, monitor real-time prices, view P&L, and set price alerts.', category: 'Finance', tags: ['Crypto', 'Portfolio', 'Bitcoin', 'Trading'], isPublic: true, isPremium: true, price: 1900, rating: 4.3, reviewsCount: 134, clonesCount: 2670,
        versions: [{ version: 1, schemas: [{ tableName: 'Holdings', fields: [{ name: 'coin', type: 'string', required: true }, { name: 'amount', type: 'number', required: true }, { name: 'buyPrice', type: 'number', required: true }, { name: 'currentPrice', type: 'number', required: false }] }], pages: ['Dashboard', 'Holdings', 'Alerts'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Holdings', collectionName: 'holdings', config: {} }] }]
    },

    // ── HR & Productivity (21-25) ──
    {
        name: 'Time Tracker', description: 'Track time spent on tasks, generate timesheets, calculate billable hours, and export payroll data.', category: 'Productivity', tags: ['Time', 'Timesheet', 'Billable', 'Tracking'], isPublic: true, isPremium: false, price: 0, rating: 4.5, reviewsCount: 267, clonesCount: 4230,
        versions: [{ version: 1, schemas: [{ tableName: 'TimeEntries', fields: [{ name: 'task', type: 'string', required: true }, { name: 'hours', type: 'number', required: true }, { name: 'date', type: 'date', required: true }, { name: 'project', type: 'string', required: false }] }], pages: ['Timer', 'Entries', 'Reports'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Entries', collectionName: 'timeentries', config: {} }] }]
    },

    {
        name: 'OKR Manager', description: 'Set objectives and key results, track progress, cascade goals, and run quarterly reviews.', category: 'Productivity', tags: ['OKR', 'Goals', 'Objectives', 'Performance'], isPublic: true, isPremium: true, price: 2900, rating: 4.4, reviewsCount: 89, clonesCount: 1560,
        versions: [{ version: 1, schemas: [{ tableName: 'Objectives', fields: [{ name: 'title', type: 'string', required: true }, { name: 'owner', type: 'string', required: true }, { name: 'progress', type: 'number', required: false }, { name: 'quarter', type: 'string', required: true }] }], pages: ['Dashboard', 'Objectives', 'Key Results'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Objectives', collectionName: 'objectives', config: {} }] }]
    },

    {
        name: 'Meeting Notes', description: 'Capture meeting agendas, assign action items, track follow-ups, and search past meeting records.', category: 'Productivity', tags: ['Meetings', 'Notes', 'Actions', 'Minutes'], isPublic: true, isPremium: false, price: 0, rating: 4.2, reviewsCount: 156, clonesCount: 2890,
        versions: [{ version: 1, schemas: [{ tableName: 'Meetings', fields: [{ name: 'title', type: 'string', required: true }, { name: 'date', type: 'date', required: true }, { name: 'attendees', type: 'string', required: false }, { name: 'notes', type: 'string', required: false }] }], pages: ['Meetings', 'Actions', 'Archive'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Meetings', collectionName: 'meetings', config: {} }] }]
    },

    {
        name: 'Employee Onboarding', description: 'Automate new hire onboarding with checklists, document collection, training schedules, and buddy assignments.', category: 'Human Resources', tags: ['Onboarding', 'HR', 'Checklist', 'Training'], isPublic: true, isPremium: true, price: 3900, rating: 4.6, reviewsCount: 78, clonesCount: 1340,
        versions: [{ version: 1, schemas: [{ tableName: 'NewHires', fields: [{ name: 'name', type: 'string', required: true }, { name: 'department', type: 'string', required: true }, { name: 'startDate', type: 'date', required: true }, { name: 'progress', type: 'number', required: false }] }], pages: ['Dashboard', 'New Hires', 'Checklists'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'New Hires', collectionName: 'newhires', config: {} }] }]
    },

    {
        name: 'Habit Tracker', description: 'Build positive habits with daily tracking, streak visualization, reminders, and completion analytics.', category: 'Productivity', tags: ['Habits', 'Streaks', 'Self-Improvement', 'Daily'], isPublic: true, isPremium: false, price: 0, rating: 4.7, reviewsCount: 345, clonesCount: 6780,
        versions: [{ version: 1, schemas: [{ tableName: 'Habits', fields: [{ name: 'name', type: 'string', required: true }, { name: 'frequency', type: 'string', required: true }, { name: 'streak', type: 'number', required: false }, { name: 'completed', type: 'boolean', required: false }] }], pages: ['Today', 'Habits', 'Stats'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Habits', collectionName: 'habits', config: {} }] }]
    },

    // ── Dev Tools & Engineering (26-30) ──
    {
        name: 'API Documentation', description: 'Generate interactive API docs with endpoint definitions, request/response examples, and testing console.', category: 'Dev Tools', tags: ['API', 'Docs', 'REST', 'Swagger'], isPublic: true, isPremium: false, price: 0, rating: 4.6, reviewsCount: 234, clonesCount: 4120,
        versions: [{ version: 1, schemas: [{ tableName: 'Endpoints', fields: [{ name: 'method', type: 'string', required: true }, { name: 'path', type: 'string', required: true }, { name: 'description', type: 'string', required: false }, { name: 'group', type: 'string', required: false }] }], pages: ['Endpoints', 'Groups', 'Testing'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Endpoints', collectionName: 'endpoints', config: {} }] }]
    },

    {
        name: 'Bug Tracker', description: 'Track bugs and issues with severity levels, assignees, reproduction steps, and resolution timelines.', category: 'Dev Tools', tags: ['Bugs', 'Issues', 'QA', 'Testing'], isPublic: true, isPremium: false, price: 0, rating: 4.5, reviewsCount: 189, clonesCount: 3450,
        versions: [{ version: 1, schemas: [{ tableName: 'Bugs', fields: [{ name: 'title', type: 'string', required: true }, { name: 'severity', type: 'string', required: true }, { name: 'status', type: 'string', required: true }, { name: 'assignee', type: 'string', required: false }] }], pages: ['Dashboard', 'Bugs', 'Sprint Board'], instances: [{ moduleType: 'kanban_board', moduleSlug: 'kanban', pageName: 'Sprint Board', collectionName: 'bugs', config: {} }] }]
    },

    {
        name: 'Feature Request Board', description: 'Collect user feature requests, let users vote, prioritize via scoring, and track implementation roadmap.', category: 'Dev Tools', tags: ['Features', 'Voting', 'Roadmap', 'Feedback'], isPublic: true, isPremium: true, price: 1900, rating: 4.4, reviewsCount: 112, clonesCount: 2100,
        versions: [{ version: 1, schemas: [{ tableName: 'Requests', fields: [{ name: 'title', type: 'string', required: true }, { name: 'description', type: 'string', required: false }, { name: 'votes', type: 'number', required: false }, { name: 'status', type: 'string', required: true }] }], pages: ['Board', 'Requests', 'Roadmap'], instances: [{ moduleType: 'kanban_board', moduleSlug: 'kanban', pageName: 'Board', collectionName: 'requests', config: {} }] }]
    },

    {
        name: 'Changelog Publisher', description: 'Maintain a public changelog with versioned entries, categories, and subscriber notifications.', category: 'Dev Tools', tags: ['Changelog', 'Updates', 'Releases', 'Communication'], isPublic: true, isPremium: false, price: 0, rating: 4.2, reviewsCount: 67, clonesCount: 1230,
        versions: [{ version: 1, schemas: [{ tableName: 'Entries', fields: [{ name: 'version', type: 'string', required: true }, { name: 'title', type: 'string', required: true }, { name: 'type', type: 'string', required: true }, { name: 'date', type: 'date', required: true }] }], pages: ['Entries', 'Archive', 'Settings'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Entries', collectionName: 'entries', config: {} }] }]
    },

    {
        name: 'Status Page Monitor', description: 'Public status page for services with uptime monitoring, incident management, and subscriber alerts.', category: 'Dev Tools', tags: ['Status', 'Uptime', 'Incidents', 'Monitoring'], isPublic: true, isPremium: true, price: 2900, rating: 4.5, reviewsCount: 145, clonesCount: 2560,
        versions: [{ version: 1, schemas: [{ tableName: 'Services', fields: [{ name: 'name', type: 'string', required: true }, { name: 'status', type: 'string', required: true }, { name: 'uptime', type: 'number', required: false }, { name: 'lastChecked', type: 'date', required: false }] }], pages: ['Status', 'Services', 'Incidents'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Services', collectionName: 'services', config: {} }] }]
    },

    // ── Communication & Support (31-35) ──
    {
        name: 'Live Chat Widget', description: 'Embeddable live chat for websites with agent routing, canned replies, and visitor tracking.', category: 'Communication', tags: ['Chat', 'Live', 'Support', 'Widget'], isPublic: true, isPremium: true, price: 3900, rating: 4.6, reviewsCount: 167, clonesCount: 3120,
        versions: [{ version: 1, schemas: [{ tableName: 'Conversations', fields: [{ name: 'visitorName', type: 'string', required: false }, { name: 'status', type: 'string', required: true }, { name: 'agent', type: 'string', required: false }, { name: 'lastMessage', type: 'string', required: false }] }], pages: ['Inbox', 'Conversations', 'Settings'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Conversations', collectionName: 'conversations', config: {} }] }]
    },

    {
        name: 'Survey Builder', description: 'Create multi-question surveys with various input types, branching logic, and response analytics.', category: 'Communication', tags: ['Survey', 'Forms', 'Feedback', 'Questionnaire'], isPublic: true, isPremium: false, price: 0, rating: 4.3, reviewsCount: 198, clonesCount: 3670,
        versions: [{ version: 1, schemas: [{ tableName: 'Surveys', fields: [{ name: 'title', type: 'string', required: true }, { name: 'questions', type: 'number', required: false }, { name: 'responses', type: 'number', required: false }, { name: 'status', type: 'string', required: true }] }], pages: ['Builder', 'Surveys', 'Results'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Surveys', collectionName: 'surveys', config: {} }] }]
    },

    {
        name: 'Feedback Collector', description: 'Collect in-product feedback with rating widgets, screenshot capture, and priority triage dashboard.', category: 'Communication', tags: ['Feedback', 'NPS', 'Rating', 'User Voice'], isPublic: true, isPremium: false, price: 0, rating: 4.1, reviewsCount: 89, clonesCount: 1540,
        versions: [{ version: 1, schemas: [{ tableName: 'Feedback', fields: [{ name: 'user', type: 'string', required: false }, { name: 'rating', type: 'number', required: true }, { name: 'comment', type: 'string', required: false }, { name: 'page', type: 'string', required: false }] }], pages: ['Dashboard', 'Feedback', 'Trends'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Feedback', collectionName: 'feedback', config: {} }] }]
    },

    {
        name: 'FAQ Knowledge Base', description: 'Self-service knowledge base with categorized articles, search, analytics, and helpfulness rating.', category: 'Communication', tags: ['FAQ', 'Knowledge Base', 'Help', 'Self-Service'], isPublic: true, isPremium: false, price: 0, rating: 4.4, reviewsCount: 156, clonesCount: 2780,
        versions: [{ version: 1, schemas: [{ tableName: 'FAQArticles', fields: [{ name: 'question', type: 'string', required: true }, { name: 'answer', type: 'string', required: true }, { name: 'category', type: 'string', required: true }, { name: 'views', type: 'number', required: false }] }], pages: ['Articles', 'Categories', 'Analytics'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Articles', collectionName: 'faqarticles', config: {} }] }]
    },

    {
        name: 'Notification Center', description: 'Multi-channel notification management: email, SMS, push, and in-app alerts with delivery tracking.', category: 'Communication', tags: ['Notifications', 'Push', 'SMS', 'Alerts'], isPublic: true, isPremium: true, price: 3900, rating: 4.5, reviewsCount: 123, clonesCount: 2340,
        versions: [{ version: 1, schemas: [{ tableName: 'Notifications', fields: [{ name: 'title', type: 'string', required: true }, { name: 'channel', type: 'string', required: true }, { name: 'status', type: 'string', required: true }, { name: 'sentAt', type: 'date', required: false }] }], pages: ['Dashboard', 'Notifications', 'Channels'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Notifications', collectionName: 'notifications', config: {} }] }]
    },

    // ── Design & Creativity (36-37) ──
    {
        name: 'Brand Kit Manager', description: 'Centralize brand assets: logos, colors, fonts, guidelines, and downloadable brand packages.', category: 'Design', tags: ['Brand', 'Assets', 'Logo', 'Guidelines'], isPublic: true, isPremium: true, price: 1900, rating: 4.3, reviewsCount: 78, clonesCount: 1340,
        versions: [{ version: 1, schemas: [{ tableName: 'Assets', fields: [{ name: 'name', type: 'string', required: true }, { name: 'type', type: 'string', required: true }, { name: 'url', type: 'string', required: true }, { name: 'version', type: 'string', required: false }] }], pages: ['Assets', 'Colors', 'Guidelines'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Assets', collectionName: 'assets', config: {} }] }]
    },

    {
        name: 'Wireframe Toolkit', description: 'Document UI wireframes and design specs with component library, annotation tools, and version history.', category: 'Design', tags: ['Wireframe', 'UI', 'Prototype', 'Design'], isPublic: true, isPremium: false, price: 0, rating: 4.2, reviewsCount: 56, clonesCount: 980,
        versions: [{ version: 1, schemas: [{ tableName: 'Wireframes', fields: [{ name: 'name', type: 'string', required: true }, { name: 'page', type: 'string', required: true }, { name: 'status', type: 'string', required: true }, { name: 'version', type: 'number', required: false }] }], pages: ['Library', 'Wireframes', 'Components'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Wireframes', collectionName: 'wireframes', config: {} }] }]
    },

    // ── Automation & Integration (38-39) ──
    {
        name: 'Workflow Automator', description: 'Visual workflow builder with triggers, conditions, actions, and integrations. No-code automation engine.', category: 'Automation', tags: ['Workflow', 'No-Code', 'Automation', 'Integration'], isPublic: true, isPremium: true, price: 5900, rating: 4.7, reviewsCount: 234, clonesCount: 4560,
        versions: [{ version: 1, schemas: [{ tableName: 'Workflows', fields: [{ name: 'name', type: 'string', required: true }, { name: 'trigger', type: 'string', required: true }, { name: 'steps', type: 'number', required: false }, { name: 'status', type: 'string', required: true }] }], pages: ['Builder', 'Workflows', 'Logs'], instances: [{ moduleType: 'custom', moduleSlug: 'flow_builder', pageName: 'Builder', collectionName: 'workflows', config: {} }] }]
    },

    {
        name: 'Webhook Manager', description: 'Manage incoming and outgoing webhooks with payload inspection, retry logic, and delivery logs.', category: 'Automation', tags: ['Webhooks', 'API', 'Events', 'Integration'], isPublic: true, isPremium: false, price: 0, rating: 4.1, reviewsCount: 67, clonesCount: 1120,
        versions: [{ version: 1, schemas: [{ tableName: 'Webhooks', fields: [{ name: 'url', type: 'string', required: true }, { name: 'event', type: 'string', required: true }, { name: 'status', type: 'string', required: true }, { name: 'lastTriggered', type: 'date', required: false }] }], pages: ['Webhooks', 'Logs', 'Settings'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Webhooks', collectionName: 'webhooks', config: {} }] }]
    },

    // ── Miscellaneous (40) ──
    {
        name: 'Recipe Cookbook', description: 'Organize recipes with ingredients, steps, nutritional info, meal planning, and shopping list generation.', category: 'Lifestyle', tags: ['Recipes', 'Cooking', 'Meal Plan', 'Food'], isPublic: true, isPremium: false, price: 0, rating: 4.8, reviewsCount: 456, clonesCount: 8920,
        versions: [{ version: 1, schemas: [{ tableName: 'Recipes', fields: [{ name: 'title', type: 'string', required: true }, { name: 'cuisine', type: 'string', required: false }, { name: 'prepTime', type: 'number', required: false }, { name: 'servings', type: 'number', required: false }] }], pages: ['Recipes', 'Meal Plan', 'Shopping List'], instances: [{ moduleType: 'crud_table', moduleSlug: 'crud_table', pageName: 'Recipes', collectionName: 'recipes', config: {} }] }]
    }
];

const seedTools = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Tool Seeding...');

        let tenants = await Tenant.find();
        let creatorId = null;
        if (tenants.length === 0) {
            console.log('No tenants found. Creating a default System Admin tenant...');
            const sysTenant = await Tenant.create({ name: 'System Admin', plan: 'enterprise' });
            creatorId = sysTenant._id;
        } else {
            creatorId = tenants[0]._id;
        }

        await Tool.deleteMany({});
        console.log('Cleared all tools.');

        const toolsWithCreator = toolsData.map(t => ({
            ...t,
            tenantId: creatorId,
            currentVersion: 1
        }));

        await Tool.insertMany(toolsWithCreator);
        console.log(`${toolsData.length} Tools successfully imported into the Ecosystem Marketplace.`);

        process.exit();
    } catch (err) {
        console.error('Error seeding tools:', err);
        process.exit(1);
    }
};

seedTools();
