// @ts-check
const { expect } = require('@playwright/test');

/**
 * Valida que una imagen cargue correctamente con código HTTP 200.
 * @param {import('@playwright/test').Page} page
 * @param {string} srcSubstring
 */
async function verificarImagenCargada(page, srcSubstring) {
  const img = page.locator(`img[src*="${srcSubstring}"]`);
  await expect(img).toBeVisible();
  const naturalWidth = await img.evaluate((el) => /** @type {HTMLImageElement} */ (el).naturalWidth);
  expect(naturalWidth).toBeGreaterThan(0);
}

/**
 * Compara dos números con tolerancia para evitar discrepancias por formato (ej. 0.9 vs 0.90)
 * @param {number|string} valorReal
 * @param {number|string} valorEsperado
 * @param {number} [tolerancia=0.01]
 */
function asertarNumeroConTolerancia(valorReal, valorEsperado, tolerancia = 0.01) {
  const numReal = parseFloat(String(valorReal).replace('%', '').trim());
  const numEsp = parseFloat(String(valorEsperado).replace('%', '').trim());
  expect(Math.abs(numReal - numEsp)).toBeLessThanOrEqual(tolerancia);
}

module.exports = {
  verificarImagenCargada,
  asertarNumeroConTolerancia
};