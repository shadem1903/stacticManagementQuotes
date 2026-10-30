import { describe, it, expect } from 'vitest';
import { promoState, discountPercent, validatePromotion, activePromotions, type Promotion } from '../../src/lib/promotions';

const base: Promotion = {
  id: 'lanzamiento', name: 'Lanzamiento', description: 'x', originalPrice: 200000, promoPrice: 150000, currency: 'COP',
  startsAt: '2026-11-01T00:00:00-05:00', endsAt: '2026-11-30T23:59:59-05:00', timeZone: 'America/Bogota',
  appliesTo: ['basico'], eligibility: [], restrictions: [], quota: null, howToRedeem: 'Solicitar cotización', termsVersion: '1.0',
};

describe('promoState', () => {
  it('antes del inicio es upcoming', () => expect(promoState(base, new Date('2026-10-31T23:59:59-05:00'))).toBe('upcoming'));
  it('en el instante de inicio es active (zona horaria Bogotá)', () => expect(promoState(base, new Date('2026-11-01T05:00:00Z'))).toBe('active'));
  it('un segundo antes del inicio en UTC sigue upcoming', () => expect(promoState(base, new Date('2026-11-01T04:59:59Z'))).toBe('upcoming'));
  it('en el instante de fin ya está expired', () => expect(promoState(base, new Date('2026-11-30T23:59:59-05:00'))).toBe('expired'));
  it('fechas invertidas son invalid', () => expect(promoState({ startsAt: base.endsAt, endsAt: base.startsAt })).toBe('invalid'));
  it('fechas mal formadas son invalid', () => expect(promoState({ startsAt: 'mañana', endsAt: base.endsAt })).toBe('invalid'));
});

describe('discountPercent', () => {
  it('calcula 25%', () => expect(discountPercent(200000, 150000)).toBe(25));
  it('redondea hacia abajo para no exagerar', () => expect(discountPercent(300000, 199999)).toBe(33));
  it('null si el precio promocional no es menor', () => expect(discountPercent(100, 100)).toBeNull());
  it('null si falta precio de referencia', () => expect(discountPercent(null, 100)).toBeNull());
  it('null si el original es 0 o negativo', () => expect(discountPercent(0, 0)).toBeNull());
});

describe('validatePromotion / activePromotions', () => {
  it('una promoción correcta no tiene errores', () => expect(validatePromotion(base)).toEqual([]));
  it('exige zona horaria en las fechas', () => expect(validatePromotion({ ...base, startsAt: '2026-11-01T00:00:00' }).join()).toMatch(/zona horaria/));
  it('rechaza descuento falso (promo mayor que original)', () => expect(validatePromotion({ ...base, promoPrice: 250000 }).length).toBeGreaterThan(0));
  it('solo devuelve promociones válidas y vigentes', () => {
    const now = new Date('2026-11-15T12:00:00-05:00');
    const list = [base, { ...base, id: 'vencida', endsAt: '2026-11-10T00:00:00-05:00' }, { ...base, id: 'mala', promoPrice: 999999 }];
    expect(activePromotions(list, now).map((p) => p.id)).toEqual(['lanzamiento']);
  });
});
