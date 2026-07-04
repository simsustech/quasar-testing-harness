import { test, expect } from '@playwright/test'

test('DEBUG: check body class and getComputedStyle for each style', async ({ page }) => {
  for (const style of ['md3', 'md2', 'unstyled']) {
    await page.goto(`/q-btn?style=${style}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    
    const result = await page.evaluate((s) => {
      const bodyClasses = document.body.className
      const el = document.querySelector('[data-testid="component-preview"] .q-btn')
      if (!el) return { style: s, bodyClasses, found: false }
      const cs = getComputedStyle(el)
      return {
        style: s,
        bodyClasses,
        found: true,
        backgroundColor: cs.backgroundColor,
        color: cs.color,
        borderRadius: cs.borderRadius,
        height: cs.height,
        display: cs.display,
        // Check if unstyled reset is active: bg should NOT be transparent
        // for md3/md2
      }
    }, style)
    
    console.log(JSON.stringify(result, null, 2))
  }
})
