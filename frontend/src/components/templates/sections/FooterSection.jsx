import React from 'react';
import { useContent } from '../../../context/ContentContext';

const FooterSection = () => {
    const { siteSettings, template, theme } = useContent();
    const name = siteSettings?.siteName || template?.name || 'My Site';

    return (
        <footer style={{
            borderTop: '1px solid #e2e8f0',
            padding: '32px 24px',
            textAlign: 'center',
            backgroundColor: 'rgba(0,0,0,0.02)'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                    © {new Date().getFullYear()} {name}. All rights reserved.
                </p>
                {siteSettings?.socialLinks && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px' }}>
                        {Object.entries(siteSettings.socialLinks).map(([platform, url]) => (
                            url ? (
                                <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                                    style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', textTransform: 'capitalize' }}>
                                    {platform}
                                </a>
                            ) : null
                        ))}
                    </div>
                )}
            </div>
        </footer>
    );
};

export default FooterSection;
