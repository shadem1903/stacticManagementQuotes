# Despliegue y mantenimiento

## Antes del primer despliegue

1. Completar `src/config/company.json` (al menos razón social, NIT, domicilio, correos y `siteUrl`).
2. Tener el endpoint de contacto funcionando ([API-CONTACTO.md](API-CONTACTO.md)).
3. `npm test && npm run build && npm run check:links && npm run test:e2e` en verde.
4. Revisión jurídica y `npm run verify:legal` en verde para publicar los legales como definitivos. Mientras no pase, el sitio puede salir, pero los legales quedan como borrador y con `noindex`.

## Hosting recomendado

Cualquier hosting estático con HTTPS. Recomendado: **Cloudflare Pages** o **Netlify**, porque aplican automáticamente `dist/_headers` (CSP, HSTS, `X-Frame-Options`, etc.), sirven `404.html` y resuelven `/planes` → `planes.html` sin configuración.

| Ajuste | Valor |
|---|---|
| Comando de compilación | `npm run build` |
| Carpeta de salida | `dist` |
| Node | 20 o superior |
| Variables | `SITE_URL`, `PUBLIC_CONTACT_ENDPOINT` |

En otro servidor (Nginx, Apache, Vercel), replicar las cabeceras de `dist/_headers` en su configuración y servir `X.html` para la ruta `/X`.

## Comprobaciones después de publicar

- https://securityheaders.com y https://observatory.mozilla.org sobre el dominio.
- Lighthouse (móvil): objetivos LCP < 2,5 s, CLS < 0,1, INP < 200 ms; accesibilidad ≥ 95. Referencia actual: el inicio pesa ~12 KB de HTML comprimido y no carga JavaScript de terceros.
- `https://dominio/sitemap.xml` y `robots.txt` responden y el sitemap no incluye legales en borrador.
- Enviar una solicitud real de prueba y verificar que llega al panel y que los logs no contienen datos personales.

## Mantenimiento

- **Promociones:** programar una recompilación al inicio y al final de cada una (webhook de despliegue en el hosting + una tarea programada, o una recompilación diaria).
- **Dependencias:** `npm outdated` y `npm audit` mensual; actualizar Astro dentro de la versión mayor 5.
- **Funcionalidades:** al publicar un módulo en producción, cambiar su estado en `features.json` y, si aplica, las medidas en `/legal/seguridad`.
- **Legales:** cada cambio sigue el procedimiento de [CONTENIDO.md](CONTENIDO.md) y queda en el historial del documento y de git.
- **Respaldo:** el repositorio es la fuente del sitio; las solicitudes de contacto y sus consentimientos viven en el backend, que debe tener sus propias copias de seguridad y monitoreo.
