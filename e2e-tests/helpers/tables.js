const { expect } = require('@playwright/test');
const { asertarNumeroConTolerancia } = require('./assertions');

async function verificarRanking(seccion, esperado) {
  const filas = seccion.locator('tbody tr');
  await expect(filas).toHaveCount(esperado.length);
  for (const [i, registro] of esperado.entries()) {
    const celdas = filas.nth(i).locator('td');
    await expect(celdas).toHaveCount(3);
    await expect(celdas.nth(0)).toHaveText(registro.region);
    await expect(celdas.nth(1)).toHaveText(String(registro.apariciones));
    await expect(celdas.nth(2)).toHaveText(`${registro.porcentaje.toFixed(1)}%`);
  }
}

async function verificarMetricas(tabla, esperado) {
  const filas = tabla.locator('tbody tr');
  await expect(filas).toHaveCount(Object.keys(esperado).length);
  await expect(tabla.locator('thead th')).toHaveText(['Modelo', 'MAE', 'RMSE', 'R²']);
  for (const [modelo, valores] of Object.entries(esperado)) {
    const fila = filas.filter({ has: tabla.page().getByRole('cell', { name: modelo, exact: true }) });
    await expect(fila).toHaveCount(1);
    const celdas = fila.locator('td');
    await expect(celdas).toHaveCount(4);
    for (let i = 0; i < valores.length; i++) {
      asertarNumeroConTolerancia(await celdas.nth(i + 1).innerText(), valores[i], 0.000001);
    }
  }
}

async function verificarRecursoImagen(page, ruta) {
  const img = page.locator(`img[src="${ruta}"]`);
  await expect(img).toBeVisible();
  await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
  const respuesta = await page.request.get(ruta);
  expect(respuesta.status()).toBe(200);
  expect(respuesta.headers()['content-type']).toMatch(/^image\//);
  expect((await respuesta.body()).length).toBeGreaterThan(0);
}
module.exports = { verificarRanking, verificarMetricas, verificarRecursoImagen };
