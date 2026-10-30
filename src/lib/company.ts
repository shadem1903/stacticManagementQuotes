import company from '../config/company.json';

export type Company = typeof company;
export { company };

/** true si el valor existe y no está vacío */
export const has = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

/** Lista de campos imprescindibles para publicar documentos legales definitivos. */
export const REQUIRED_LEGAL_FIELDS = [
  'legalName',
  'nit',
  'address',
  'city',
  'privacyEmail',
  'commercialEmail',
  'siteUrl',
] as const;

export function missingLegalFields(c: Record<string, unknown> = company): string[] {
  return REQUIRED_LEGAL_FIELDS.filter((k) => !has(c[k]));
}

export const portalUrl = has(company.portalUrl) ? company.portalUrl : null;

export const contactEndpoint: string | null = (() => {
  const v = import.meta.env.PUBLIC_CONTACT_ENDPOINT;
  return typeof v === 'string' && v.startsWith('https://') ? v : null;
})();

export const socialLinks = Object.entries(company.social)
  .filter(([, url]) => has(url))
  .map(([name, url]) => ({ name, url: url as string }));
