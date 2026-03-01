import React from 'react';
import { ToolRenderer } from './ToolRegistry';

/**
 * PageRenderer Component
 * Renders a specific page with all its configured sections (tools).
 */
const PageRenderer = ({ page, template }) => {
    if (!page || !page.sections) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
                <p>No content configured for this page.</p>
            </div>
        );
    }

    // Helper to find instance config by moduleSlug
    const getInstanceConfig = (slug) => {
        return (template?.instances || []).find(inst => inst.moduleSlug === slug);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center px-4 md:px-0">
                <h1 className="text-2xl font-bold text-slate-800">{page.name}</h1>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {page.sections.map((sectionSlug, index) => {
                    const instance = getInstanceConfig(sectionSlug);
                    return (
                        <section key={`${sectionSlug}-${index}`} className="w-full">
                            <ToolRenderer
                                slug={instance?.moduleType || sectionSlug}
                                config={instance?.config || {}}
                            />
                        </section>
                    );
                })}
            </div>
        </div>
    );
};

export default PageRenderer;
