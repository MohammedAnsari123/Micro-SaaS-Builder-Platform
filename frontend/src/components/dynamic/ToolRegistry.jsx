import React, { lazy, Suspense } from 'react';

// Lazy load tools for better performance
const ChartDashboard = lazy(() => import('../modules/ChartDashboard'));
const CrudTable = lazy(() => import('../modules/CrudTable'));
const KanbanBoard = lazy(() => import('../modules/KanbanBoard'));
const MetricCards = lazy(() => import('../modules/MetricCards'));
const CalendarView = lazy(() => import('../modules/CalendarView'));

// Tool Registry Map
const tools = {
    // Builder Slugs
    'crud_table': CrudTable,
    'chart_dashboard': ChartDashboard,
    'kanban_board': KanbanBoard,
    'event_calendar': CalendarView,
    'metric_cards': MetricCards,
    'form_builder': CrudTable,
    'user_manager': CrudTable,
    'file_manager': CrudTable,

    // Legacy Slugs
    'analytics-dashboard': ChartDashboard,
    'crm-manager': CrudTable,
    'kanban-board': KanbanBoard,
    'invoice-generator': CrudTable,
    'event-calendar': CalendarView,
    'metric-cards': MetricCards
};

/**
 * ToolRegistry Component
 * Renders a tool based on its slug.
 */
export const ToolRenderer = ({ slug, instanceData }) => {
    // Normalize slug (replace hyphens with underscores for loose matching if needed)
    const normalizedSlug = slug ? slug.replace(/-/g, '_') : '';
    const Component = tools[slug] || tools[normalizedSlug] || CrudTable;

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
            <Component instance={instanceData} />
        </Suspense>
    );
};

export default tools;
