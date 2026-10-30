import { describe, it, expect } from 'vitest';
import { validateContact, toPayload, type ContactInput } from '../../src/lib/contact';

const ok: ContactInput = {
  name: 'Ana Pérez', email: 'ana@clinica.co', company: 'Clínica Sonrisa', sector: 'Odontología', reason: 'demo',
  message: 'Somos 4 odontólogos y queremos organizar la agenda.', channel: 'email', phone: '',
  privacyAccepted: true, marketingOptIn: false, website: '', elapsedMs: 8000,
};

describe('validateContact', () => {
  it('acepta un envío correcto', () => expect(validateContact(ok)).toEqual({}));
  it('exige autorización de tratamiento', () => expect(validateContact({ ...ok, privacyAccepted: false }).privacyAccepted).toBeTruthy());
  it('la publicidad es opcional', () => expect(validateContact({ ...ok, marketingOptIn: false })).toEqual({}));
  it('rechaza correo inválido', () => expect(validateContact({ ...ok, email: 'ana@' }).email).toBeTruthy());
  it('rechaza sector fuera de la lista', () => expect(validateContact({ ...ok, sector: '<script>' }).sector).toBeTruthy());
  it('exige teléfono si el canal es WhatsApp', () => expect(validateContact({ ...ok, channel: 'whatsapp' }).phone).toBeTruthy());
  it('valida formato del teléfono', () => expect(validateContact({ ...ok, channel: 'telefono', phone: 'abc' }).phone).toBeTruthy());
  it('acepta teléfono colombiano', () => expect(validateContact({ ...ok, channel: 'telefono', phone: '+57 300 123 4567' })).toEqual({}));
  it('bloquea el honeypot', () => expect(validateContact({ ...ok, website: 'http://spam' }).form).toBeTruthy());
  it('bloquea envíos demasiado rápidos (bots)', () => expect(validateContact({ ...ok, elapsedMs: 500 }).form).toBeTruthy());
  it('limita la longitud del mensaje', () => expect(validateContact({ ...ok, message: 'a'.repeat(2001) }).message).toBeTruthy());
  it('exige mensaje mínimo', () => expect(validateContact({ ...ok, message: 'hola' }).message).toBeTruthy());
});

describe('toPayload', () => {
  it('normaliza y registra la versión del aviso aceptado', () => {
    const p = toPayload({ ...ok, email: ' ANA@Clinica.CO ' }, '0.1.0');
    expect(p.email).toBe('ana@clinica.co');
    expect(p.consents.privacyNotice).toEqual({ accepted: true, version: '0.1.0' });
    expect(p.consents.marketing.accepted).toBe(false);
    expect('website' in p).toBe(false);
  });
  it('no envía teléfono cuando el canal es correo', () => expect(toPayload({ ...ok, phone: '3001234567' }, 'v').phone).toBeNull());
});
