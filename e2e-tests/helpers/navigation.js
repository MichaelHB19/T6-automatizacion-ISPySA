// @ts-check
const { expect } = require('@playwright/test');

/**
 * Valida los 5 enlaces de la barra de navegación superior.
 * @param {import('@playwright/test').Page} page
 * @param {string[]} rutasEsperadas
 */
async function verificarNavegacionGlobal(page, rutasEsperadas) {
  const nav = page.locator('.nav-links, nav');
  await expect(nav).toBeVisible();
  for (const ruta of rutasEsperadas) {
    const enlace = nav.locator(`a[href="${ruta}"]`);
    await expect(enlace).toBeVisible();
  }
}

/**
 * Selecciona grupo y región en la vista /regional
 * @param {import('@playwright/test').Page} page
 * @param {string} grupo
 * @param {string} region
 */
async function seleccionarFiltroRegional(page, grupo, region) {
  if (grupo) {
    await page.locator('select[name="grupo"]').selectOption(grupo);
  }
  if (region) {
    await page.locator('select[name="region"]').selectOption(region);
  }
}

module.exports = {
  verificarNavegacionGlobal,
  seleccionarFiltroRegional
};