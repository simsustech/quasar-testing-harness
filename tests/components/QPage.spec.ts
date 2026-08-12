import { test, expect } from '@playwright/test'
import fs from 'node:fs'

import { styleFromPage, shotPath, shot, dumpDiagnostics, computedStyles } from '../helpers.js'

const SLUG = 'q-page'
const STYLES = ['md3', 'md2', 'unstyled'] as const
const PADDING_STYLES = ['md3', 'md2'] as const

test.describe('QPage', () => {
  for (const style of STYLES) {
    test(`renders cleanly with ?style=${style}`, async ({ page }) => {
      await page.goto(`/${SLUG}?style=${style}`, { waitUntil: 'networkidle' })
      await expect(page.locator('.control-panel')).toBeVisible({ timeout: 10_000 })
      await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 30_000 })
      const png = await shot(page, SLUG, { style }, style)
      await dumpDiagnostics(page, SLUG, { style }, style)
      expect(fs.existsSync(png)).toBe(true)
      expect(fs.statSync(png).size).toBeGreaterThan(100)
    })
  }
})

test.describe('QPage — padding prop', () => {
  for (const style of PADDING_STYLES) {
    test(`padding=true adds q-layout-padding class and responsive padding (?style=${style})`, async ({ page }) => {
      await page.goto(`/${SLUG}?style=${style}&padding=true`, { waitUntil: 'networkidle' })
      await expect(page.locator('.control-panel')).toBeVisible({ timeout: 10_000 })

      // Wait for the QPage component to render inside the nested QLayout
      const qpage = page.locator('[data-testid="component-preview"] main.q-page')
      await expect(qpage).toBeAttached({ timeout: 10_000 })

      // Must have the q-layout-padding class
      await expect(qpage).toHaveClass(/q-layout-padding/)

      // Must have non-zero computed padding (responsive: 16px at 1280px viewport)
      const s = await computedStyles(page, {
        'main.q-page': ['padding-top', 'padding-right', 'padding-bottom', 'padding-left']
      })
      const paddingVal = s['main.q-page']?.['padding-top']
      expect(paddingVal).toBeTruthy()
      expect(parseFloat(paddingVal!)).toBeGreaterThan(0)
    })

    test(`padding=false does NOT add q-layout-padding (?style=${style})`, async ({ page }) => {
      await page.goto(`/${SLUG}?style=${style}`, { waitUntil: 'networkidle' })
      await expect(page.locator('.control-panel')).toBeVisible({ timeout: 10_000 })

      const qpage = page.locator('[data-testid="component-preview"] main.q-page')
      await expect(qpage).toHaveClass(/^q-page$/)
    })
  }
})

test.describe('q-page — dark mode', () => {
  test('renders cleanly with ?style=md3&dark=true', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md3&dark=true`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 30_000 })
    await shot(page, SLUG, 'dark', 'md3')
    await dumpDiagnostics(page, SLUG, 'dark', 'md3')
  })
})
