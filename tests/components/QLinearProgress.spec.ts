import { test, expect } from '@playwright/test'
import fs from 'node:fs'

import { styleFromPage, shotPath, shot, dumpDiagnostics, computedStyles } from '../helpers.js'

const SLUG = 'q-linear-progress'
const STYLES = ['md3', 'md2', 'unstyled'] as const

test.describe('QLinearProgress', () => {
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

test.describe('QLinearProgress — prop variations', () => {
  const variants = [
    { label: 'determinate-65', query: 'value=65&color=primary&size=8px' },
    { label: 'stripe', query: 'value=65&color=primary&size=8px&stripe=true' },
    { label: 'indeterminate', query: 'indeterminate=true&color=primary&size=8px' },
    { label: 'query', query: 'query=true&color=primary&size=8px' },
    { label: 'color-secondary', query: 'value=65&color=secondary&size=8px' },
    { label: 'rounded', query: 'value=65&color=primary&size=8px&rounded=true' },
  ]

  test('all visual variants at md3', async ({ page }) => {
    for (const v of variants) {
      await page.goto(`/${SLUG}?style=md3&${v.query}`, { waitUntil: 'networkidle' })
      await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 10_000 })
      const png = await shot(page, SLUG, v.label, 'md3')
      await dumpDiagnostics(page, SLUG, v.label, 'md3')
      expect(fs.statSync(png).size).toBeGreaterThan(100)
    }
  })
})



test.describe('q-linear-progress — dark mode', () => {
  test('renders cleanly with ?style=md3&dark=true', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md3&dark=true`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 10_000 })
    await shot(page, SLUG, 'dark', 'md3')
    await dumpDiagnostics(page, SLUG, 'dark', 'md3')
  })
})
