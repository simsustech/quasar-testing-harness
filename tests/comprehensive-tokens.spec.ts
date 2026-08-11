import { test, expect } from '@playwright/test'
import { computedRgba } from './helpers.js'

/**
 * Comprehensive CSS verification.
 * Checks actual computed styles + CSS variables across MD3/MD2/Unstyled.
 */

test.describe('Comprehensive CSS verification', () => {

  test('QBtn md3 light — correct colors and variables', async ({ page }) => {
    await page.goto('/q-btn?style=md3', { waitUntil: 'networkidle' })
    await expect(page.locator('[data-testid="component-preview"] .q-btn')).toBeVisible()

const result = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="component-preview"] .q-btn')!
      const s = getComputedStyle(el)
      const bodyStyle = getComputedStyle(document.body)
return {
        radius: s.borderRadius,
        height: s.height, fontSize: s.fontSize,
        bodyClass: document.body.className,
        vPrimary: bodyStyle.getPropertyValue('--q-primary').trim(),
        vOnPrimary: bodyStyle.getPropertyValue('--q-on-primary').trim(),
        vRadiusXl: bodyStyle.getPropertyValue('--q-radius-xl').trim(),
      }
    })

const SEL = '[data-testid="component-preview"] .q-btn'
    const bg = await computedRgba(page, SEL, 'background-color')
    const color = await computedRgba(page, SEL, 'color')

    expect(result.bodyClass).toContain('quasar-style-md3')
    // 0.5.x emits QBtn backgrounds via color-mix(in oklab, …), so computed
    // colors come back in oklab() — compare through the canvas round-trip.
    expect(bg).toEqual([103, 80, 164, 255])
    expect(color).toEqual([255, 255, 255, 255])
    expect(result.radius).toBe('28px')
    expect(result.height).toBe('36px')
    expect(result.fontSize).toBe('14px')
    expect(result.vPrimary).toMatch(/rgb\(103,\s*80,\s*164\)|#6750a4/)
    expect(result.vOnPrimary).toMatch(/ffffff|rgb\(255,\s*255,\s*255\)/)
    expect(result.vRadiusXl).toBe('28px')
  })

test('QBtn md2 light - md2 radius = --q-radius-sm (4px), same fill color', async ({ page }) => {
    await page.goto('/q-btn?style=md2', { waitUntil: 'networkidle' })
    await expect(page.locator('[data-testid="component-preview"] .q-btn')).toBeVisible()

    const result = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="component-preview"] .q-btn')!
      const s = getComputedStyle(el)
      const bodyStyle = getComputedStyle(document.body)
return {
        radius: s.borderRadius,
        vRadiusXl: bodyStyle.getPropertyValue('--q-radius-xl').trim(),
      }
    })

const bg = await computedRgba(page, '[data-testid="component-preview"] .q-btn', 'background-color')

    expect(bg).toEqual([103, 80, 164, 255])
    // 0.5.x preset: md2 btnRadius = var(--q-radius-sm) = 4px (md3 = --q-radius-xl = 28px)
    expect(result.radius).toBe('4px')
    expect(result.vRadiusXl).toBe('28px')
  })

  test('QBtn unstyled — transparent bg, no theme colors', async ({ page }) => {
    await page.goto('/q-btn?style=unstyled', { waitUntil: 'networkidle' })
    await expect(page.locator('[data-testid="component-preview"] .q-btn')).toBeVisible()

    const result = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="component-preview"] .q-btn')!
      const s = getComputedStyle(el)
      const bodyStyle = getComputedStyle(document.body)
      return {
        bg: s.backgroundColor, color: s.color, radius: s.borderRadius,
        vPrimary: bodyStyle.getPropertyValue('--q-primary').trim(),
        vRadiusXl: bodyStyle.getPropertyValue('--q-radius-xl').trim(),
      }
    })

    expect(result.bg).toBe('rgba(0, 0, 0, 0)')
    expect(result.radius).toBe('0px')
    expect(result.vPrimary).toBe('transparent')
    expect(result.vRadiusXl).toBe('0')
  })

  test('QBtn md3 dark — variables differ from light', async ({ page }) => {
    await page.goto('/q-btn?style=md3&dark=true', { waitUntil: 'networkidle' })
    await expect(page.locator('[data-testid="component-preview"] .q-btn')).toBeVisible()

    const result = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="component-preview"] .q-btn')!
      const s = getComputedStyle(el)
      const bodyStyle = getComputedStyle(document.body)
      return {
        bg: s.backgroundColor, color: s.color, radius: s.borderRadius,
        isDark: document.body.classList.contains('body--dark'),
        vPrimary: bodyStyle.getPropertyValue('--q-primary').trim(),
      }
    })

    expect(result.isDark).toBe(true)
    expect(result.radius).toBe('28px')
    expect(result.vPrimary).toBeTruthy()
    expect(result.vPrimary).not.toBe('transparent')
    // Dark primary should be different from light primary (#6750a4)
    expect(result.bg).not.toBe('rgb(103, 80, 164)')
    expect(result.color).not.toBe('rgb(0, 0, 0)')
  })

test('QBtn md2 dark - radius stays 4px', async ({ page }) => {
    await page.goto('/q-btn?style=md2&dark=true', { waitUntil: 'networkidle' })
    await expect(page.locator('[data-testid="component-preview"] .q-btn')).toBeVisible()

    const result = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="component-preview"] .q-btn')!
      const s = getComputedStyle(el)
      return {
        radius: s.borderRadius,
        isDark: document.body.classList.contains('body--dark'),
      }
    })

    expect(result.isDark).toBe(true)
expect(result.radius).toBe('4px')      // md2 btnRadius = --q-radius-sm in dark too
  })

  test('dark mode emits many color tokens (not just primary)', async ({ page }) => {
    await page.goto('/q-btn?style=md3&dark=true', { waitUntil: 'networkidle' })

    const tokens = await page.evaluate(() => {
      const bodyStyle = getComputedStyle(document.body)
      const keys = ['--q-primary', '--q-on-primary', '--q-primary-container',
        '--q-surface', '--q-on-surface', '--q-outline',
        '--q-surface-container', '--q-surface-container-low']
      return keys.map(k => bodyStyle.getPropertyValue(k).trim()).filter(Boolean)
    })

    expect(tokens.length).toBeGreaterThanOrEqual(8)
  })

  test('flat button uses primary color for text, not on-primary (white)', async ({ page }) => {
    await page.goto('/q-btn?style=md3&flat=true&label=Flat', { waitUntil: 'networkidle' })
    await expect(page.locator('[data-testid="component-preview"] .q-btn--flat')).toBeVisible()

    const result = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="component-preview"] .q-btn')!
      const s = getComputedStyle(el)
      return { bg: s.backgroundColor, color: s.color }
    })

    expect(result.bg).toBe('rgba(0, 0, 0, 0)')           // transparent
    expect(result.color).not.toBe('rgb(255, 255, 255)')   // NOT white
  })

  test('QCard md3 — surface container background', async ({ page }) => {
    await page.goto('/q-card?style=md3', { waitUntil: 'networkidle' })
    await expect(page.locator('[data-testid="component-preview"] .q-card')).toBeVisible()

    const result = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="component-preview"] .q-card')!
      const s = getComputedStyle(el)
      return { bg: s.backgroundColor, radius: s.borderRadius }
    })

    // QCard should have a non-transparent background and 16px radius
    expect(result.bg).not.toBe('rgba(0, 0, 0, 0)')
    expect(result.radius).toBe('16px')
  })

  test('no legacy --q-color-primary-bg or --q-color-primary-text in any stylesheet', async ({ page }) => {
    await page.goto('/q-btn?style=md3', { waitUntil: 'networkidle' })

const hasOld = await page.evaluate(() => {
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of Array.from(sheet.cssRules || [])) {
            const t = rule.cssText || ''
            if (t.includes('--q-color-primary-bg') || t.includes('--q-color-primary-text'))
              return true
          }
        } catch {
          /* cross-origin stylesheets throw on cssRules access */
        }
      }
      return false
    })

expect(hasOld).toBe(false)
  })
})
