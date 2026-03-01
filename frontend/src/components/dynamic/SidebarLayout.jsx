import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import PageRenderer from './PageRenderer';

/**
 * SidebarLayout Component
 * A layout with a side navigation menu.
 */
const SidebarLayout = ({ template, activeSlug, onPageChange }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Normalize pages to always be objects for consistent UI rendering
    const normalizedPages = (template.pages || []).map(p => {
        if (typeof p === 'object' && p !== null) return p;
        return { name: String(p), slug: String(p), icon: 'File', sections: [] };
    });

    const activePage = normalizedPages.find(p => p.slug === activeSlug) || normalizedPages[0] || { name: 'Empty', slug: 'empty', sections: [] };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className={`bg-white border-r border-slate-200 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
                <div className="p-6 flex items-center justify-between">
                    {!isCollapsed && <span className="text-xl font-bold text-blue-600">{template.name}</span>}
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-slate-100 rounded-lg">
                        <LucideIcons.Menu className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <nav className="mt-6 px-3 space-y-2">
                    {normalizedPages.map((page) => {
                        const Icon = LucideIcons[page.icon] || LucideIcons.File;
                        const isActive = page.slug === activePage.slug;

                        return (
                            <button
                                key={page.slug}
                                onClick={() => onPageChange(page.slug)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                    : 'text-slate-500 hover:bg-slate-100'
                                    }`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && <span className="font-medium">{page.name}</span>}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <PageRenderer page={activePage} template={template} />
            </main>
        </div>
    );
};

export default SidebarLayout;
