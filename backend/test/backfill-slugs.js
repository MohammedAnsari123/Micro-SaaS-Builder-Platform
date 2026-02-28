const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Tool = require('../models/Tool');

dotenv.config({ path: path.join(__dirname, '.env') });

const backfillSlugs = async () => {
    try {
        if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not defined in .env');

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find all tools that don't have a slug (or have an empty one)
        const tools = await Tool.find({
            $or: [
                { slug: { $exists: false } },
                { slug: '' },
                { slug: null }
            ]
        });

        console.log(`Found ${tools.length} tools needing slugs`);

        for (const tool of tools) {
            console.log(`Processing: ${tool.name}`);
            // The pre-save hook in Tool.js will handle slug generation
            await tool.save();
            console.log(`  -> Slug created: ${tool.slug}`);
        }

        console.log('Backfill complete!');
        process.exit(0);
    } catch (err) {
        console.error('Backfill failed:', err);
        process.exit(1);
    }
};

backfillSlugs();
