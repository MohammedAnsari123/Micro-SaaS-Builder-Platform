import React, { useEffect } from 'react';
import { useContent } from './ContentContext';

const ThemeProvider = ({ children, themeOverride }) => {
    const { theme: ctxTheme } = useContent();
    const theme = themeOverride || ctxTheme;

    useEffect(() => {
        if (!theme) return;

        const root = document.documentElement;
        root.style.setProperty('--color-primary', theme.primary || '#3b82f6');
        root.style.setProperty('--color-secondary', theme.secondary || '#64748b');
        root.style.setProperty('--color-accent', theme.accent || '#10b981');
        root.style.setProperty('--color-background', theme.background || '#ffffff');
        root.style.setProperty('--color-text', theme.text || '#0f172a');
        root.style.setProperty('--font-family', theme.font || 'Inter, sans-serif');

        return () => {
            root.style.removeProperty('--color-primary');
            root.style.removeProperty('--color-secondary');
            root.style.removeProperty('--color-accent');
            root.style.removeProperty('--color-background');
            root.style.removeProperty('--color-text');
            root.style.removeProperty('--font-family');
        };
    }, [theme]);

    return (
        <div style={{
            fontFamily: 'var(--font-family, Inter, sans-serif)',
            color: 'var(--color-text, #0f172a)',
            backgroundColor: 'var(--color-background, #ffffff)',
            minHeight: '100vh'
        }}>
            {children}
        </div>
    );
};

export default ThemeProvider;
