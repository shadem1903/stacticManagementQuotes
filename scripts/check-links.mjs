#!/usr/bin/env node
// Verifica que todos los enlaces internos y anclas de dist/ apunten a páginas existentes.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = new URL('../dist', import.meta.url).pathname;
const pages = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && pages.push(p); });
walk(dist);

const resolveFile = (path) => {
  const clean = path.replace(/\/$/, '') || '/index';
  for (const c of [clean, `${clean}.html`, join(clean, 'index.html')]) {
    const p = join(dist, c);
    if (existsSync(p) && statSync(p).isFile()) return p;
  }
  return null;
};
const broken = [];
let count = 0;
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const from = '/' + relative(dist, page);
  for (const m of html.matchAll(/\shref="([^"]+)"/g)) {
    const href = m[1].replace(/&#38;|&amp;/g, "&");
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;
    count++;
    const [pathAndQuery, hash] = href.split('#');
    const path = pathAndQuery.split('?')[0];
    const target = path ? resolveFile(path) : page;
    if (!target) { broken.push(`${from} → ${href}`); continue; }
    if (hash) {
      const t = readFileSync(target, 'utf8');
      if (!t.includes(`id="${hash}"`)) broken.push(`${from} → ${href} (ancla inexistente)`);
    }
  }
}
if (broken.length) { console.error(`✗ ${broken.length} enlaces rotos:\n` + broken.map((b) => '  - ' + b).join('\n')); process.exit(1); }
console.log(`✓ ${count} enlaces internos verificados en ${pages.length} páginas, sin enlaces rotos.`);
