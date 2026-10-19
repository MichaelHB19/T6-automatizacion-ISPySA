// @ts-check
const { test, expect } = require('@playwright/test');
const testData = require('../data/test-data.json');
const { verificarNavegacionGlobal, seleccionarFiltroRegional } = require('../helpers/navigation');
const { verificarImagenCargada, asertarNumeroConTolerancia } = require('../helpers/assertions');

test.describe('Casos T01 a T06 (ISPySA-Pneumonia)', () => {

  // T01: Carga y estructura del resumen nacional (RF-01, R-01)
  test('T01 - Carga y estructura del resumen nacional', async ({ page }) => {
    const res = await page.goto(testData.T01.ruta);
    expect(res?.status()).toBe(testData.T01.estado);

    const h1 = page.locator('h1');
    await expect(h1).toHaveText(testData.T01.h1);

    await verificarNavegacionGlobal(page, testData.T01.navegacion);
  });

  // T02: KPI, figura y enlaces del resumen (RF-01, R-01, R-07)
  test('T02 - KPI, figura y accesos rápidos del resumen nacional', async ({ page }) => {
    await page.goto(testData.T02.ruta);

    // Validar KPIs de menores y adultos
    const contenido = await page.content();
    expect(contenido).toContain(testData.T02.kpi.children.fecha);
    expect(contenido).toContain(String(testData.T02.kpi.children.casos));
    expect(contenido).toContain(testData.T02.kpi.children.hr);
    expect(contenido).toContain(testData.T02.kpi.children.cfr);

    expect(contenido).toContain(String(testData.T02.kpi.adults.casos));
    expect(contenido).toContain(testData.T02.kpi.adults.hr);
    expect(contenido).toContain(testData.T02.kpi.adults.cfr);

    // Validar carga de figura
    await verificarImagenCargada(page, 'national_annual_variation_grid.png');

    // Validar accesos rápidos
    for (const link of testData.T02.accesos_rapidos) {
      const acceso = page.locator(`a[href="${link}"]`).first();
      await expect(acceso).toBeVisible();
    }
  });

  // T03: Consulta regional con valores válidos (menores) (RF-02, R-02)
  test('T03 - Consulta regional con valores válidos (menores)', async ({ page }) => {
    const pasoInicial = testData.T03.pasos[0];
    const pasoLoreto = testData.T03.pasos[1];

    // 1. Estado inicial (/regional)
    await page.goto(pasoInicial.ruta);
    await expect(page.locator('h2')).toContainText(pasoInicial.h2);
    await verificarImagenCargada(page, 'HUANUCO_Children_5_Cases.png');

    // 2. Cambio a LORETO
    await page.goto(pasoLoreto.ruta);
    await expect(page.locator('h2')).toContainText(pasoLoreto.h2);
    await verificarImagenCargada(page, 'LORETO_Children_5_Cases.png');

    // Validar métricas en la tabla de LORETO
    const textoTabla = await page.locator('table').innerText();
    expect(textoTabla).toContain('0.75');
    expect(textoTabla).toContain('1.25');
  });

  // T04: Consulta regional: grupo adultos y entradas no válidas (RF-02, R-02)
  test('T04 - Consulta regional: grupo adultos y fallback ante parámetros no válidos', async ({ page }) => {
    // 1. Adultos CUSCO
    await page.goto(testData.T04.pasos[0].ruta);
    await expect(page.locator('h2')).toContainText(testData.T04.pasos[0].h2);
    const textoCusco = await page.locator('table').innerText();
    expect(textoCusco).toContain('0.225');

    // 2. Parámetros inválidos (xxx & zzz) -> Retorna a HUANUCO menores
    const resInv1 = await page.goto(testData.T04.pasos[1].ruta);
    expect(resInv1?.status()).toBe(200);
    await expect(page.locator('h2')).toContainText(testData.T04.pasos[1].h2);

    // 3. Región de otro grupo (AREQUIPA en children) -> Retorna a HUANUCO
    const resInv2 = await page.goto(testData.T04.pasos[2].ruta);
    expect(resInv2?.status()).toBe(200);
    await expect(page.locator('h2')).toContainText(testData.T04.pasos[2].h2);
  });

  // T05: Contenido de severidad para ambos grupos (RF-03, R-03)
  test('T05 - Contenido de la vista de severidad para ambos grupos', async ({ page }) => {
    await page.goto(testData.T05.ruta);

    // Contar tablas (exactamente 2)
    const tablas = page.locator('table');
    await expect(tablas).toHaveCount(testData.T05.tablas);

    // Validar que cada tabla tenga 5 filas en el tbody
    for (let i = 0; i < testData.T05.tablas; i++) {
      const filas = tablas.nth(i).locator('tbody tr');
      await expect(filas).toHaveCount(testData.T05.filas_por_tabla);
    }

    // Validar que carguen las dos imágenes
    await verificarImagenCargada(page, 'national_children_severity.png');
    await verificarImagenCargada(page, 'national_adults_severity.png');
  });

  // T06: Valores y formato de HR y CFR anuales (RF-03, R-03)
  test('T06 - Valores y formato de HR y CFR anuales contra CSV', async ({ page }) => {
    await page.goto(testData.T06.ruta);

    // Validar valores del grupo children
    for (const registro of testData.T06.severidad.children) {
      const fila = page.locator('table').first().locator(`tr:has-text("${registro.anio}")`);
      await expect(fila).toBeVisible();
      await expect(fila).toContainText(registro.hr);
      await expect(fila).toContainText(registro.cfr);
    }

    // Validar valores del grupo adults
    for (const registro of testData.T06.severidad.adults) {
      const fila = page.locator('table').nth(1).locator(`tr:has-text("${registro.anio}")`);
      await expect(fila).toBeVisible();
      await expect(fila).toContainText(registro.hr);
      await expect(fila).toContainText(registro.cfr);
    }
  });

});