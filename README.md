# stacticManagementQuotes

Sitio web público de **Cumplido**, que vende dos software:

- **Cumplido Salud**: consultorios de odontología, fisioterapia y bienestar.
- **Cumplido Belleza**: peluquerías, barberías, salones, manicura y pedicura.

Los dos incluyen la administración y la contabilidad completas (no se venden aparte).

Sitio estático construido con [Astro](https://astro.build): HTML generado en la compilación, casi sin JavaScript en el cliente (solo menú, pestañas, tema y formulario), contenido separado del código y documentos legales versionados.

## Inicio rápido

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # genera dist/ y dist/_headers
npm run preview      # sirve dist/ localmente
```

Requiere Node.js 20.3 o superior.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga |
| `npm run build` | Compila el sitio en `dist/` y genera cabeceras de seguridad (`dist/_headers`) |
| `npm test` | Pruebas unitarias (promociones, descuentos, validación del formulario, tokens legales) |
| `npm run test:e2e` | Pruebas de navegador en escritorio y móvil: carga de las 22 páginas, accesibilidad WCAG AA (axe), desborde horizontal, menú, pestañas, tema y formulario. Primero `npm run build` |
| `npm run check:links` | Verifica todos los enlaces internos y anclas de `dist/` |
| `npm run verify:legal` | Lista los datos y revisiones que faltan para publicar los legales como definitivos. Falla mientras haya pendientes |

## Estructura

```
src/
  config/company.json      Datos corporativos (null = pendiente; nunca datos de ejemplo)
  data/                    Contenido editable: planes, promociones, FAQ, funcionalidades, soluciones
  content/legal/*.md       Documentos legales con versión, fechas e historial
  lib/                     Lógica: promociones, validación de contacto, tokens legales
  components/              Header, Footer, AgendaDemo (hero), PlanCards, FaqList…
  layouts/Base.astro       SEO, tema, estructura común
  pages/                   Rutas del sitio
  styles/global.css        Tokens de diseño (colores de la app, Inter, escala 4 px), claro/oscuro
scripts/                   postbuild (CSP), verify-legal, check-links
tests/unit, tests/e2e      Vitest y Playwright
docs/                      Documentación técnica, legal y de despliegue
```

## Rutas

`/`, `/soluciones` (elige tu software), `/soluciones/salud` (Cumplido Salud), `/soluciones/belleza` (Cumplido Belleza), `/soluciones/administracion` (administración y contabilidad incluidas), `/funcionalidades`, `/planes`, `/promociones`, `/nosotros`, `/contacto`, `/preguntas-frecuentes`, `/legal` y los 10 documentos de `/legal/*`, más `robots.txt`, `sitemap.xml` y 404.

## Marca

Logo en `src/components/Logo.astro` y `public/brand/` (marca, salud, belleza): una "C" abierta que se completa con un check. El check cambia de color por producto. Antes de lanzar: verificar y registrar la marca "Cumplido" en la SIC (clase 42 y 9) y comprar el dominio.

## Estado y pendientes

- **Datos del titular:** completar `src/config/company.json`. Ver [docs/PENDIENTES-LEGALES.md](docs/PENDIENTES-LEGALES.md).
- **Formulario de contacto:** necesita el endpoint del backend (`PUBLIC_CONTACT_ENDPOINT`). Contrato en [docs/API-CONTACTO.md](docs/API-CONTACTO.md).
- **Legales:** borradores; se muestran con aviso y `noindex` hasta revisión jurídica.
- **Precios:** por cotización. **Promociones:** ninguna vigente.

Más documentación: [contenido](docs/CONTENIDO.md) · [despliegue y mantenimiento](docs/DESPLIEGUE.md).
