import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('@playwright/test');

const BASE = 'http://[::1]:3000';

async function inspectComponent(page, url, label) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-testid="component-preview"]', { timeout: 10000 });

  const data = await page.evaluate(() => {
    const root = document.querySelector('[data-testid="component-preview"]');
    if (!root) return null;

    const inner = root.querySelector('.q-toggle__inner');
    const track = root.querySelector('.q-toggle__track');
    const thumb = root.querySelector('.q-toggle__thumb');
    const fieldLabel = root.querySelector('.q-field__label');
    const fieldNative = root.querySelector('.q-field__native');
    const fieldControl = root.querySelector('.q-field__control');
    const controlContainer = root.querySelector('.q-field__control-container');
    const labelEl = root.querySelector('.q-toggle__label');

    return {
      inner: inner ? (() => {
        const s = window.getComputedStyle(inner);
        return { 'font-size': s.fontSize, width: s.width, height: s.height, padding: s.padding };
      })() : null,
      track: track ? (() => {
        const s = window.getComputedStyle(track);
        return { width: s.width, height: s.height, 'border-radius': s.borderRadius, outline: s.outline, 'background-color': s.backgroundColor };
      })() : null,
      thumb: thumb ? (() => {
        const s = window.getComputedStyle(thumb);
        return { width: s.width, height: s.height, left: s.left, top: s.top, 'border-radius': s.borderRadius };
      })() : null,
      label: fieldLabel ? (() => {
        const s = window.getComputedStyle(fieldLabel);
        return { 'font-size': s.fontSize, top: s.top, left: s.left, 'padding-top': s.paddingTop, transform: s.transform, color: s.color };
      })() : null,
      native: fieldNative ? (() => {
        const s = window.getComputedStyle(fieldNative);
        return { 'padding-top': s.paddingTop, 'padding-bottom': s.paddingBottom, 'min-height': s.minHeight, 'font-size': s.fontSize, 'line-height': s.lineHeight };
      })() : null,
      control: fieldControl ? (() => {
        const s = window.getComputedStyle(fieldControl);
        return { height: s.height, 'padding-top': s.paddingTop, 'padding-bottom': s.paddingBottom, 'min-height': s.minHeight };
      })() : null,
      controlContainer: controlContainer ? (() => {
        const s = window.getComputedStyle(controlContainer);
        return { 'padding-top': s.paddingTop };
      })() : null,
      toggleLabel: labelEl ? (() => {
        const s = window.getComputedStyle(labelEl);
        return { 'padding-left': s.paddingLeft };
      })() : null,
    };
  });
  return { url, label, data };
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  const tests = [
    { url: `${BASE}/q-toggle?style=md3&label=Off&modelValue=false`, label: 'toggle-off' },
    { url: `${BASE}/q-toggle?style=md3&label=On&modelValue=true`, label: 'toggle-on' },
    { url: `${BASE}/q-toggle?style=md3&label=Compact&dense=true&modelValue=true`, label: 'toggle-dense-on' },
    { url: `${BASE}/q-toggle?style=md3&label=Compact&dense=true&modelValue=false`, label: 'toggle-dense-off' },
    { url: `${BASE}/q-input?style=md3&label=type&dense=true&outlined=true&modelValue=button`, label: 'input-dense-outlined-float' },
    { url: `${BASE}/q-input?style=md3&label=type&dense=true&outlined=true&modelValue=`, label: 'input-dense-outlined-empty' },
    { url: `${BASE}/q-input?style=md3&label=First&dense=true&filled=true&modelValue=John`, label: 'input-dense-filled-float' },
    { url: `${BASE}/q-input?style=md3&label=First&dense=true&filled=true&modelValue=`, label: 'input-dense-filled-empty' },
  ];

  const results = [];
  for (const t of tests) {
    const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
    try {
      const r = await inspectComponent(page, t.url, t.label);
      results.push(r);
      console.log(`✓ ${t.label}`);
    } catch (e) {
      console.error(`✗ ${t.label}: ${e.message}`);
    }
    await page.close();
  }

  await browser.close();

  // Print all results as JSON
  console.log('\n--- RESULTS ---');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
