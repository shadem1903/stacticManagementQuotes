// @ts-check
import { defineConfig } from 'astro/config';
import company from './src/config/company.json' with { type: 'json' };
import { remarkCompanyTokens } from './src/lib/remark-company-tokens.mjs';

// URL pública definitiva. Prioridad: variable de entorno > company.json.
// Si no existe, se omiten canonical y sitemap (no se inventa un dominio).
const site = process.env.SITE_URL || company.siteUrl || undefined;

export default defineConfig({
  site,
  trailingSlash: 'never',
  build: { format: 'file' },
  markdown: {
    remarkPlugins: [remarkCompanyTokens],
  },
  devToolbar: { enabled: false },
});
