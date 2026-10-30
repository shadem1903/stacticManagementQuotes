import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const PAGES = [
  '/', '/soluciones', '/soluciones/salud', '/soluciones/belleza', '/soluciones/administracion', '/funcionalidades',
  '/planes', '/promociones', '/nosotros', '/contacto', '/preguntas-frecuentes', '/legal',
  '/legal/privacidad', '/legal/tratamiento-de-datos', '/legal/aviso-de-privacidad', '/legal/cookies', '/legal/terminos',
  '/legal/servicio-saas', '/legal/cancelaciones-y-reembolsos', '/legal/promociones', '/legal/tratamiento-por-encargo', '/legal/seguridad',
];

for (const path of PAGES) {
  test(`${path}: carga, un h1, sin desborde horizontal, sin errores y accesible (WCAG AA)`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('title')).not.toBeEmpty();
    expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(', ')}`)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('los documentos legales en borrador no se indexan y muestran aviso', async ({ page }) => {
  await page.goto('/legal/tratamiento-de-datos');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.getByText('Borrador pendiente de revisión jurídica')).toBeVisible();
  await expect(page.locator('mark.pending').first()).toBeVisible();
});

test('página 404 personalizada', async ({ page }) => {
  await page.goto('/no-existe');
  await expect(page.getByRole('heading', { name: 'Esta página no existe' })).toBeVisible();
});

test('promociones: sin promociones vigentes muestra estado vacío', async ({ page }) => {
  await page.goto('/promociones');
  await expect(page.getByRole('heading', { name: 'No hay promociones vigentes' })).toBeVisible();
});

test('el ejemplo del inicio cambia entre Cumplido Salud y Cumplido Belleza', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#demo-salud')).toBeVisible();
  await page.getByRole('button', { name: 'Cumplido Belleza' }).click();
  await expect(page.locator('#demo-belleza')).toBeVisible();
  await expect(page.locator('#demo-salud')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Cumplido Belleza' })).toHaveAttribute('aria-pressed', 'true');
});

test('tema oscuro se aplica y se recuerda', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-theme-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme-resolved', 'dark');
  await page.goto('/planes');
  await expect(page.locator('html')).toHaveAttribute('data-theme-resolved', 'dark');
});

test.describe('navegación', () => {
  test('el menú lleva a cada software', async ({ page, isMobile }) => {
    await page.goto('/');
    if (isMobile) await page.locator('[data-menu-toggle]').click();
    await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Cumplido Belleza' }).click();
    await expect(page).toHaveURL(/\/soluciones\/belleza/);
    await expect(page.locator('h1')).toContainText('salón');
    if (isMobile) await page.locator('[data-menu-toggle]').click();
    await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Cumplido Salud' }).click();
    await expect(page.locator('h1')).toContainText('consultorio');
  });

  test('menú móvil abre, cierra con Escape y devuelve el foco', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'solo móvil');
    await page.goto('/');
    const btn = page.locator('[data-menu-toggle]');
    await btn.click();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Planes' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await expect(btn).toBeFocused();
  });

  test('pie de página enlaza todos los documentos legales', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    for (const name of ['Política de privacidad', 'Tratamiento de datos personales', 'Política de cookies', 'Condiciones del servicio SaaS', 'Seguridad y reporte de incidentes']) {
      await expect(footer.getByRole('link', { name })).toBeVisible();
    }
  });
});

test.describe('formulario de contacto', () => {
  test('muestra errores accesibles y enfoca el primer campo inválido', async ({ page }) => {
    await page.goto('/contacto');
    await page.getByRole('button', { name: 'Enviar solicitud' }).click();
    await expect(page.locator('#name')).toBeFocused();
    await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('[data-err="email"]')).toHaveText(/correo/);
    await expect(page.locator('[data-err="privacyAccepted"]')).not.toBeEmpty();
  });

  test('la casilla de publicidad es independiente y no viene marcada', async ({ page }) => {
    await page.goto('/contacto');
    await expect(page.locator('input[name="marketingOptIn"]')).not.toBeChecked();
    await expect(page.locator('input[name="privacyAccepted"]')).not.toBeChecked();
  });

  test('el teléfono solo se pide si el canal lo requiere', async ({ page }) => {
    await page.goto('/contacto');
    await expect(page.locator('#phone')).toBeHidden();
    await page.locator('input[name="channel"][value="whatsapp"]').check();
    await expect(page.locator('#phone')).toBeVisible();
  });

  test('prellenado desde la URL', async ({ page }) => {
    await page.goto('/contacto?motivo=planes&plan=profesional&producto=belleza');
    await expect(page.locator('#reason')).toHaveValue('planes');
    await expect(page.locator('#message')).toHaveValue(/plan Profesional de Cumplido Belleza/);
  });

  test('sin endpoint configurado no finge el envío', async ({ page }) => {
    await page.goto('/contacto');
    await page.fill('#name', 'Ana Pérez');
    await page.fill('#email', 'ana@clinica.co');
    await page.selectOption('#sector', 'Odontología');
    await page.selectOption('#reason', 'demo');
    await page.fill('#message', 'Somos 4 odontólogos y queremos organizar la agenda.');
    await page.check('input[name="privacyAccepted"]');
    await page.waitForTimeout(3100);
    await page.getByRole('button', { name: 'Enviar solicitud' }).click();
    await expect(page.locator('[data-err="form"]')).toContainText('no está conectado');
    await expect(page.locator('[data-success]')).toBeHidden();
  });
});
