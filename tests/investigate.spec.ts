import { test, expect } from '@playwright/test';
import * as fs from 'fs';

const components = [
  { name: 'QBtn', selector: '.q-btn' },
  { name: 'QCard', selector: '.q-card' },
  { name: 'QDrawer', selector: '.q-drawer' },
  { name: 'QHeader', selector: '.q-header' },
  { name: 'QImg', selector: '.q-img' },
  { name: 'QChip', selector: '.q-chip' },
];
const styles = ['md3', 'md2', 'unstyled'];

const findings: Record<string, any> = {};

for (const comp of components) {
  for (const style of styles) {
    test(`${comp.name} @ ${style}`, async ({ page }) => {
      await page.goto(`http://localhost:3000/${comp.name.toLowerCase()}?style=${style}`, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForSelector(comp.selector, { timeout: 8000 });
      await page.waitForTimeout(500);

      const data = await page.evaluate((sel) => {
        const el = document.querySelector(sel) as HTMLElement;
        if (!el) return { error: 'element not found' };
        const cs = getComputedStyle(el);
        const rules: any[] = [];
        for (const sheet of document.styleSheets) {
          try {
            for (const rule of sheet.cssRules as any) {
              if (rule instanceof CSSStyleRule && rule.selectorText.includes(sel.replace('.', ''))) {
                rules.push({
                  selector: rule.selectorText.substring(0, 200),
                  css: rule.style.cssText.substring(0, 500)
                });
              }
            }
          } catch(e) {}
        }
        return {
          class: el.className.substring(0, 200),
          computed: {
            bg: cs.backgroundColor,
            color: cs.color,
            display: cs.display,
            position: cs.position,
            opacity: cs.opacity,
            width: cs.width,
            height: cs.height,
            borderRadius: cs.borderRadius,
            fontSize: cs.fontSize,
            fontWeight: cs.fontWeight,
            zIndex: cs.zIndex,
            visibility: cs.visibility,
          },
          matchingRules: rules
        };
      }, comp.selector);

      findings[`${comp.name}_${style}`] = data;
    });
  }
}

test.afterAll(() => {
  fs.writeFileSync('/home/stefan/Projects/unocss-preset-quasar/investigation-findings.json', JSON.stringify(findings, null, 2));
});
