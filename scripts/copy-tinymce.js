
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../node_modules', 'tinymce');
const dest = path.join(__dirname, '../public', 'tinymce');

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

try {
    if (fs.existsSync(src)) {
        console.log(`Copying from ${src} to ${dest}...`);
        copyDir(src, dest);
        console.log('TinyMCE assets copied successfully!');
    } else {
        console.error('Source directory not found:', src);
        console.log('Waiting for npm install to finish...');
    }
} catch (err) {
    console.error('Error copying TinyMCE assets:', err);
}
