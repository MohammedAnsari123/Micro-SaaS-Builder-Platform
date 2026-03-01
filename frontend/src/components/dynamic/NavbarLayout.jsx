import React from 'react';
import * as LucideIcons from 'lucide-react';
import PageRenderer from './PageRenderer';

/**
 * NavbarLayout Component
 * A layout with a top navigation bar.
 */
const NavbarLayout = ({ template, activeSlug, onPageChange }) => {
    // Normalize pages to always be objects for consistent UI rendering
    const normalizedPages = (template.pages || []).map(p => {
        if (typeof p === 'object' && p !== null) return p;
        return { name: String(p), slug: String(p), icon: 'File', sections: [] };
    });

    const activePage = normalizedPages.find(p => p.slug === activeSlug) || normalizedPages[0] || { name: 'Empty', slug: 'empty', sections: [] };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <span className="text-xl font-bold text-blue-600">{template.name}</span>

                        <nav className="hidden md:flex items-center gap-2">
                            {normalizedPages.map((page) => {
                                const Icon = LucideIcons[page.icon] || LucideIcons.File;
                                const isActive = page.slug === activePage.slug;

                                return (
                                    <button
                                        key={page.slug}
                                        onClick={() => onPageChange(page.slug)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive
                                            ? 'bg-blue-50 text-blue-600 font-bold'
                                            : 'text-slate-500 hover:bg-slate-50'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{page.name}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 outline-none">
                            <LucideIcons.Search className="w-5 h-5" />
                        </button>
                        <div className="w-10 h-10 bg-blue-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-blue-600 font-bold">
                            JD
                        </div>
                    </div>
                </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full p-8 transition-opacity">
                <PageRenderer page={activePage} template={template} />
            </main>
        </div>
    );
};

export default NavbarLayout;
