const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected');

        // Define schema inline to avoid import issues
        const toolSchema = new mongoose.Schema({
            name: String,
            slug: String,
            tenantId: mongoose.Schema.Types.ObjectId
        }, { strict: false });

        const Tool = mongoose.models.Tool || mongoose.model('Tool', toolSchema);

        const tools = await Tool.find({});
        console.log(`Checking ${tools.length} tools`);

        for (const tool of tools) {
            const newSlug = tool.name
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/-+/g, '-')
                .replace(/^-+|-+$/g, '');

            if (tool.slug !== newSlug) {
                await Tool.updateOne({ _id: tool._id }, { $set: { slug: newSlug } });
                console.log(`Updated: ${tool.name} -> ${newSlug}`);
            }
        }

        console.log('Done');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
