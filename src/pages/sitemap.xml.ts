import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { solutionList } from '../data/solutions';
import { missingLegalFields } from '../lib/company';

// Solo se genera si existe la URL pública (SITE_URL o company.siteUrl).
// Los documentos legales en borrador (noindex) se excluyen.
export const GET: APIRoute = async ({ site }) => {
  if (!site)
    return new Response('<?xml version="1.0" encoding="UTF-8"?>\n<!-- Configura SITE_URL para generar el sitemap -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n', {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  const pages = ['/', '/soluciones', ...solutionList.map((s) => `/soluciones/${s.id}`), '/funcionalidades', '/planes', '/promociones', '/nosotros', '/contacto', '/preguntas-frecuentes', '/legal'];
  const legal = await getCollection('legal');
  const publishable = missingLegalFields().length === 0;
  for (const d of legal) if (d.data.legalReviewed && publishable) pages.push(`/legal/${d.id}`);
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`)
    .join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
