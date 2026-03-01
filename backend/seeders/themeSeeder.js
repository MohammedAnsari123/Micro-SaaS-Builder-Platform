const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Theme = require('../models/Theme');

dotenv.config({ path: path.join(__dirname, '../.env') });

const themesData = [
    { name: 'Oceanic Dark', colors: { primary: '#0ea5e9', secondary: '#0f172a', background: '#020617', text: '#f8fafc', accent: '#22d3ee' }, version: 1 },
    { name: 'Minimalist Light', colors: { primary: '#1e293b', secondary: '#f8fafc', background: '#ffffff', text: '#0f172a', accent: '#64748b' }, version: 1 },
    { name: 'Cyber Neon', colors: { primary: '#d946ef', secondary: '#2e1065', background: '#0f172a', text: '#f5f3ff', accent: '#a855f7' }, version: 1 },
    { name: 'Forest Green', colors: { primary: '#059669', secondary: '#ecfdf5', background: '#f0fdf4', text: '#064e3b', accent: '#10b981' }, version: 1 },
    { name: 'Midnight Gold', colors: { primary: '#fbbf24', secondary: '#1e1b4b', background: '#020617', text: '#fef3c7', accent: '#f59e0b' }, version: 1 }
];

const seedThemes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Theme Seeding...');

        await Theme.deleteMany({});
        console.log('Cleared all themes.');

        await Theme.insertMany(themesData);
        console.log(`${themesData.length} Themes successfully imported.`);

        process.exit();
    } catch (err) {
        console.error('Error seeding themes:', err);
        process.exit(1);
    }
};

seedThemes();
