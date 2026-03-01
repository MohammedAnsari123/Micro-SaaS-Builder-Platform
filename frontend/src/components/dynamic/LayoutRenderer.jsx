import React, { useState } from 'react';
import ThemeEngine from './ThemeEngine';
import SidebarLayout from './SidebarLayout';
import NavbarLayout from './NavbarLayout';

/**
 * LayoutRenderer Component
 * The main engine that decides which layout shell to use based on template metadata.
 */
const LayoutRenderer = ({ template, theme }) => {
    // Determine initial slug, handling both object.slug and raw string formats
    const getInitialSlug = () => {
        // Normalize pages to always be objects for consistent processing
        const normalizedPages = (template?.pages || []).map(p => {
            if (typeof p === 'object') return p;
            return { name: p, slug: p, icon: 'File' }; // Default icon for string pages
        });

        if (normalizedPages.length === 0) return 'index';
        const firstPage = normalizedPages[0];
        return firstPage.slug;
    };

    const [activePageSlug, setActivePageSlug] = useState(getInitialSlug());

    if (!template) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const layoutProps = {
        template,
        activeSlug: activePageSlug,
        onPageChange: setActivePageSlug
    };

    return (
        <>
            <ThemeEngine theme={theme} />
            {(() => {
                switch (template.layoutType) {
                    case 'sidebar':
                        return <SidebarLayout {...layoutProps} />;
                    case 'navbar':
                        return <NavbarLayout {...layoutProps} />;
                    case 'hybrid':
                        // Basic hybrid uses sidebar for now, can be expanded later
                        return <SidebarLayout {...layoutProps} />;
                    default:
                        return <SidebarLayout {...layoutProps} />;
                }
            })()}
        </>
    );
};

export default LayoutRenderer;
