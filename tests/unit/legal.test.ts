import { describe, it, expect } from 'vitest';
import { remarkCompanyTokens } from '../../src/lib/remark-company-tokens.mjs';

const run = (text: string) => {
  const tree: any = { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', value: text }] }] };
  remarkCompanyTokens()(tree);
  return tree.children[0].children;
};

describe('remarkCompanyTokens', () => {
  it('marca como pendiente los datos que faltan, nunca inventa', () => {
    const out = run('Responsable: {{legalName}}.');
    const html = out.find((n: any) => n.type === 'html');
    expect(html.value).toContain('Pendiente: razón social');
    expect(html.value).toContain('class="pending"');
  });
  it('reemplaza los datos existentes', () => {
    const out = run('País: {{country}}');
    expect(out.map((n: any) => n.value).join('')).toBe('País: Colombia');
  });
});
