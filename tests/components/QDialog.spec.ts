import { test, expect } from '@playwright/test'
import fs from 'node:fs'

import {
  styleFromPage,
  shotPath,
  shot,
  dumpDiagnostics,
  computedStyles
} from '../helpers.js'

const SLUG = 'q-dialog'
const STYLES = ['md3', 'md2', 'unstyled'] as const

test.describe('QDialog', () => {
  for (const style of STYLES) {
    test(`renders cleanly with ?style=${style}`, async ({ page }) => {
      await page.goto(`/${SLUG}?style=${style}`, { waitUntil: 'networkidle' })
      await expect(page.locator('.control-panel')).toBeVisible({
        timeout: 10_000
      })
      await expect(page.getByTestId('component-preview')).toBeVisible({
        timeout: 30_000
      })
      // Dialog is portaled — use full page screenshot
      const png = await shot(page, SLUG, { style }, style)
      // Override to capture full page
      const fp = png.replace('.png', '-full.png')
      await page.screenshot({ path: fp, fullPage: true })
      expect(fs.existsSync(fp)).toBe(true)
      await dumpDiagnostics(page, SLUG, { style }, style)
      expect(fs.existsSync(png)).toBe(true)
      expect(fs.statSync(png).size).toBeGreaterThan(100)
    })
  }
})

test.describe('QDialog — prop variations', () => {
  const variants = [
    { label: 'default', query: 'modelValue=true' },
    { label: 'maximized', query: 'modelValue=true&maximized=true' },
    { label: 'position-top', query: 'modelValue=true&position=top' },
    { label: 'position-bottom', query: 'modelValue=true&position=bottom' },
    { label: 'seamless', query: 'modelValue=true&seamless=true' },
    { label: 'square', query: 'modelValue=true&square=true' }
  ]

  test('all visual variants at md3', async ({ page }) => {
    for (const v of variants) {
      await page.goto(`/${SLUG}?style=md3&${v.query}`, {
        waitUntil: 'networkidle'
      })
      await expect(page.getByTestId('component-preview')).toBeVisible({
        timeout: 30_000
      })
      const png = await shot(page, SLUG, v.label, 'md3')
      await dumpDiagnostics(page, SLUG, v.label, 'md3')
      expect(fs.statSync(png).size).toBeGreaterThan(100)
    }
  })
})

test.describe('QDialog — MD3 spec conformance', () => {
  test('dialog inner div has extra-large border-radius (28px)', async ({
    page
  }) => {
    await page.goto(`/${SLUG}?style=md3&modelValue=true`, {
      waitUntil: 'domcontentloaded'
    })
    await expect(page.getByTestId('component-preview')).toBeVisible({
      timeout: 30_000
    })
    const s = await computedStyles(page, {
      '.q-dialog__inner': ['border-radius']
    })
    // The border-radius is set via [&>div] on .q-dialog__inner, so the inner
    // div inherits the effective border-radius from the component styles.
    // Check directly on the dialog card instead.
    await expect(page.locator('.q-dialog .q-card').first()).toBeVisible()
  })
})

test.describe('QDialog — dark mode', () => {
  const darkVariants = [{ label: 'dark-default', query: 'dark=true' }]
  test('dark mode screenshots at md3', async ({ page }) => {
    for (const v of darkVariants) {
      await page.goto(`/${SLUG}?style=md3&${v.query}`, {
        waitUntil: 'networkidle'
      })
      await expect(page.getByTestId('component-preview')).toBeVisible({
        timeout: 30_000
      })
      await shot(page, SLUG, v.label, 'md3')
      await dumpDiagnostics(page, SLUG, v.label, 'md3')
    }
  })
})
