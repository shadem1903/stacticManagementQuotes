// Plugin remark: reemplaza tokens {{clave}} en los documentos legales por los
// datos de src/config/company.json. Si el dato es null, inserta una marca
// visible "Pendiente: …" para que nunca se publique un campo inventado.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const companyPath = fileURLToPath(new URL('../config/company.json', import.meta.url));

export const TOKEN_LABELS = {
  legalName: 'razón social',
  legalForm: 'tipo societario',
  nit: 'NIT',
  address: 'domicilio',
  city: 'ciudad',
  country: 'país',
  commercialEmail: 'correo comercial',
  privacyEmail: 'correo de protección de datos',
  securityEmail: 'correo de seguridad',
  supportEmail: 'correo de soporte',
  phone: 'teléfono',
  siteUrl: 'dirección del sitio web',
  portalUrl: 'dirección del portal de clientes',
  hostingProvider: 'proveedor de alojamiento',
  hostingRegion: 'país o región de alojamiento',
  brandName: 'nombre comercial',
};

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function resolve(company, key) {
  const value = key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), company);
  return value === undefined ? null : value;
}

export function remarkCompanyTokens() {
  return (tree) => {
    const company = JSON.parse(readFileSync(companyPath, 'utf8'));
    const re = /\{\{\s*([a-zA-Z.]+)\s*\}\}/g;

    const walk = (node) => {
      if (!node.children) return;
      const out = [];
      for (const child of node.children) {
        if (child.type === 'text' && re.test(child.value)) {
          re.lastIndex = 0;
          let last = 0;
          let m;
          while ((m = re.exec(child.value))) {
            if (m.index > last) out.push({ type: 'text', value: child.value.slice(last, m.index) });
            const key = m[1];
            const value = resolve(company, key);
            if (value == null || value === '') {
              const label = TOKEN_LABELS[key] || key;
              out.push({
                type: 'html',
                value: `<mark class="pending" data-pending="${escapeHtml(key)}">Pendiente: ${escapeHtml(label)}</mark>`,
              });
            } else {
              out.push({ type: 'text', value: String(value) });
            }
            last = m.index + m[0].length;
          }
          if (last < child.value.length) out.push({ type: 'text', value: child.value.slice(last) });
        } else {
          walk(child);
          out.push(child);
        }
      }
      node.children = out;
    };
    walk(tree);
  };
}
