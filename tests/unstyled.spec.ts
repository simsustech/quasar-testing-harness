import { test, expect } from '@playwright/test'

test.describe('Unstyled style', () => {
  test.beforeEach(async ({ page }) => {
    page.on('pageerror', (err) => { throw err })
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') throw new Error(msg.text())
    })
  })

  test('QBtn has no background or primary color by default', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.goto('/q-btn?style=unstyled', { waitUntil: 'networkidle', timeout: 20000 })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 10000 })
    await page.waitForSelector('.q-btn', { timeout: 5000 })
    const styles = await page.evaluate(() => {
      const btn = document.querySelector('.q-btn')!
      return {
        bg: getComputedStyle(btn).backgroundColor,
        color: getComputedStyle(btn).color
      }
    })
    expect(styles.bg).toBe('rgba(0, 0, 0, 0)')
    expect(styles.color).not.toContain('103, 80, 164')
  })

  test('Inline style overrides unstyled default', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.goto('/q-btn?style=unstyled', { waitUntil: 'networkidle', timeout: 20000 })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 10000 })
    await page.waitForSelector('.q-btn', { timeout: 5000 })
    const bg = await page.evaluate(() => {
      const btn = document.querySelector('.q-btn')!
      btn.setAttribute('style', 'background: rgb(0, 128, 0) !important')
      return getComputedStyle(btn).backgroundColor
    })
    expect(bg).toBe('rgb(0, 128, 0)')
  })

  test('Binding a Quasar color prop does not theme the component', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.goto('/q-btn?style=unstyled&color=secondary', { waitUntil: 'networkidle', timeout: 20000 })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 10000 })
    await page.waitForSelector('.q-btn', { timeout: 5000 })
    const bg = await page.evaluate(() => getComputedStyle(document.querySelector('.q-btn')!).backgroundColor)
    // Should be transparent — the color prop should NOT force a background in unstyled
    expect(bg).toBe('rgba(0, 0, 0, 0)')
  })

  test('Rendering multiple components with no theme leaking', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.goto('/q-card?style=unstyled', { waitUntil: 'networkidle', timeout: 20000 })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 10000 })
    await page.waitForSelector('.q-card', { timeout: 5000 })
    const styles = await page.evaluate(() => {
      const card = document.querySelector('.q-card')!
      return {
        bg: getComputedStyle(card).backgroundColor,
        shadow: getComputedStyle(card).boxShadow
      }
    })
    expect(styles.bg).toBe('rgba(0, 0, 0, 0)')
  })
})
