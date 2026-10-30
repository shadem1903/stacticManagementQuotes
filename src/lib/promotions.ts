// Lógica de promociones: vigencia y cálculo de descuentos.
// Las fechas se guardan en ISO 8601 con desplazamiento explícito (p. ej. -05:00)
// para que la vigencia no dependa de la zona horaria del servidor de compilación.

export interface Promotion {
  id: string;
  name: string;
  description: string;
  /** Precio de referencia real (el que se cobraba antes). null si no aplica. */
  originalPrice: number | null;
  promoPrice: number | null;
  currency: 'COP' | 'USD';
  startsAt: string; // ISO con offset
  endsAt: string; // ISO con offset
  timeZone: string; // p. ej. America/Bogota
  appliesTo: string[]; // ids de planes
  eligibility: string[];
  restrictions: string[];
  /** Cupos reales; null si no hay límite */
  quota: number | null;
  howToRedeem: string;
  termsVersion: string;
}

export type PromoState = 'upcoming' | 'active' | 'expired' | 'invalid';

export function promoState(p: Pick<Promotion, 'startsAt' | 'endsAt'>, now: Date = new Date()): PromoState {
  const start = Date.parse(p.startsAt);
  const end = Date.parse(p.endsAt);
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 'invalid';
  const t = now.getTime();
  if (t < start) return 'upcoming';
  if (t >= end) return 'expired';
  return 'active';
}

/** Porcentaje de descuento entero, redondeado hacia abajo para no exagerar el beneficio. */
export function discountPercent(original: number | null, promo: number | null): number | null {
  if (original == null || promo == null) return null;
  if (!(original > 0) || promo < 0 || promo >= original) return null;
  return Math.floor(((original - promo) / original) * 100);
}

export function validatePromotion(p: Promotion): string[] {
  const errors: string[] = [];
  if (!p.id) errors.push('id requerido');
  if (!p.name) errors.push('nombre requerido');
  if (promoState(p) === 'invalid') errors.push('fechas inválidas: endsAt debe ser posterior a startsAt');
  if (!/[+-]\d{2}:\d{2}$|Z$/.test(p.startsAt) || !/[+-]\d{2}:\d{2}$|Z$/.test(p.endsAt))
    errors.push('las fechas deben incluir zona horaria (offset)');
  if (p.originalPrice != null && p.promoPrice != null && discountPercent(p.originalPrice, p.promoPrice) == null)
    errors.push('el precio promocional debe ser menor que el precio original');
  if (!p.howToRedeem) errors.push('procedimiento para obtener el beneficio requerido');
  if (!p.termsVersion) errors.push('versión de términos requerida');
  return errors;
}

export function activePromotions(list: Promotion[], now: Date = new Date()): Promotion[] {
  return list.filter((p) => validatePromotion(p).length === 0 && promoState(p, now) === 'active');
}

export function formatMoney(value: number, currency: Promotion['currency']): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

export function formatDateTime(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'long', timeStyle: 'short', timeZone }).format(new Date(iso));
}
