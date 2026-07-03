import { test, expect } from '@playwright/test'
import fs from 'node:fs'

import { styleFromPage, shotPath, shot, dumpDiagnostics } from '../helpers.js'

const SLUG = 'q-chip'
const STYLES = ['md3', 'md2', 'unstyled'] as const

test.describe('QChip', () => {
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

test.describe('QChip — prop variations', () => {
  const variants = [
    { label: 'default', query: 'label=New&color=primary&icon=i-mdi-star-outline' },
    { label: 'outline', query: 'label=Outlined&color=primary&outline=true' },
    { label: 'square', query: 'label=Square&color=primary&square=true' },
    { label: 'dense', query: 'label=Compact&color=primary&dense=true' },
    { label: 'color-secondary', query: 'label=Secondary&color=secondary' },
    { label: 'color-teal', query: 'label=Teal&color=teal' },
    { label: 'removable', query: 'label=Removable&color=primary&removable=true' },
    { label: 'clickable', query: 'label=Click&color=primary&clickable=true' },
    { label: 'selected', query: 'label=Selected&color=primary&selected=true' },
    { label: 'icon-right', query: 'label=Star&color=primary&iconRight=i-mdi-star' },
    { label: 'size-xs', query: 'label=Tiny&color=primary&size=xs' },
    { label: 'size-lg', query: 'label=Large&color=primary&size=lg' },
    { label: 'dark', query: 'label=Dark&dark=true&color=primary' },
    { label: 'disabled', query: 'label=Off&disable=true&color=primary' },
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

test.describe('QChip — dark mode', () => {
  const darkVariants = [
    { label: 'dark-default', query: 'dark=true' },
  ]
  test('dark mode screenshots at md3', async ({ page }) => {
    for (const v of darkVariants) {
      await page.goto(`/${SLUG}?style=md3&${v.query}`, { waitUntil: 'networkidle' })
      await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 10_000 })
      await shot(page, SLUG, v.label, 'md3')
      await dumpDiagnostics(page, SLUG, v.label, 'md3')
    }
  })
})
