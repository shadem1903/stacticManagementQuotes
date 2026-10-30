# Gestión de contenido

Todo el contenido comercial vive en archivos de datos, separados del código. Se edita con un cambio en el repositorio (pull request) y se publica al volver a compilar. Esto da historial, revisión y aprobación sin un CMS.

> Cuando exista el backend administrativo, `plans.json`, `promotions.json` y `faqs.json` pueden generarse desde su API en la compilación (un script en `scripts/` que los descargue antes de `astro build`). El formato de estos archivos es el contrato.

## Archivos

| Archivo | Contenido | Quién debería aprobar |
|---|---|---|
| `src/config/company.json` | Razón social, NIT, domicilio, correos, teléfono, dominio, portal, redes, alojamiento, historia/misión/visión | Representante legal |
| `src/data/features.json` | Funcionalidades y su estado (`disponible`, `en-desarrollo`, `planeado`) | Producto |
| `src/data/plans.json` | Planes, precio (`null` = cotización), usuarios, módulos, soporte | Comercial + gerencia |
| `src/data/promotions.json` | Promociones | Comercial + jurídico |
| `src/data/faqs.json` | Preguntas frecuentes (`home: true` las muestra en el inicio) | Comercial |
| `src/data/solutions.ts` | Contenido de cada página de solución | Producto |
| `src/content/legal/*.md` | Documentos legales | Solo jurídico |

Reglas:

- Un valor `null` en `company.json` se **oculta** en las páginas comerciales y se marca **"Pendiente"** en los legales. Nunca escribas datos de ejemplo.
- Marca una funcionalidad como `disponible` solo cuando funcione en producción.
- El portal de clientes aparece en el menú solo cuando `portalUrl` tiene valor.

## Formato de una promoción

```json
{
  "id": "lanzamiento-2027",
  "name": "Precio de lanzamiento",
  "description": "Descuento en los tres primeros meses del plan Profesional.",
  "originalPrice": 400000,
  "promoPrice": 300000,
  "currency": "COP",
  "startsAt": "2027-01-15T00:00:00-05:00",
  "endsAt": "2027-02-28T23:59:59-05:00",
  "timeZone": "America/Bogota",
  "appliesTo": ["profesional"],
  "eligibility": ["Empresas que contraten por primera vez"],
  "restrictions": ["No acumulable con otras promociones"],
  "quota": null,
  "howToRedeem": "Solicita una cotización e indica el nombre de la promoción.",
  "termsVersion": "1.0.0"
}
```

- `originalPrice` debe ser un precio realmente cobrado antes. El descuento se calcula solo y se redondea hacia abajo.
- Las fechas deben llevar zona horaria. Si una promoción no es válida (fechas invertidas, precio promocional mayor, sin procedimiento) **no se publica**.
- Se publican solo las vigentes al compilar. Si una vence entre compilaciones, el navegador la oculta. Aun así, programa una recompilación al inicio y al fin de cada promoción (ver despliegue).
- Conserva evidencia: el historial de git de `promotions.json` registra qué se publicó y cuándo.

## Documentos legales

Cada `.md` tiene en su encabezado: `title`, `description`, `version`, `effectiveDate`, `lastUpdated`, `legalReviewed`, `scope`, `related` e `history`. En el texto se usan tokens como `{{legalName}}` o `{{privacyEmail}}`, que se reemplazan con `company.json`.

Para publicar una versión nueva:

1. Copia la versión anterior al historial (`history`) con fecha y resumen de cambios.
2. Actualiza `version`, `lastUpdated` y, si cambia la vigencia, `effectiveDate`.
3. El abogado revisa y se cambia `legalReviewed: true`.
4. `npm run verify:legal` debe pasar.

La aceptación de cada versión por los clientes (en la contratación) se registra en el backend, no en este sitio.
