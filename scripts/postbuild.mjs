#!/usr/bin/env node
// Genera dist/_headers (Netlify / Cloudflare Pages) con cabeceras de seguridad
// y una CSP con los hashes de los scripts inline que produce Astro.
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const dist = new URL('../dist', import.meta.url).pathname;
const htmlFiles = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && htmlFiles.push(p); });
walk(dist);

const hashes = new Set();
for (const f of htmlFiles) {
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g)) {
    hashes.add(`'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`);
  }
}
const endpoint = process.env.PUBLIC_CONTACT_ENDPOINT;
const connect = ["'self'", endpoint ? new URL(endpoint).origin : ''].filter(Boolean).join(' ');
const csp = [
  "default-src 'self'",
  `script-src 'self' ${[...hashes].join(' ')}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src ${connect}`,
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const headers = `/*
  Content-Security-Policy: ${csp}
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()
  Cross-Origin-Opener-Policy: same-origin

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
`;
writeFileSync(join(dist, '_headers'), headers);
console.log(`postbuild: _headers generado (${hashes.size} hashes de scripts inline, ${htmlFiles.length} páginas).`);
