// Orden y agrupación del centro legal. El contenido vive en src/content/legal/*.md
export const legalCategories = [
  { id: 'datos', title: 'Privacidad y datos personales' },
  { id: 'uso', title: 'Uso del sitio y contratación' },
  { id: 'seguridad', title: 'Seguridad' },
] as const;

export const legalNav = [
  { slug: 'privacidad', short: 'Política de privacidad', category: 'datos' },
  { slug: 'tratamiento-de-datos', short: 'Tratamiento de datos personales', category: 'datos' },
  { slug: 'aviso-de-privacidad', short: 'Aviso de privacidad', category: 'datos' },
  { slug: 'tratamiento-por-encargo', short: 'Tratamiento por encargo', category: 'datos' },
  { slug: 'cookies', short: 'Política de cookies', category: 'datos' },
  { slug: 'terminos', short: 'Términos de uso del sitio', category: 'uso' },
  { slug: 'servicio-saas', short: 'Condiciones del servicio SaaS', category: 'uso' },
  { slug: 'cancelaciones-y-reembolsos', short: 'Cancelaciones y reembolsos', category: 'uso' },
  { slug: 'promociones', short: 'Términos de promociones', category: 'uso' },
  { slug: 'seguridad', short: 'Seguridad y reporte de incidentes', category: 'seguridad' },
].map((d) => ({ ...d, href: `/legal/${d.slug}` }));
