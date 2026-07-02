import { chromium } from 'playwright';

const components = ['q-btn', 'q-card', 'q-drawer', 'q-header', 'q-img', 'q-chip'];
const styles = ['md3', 'md2', 'unstyled'];

async function checkComponent(page, component, style) {
  await page.goto(`http://localhost:3000/${component}?style=${style}`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForSelector(`.${component}`, { timeout: 8000 });

  const results = await page.evaluate((comp) => {
    const el = document.querySelector('.' + comp);
    if (!el) return { error: 'element not found' };

    const cs = getComputedStyle(el);

    return {
      class: el.className.substring(0, 120),
      backgroundColor: cs.backgroundColor,
      color: cs.color,
      display: cs.display,
      position: cs.position,
      opacity: cs.opacity,
      width: cs.width,
      height: cs.height,
      padding: cs.padding,
      borderRadius: cs.borderRadius,
      boxShadow: cs.boxShadow,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
      visibility: cs.visibility,
      zIndex: cs.zIndex,
      top: cs.top,
      left: cs.left,
      right: cs.right,
      bottom: cs.bottom,
      transform: cs.transform,
    };
  }, component);

  // Get all CSS rules for this component
  const cssRules = await page.evaluate((comp) => {
    const rules = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules || []) {
          if (rule instanceof CSSStyleRule) {
            const sel = rule.selectorText;
            if (sel.includes('.' + comp)) {
              const bg = rule.style.backgroundColor;
              const clr = rule.style.color;
              if (bg || clr) {
                rules.push({
                  selector: sel.substring(0, 100),
                  bg: bg,
                  color: clr
                });
              }
            }
          }
        }
      } catch(e) {}
    }
    return rules;
  }, component);

  return { computed: results, cssRules };
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const findings = {};

  for (const comp of components) {
    findings[comp] = {};
    for (const style of styles) {
      console.log(`Checking ${comp} @ ${style}...`);
      try {
        findings[comp][style] = await checkComponent(page, comp, style);
      } catch(e) {
        findings[comp][style] = { error: e.message };
      }
    }
  }

  console.log(JSON.stringify(findings, null, 2));
  await browser.close();
})();
