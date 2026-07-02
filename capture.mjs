import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/q-btn?style=md3', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForSelector('.q-btn', { timeout: 8000 });
  await page.waitForTimeout(1000);
  
  const data = await page.evaluate(() => {
    const results = [];
    for (const sheet of document.styleSheets) {
      try {
        const rules = Array.from(sheet.cssRules);
        for (const rule of rules) {
          if (rule instanceof CSSStyleRule) {
            results.push(rule.cssText);
          }
        }
      } catch(e) {}
    }
    return results.filter(r => r.includes('.q-btn') || r.includes('button') || r.includes('@layer'));
  });
  
  for (const r of data) console.log(r);
  await browser.close();
})();
