const { test, expect } = require('../helpers/fixtures');
const testData = require('../data/test-data.json');
const { verificarRanking, verificarMetricas, verificarRecursoImagen } = require('../helpers/tables');

test.describe('Casos T07 a T12 (ISPySA-Pneumonia)', () => {
  test('T07 - Ranking de menores de 5 años', async ({ page }) => {
    const dato = testData.T07;
    const respuesta = await page.goto(dato.ruta);
    expect(respuesta.status()).toBe(200);
    const seccion = page.getByRole('region', { name: 'Top regiones menores de 5 años', exact: true });
    await verificarRanking(seccion, dato.ranking);
    await verificarRecursoImagen(page, dato.figura);
  });

  test('T08 - Ranking de adultos 60+ y recursos', async ({ page }) => {
    const dato = testData.T08;
    const respuesta = await page.goto(dato.ruta);
    expect(respuesta.status()).toBe(200);
    const seccion = page.getByRole('region', { name: 'Top regiones adultos 60+', exact: true });
    await verificarRanking(seccion, dato.ranking);
    await verificarRecursoImagen(page, dato.figura);
  });

  test('T09 - Pronóstico nacional de menores de 5 años', async ({ page }) => {
    const dato = testData.T09;
    const respuesta = await page.goto(dato.ruta);
    expect(respuesta.status()).toBe(200);
    const seccion = page.getByRole('region', { name: 'Pronóstico nacional menores de 5 años', exact: true });
    await verificarMetricas(seccion.locator('table'), dato.metricas);
    await verificarRecursoImagen(page, dato.figura);
  });

  test('T10 - Pronóstico nacional de adultos 60+', async ({ page }) => {
    const dato = testData.T10;
    const respuesta = await page.goto(dato.ruta);
    expect(respuesta.status()).toBe(200);
    const seccion = page.getByRole('region', { name: 'Pronóstico nacional adultos 60+', exact: true });
    await verificarMetricas(seccion.locator('table'), dato.metricas);
    await verificarRecursoImagen(page, dato.figura);
  });

  test('T11 - Recurso heredado permitido', async ({ page, request }, testInfo) => {
    const dato = testData.T11;
    const respuesta = await request.get(dato.ruta);
    await testInfo.attach('respuesta-http', {
      body: JSON.stringify({ ruta: dato.ruta, estado: respuesta.status(), cabeceras: respuesta.headers() }, null, 2),
      contentType: 'application/json'
    });
    expect(respuesta.status()).toBe(dato.estado);
    expect(respuesta.headers()['content-type']).toMatch(/^image\//);
    expect((await respuesta.body()).length).toBeGreaterThan(0);
    await page.goto(dato.ruta);
    await expect.poll(() => page.locator('img').evaluate(el => el.naturalWidth)).toBeGreaterThan(0);
  });

  test('T12 - Recurso inexistente y bloqueo de traversal', async ({ page, request }, testInfo) => {
    for (const [i, dato] of testData.T12.rutas.entries()) {
      await test.step(`Solicitar ${dato.ruta}`, async () => {
        const respuesta = await request.get(dato.ruta, { maxRedirects: 0 });
        await testInfo.attach(`respuesta-${i + 1}`, {
          body: JSON.stringify({ ruta: dato.ruta, estado: respuesta.status(), esperado: dato.estado_esperado,
            tipo: respuesta.headers()['content-type'] }, null, 2),
          contentType: 'application/json'
        });
        await page.goto(dato.ruta);
        await testInfo.attach(`T12-${i + 1}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
        // Se conserva el 404 esperado aunque el defecto INC-01 siga presente.
        expect.soft(respuesta.status(), `${dato.ruta}: debe impedir acceso fuera de outputs`).toBe(dato.estado_esperado);
      });
    }
  });
});
