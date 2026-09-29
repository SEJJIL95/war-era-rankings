const { mkdirSync, copyFileSync, rmSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '..');
const output = join(root, 'build');
rmSync(output, { recursive: true, force: true });
mkdirSync(output);
copyFileSync(join(root, 'public', 'index.html'), join(output, 'index.html'));
console.log('Built static statement page in build/index.html');
