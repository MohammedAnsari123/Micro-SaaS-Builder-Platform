import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const directoryPath = path.join(__dirname, 'src');

const replacements = [
    { regex: /text-white/g, replace: 'text-slate-900' },
    { regex: /text-slate-400/g, replace: 'text-slate-500' },
    { regex: /text-slate-300/g, replace: 'text-slate-600' },
    { regex: /text-brand-400/g, replace: 'text-brand-600' },
    { regex: /border-white\/5/g, replace: 'border-slate-200' },
    { regex: /border-white\/10/g, replace: 'border-slate-300' },
    { regex: /border-white\/20/g, replace: 'border-slate-300' },
    { regex: /bg-white\/5/g, replace: 'bg-slate-50' },
    { regex: /hover:bg-white\/5/g, replace: 'hover:bg-slate-100' },
    { regex: /bg-white\/10/g, replace: 'bg-slate-100' },
    { regex: /hover:bg-white\/10/g, replace: 'hover:bg-slate-200' },
    { regex: /bg-white\/20/g, replace: 'bg-slate-200' },
    { regex: /bg-black\/20/g, replace: 'bg-slate-50' },
    { regex: /bg-black\/50/g, replace: 'bg-slate-900\/20' },
    { regex: /bg-\[#0f172a\]\/80/g, replace: 'bg-white/80' },
    { regex: /bg-\[#0f172a\]/g, replace: 'bg-white' },
    { regex: /text-slate-500 hover:text-white/g, replace: 'text-slate-500 hover:text-slate-900' },
    { regex: /bg-slate-900/g, replace: 'bg-white' }, // for options
];

function processDirectory(dir) {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(dir, file.name);
            if (file.isDirectory()) {
                processDirectory(filePath);
            } else if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
                let content = fs.readFileSync(filePath, 'utf8');
                let originalContent = content;

                replacements.forEach(({ regex, replace }) => {
                    content = content.replace(regex, replace);
                });

                if (content !== originalContent) {
                    fs.writeFileSync(filePath, content, 'utf8');
                    console.log(`Updated: ${filePath}`);
                }
            }
        });
    });
}

processDirectory(directoryPath);
console.log('Migration script completed.');
