# Contrato del endpoint de contacto

El sitio es estático: el formulario envía las solicitudes a un endpoint del backend administrativo. Configúralo al compilar:

```bash
PUBLIC_CONTACT_ENDPOINT=https://api.tudominio.com/public/contact-requests npm run build
```

Sin esta variable el formulario valida, pero no envía, y lo dice. Debe ser `https://`.

## Petición

`POST` con `Content-Type: application/json`, sin cookies (`credentials: omit`).

```json
{
  "name": "Ana Pérez",
  "email": "ana@clinica.co",
  "company": "Clínica Sonrisa",
  "sector": "Odontología",
  "reason": "demo",
  "message": "Somos 4 odontólogos y queremos organizar la agenda.",
  "preferredChannel": "email",
  "phone": null,
  "consents": {
    "privacyNotice": { "accepted": true, "version": "0.1.0-borrador" },
    "marketing": { "accepted": false }
  },
  "submittedAt": "2026-10-28T20:00:00.000Z"
}
```

Valores permitidos: `sector` (lista en `src/lib/contact.ts`), `reason`: `demo | planes | soporte | alianzas | otro`, `preferredChannel`: `email | telefono | whatsapp`.

## Respuestas esperadas

| Código | Cuerpo | El sitio muestra |
|---|---|---|
| `201` | `{ "id": "SOL-2026-000123" }` | Confirmación con el número de solicitud |
| `422` | `{ "errors": { "email": "Mensaje" } }` | Los errores en cada campo |
| `429` | — | "Recibimos muchas solicitudes seguidas…" |
| `5xx` | — | Error genérico, sin perder lo escrito |

## Obligaciones del backend (no delegar al navegador)

1. **Repetir toda la validación** de `src/lib/contact.ts`; la del navegador se puede saltar.
2. **CORS** solo para el origen del sitio. Responder `OPTIONS`.
3. **Límite de solicitudes** por IP y por correo (p. ej. 5 por hora por IP).
4. **Antibots** en servidor: el honeypot y el tiempo mínimo del navegador no bastan. Si se agrega un captcha de terceros, actualizar la política de cookies y privacidad **antes**.
5. **Guardar la evidencia del consentimiento:** versión del aviso aceptado, fecha y hora del servidor, IP. La autorización de publicidad se guarda por separado y debe poder revocarse.
6. **Registros sin datos personales:** no escribir nombre, correo, teléfono ni mensaje en los logs; usar el `id`.
7. **Acceso restringido** a las solicitudes: solo roles comerciales autorizados en el panel administrativo, con registro de accesos.
8. **Conservación:** suprimir solicitudes no convertidas según el plazo de la política (borrador: 12 meses).
9. Escapar el contenido al mostrarlo en el panel (prevención de XSS almacenado) y usar consultas parametrizadas (inyección SQL).
10. Al recibir, actualizar `connect-src` de la CSP: `scripts/postbuild.mjs` lo hace solo con `PUBLIC_CONTACT_ENDPOINT`.
