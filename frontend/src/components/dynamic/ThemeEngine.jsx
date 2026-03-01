import React, { useEffect } from 'react';

/**
 * ThemeEngine Component
 * Injects CSS variables into the document root based on the provided theme configuration.
 */
const ThemeEngine = ({ theme }) => {
    useEffect(() => {
        if (!theme || !theme.colors) return;

        const root = document.documentElement;
        const { colors } = theme;

        // Map theme colors to CSS variables
        const colorMap = {
            '--primary-color': colors.primary || '#3b82f6',
            '--secondary-color': colors.secondary || '#f8fafc',
            '--bg-color': colors.background || '#ffffff',
            '--text-color': colors.text || '#1e293b',
            '--accent-color': colors.accent || '#10b981',
            // Add more as needed
        };

        Object.entries(colorMap).forEach(([variable, value]) => {
            root.style.setProperty(variable, value);
        });

        // Handle typography if present
        if (theme.typography) {
            root.style.setProperty('--font-family', theme.typography.fontFamily || 'Inter, sans-serif');
        }

        // Cleanup (optional, but good for SPA if we leave the site)
        return () => {
            // You might want to reset to defaults here if necessary
        };
    }, [theme]);

    return null; // This is a logic-only component
};

export default ThemeEngine;
