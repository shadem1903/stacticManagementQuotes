---
title: Seguridad y reporte de incidentes
description: Medidas de seguridad del sitio y la plataforma, y cómo reportar una vulnerabilidad o incidente.
version: 0.1.0-borrador
effectiveDate: null
lastUpdated: "2026-10-28"
legalReviewed: false
scope: Sitio web público y plataforma de gestión.
related: [tratamiento-de-datos, tratamiento-por-encargo]
history:
  - { version: 0.1.0-borrador, date: "2026-10-28", changes: Primera redacción. }
---

## Lo que podemos afirmar hoy

No contamos con certificaciones de seguridad (como ISO/IEC 27001). Si obtenemos alguna, la publicaremos aquí con su alcance y vigencia.

## En este sitio web

- Se sirve exclusivamente por HTTPS, con cabeceras de seguridad (política de seguridad de contenido, protección contra encuadre y control de referencias).
- No carga scripts de terceros ni cookies de seguimiento.
- El formulario de contacto valida los datos, limita envíos repetidos y tiene protección contra bots. Los datos se envían cifrados al sistema de solicitudes.
- El formulario no da acceso a la plataforma ni a datos de ninguna empresa.

## En la plataforma (en desarrollo)

Estas son las medidas que estamos implementando. Las marcaremos como vigentes a medida que pasen a producción:

- Autenticación de usuarios y permisos por rol, módulo, área y función.
- Separación lógica de la información de cada empresa.
- Acceso a la historia clínica solo con permiso clínico, con registro de accesos.
- Cifrado de la comunicación en tránsito y de los respaldos.
- Copias de seguridad periódicas con pruebas de restauración.
- Registros de actividad sin contraseñas ni tokens.
- Actualización periódica de dependencias y pruebas de seguridad antes de cada publicación.

## Cómo reportar una vulnerabilidad

Si encuentras una posible vulnerabilidad, escríbenos a {{securityEmail}} con:

1. Descripción del problema y dónde lo encontraste.
2. Pasos para reproducirlo.
3. Impacto que crees que tiene.

Te confirmaremos la recepción en un plazo de tres (3) días hábiles. Te pedimos no acceder a datos de terceros, no afectar la disponibilidad del servicio y darnos un plazo razonable para corregir antes de divulgarlo.

## Si crees que tus datos se vieron afectados

Escríbenos a {{privacyEmail}}. Si el incidente afecta datos de una empresa cliente, la informaremos para que pueda notificar a sus titulares y a la Superintendencia de Industria y Comercio cuando corresponda.
