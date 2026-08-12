import { test, expect } from '@playwright/test'
import fs from 'node:fs'

import { styleFromPage, shotPath, shot, dumpDiagnostics, computedStyles } from '../helpers.js'

const SLUG = 'q-badge'
const STYLES = ['md3', 'md2', 'unstyled'] as const

test.describe('QBadge', () => {
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

test.describe('QBadge — prop variations', () => {
  const variants = [
    { label: 'default', query: 'label=3&color=primary&floating=true' },
    { label: 'outline', query: 'label=Outline&color=primary&outline=true' },
    { label: 'rounded', query: 'label=999+&color=primary&rounded=true&floating=true' },
    { label: 'transparent', query: 'label=%E2%88%9E&color=orange&transparent=true' },
    { label: 'color-secondary', query: 'label=New&color=secondary&floating=true' },
    { label: 'color-blue', query: 'label=42&color=blue&floating=true' },
    { label: 'color-teal', query: 'label=v2.0.0&color=teal&align=middle' },
    { label: 'align-top', query: 'label=top&color=primary&align=top' },
    { label: 'align-bottom', query: 'label=bot&color=primary&align=bottom' },
    { label: 'multi-line', query: 'label=Long+label+text&color=primary&multiLine=true' },
    { label: 'no-floating', query: 'label=3&color=primary' },
  ]

  test('all visual variants at md3', async ({ page }) => {
    for (const v of variants) {
      await page.goto(`/${SLUG}?style=md3&${v.query}`, { waitUntil: 'networkidle' })
      await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 30_000 })
      const png = await shot(page, SLUG, v.label, 'md3')
      await dumpDiagnostics(page, SLUG, v.label, 'md3')
      expect(fs.statSync(png).size).toBeGreaterThan(100)
    }
  })
})

test.describe('QBadge — MD3 spec conformance', () => {
  test('badge has primary background color', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md3&label=3&color=primary&floating=true`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 30_000 })
    const s = await computedStyles(page, {
      '.q-badge': ['background-color', 'color', 'font-size']
    })
    expect(s['.q-badge']?.['background-color']).not.toBe('rgba(0, 0, 0, 0)')
    expect(s['.q-badge']?.['color']).toBeDefined()
  })
})

test.describe('QBadge — dark mode', () => {
  const darkVariants = [
    { label: 'dark-default', query: 'dark=true' },
  ]
  test('dark mode screenshots at md3', async ({ page }) => {
    for (const v of darkVariants) {
      await page.goto(`/${SLUG}?style=md3&${v.query}`, { waitUntil: 'networkidle' })
      await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 30_000 })
      await shot(page, SLUG, v.label, 'md3')
      await dumpDiagnostics(page, SLUG, v.label, 'md3')
    }
  })
})
