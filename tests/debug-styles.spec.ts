import { test, expect } from '@playwright/test'
import fs from 'node:fs'

test('DEBUG: capture all computed styles for problem components', async ({ page }) => {
  // QTooltip
  await page.goto('/q-tooltip?style=md3', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  const tooltipStyles = await page.evaluate(() => {
    const el = document.querySelector('.q-tooltip')
    if (!el) return { found: false }
    const s = getComputedStyle(el)
    return {
      found: true,
      display: s.display,
      alignItems: s.alignItems,
      overflow: s.overflow,
      overflowY: s.overflowY,
      padding: s.padding,
      height: s.height,
      lineHeight: s.lineHeight,
      fontSize: s.fontSize,
      backgroundColor: s.backgroundColor,
      color: s.color,
      text: el.textContent?.trim()
    }
  })
  console.log('QTooltip:', JSON.stringify(tooltipStyles, null, 2))

  // QBadge with icon
  await page.goto('/composites?style=md3', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  const badgeStyles = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="composite-icon-badge"] .q-badge')
    if (!el) return { found: false }
    const s = getComputedStyle(el)
    return {
      found: true,
      display: s.display,
      position: s.position,
      top: s.top,
      right: s.right,
      height: s.height,
      fontSize: s.fontSize,
      lineHeight: s.lineHeight,
      backgroundColor: s.backgroundColor,
      color: s.color,
      zIndex: s.zIndex,
      overflow: s.overflow,
      maskImage: s.maskImage,
      text: el.textContent?.trim()
    }
  })
  console.log('QBadge:', JSON.stringify(badgeStyles, null, 2))

  // QBtn FAB
  await page.goto('/q-fab?style=md3', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  const fabStyles = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="component-preview"] .q-btn--fab')
    if (!el) return { found: false }
    const icon = el.querySelector('.q-icon')
    const s = getComputedStyle(el)
    const si = icon ? getComputedStyle(icon) : null
    return {
      found: true,
      width: s.width,
      height: s.height,
      display: s.display,
      alignItems: s.alignItems,
      justifyContent: s.justifyContent,
      overflow: s.overflow,
      iconDisplay: si?.display,
      iconAlign: si?.alignSelf
    }
  })
  
  // Check which stylesheets have tooltip rules
  const sheets = await page.evaluate(() => {
    const result = [];
    for (const sheet of document.styleSheets) {
      try {
        const rules = Array.from(sheet.cssRules || []);
        for (const rule of rules) {
          if (rule.cssText?.includes('q-tooltip')) {
            result.push(rule.cssText);
          }
        }
      } catch(e) {}
    }
    return result;
  });
  console.log('Stylesheets with tooltip:', JSON.stringify(sheets, null, 2));

  expect(true).toBe(true)
})
