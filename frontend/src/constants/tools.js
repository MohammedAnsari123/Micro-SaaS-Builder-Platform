import { Database, Lock, CreditCard, BarChart3, Rocket, Bot } from 'lucide-react';

export const TOOLS = [
    {
        id: 'database',
        label: 'MongoDB',
        feature: 'Database Layer',
        icon: Database,
        color: '#10B981', // Emerald
        position: [-1.5, 2, 0.1], // Target position on the panel
        delay: 0,
    },
    {
        id: 'auth',
        label: 'Auth',
        feature: 'JWT / OAuth',
        icon: Lock,
        color: '#8B5CF6', // Violet
        position: [1.5, 2, 0.1],
        delay: 0.2,
    },
    {
        id: 'payments',
        label: 'Stripe',
        feature: 'Payment Processing',
        icon: CreditCard,
        color: '#3B82F6', // Blue
        position: [-1.5, 0, 0.1],
        delay: 0.4,
    },
    {
        id: 'analytics',
        label: 'Analytics',
        feature: 'Usage Metrics',
        icon: BarChart3,
        color: '#F59E0B', // Amber
        position: [1.5, 0, 0.1],
        delay: 0.6,
    },
    {
        id: 'deploy',
        label: 'Deploy',
        feature: 'CI/CD Pipeline',
        icon: Rocket,
        color: '#EF4444', // Red
        position: [-1.5, -2, 0.1],
        delay: 0.8,
    },
    {
        id: 'ai',
        label: 'AI Engine',
        feature: 'LLM Integration',
        icon: Bot,
        color: '#EC4899', // Pink
        position: [1.5, -2, 0.1],
        delay: 1.0,
    }
];
