import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import { shot, dumpDiagnostics } from '../helpers.js'

const SLUG = 'q-checkbox'
const STYLES = ['md3', 'md2', 'unstyled'] as const

test.describe('QCheckbox', () => {
  for (const style of STYLES) {
    test(`renders cleanly with ?style=${style}`, async ({ page }) => {
      await page.goto(`/${SLUG}?style=${style}`, { waitUntil: 'networkidle' })
      await expect(page.locator('.control-panel')).toBeVisible({
        timeout: 10_000
      })
      await expect(page.getByTestId('component-preview')).toBeVisible({
        timeout: 30_000
      })
      const png = await shot(page, SLUG, { style }, style)
      await dumpDiagnostics(page, SLUG, { style }, style)
      expect(fs.existsSync(png)).toBe(true)
      expect(fs.statSync(png).size).toBeGreaterThan(100)
    })
  }
})

test.describe('QCheckbox — prop variations', () => {
  const variants = [
    { label: 'checked', query: 'label=Agree&modelValue=true' },
    { label: 'unchecked', query: 'label=Agree&modelValue=false' },
    { label: 'dense', query: 'label=Compact&dense=true&modelValue=true' },
    { label: 'disabled', query: 'label=Locked&disable=true&modelValue=true' },
    {
      label: 'color-secondary',
      query: 'label=Secondary&color=secondary&modelValue=true'
    },
    { label: 'left-label', query: 'label=Left&leftLabel=true&modelValue=true' }
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

test.describe('q-checkbox — dark mode', () => {
  test('renders cleanly with ?style=md3&dark=true', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md3&dark=true`, {
      waitUntil: 'networkidle'
    })
    await expect(page.getByTestId('component-preview')).toBeVisible({
      timeout: 30_000
    })
    await shot(page, SLUG, 'dark', 'md3')
    await dumpDiagnostics(page, SLUG, 'dark', 'md3')
  })
})
