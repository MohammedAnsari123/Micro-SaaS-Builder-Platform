const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Template = require('../models/Template');
const Tenant = require('../models/Tenant');

dotenv.config({ path: path.join(__dirname, '../.env') });

const templates = [
    // ─────────────── 1. CRM Pro ───────────────
    {
        name: 'CRM Pro',
        slug: 'crm-pro',
        description: 'Enterprise-grade Customer Relationship Management with lead scoring, deal pipelines, activity timeline, and team collaboration.',
        colorTheme: 'blue',
        category: 'Sales',
        tags: ['CRM', 'B2B', 'Sales', 'Pipeline'],
        isPublic: true, isPremium: false, price: 0,
        schemaConfig: {
            tables: [
                { name: 'Leads', fields: [{ name: 'name', type: 'string', required: true }, { name: 'email', type: 'string', required: true, unique: true }, { name: 'phone', type: 'string', required: false }, { name: 'status', type: 'string', required: true }, { name: 'score', type: 'number', required: false }] },
                { name: 'Deals', fields: [{ name: 'title', type: 'string', required: true }, { name: 'amount', type: 'number', required: true }, { name: 'stage', type: 'string', required: true }, { name: 'probability', type: 'number', required: false }, { name: 'expectedCloseDate', type: 'date', required: false }] },
                { name: 'Activities', fields: [{ name: 'type', type: 'string', required: true }, { name: 'subject', type: 'string', required: true }, { name: 'notes', type: 'string', required: false }, { name: 'dueDate', type: 'date', required: true }] },
                { name: 'Companies', fields: [{ name: 'name', type: 'string', required: true }, { name: 'industry', type: 'string', required: false }, { name: 'website', type: 'string', required: false }, { name: 'revenue', type: 'number', required: false }] }
            ]
        },
        layoutJSON: { sidebar: true, header: true, navigation: ['Dashboard', 'Leads', 'Deals', 'Activities', 'Companies'] },
        defaultPages: [
            { name: 'Dashboard', type: 'chart_dashboard', collection: 'leads' },
            { name: 'Leads', type: 'crud_table', collection: 'leads' },
            { name: 'Deals', type: 'kanban_board', collection: 'deals' },
            { name: 'Activities', type: 'crud_table', collection: 'activities' },
            { name: 'Companies', type: 'crud_table', collection: 'companies' }
        ]
    },

    // ─────────────── 2. TaskMaster Agile ───────────────
    {
        name: 'TaskMaster Agile',
        slug: 'taskmaster-agile',
        description: 'Advanced project management with Kanban boards, sprint planning, burndown charts, backlog grooming, and team velocity tracking.',
        colorTheme: 'emerald',
        category: 'Project Management',
        tags: ['Agile', 'Scrum', 'Kanban', 'Sprint'],
        isPublic: true, isPremium: true, price: 2900,
        schemaConfig: {
            tables: [
                { name: 'Tasks', fields: [{ name: 'title', type: 'string', required: true }, { name: 'description', type: 'string', required: false }, { name: 'points', type: 'number', required: true }, { name: 'status', type: 'string', required: true }, { name: 'assignee', type: 'string', required: false }, { name: 'priority', type: 'string', required: true }] },
                { name: 'Sprints', fields: [{ name: 'name', type: 'string', required: true }, { name: 'startDate', type: 'date', required: true }, { name: 'endDate', type: 'date', required: true }, { name: 'goal', type: 'string', required: false }, { name: 'velocity', type: 'number', required: false }] },
                { name: 'Epics', fields: [{ name: 'title', type: 'string', required: true }, { name: 'color', type: 'string', required: false }, { name: 'progress', type: 'number', required: false }] }
            ]
        },
        layoutJSON: { sidebar: true, header: true, navigation: ['Agile Board', 'Backlog', 'Sprints', 'Epics', 'Reports'] },
        defaultPages: [
            { name: 'Agile Board', type: 'kanban_board', collection: 'tasks' },
            { name: 'Backlog', type: 'crud_table', collection: 'tasks' },
            { name: 'Sprints', type: 'crud_table', collection: 'sprints' },
            { name: 'Epics', type: 'crud_table', collection: 'epics' },
            { name: 'Reports', type: 'chart_dashboard', collection: 'sprints' }
        ]
    },

    // ─────────────── 3. Inventory Hub ───────────────
    {
        name: 'Inventory Hub',
        slug: 'inventory-hub',
        description: 'Complete inventory management with product catalog, stock tracking, supplier management, purchase orders, and warehouse analytics.',
        colorTheme: 'amber',
        category: 'Inventory',
        tags: ['Stock', 'Warehouse', 'Supply Chain', 'Products'],
        isPublic: true, isPremium: true, price: 4900,
        schemaConfig: {
            tables: [
                { name: 'Products', fields: [{ name: 'sku', type: 'string', required: true, unique: true }, { name: 'name', type: 'string', required: true }, { name: 'quantity', type: 'number', required: true }, { name: 'price', type: 'number', required: true }, { name: 'category', type: 'string', required: false }] },
                { name: 'Suppliers', fields: [{ name: 'name', type: 'string', required: true }, { name: 'contactEmail', type: 'string', required: true }, { name: 'phone', type: 'string', required: false }, { name: 'country', type: 'string', required: false }] },
                { name: 'PurchaseOrders', fields: [{ name: 'orderNumber', type: 'string', required: true, unique: true }, { name: 'supplier', type: 'string', required: true }, { name: 'totalAmount', type: 'number', required: true }, { name: 'status', type: 'string', required: true }, { name: 'expectedDelivery', type: 'date', required: false }] },
                { name: 'Warehouses', fields: [{ name: 'name', type: 'string', required: true }, { name: 'location', type: 'string', required: true }, { name: 'capacity', type: 'number', required: false }] }
            ]
        },
        layoutJSON: { sidebar: true, header: true, navigation: ['Dashboard', 'Products', 'Suppliers', 'Orders', 'Warehouses'] },
        defaultPages: [
            { name: 'Dashboard', type: 'chart_dashboard', collection: 'products' },
            { name: 'Products', type: 'crud_table', collection: 'products' },
            { name: 'Suppliers', type: 'crud_table', collection: 'suppliers' },
            { name: 'Orders', type: 'crud_table', collection: 'purchaseorders' },
            { name: 'Warehouses', type: 'crud_table', collection: 'warehouses' }
        ]
    },

    // ─────────────── 4. HelpDesk Pro ───────────────
    {
        name: 'HelpDesk Pro',
        slug: 'helpdesk-pro',
        description: 'Customer support ticketing with priority queues, SLA tracking, knowledge base, canned responses, and satisfaction surveys.',
        colorTheme: 'violet',
        category: 'Support',
        tags: ['Tickets', 'Support', 'SLA', 'Customer Service'],
        isPublic: true, isPremium: false, price: 0,
        schemaConfig: {
            tables: [
                { name: 'Tickets', fields: [{ name: 'subject', type: 'string', required: true }, { name: 'customerEmail', type: 'string', required: true }, { name: 'priority', type: 'string', required: true }, { name: 'status', type: 'string', required: true }, { name: 'category', type: 'string', required: false }, { name: 'assignedTo', type: 'string', required: false }] },
                { name: 'KnowledgeBase', fields: [{ name: 'title', type: 'string', required: true }, { name: 'content', type: 'string', required: true }, { name: 'category', type: 'string', required: false }, { name: 'views', type: 'number', required: false }] },
                { name: 'CannedResponses', fields: [{ name: 'title', type: 'string', required: true }, { name: 'body', type: 'string', required: true }, { name: 'shortcut', type: 'string', required: false }] }
            ]
        },
        layoutJSON: { sidebar: true, header: true, navigation: ['Dashboard', 'Tickets', 'Knowledge Base', 'Canned Responses', 'Analytics'] },
        defaultPages: [
            { name: 'Dashboard', type: 'chart_dashboard', collection: 'tickets' },
            { name: 'Tickets', type: 'crud_table', collection: 'tickets' },
            { name: 'Knowledge Base', type: 'crud_table', collection: 'knowledgebase' },
            { name: 'Canned Responses', type: 'crud_table', collection: 'cannedresponses' },
            { name: 'Analytics', type: 'chart_dashboard', collection: 'tickets' }
        ]
    },

    // ─────────────── 5. ShopFlow E-Commerce ───────────────
    {
        name: 'ShopFlow E-Commerce',
        slug: 'shopflow-ecommerce',
        description: 'Full-featured online store management with product listings, order processing, customer management, coupon engine, and revenue dashboards.',
        colorTheme: 'rose',
        category: 'E-Commerce',
        tags: ['Shop', 'Orders', 'Products', 'Payments'],
        isPublic: true, isPremium: true, price: 5900,
        schemaConfig: {
            tables: [
                { name: 'Products', fields: [{ name: 'name', type: 'string', required: true }, { name: 'price', type: 'number', required: true }, { name: 'stock', type: 'number', required: true }, { name: 'category', type: 'string', required: false }, { name: 'imageUrl', type: 'string', required: false }] },
                { name: 'Orders', fields: [{ name: 'orderId', type: 'string', required: true, unique: true }, { name: 'customerEmail', type: 'string', required: true }, { name: 'total', type: 'number', required: true }, { name: 'status', type: 'string', required: true }, { name: 'paymentMethod', type: 'string', required: false }] },
                { name: 'Customers', fields: [{ name: 'name', type: 'string', required: true }, { name: 'email', type: 'string', required: true, unique: true }, { name: 'phone', type: 'string', required: false }, { name: 'totalOrders', type: 'number', required: false }] },
                { name: 'Coupons', fields: [{ name: 'code', type: 'string', required: true, unique: true }, { name: 'discount', type: 'number', required: true }, { name: 'type', type: 'string', required: true }, { name: 'expiresAt', type: 'date', required: false }] }
            ]
        },
        layoutJSON: { sidebar: true, header: true, navigation: ['Dashboard', 'Products', 'Orders', 'Customers', 'Coupons'] },
        defaultPages: [
            { name: 'Dashboard', type: 'chart_dashboard', collection: 'orders' },
            { name: 'Products', type: 'crud_table', collection: 'products' },
            { name: 'Orders', type: 'crud_table', collection: 'orders' },
            { name: 'Customers', type: 'crud_table', collection: 'customers' },
            { name: 'Coupons', type: 'crud_table', collection: 'coupons' }
        ]
    },

    // ─────────────── 6. PeopleOps HR ───────────────
    {
        name: 'PeopleOps HR',
        slug: 'peopleops-hr',
        description: 'Human resource management for employee records, leave tracking, payroll summaries, recruitment pipeline, and team directory.',
        colorTheme: 'teal',
        category: 'Human Resources',
        tags: ['HR', 'Employees', 'Payroll', 'Leave'],
        isPublic: true, isPremium: true, price: 3900,
        schemaConfig: {
            tables: [
                { name: 'Employees', fields: [{ name: 'name', type: 'string', required: true }, { name: 'email', type: 'string', required: true, unique: true }, { name: 'department', type: 'string', required: true }, { name: 'role', type: 'string', required: true }, { name: 'joinDate', type: 'date', required: true }, { name: 'salary', type: 'number', required: false }] },
                { name: 'LeaveRequests', fields: [{ name: 'employee', type: 'string', required: true }, { name: 'type', type: 'string', required: true }, { name: 'startDate', type: 'date', required: true }, { name: 'endDate', type: 'date', required: true }, { name: 'status', type: 'string', required: true }] },
                { name: 'Recruitment', fields: [{ name: 'position', type: 'string', required: true }, { name: 'candidateName', type: 'string', required: true }, { name: 'stage', type: 'string', required: true }, { name: 'appliedDate', type: 'date', required: true }] },
                { name: 'Departments', fields: [{ name: 'name', type: 'string', required: true, unique: true }, { name: 'head', type: 'string', required: false }, { name: 'budget', type: 'number', required: false }] }
            ]
        },
        layoutJSON: { sidebar: true, header: true, navigation: ['Dashboard', 'Employees', 'Leave Tracker', 'Recruitment', 'Departments'] },
        defaultPages: [
            { name: 'Dashboard', type: 'chart_dashboard', collection: 'employees' },
            { name: 'Employees', type: 'crud_table', collection: 'employees' },
            { name: 'Leave Tracker', type: 'kanban_board', collection: 'leaverequests' },
            { name: 'Recruitment', type: 'kanban_board', collection: 'recruitment' },
            { name: 'Departments', type: 'crud_table', collection: 'departments' }
        ]
    },

    // ─────────────── 7. FinanceTracker ───────────────
    {
        name: 'FinanceTracker',
        slug: 'finance-tracker',
        description: 'Financial management with expense tracking, invoice generation, budget planning, recurring payments, and profit/loss reporting.',
        colorTheme: 'lime',
        category: 'Finance',
        tags: ['Accounting', 'Invoicing', 'Expenses', 'Budget'],
        isPublic: true, isPremium: false, price: 0,
        schemaConfig: {
            tables: [
                { name: 'Expenses', fields: [{ name: 'title', type: 'string', required: true }, { name: 'amount', type: 'number', required: true }, { name: 'category', type: 'string', required: true }, { name: 'date', type: 'date', required: true }, { name: 'receipt', type: 'string', required: false }] },
                { name: 'Invoices', fields: [{ name: 'invoiceNo', type: 'string', required: true, unique: true }, { name: 'client', type: 'string', required: true }, { name: 'amount', type: 'number', required: true }, { name: 'status', type: 'string', required: true }, { name: 'dueDate', type: 'date', required: true }] },
                { name: 'Budgets', fields: [{ name: 'category', type: 'string', required: true }, { name: 'allocated', type: 'number', required: true }, { name: 'spent', type: 'number', required: false }, { name: 'period', type: 'string', required: true }] },
                { name: 'RecurringPayments', fields: [{ name: 'name', type: 'string', required: true }, { name: 'amount', type: 'number', required: true }, { name: 'frequency', type: 'string', required: true }, { name: 'nextPaymentDate', type: 'date', required: true }] }
            ]
        },
        layoutJSON: { sidebar: true, header: true, navigation: ['Dashboard', 'Expenses', 'Invoices', 'Budgets', 'Recurring'] },
        defaultPages: [
            { name: 'Dashboard', type: 'chart_dashboard', collection: 'expenses' },
            { name: 'Expenses', type: 'crud_table', collection: 'expenses' },
            { name: 'Invoices', type: 'crud_table', collection: 'invoices' },
            { name: 'Budgets', type: 'crud_table', collection: 'budgets' },
            { name: 'Recurring', type: 'crud_table', collection: 'recurringpayments' }
        ]
    },

    // ─────────────── 8. DataPulse Analytics ───────────────
    {
        name: 'DataPulse Analytics',
        slug: 'datapulse-analytics',
        description: 'Business intelligence dashboard with KPI tracking, custom metric definitions, data sources management, automated alerts, and report builder.',
        colorTheme: 'cyan',
        category: 'Analytics',
        tags: ['BI', 'KPI', 'Metrics', 'Reporting'],
        isPublic: true, isPremium: true, price: 6900,
        schemaConfig: {
            tables: [
                { name: 'KPIs', fields: [{ name: 'name', type: 'string', required: true }, { name: 'value', type: 'number', required: true }, { name: 'target', type: 'number', required: false }, { name: 'unit', type: 'string', required: false }, { name: 'trend', type: 'string', required: false }] },
                { name: 'DataSources', fields: [{ name: 'name', type: 'string', required: true }, { name: 'type', type: 'string', required: true }, { name: 'connectionString', type: 'string', required: false }, { name: 'status', type: 'string', required: true }] },
                { name: 'Alerts', fields: [{ name: 'metricName', type: 'string', required: true }, { name: 'threshold', type: 'number', required: true }, { name: 'condition', type: 'string', required: true }, { name: 'channel', type: 'string', required: true }] },
                { name: 'Reports', fields: [{ name: 'title', type: 'string', required: true }, { name: 'type', type: 'string', required: true }, { name: 'schedule', type: 'string', required: false }, { name: 'recipients', type: 'string', required: false }] }
            ]
        },
        layoutJSON: { sidebar: true, header: true, navigation: ['Dashboard', 'KPIs', 'Data Sources', 'Alerts', 'Reports'] },
        defaultPages: [
            { name: 'Dashboard', type: 'chart_dashboard', collection: 'kpis' },
            { name: 'KPIs', type: 'crud_table', collection: 'kpis' },
            { name: 'Data Sources', type: 'crud_table', collection: 'datasources' },
            { name: 'Alerts', type: 'crud_table', collection: 'alerts' },
            { name: 'Reports', type: 'crud_table', collection: 'reports' }
        ]
    },

    // ─────────────── 9. EduLearn LMS ───────────────
    {
        name: 'EduLearn LMS',
        slug: 'edulearn-lms',
        description: 'Learning management system with course builder, student enrollment, assignment submissions, grade book, and progress analytics.',
        colorTheme: 'orange',
        category: 'Education',
        tags: ['LMS', 'Courses', 'Students', 'E-Learning'],
        isPublic: true, isPremium: true, price: 4900,
        schemaConfig: {
            tables: [
                { name: 'Courses', fields: [{ name: 'title', type: 'string', required: true }, { name: 'instructor', type: 'string', required: true }, { name: 'duration', type: 'string', required: false }, { name: 'level', type: 'string', required: true }, { name: 'enrolled', type: 'number', required: false }] },
                { name: 'Students', fields: [{ name: 'name', type: 'string', required: true }, { name: 'email', type: 'string', required: true, unique: true }, { name: 'enrolledCourses', type: 'number', required: false }, { name: 'completionRate', type: 'number', required: false }] },
                { name: 'Assignments', fields: [{ name: 'title', type: 'string', required: true }, { name: 'course', type: 'string', required: true }, { name: 'dueDate', type: 'date', required: true }, { name: 'maxScore', type: 'number', required: true }] },
                { name: 'Grades', fields: [{ name: 'student', type: 'string', required: true }, { name: 'assignment', type: 'string', required: true }, { name: 'score', type: 'number', required: true }, { name: 'feedback', type: 'string', required: false }] }
            ]
        },
        layoutJSON: { sidebar: true, header: true, navigation: ['Dashboard', 'Courses', 'Students', 'Assignments', 'Grades'] },
        defaultPages: [
            { name: 'Dashboard', type: 'chart_dashboard', collection: 'courses' },
            { name: 'Courses', type: 'crud_table', collection: 'courses' },
            { name: 'Students', type: 'crud_table', collection: 'students' },
            { name: 'Assignments', type: 'crud_table', collection: 'assignments' },
            { name: 'Grades', type: 'crud_table', collection: 'grades' }
        ]
    },

    // ─────────────── 10. MedRecord Healthcare ───────────────
    {
        name: 'MedRecord Healthcare',
        slug: 'medrecord-healthcare',
        description: 'Healthcare practice management with patient records, appointment scheduling, prescriptions, medical history, and billing integration.',
        colorTheme: 'sky',
        category: 'Healthcare',
        tags: ['Medical', 'Patients', 'Appointments', 'EHR'],
        isPublic: true, isPremium: true, price: 7900,
        schemaConfig: {
            tables: [
                { name: 'Patients', fields: [{ name: 'name', type: 'string', required: true }, { name: 'dateOfBirth', type: 'date', required: true }, { name: 'phone', type: 'string', required: true }, { name: 'bloodGroup', type: 'string', required: false }, { name: 'allergies', type: 'string', required: false }] },
                { name: 'Appointments', fields: [{ name: 'patient', type: 'string', required: true }, { name: 'doctor', type: 'string', required: true }, { name: 'dateTime', type: 'date', required: true }, { name: 'type', type: 'string', required: true }, { name: 'status', type: 'string', required: true }] },
                { name: 'Prescriptions', fields: [{ name: 'patient', type: 'string', required: true }, { name: 'medication', type: 'string', required: true }, { name: 'dosage', type: 'string', required: true }, { name: 'duration', type: 'string', required: true }] },
                { name: 'MedicalHistory', fields: [{ name: 'patient', type: 'string', required: true }, { name: 'condition', type: 'string', required: true }, { name: 'diagnosedDate', type: 'date', required: true }, { name: 'notes', type: 'string', required: false }] }
            ]
        },
        layoutJSON: { sidebar: true, header: true, navigation: ['Dashboard', 'Patients', 'Appointments', 'Prescriptions', 'History'] },
        defaultPages: [
            { name: 'Dashboard', type: 'chart_dashboard', collection: 'patients' },
            { name: 'Patients', type: 'crud_table', collection: 'patients' },
            { name: 'Appointments', type: 'kanban_board', collection: 'appointments' },
            { name: 'Prescriptions', type: 'crud_table', collection: 'prescriptions' },
            { name: 'History', type: 'crud_table', collection: 'medicalhistory' }
        ]
    },

    // ─────────────── 11. PropDeals Real Estate ───────────────
    {
        name: 'PropDeals Real Estate',
        slug: 'propdeals-realestate',
        description: 'Real estate agency management with property listings, client inquiries, viewing schedules, contract tracking, and commission calculator.',
        colorTheme: 'fuchsia',
        category: 'Real Estate',
        tags: ['Properties', 'Listings', 'Agents', 'Deals'],
        isPublic: true, isPremium: false, price: 0,
        schemaConfig: {
            tables: [
                { name: 'Properties', fields: [{ name: 'title', type: 'string', required: true }, { name: 'address', type: 'string', required: true }, { name: 'price', type: 'number', required: true }, { name: 'type', type: 'string', required: true }, { name: 'bedrooms', type: 'number', required: false }, { name: 'status', type: 'string', required: true }] },
                { name: 'Clients', fields: [{ name: 'name', type: 'string', required: true }, { name: 'email', type: 'string', required: true }, { name: 'phone', type: 'string', required: true }, { name: 'budget', type: 'number', required: false }, { name: 'preference', type: 'string', required: false }] },
                { name: 'Viewings', fields: [{ name: 'property', type: 'string', required: true }, { name: 'client', type: 'string', required: true }, { name: 'scheduledDate', type: 'date', required: true }, { name: 'feedback', type: 'string', required: false }] },
                { name: 'Contracts', fields: [{ name: 'property', type: 'string', required: true }, { name: 'buyer', type: 'string', required: true }, { name: 'salePrice', type: 'number', required: true }, { name: 'commission', type: 'number', required: false }, { name: 'closingDate', type: 'date', required: false }] }
            ]
        },
        layoutJSON: { sidebar: true, header: true, navigation: ['Dashboard', 'Properties', 'Clients', 'Viewings', 'Contracts'] },
        defaultPages: [
            { name: 'Dashboard', type: 'chart_dashboard', collection: 'properties' },
            { name: 'Properties', type: 'crud_table', collection: 'properties' },
            { name: 'Clients', type: 'crud_table', collection: 'clients' },
            { name: 'Viewings', type: 'crud_table', collection: 'viewings' },
            { name: 'Contracts', type: 'crud_table', collection: 'contracts' }
        ]
    },

    // ─────────────── 12. EventForge ───────────────
    {
        name: 'EventForge',
        slug: 'eventforge',
        description: 'Event planning platform with event creation, attendee registration, venue management, speaker lineup, and ticket sales tracking.',
        colorTheme: 'pink',
        category: 'Events',
        tags: ['Events', 'Conferences', 'Tickets', 'Venues'],
        isPublic: true, isPremium: true, price: 3900,
        schemaConfig: {
            tables: [
                { name: 'Events', fields: [{ name: 'name', type: 'string', required: true }, { name: 'date', type: 'date', required: true }, { name: 'venue', type: 'string', required: true }, { name: 'capacity', type: 'number', required: true }, { name: 'status', type: 'string', required: true }] },
                { name: 'Attendees', fields: [{ name: 'name', type: 'string', required: true }, { name: 'email', type: 'string', required: true }, { name: 'ticketType', type: 'string', required: true }, { name: 'checkedIn', type: 'boolean', required: false }] },
                { name: 'Venues', fields: [{ name: 'name', type: 'string', required: true }, { name: 'address', type: 'string', required: true }, { name: 'capacity', type: 'number', required: true }, { name: 'amenities', type: 'string', required: false }] },
                { name: 'Speakers', fields: [{ name: 'name', type: 'string', required: true }, { name: 'topic', type: 'string', required: true }, { name: 'bio', type: 'string', required: false }, { name: 'sessionTime', type: 'date', required: false }] }
            ]
        },
        layoutJSON: { sidebar: true, header: true, navigation: ['Dashboard', 'Events', 'Attendees', 'Venues', 'Speakers'] },
        defaultPages: [
            { name: 'Dashboard', type: 'chart_dashboard', collection: 'events' },
            { name: 'Events', type: 'crud_table', collection: 'events' },
            { name: 'Attendees', type: 'crud_table', collection: 'attendees' },
            { name: 'Venues', type: 'crud_table', collection: 'venues' },
            { name: 'Speakers', type: 'crud_table', collection: 'speakers' }
        ]
    },

    // ─────────────── 13. SocialPulse ───────────────
    {
        name: 'SocialPulse',
        slug: 'socialpulse',
        description: 'Social media management with post scheduling, content calendar, engagement analytics, hashtag tracking, and audience insights.',
        colorTheme: 'indigo',
        category: 'Social Media',
        tags: ['Social', 'Content', 'Scheduling', 'Engagement'],
        isPublic: true, isPremium: false, price: 0,
        schemaConfig: {
            tables: [
                { name: 'Posts', fields: [{ name: 'content', type: 'string', required: true }, { name: 'platform', type: 'string', required: true }, { name: 'scheduledDate', type: 'date', required: false }, { name: 'status', type: 'string', required: true }, { name: 'engagement', type: 'number', required: false }] },
                { name: 'Campaigns', fields: [{ name: 'name', type: 'string', required: true }, { name: 'startDate', type: 'date', required: true }, { name: 'endDate', type: 'date', required: true }, { name: 'budget', type: 'number', required: false }, { name: 'reach', type: 'number', required: false }] },
                { name: 'Hashtags', fields: [{ name: 'tag', type: 'string', required: true }, { name: 'uses', type: 'number', required: false }, { name: 'trend', type: 'string', required: false }] },
                { name: 'Audiences', fields: [{ name: 'segment', type: 'string', required: true }, { name: 'platform', type: 'string', required: true }, { name: 'size', type: 'number', required: false }, { name: 'growthRate', type: 'number', required: false }] }
            ]
        },
        layoutJSON: { sidebar: true, header: true, navigation: ['Dashboard', 'Content Calendar', 'Campaigns', 'Hashtags', 'Audiences'] },
        defaultPages: [
            { name: 'Dashboard', type: 'chart_dashboard', collection: 'posts' },
            { name: 'Content Calendar', type: 'kanban_board', collection: 'posts' },
            { name: 'Campaigns', type: 'crud_table', collection: 'campaigns' },
            { name: 'Hashtags', type: 'crud_table', collection: 'hashtags' },
            { name: 'Audiences', type: 'crud_table', collection: 'audiences' }
        ]
    },

    // ─────────────── 14. GrowthEngine Marketing ───────────────
    {
        name: 'GrowthEngine Marketing',
        slug: 'growthengine-marketing',
        description: 'Marketing automation with email campaigns, landing page tracking, lead magnets, A/B testing results, and conversion funnel analytics.',
        colorTheme: 'red',
        category: 'Marketing',
        tags: ['Email', 'Campaigns', 'Leads', 'Conversion'],
        isPublic: true, isPremium: true, price: 5900,
        schemaConfig: {
            tables: [
                { name: 'Campaigns', fields: [{ name: 'name', type: 'string', required: true }, { name: 'type', type: 'string', required: true }, { name: 'status', type: 'string', required: true }, { name: 'sentCount', type: 'number', required: false }, { name: 'openRate', type: 'number', required: false }, { name: 'clickRate', type: 'number', required: false }] },
                { name: 'Leads', fields: [{ name: 'name', type: 'string', required: true }, { name: 'email', type: 'string', required: true, unique: true }, { name: 'source', type: 'string', required: true }, { name: 'score', type: 'number', required: false }, { name: 'status', type: 'string', required: true }] },
                { name: 'LandingPages', fields: [{ name: 'title', type: 'string', required: true }, { name: 'url', type: 'string', required: true }, { name: 'visits', type: 'number', required: false }, { name: 'conversions', type: 'number', required: false }] },
                { name: 'ABTests', fields: [{ name: 'name', type: 'string', required: true }, { name: 'variantA', type: 'string', required: true }, { name: 'variantB', type: 'string', required: true }, { name: 'winner', type: 'string', required: false }, { name: 'confidence', type: 'number', required: false }] }
            ]
        },
        layoutJSON: { sidebar: true, header: true, navigation: ['Dashboard', 'Campaigns', 'Leads', 'Landing Pages', 'A/B Tests'] },
        defaultPages: [
            { name: 'Dashboard', type: 'chart_dashboard', collection: 'campaigns' },
            { name: 'Campaigns', type: 'crud_table', collection: 'campaigns' },
            { name: 'Leads', type: 'crud_table', collection: 'leads' },
            { name: 'Landing Pages', type: 'crud_table', collection: 'landingpages' },
            { name: 'A/B Tests', type: 'crud_table', collection: 'abtests' }
        ]
    },

    // ─────────────── 15. Blank Canvas ───────────────
    {
        name: 'Blank Canvas',
        slug: 'blank-canvas',
        description: 'Start from scratch. A completely empty template with no pre-defined schema — build exactly what you need from the ground up.',
        colorTheme: 'slate',
        category: 'General',
        tags: ['Blank', 'Custom', 'Starter', 'Empty'],
        isPublic: true, isPremium: false, price: 0,
        schemaConfig: { tables: [] },
        layoutJSON: { sidebar: true, header: true, navigation: ['Dashboard', 'Page 1', 'Page 2', 'Page 3', 'Settings'] },
        defaultPages: [
            { name: 'Dashboard', type: 'chart_dashboard', collection: 'custom' },
            { name: 'Page 1', type: 'crud_table', collection: 'custom' },
            { name: 'Page 2', type: 'crud_table', collection: 'custom' },
            { name: 'Page 3', type: 'crud_table', collection: 'custom' },
            { name: 'Settings', type: 'settings', collection: 'config' }
        ]
    }
];

const seedTemplates = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Template Seeding...');

        let tenants = await Tenant.find();
        let creatorId = null;
        if (tenants.length === 0) {
            console.log('No tenants found. Creating a default System Admin tenant...');
            const sysTenant = await Tenant.create({ name: 'System Admin', plan: 'enterprise' });
            creatorId = sysTenant._id;
        } else {
            creatorId = tenants[0]._id;
        }

        await Template.deleteMany({});
        console.log('Cleared all templates.');

        const templatesWithCreator = templates.map(t => ({ ...t, creatorId }));
        await Template.insertMany(templatesWithCreator);
        console.log(`${templates.length} Templates successfully imported.`);

        process.exit();
    } catch (err) {
        console.error('Error seeding templates:', err);
        process.exit(1);
    }
};

seedTemplates();
