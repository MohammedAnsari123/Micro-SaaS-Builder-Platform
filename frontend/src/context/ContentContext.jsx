import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

const ContentContext = createContext(null);

export const useContent = () => {
    const ctx = useContext(ContentContext);
    if (!ctx) throw new Error('useContent must be used within ContentProvider');
    return ctx;
};

export const ContentProvider = ({ tenantId, cloneId, template, theme, siteSettings, plan, children }) => {
    const [contentMap, setContentMap] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch content for a specific page
    const fetchPageContent = useCallback(async (page) => {
        if (contentMap[page]) return contentMap[page];

        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/content/public/${tenantId}?page=${page}`);
            if (res.data.success) {
                const sections = {};
                res.data.data.forEach(item => {
                    sections[item.section] = item.data;
                });
                setContentMap(prev => ({ ...prev, [page]: sections }));
                return sections;
            }
        } catch (err) {
            console.error(`Failed to fetch content for page "${page}":`, err);
        } finally {
            setLoading(false);
        }
        return {};
    }, [tenantId, contentMap]);

    // Get content for a page (returns cached or empty)
    const getPageContent = useCallback((page) => {
        return contentMap[page] || {};
    }, [contentMap]);

    // Get a specific section's data
    const getSectionData = useCallback((page, section) => {
        return contentMap[page]?.[section] || {};
    }, [contentMap]);

    const value = {
        tenantId,
        cloneId,
        template,
        theme,
        siteSettings,
        plan,
        loading,
        contentMap,
        fetchPageContent,
        getPageContent,
        getSectionData
    };

    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    );
};

export default ContentContext;
