import { test, expect } from '@playwright/test'

const components = [
  { name: 'QBtn', selector: '.q-btn' },
  { name: 'QCard', selector: '.q-card' },
  { name: 'QDrawer', selector: '.q-drawer' },
  { name: 'QHeader', selector: '.q-header' },
  { name: 'QImg', selector: '.q-img' },
  { name: 'QChip', selector: '.q-chip' }
]
const styles = ['md3', 'md2', 'unstyled']

for (const comp of components) {
  for (const style of styles) {
    test(`${comp.name} @ ${style}`, async ({ page }) => {
      const slug = `q-${comp.name.slice(1).toLowerCase()}`
      await page.goto(`/${slug}?style=${style}`, {
        timeout: 15000
      })
      const el = page.locator(comp.selector).first()
      await expect(el).toBeVisible({ timeout: 8000 })

      // Verify basic rendering — element exists and has non-zero dimensions
      const box = await el.boundingBox()
      expect(box).toBeTruthy()
      expect(box!.width).toBeGreaterThan(0)
      expect(box!.height).toBeGreaterThan(0)
    })
  }
}
