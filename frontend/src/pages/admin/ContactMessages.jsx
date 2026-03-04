import React, { useState, useEffect } from 'react';
import { Mail, Eye, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

const ContactMessages = ({ token, cloneId }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const headers = { Authorization: `Bearer ${token}` };

    const fetchMessages = async () => {
        if (!cloneId || cloneId === 'undefined') return;
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/contact?cloneId=${cloneId}&page=${page}&limit=15`, { headers });
            if (res.data.success) {
                setMessages(res.data.data);
                setTotalPages(res.data.pages || 1);
            }
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMessages(); }, [page, cloneId]);

    const markRead = async (id) => {
        await axios.put(`${API_BASE}/contact/${id}/read`, {}, { headers });
        fetchMessages();
    };

    const deleteMsg = async (id) => {
        await axios.delete(`${API_BASE}/contact/${id}`, { headers });
        fetchMessages();
    };

    return (
        <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Contact Messages</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>Messages submitted through your site's contact form.</p>

            {loading ? (
                <p style={{ color: '#94a3b8' }}>Loading messages...</p>
            ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                    <Mail size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                    <p>No messages yet</p>
                </div>
            ) : (
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {messages.map(msg => (
                            <div key={msg._id} style={{
                                padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0',
                                backgroundColor: msg.isRead ? '#fff' : '#f8fafc',
                                borderLeft: msg.isRead ? '3px solid transparent' : '3px solid #3b82f6'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <div>
                                        <h4 style={{ fontWeight: 600, fontSize: '15px', color: '#0f172a' }}>{msg.name}</h4>
                                        <p style={{ color: '#64748b', fontSize: '13px' }}>{msg.email}{msg.phone ? ` • ${msg.phone}` : ''}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        {!msg.isRead && (
                                            <button onClick={() => markRead(msg._id)} title="Mark as read"
                                                style={{ padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer' }}>
                                                <Eye size={14} color="#64748b" />
                                            </button>
                                        )}
                                        <button onClick={() => deleteMsg(msg._id)} title="Delete"
                                            style={{ padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#fff', cursor: 'pointer' }}>
                                            <Trash2 size={14} color="#ef4444" />
                                        </button>
                                    </div>
                                </div>
                                <p style={{ color: '#334155', fontSize: '14px', lineHeight: 1.6 }}>{msg.message}</p>
                                <p style={{ color: '#94a3b8', fontSize: '11px', marginTop: '8px' }}>{new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString()}</p>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button key={i + 1} onClick={() => setPage(i + 1)}
                                    style={{
                                        width: '36px', height: '36px', borderRadius: '8px',
                                        border: page === i + 1 ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                        backgroundColor: page === i + 1 ? '#eff6ff' : '#fff',
                                        cursor: 'pointer', fontWeight: 600, fontSize: '13px'
                                    }}>{i + 1}</button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ContactMessages;
