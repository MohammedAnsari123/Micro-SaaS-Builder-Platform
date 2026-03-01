import React, { lazy, Suspense } from 'react';

// Lazy load tools for better performance
const ChartDashboard = lazy(() => import('../modules/ChartDashboard'));
const CrudTable = lazy(() => import('../modules/CrudTable'));
const KanbanBoard = lazy(() => import('../modules/KanbanBoard'));
const MetricCards = lazy(() => import('../modules/MetricCards'));
const CalendarView = lazy(() => import('../modules/CalendarView'));

// Tool Registry Map
const tools = {
    'analytics-dashboard': ChartDashboard,
    'crm-manager': CrudTable,
    'kanban-board': KanbanBoard,
    'invoice-generator': CrudTable,
    'lead-tracker': CrudTable,
    'inventory-manager': CrudTable,
    'sales-dashboard': ChartDashboard,
    'employee-directory': CrudTable,
    'task-list': KanbanBoard,
    'ticket-system': CrudTable,
    'seo-tracker': ChartDashboard,
    'email-campaigner': CrudTable,
    'expense-tracker': CrudTable,
    'web-traffic-monitor': ChartDashboard,
    'customer-directory': CrudTable,
    'project-list': KanbanBoard,
    'metric-cards': MetricCards,
    'event-calendar': CalendarView,
    'gantt-chart': CalendarView,
    // Add more tools here as modules are developed
};

/**
 * ToolRegistry Component
 * Renders a tool based on its slug.
 */
export const ToolRenderer = ({ slug, config }) => {
    const Component = tools[slug];

    if (!Component) {
        return (
            <div className="p-4 border-2 border-dashed border-red-200 rounded-xl bg-red-50 text-red-600 flex flex-col items-center justify-center">
                <p className="font-bold">Tool Not Found</p>
                <p className="text-sm">Slug: {slug}</p>
            </div>
        );
    }

    return (
        <Suspense fallback={<div className="animate-pulse bg-slate-100 h-64 rounded-xl"></div>}>
            <Component instance={config} />
        </Suspense>
    );
};

export default tools;
