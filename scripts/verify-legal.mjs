#!/usr/bin/env node
// Bloquea la publicación legal definitiva mientras falten datos del titular,
// revisión jurídica, fechas de vigencia o queden notas "Pendiente para revisión".
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const company = JSON.parse(readFileSync(join(root, 'src/config/company.json'), 'utf8'));
const required = {
  legalName: 'Razón social', nit: 'NIT', address: 'Domicilio', city: 'Ciudad',
  privacyEmail: 'Correo de protección de datos', commercialEmail: 'Correo comercial',
  securityEmail: 'Correo de seguridad', siteUrl: 'URL pública del sitio',
  hostingProvider: 'Proveedor de alojamiento', hostingRegion: 'País/región de alojamiento',
};
const problems = [];
for (const [k, label] of Object.entries(required)) {
  if (!company[k] || String(company[k]).trim() === '') problems.push(`company.json → falta ${label} (${k})`);
}
const dir = join(root, 'src/content/legal');
for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const src = readFileSync(join(dir, f), 'utf8');
  const fm = src.split('---')[1] ?? '';
  if (!/legalReviewed:\s*true/.test(fm)) problems.push(`${f} → sin revisión jurídica (legalReviewed: false)`);
  if (/effectiveDate:\s*null/.test(fm)) problems.push(`${f} → sin fecha de entrada en vigor`);
  if (/borrador/i.test(fm.match(/version:.*$/m)?.[0] ?? '')) problems.push(`${f} → la versión sigue marcada como borrador`);
  if (/Pendiente para revisión jurídica/.test(src)) problems.push(`${f} → contiene notas "Pendiente para revisión jurídica"`);
  for (const m of src.matchAll(/\{\{\s*([a-zA-Z.]+)\s*\}\}/g)) {
    const v = m[1].split('.').reduce((o, k) => o?.[k], company);
    if (v == null || v === '') problems.push(`${f} → usa {{${m[1]}}} sin valor en company.json`);
  }
}
const unique = [...new Set(problems)];
if (unique.length) {
  console.error(`\n✗ Documentos legales NO listos para publicación definitiva (${unique.length} pendientes):\n`);
  for (const p of unique) console.error('  - ' + p);
  console.error('\nEl sitio puede publicarse, pero los legales se mostrarán como borrador y con noindex.\n');
  process.exit(1);
}
console.log('✓ Documentos legales listos para publicación definitiva.');
