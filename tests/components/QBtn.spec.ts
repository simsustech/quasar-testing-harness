import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import { shot, dumpDiagnostics, DEVICES } from '../helpers.js'

const SLUG = 'q-btn'
const STYLES = ['md3', 'md2', 'unstyled'] as const

test.describe('QBtn', () => {
  for (const style of STYLES) {
    test(`renders cleanly with ?style=${style}`, async ({ page }) => {
      await page.goto(`/${SLUG}?style=${style}`, { waitUntil: 'networkidle' })
      await expect(page.locator('.control-panel')).toBeVisible({ timeout: 10_000 })
      await expect(page.getByTestId('component-preview')).toBeVisible()
      const png = await shot(page, SLUG, { style }, style)
      await dumpDiagnostics(page, SLUG, { style }, style)
      expect(fs.existsSync(png)).toBe(true)
      expect(fs.statSync(png).size).toBeGreaterThan(100)
    })
  }
})

test.describe('QBtn — prop variations', () => {
  const variants = [
    { label: 'filled-primary', query: 'label=Hello&color=primary' },
    { label: 'outline', query: 'label=Outline&outline=true&color=primary' },
    { label: 'flat', query: 'label=Flat&flat=true&color=accent' },
    { label: 'unelevated', query: 'label=Unelevated&unelevated=true&color=primary' },
    { label: 'rounded', query: 'label=R&rounded=true&color=primary' },
    { label: 'square', query: 'label=SQ&square=true&color=primary' },
    { label: 'push', query: 'label=Push&push=true&color=primary' },
    { label: 'glossy', query: 'label=Shiny&glossy=true&color=primary' },
    { label: 'no-caps', query: 'label=hello&noCaps=true&color=primary' },
    { label: 'loading', query: 'label=Saving&color=primary&loading=true' },
    { label: 'disabled', query: 'label=Off&disable=true&color=primary' },
    { label: 'size-xs', query: 'label=Tiny&size=xs&color=primary' },
    { label: 'size-sm', query: 'label=Small&size=sm&color=primary' },
    { label: 'size-lg', query: 'label=Big&size=lg&color=primary' },
    { label: 'size-xl', query: 'label=Huge&size=xl&color=primary' },
    { label: 'icon', query: 'icon=i-mdi-home&color=primary' },
    { label: 'icon-label', query: 'label=Home&icon=i-mdi-home&color=primary' },
    { label: 'color-secondary', query: 'label=Two&color=secondary' },
    { label: 'color-negative', query: 'label=Delete&color=negative' },
    { label: 'color-accent', query: 'label=Accent&color=accent' },
    { label: 'dense', query: 'label=Compact&dense=true&color=primary' },
  ]

  test('all visual variants at md3', async ({ page }) => {
    test.setTimeout(120_000)
    for (const v of variants) {
      await page.goto(`/${SLUG}?style=md3&${v.query}`, { waitUntil: 'domcontentloaded' })
      await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 15_000 })
      const png = await shot(page, SLUG, v.label, 'md3')
      await dumpDiagnostics(page, SLUG, v.label, 'md3')
      expect(fs.statSync(png).size).toBeGreaterThan(100)
    }
  })
})

test.describe('QBtn — border-radius', () => {
  test('standard button is rounded at md3', async ({ page }) => {
    await page.goto('/q-btn?style=md3', { waitUntil: 'networkidle' })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 15_000 })
    const btn = page.locator('.q-btn--standard').first()
    await expect(btn).toBeVisible()
    const radius = await btn.evaluate(el => getComputedStyle(el).borderRadius)
    expect(radius).toBe('28px')
  })
})

test.describe('QBtn — md3 border-radius', () => {
  const cases = [
    { name: 'standard (filled)', query: '' },
    { name: 'standard with icon', query: 'icon=i-mdi-search' },
  ]
  for (const c of cases) {
    test(c.name, async ({ page }) => {
      await page.goto(`/q-btn?style=md3&${c.query}`, { waitUntil: 'networkidle' })
      await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 15_000 })
      const btn = page.locator('.q-btn--standard').or(page.locator('.q-btn')).first()
      await expect(btn).toBeVisible()
      const radius = await btn.evaluate(el => getComputedStyle(el).borderRadius)
      expect(radius).toBe('28px')
    })
  }
})

test.describe('QBtn — dark mode', () => {
  const darkVariants = [
    { label: 'dark-filled', query: 'label=Hello&color=primary&dark=true' },
    { label: 'dark-outline', query: 'label=Outline&outline=true&color=primary&dark=true' },
    { label: 'dark-flat', query: 'label=Flat&flat=true&color=primary&dark=true' },
  ]
  test('dark mode variants at md3', async ({ page }) => {
    for (const v of darkVariants) {
      await page.goto(`/${SLUG}?style=md3&${v.query}`, { waitUntil: 'networkidle' })
      await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 10_000 })
      await shot(page, SLUG, v.label, 'md3')
      await dumpDiagnostics(page, SLUG, v.label, 'md3')
    }
  })
})
