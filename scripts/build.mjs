// Minimal static "build": copy index.html into dist/.
import { mkdirSync, copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
mkdirSync(dist, { recursive: true });

for (const file of ['index.html']) {
  const src = path.join(root, file);
  if (!existsSync(src)) {
    console.error(`build: missing ${file}`);
    process.exit(1);
  }
  copyFileSync(src, path.join(dist, file));
}
console.log('build: dist/index.html written');
