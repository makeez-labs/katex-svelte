import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const katexDist = path.join(root, 'node_modules/katex/dist');

await mkdir(dist, { recursive: true });
await cp(path.join(katexDist, 'katex.min.css'), path.join(dist, 'katex.min.css'));
await cp(path.join(katexDist, 'fonts'), path.join(dist, 'fonts'), { recursive: true });

console.log('Copied katex.min.css and fonts/ to dist/');
