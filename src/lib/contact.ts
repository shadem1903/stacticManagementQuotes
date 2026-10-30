// Validación del formulario de contacto. Se usa en el navegador y debe
// replicarse en el backend (nunca confiar solo en la validación del cliente).

export const SECTORS = [
  'Odontología',
  'Fisioterapia',
  'Salud y bienestar',
  'Peluquería o barbería',
  'Salón de belleza, manicura o pedicura',
  'Otro',
] as const;

export const REASONS = [
  { value: 'demo', label: 'Solicitar una demostración' },
  { value: 'planes', label: 'Información de planes y precios' },
  { value: 'soporte', label: 'Soporte de una cuenta existente' },
  { value: 'alianzas', label: 'Alianzas o proveedores' },
  { value: 'otro', label: 'Otro motivo' },
] as const;

export const CHANNELS = [
  { value: 'email', label: 'Correo electrónico' },
  { value: 'telefono', label: 'Llamada telefónica' },
  { value: 'whatsapp', label: 'WhatsApp' },
] as const;

export const LIMITS = { name: 80, email: 120, company: 120, phone: 20, message: 2000, minMessage: 10 };

export interface ContactInput {
  name: string;
  email: string;
  company?: string;
  sector: string;
  reason: string;
  message: string;
  channel: string;
  phone?: string;
  privacyAccepted: boolean;
  marketingOptIn: boolean;
  /** honeypot: debe llegar vacío */
  website?: string;
  /** ms transcurridos desde que se abrió el formulario */
  elapsedMs?: number;
}

export type ContactErrors = Partial<Record<keyof ContactInput | 'form', string>>;

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-zA-Z]{2,}$/;
const PHONE_RE = /^\+?[0-9\s()-]{7,20}$/;

export function validateContact(i: ContactInput): ContactErrors {
  const e: ContactErrors = {};
  const name = i.name?.trim() ?? '';
  const email = i.email?.trim() ?? '';
  const message = i.message?.trim() ?? '';

  if (i.website) e.form = 'No pudimos procesar el envío.';
  if (typeof i.elapsedMs === 'number' && i.elapsedMs < 3000) e.form = 'Revisa los datos e inténtalo de nuevo en unos segundos.';

  if (name.length < 2) e.name = 'Escribe tu nombre.';
  else if (name.length > LIMITS.name) e.name = `Máximo ${LIMITS.name} caracteres.`;

  if (!email) e.email = 'Escribe tu correo electrónico.';
  else if (email.length > LIMITS.email || !EMAIL_RE.test(email)) e.email = 'Escribe un correo válido, por ejemplo nombre@empresa.com.';

  if ((i.company?.length ?? 0) > LIMITS.company) e.company = `Máximo ${LIMITS.company} caracteres.`;

  if (!SECTORS.includes(i.sector as (typeof SECTORS)[number])) e.sector = 'Elige el sector de tu negocio.';
  if (!REASONS.some((r) => r.value === i.reason)) e.reason = 'Elige el motivo del contacto.';
  if (!CHANNELS.some((c) => c.value === i.channel)) e.channel = 'Elige cómo prefieres que te respondamos.';

  if (i.channel === 'telefono' || i.channel === 'whatsapp') {
    if (!i.phone?.trim()) e.phone = 'Escribe un número para responderte por ese canal.';
    else if (!PHONE_RE.test(i.phone.trim())) e.phone = 'Escribe un número válido, solo dígitos, espacios, + o guiones.';
  }

  if (message.length < LIMITS.minMessage) e.message = `Cuéntanos un poco más (mínimo ${LIMITS.minMessage} caracteres).`;
  else if (message.length > LIMITS.message) e.message = `Máximo ${LIMITS.message} caracteres.`;

  if (!i.privacyAccepted) e.privacyAccepted = 'Necesitamos tu autorización para responder tu solicitud.';
  return e;
}

/** Datos que se envían al backend (sin honeypot y con texto normalizado). */
export function toPayload(i: ContactInput, privacyNoticeVersion: string) {
  return {
    name: i.name.trim(),
    email: i.email.trim().toLowerCase(),
    company: i.company?.trim() || null,
    sector: i.sector,
    reason: i.reason,
    message: i.message.trim(),
    preferredChannel: i.channel,
    phone: i.channel === 'email' ? null : i.phone?.trim() || null,
    consents: {
      privacyNotice: { accepted: i.privacyAccepted, version: privacyNoticeVersion },
      marketing: { accepted: i.marketingOptIn },
    },
    submittedAt: new Date().toISOString(),
  };
}
