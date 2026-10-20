const { test: base, expect } = require('@playwright/test');

const test = base.extend({
  evidenciaFinal: [async ({ page }, use, testInfo) => {
    await use();
    if (!page.isClosed() && page.url() !== 'about:blank') {
      const captura = testInfo.outputPath('pantalla-final.png');
      await page.screenshot({ path: captura, fullPage: true });
      await testInfo.attach('pantalla-final', { path: captura, contentType: 'image/png' });
    }
  }, { auto: true }]
});
module.exports = { test, expect };
