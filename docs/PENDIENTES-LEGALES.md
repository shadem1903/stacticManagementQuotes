# Pendientes legales e inventarios

Este documento reúne lo que la especificación pide como entregables 8, 9, 11 y 12. **Ningún documento legal debe considerarse vigente** hasta cerrar esta lista. `npm run verify:legal` la comprueba.

## 1. Datos del titular que faltan (`src/config/company.json`)

| Campo | Para qué se usa | Estado |
|---|---|---|
| `legalName` | Responsable en todos los legales, pie de página, aviso del formulario | Pendiente |
| `legalForm` | Tipo societario (S.A.S., persona natural…) | Pendiente |
| `nit` | Identificación del proveedor | Pendiente |
| `address`, `city` | Domicilio del responsable | Pendiente |
| `privacyEmail` | Canal para consultas y reclamos de datos (Ley 1581) | Pendiente |
| `commercialEmail` | Contacto comercial, cancelaciones | Pendiente |
| `securityEmail` | Reporte de vulnerabilidades | Pendiente |
| `supportEmail`, `phone`, `whatsapp` | Canales en contacto y pie (opcionales) | Pendiente |
| `siteUrl` | Canonical, sitemap, Open Graph | Pendiente |
| `portalUrl` | Botón "Acceso clientes" | Pendiente |
| `hostingProvider`, `hostingRegion` | Encargados y transmisión internacional | Pendiente |
| `social.*` | Redes oficiales en el pie | Pendiente |
| `about.story/mission/vision` | Página Nosotros (se oculta si falta) | Pendiente |

## 2. Informe de revisión jurídica pendiente

Los 10 documentos (`src/content/legal/`) son borradores redactados con base en la Ley 1581 de 2012, el Decreto 1377 de 2013 (Decreto 1074 de 2015), la Ley 1480 de 2011, la Ley 527 de 1999 y la Ley 2300 de 2023. **No fueron revisados por un abogado.** Puntos que requieren decisión jurídica:

1. **Registro Nacional de Bases de Datos (SIC):** confirmar si la sociedad está obligada a inscribirse y hacerlo antes del lanzamiento.
2. **Plazos de conservación** de solicitudes comerciales (borrador: 12 meses) y de datos contractuales.
3. **Transmisión internacional:** depende del proveedor y país de alojamiento; si no es país adecuado, firmar contrato de transmisión.
4. **Contrato de transmisión con cada cliente** (responsable → encargado). `tratamiento-por-encargo` es solo un resumen.
5. **Retracto (art. 47, Ley 1480):** definir si aplica cuando el cliente es consumidor y la contratación es a distancia.
6. **Política de reembolsos y niveles de servicio** (disponibilidad, horarios de soporte, compensaciones).
7. **Aceptación electrónica** de condiciones (Ley 527 de 1999): mecanismo y evidencia en el backend.
8. **Ley 2300 de 2023:** horarios y frecuencia de contacto comercial; aplicarlos en el proceso comercial real.
9. **Acceso del super administrador a datos de las empresas.** El diseño original (imagen del proyecto) le da "acceso a la base de datos". Como encargado, ese acceso debe limitarse a lo necesario, registrarse y estar previsto en el contrato con el cliente. Es una decisión de producto y legal, no solo técnica.
10. **Historia clínica:** confirmar las obligaciones de los clientes prestadores de salud (Resolución 1995 de 1999, Ley 2015 de 2020) y si la plataforma debe cumplir requisitos de interoperabilidad.
11. **Marca "Cumplido":** la búsqueda web no encontró software con ese nombre en el sector, pero eso no reemplaza la consulta de antecedentes marcarios en la SIC (clases 9 y 42). Es una palabra común: confirmar registrabilidad antes de invertir en el dominio y el material.
12. **Alcance de la "contabilidad completa":** el sitio dice que Cumplido Salud y Cumplido Belleza incluyen contabilidad (en desarrollo). Definir qué cubre (plan de cuentas, comprobantes, estados financieros, NIIF, información exógena) para no prometer más de lo que el producto hará.
13. **Afirmaciones de seguridad:** `/legal/seguridad` describe medidas "en desarrollo". Mover cada una a "vigente" solo cuando esté en producción.

## 3. Inventario de datos personales recolectados por el sitio

| Origen | Datos | Finalidad | Destino | Conservación |
|---|---|---|---|---|
| Formulario de contacto | Nombre, correo, empresa (opc.), sector, motivo, mensaje, canal, teléfono (solo si elige teléfono/WhatsApp) | Responder la solicitud, demo, cotización | Backend administrativo (por definir) | Borrador: 12 meses sin conversión |
| Formulario de contacto | Autorización de tratamiento (versión del aviso) | Evidencia de la autorización | Backend | Mientras exista la relación + plazo legal |
| Formulario de contacto | Autorización de publicidad (opcional, separada) | Envío de novedades | Backend | Hasta revocación |
| Servidor de alojamiento | IP, fecha, página solicitada (registros técnicos) | Operación y seguridad | Proveedor de alojamiento | Según proveedor |

El sitio **no** recolecta datos de salud, de menores ni de pago.

## 4. Proveedores externos

| Proveedor | Uso | Datos personales | Estado |
|---|---|---|---|
| Alojamiento del sitio (por definir) | Servir el sitio | Registros técnicos | Pendiente de elegir |
| Backend administrativo (propio) | Recibir solicitudes | Datos del formulario | Pendiente de construir |
| Lucide, Inter (@fontsource) | Iconos y tipografía | Ninguno: se incluyen en el sitio, sin solicitudes a terceros | Activo |

## 5. Inventario de cookies y almacenamiento

| Nombre | Tipo | Finalidad | Duración |
|---|---|---|---|
| `theme` | localStorage | Preferencia de tema claro/oscuro (solo si el usuario la cambia) | Hasta que se borre |
| `contact-last-sent` | localStorage | Evitar envíos repetidos del formulario | Hasta que se borre |

No hay cookies. No hay banner de consentimiento porque no hay tecnologías opcionales. Si se agrega analítica, captcha de terceros, mapas o vídeos, hay que implementar un gestor de consentimiento que **bloquee** esas herramientas hasta que el usuario acepte.
