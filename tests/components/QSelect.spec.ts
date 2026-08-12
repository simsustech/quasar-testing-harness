import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import { shot, dumpDiagnostics, computedStyles } from '../helpers.js'

const SLUG = 'q-select'
const STYLES = ['md3', 'md2', 'unstyled'] as const

test.describe('QSelect', () => {
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

test.describe('QSelect — prop variations', () => {
  const variants = [
    { label: 'default-de', query: 'modelValue=de&label=Country' },
    { label: 'no-value', query: 'modelValue=&label=Country' },
    { label: 'disabled', query: 'modelValue=de&label=Country&disable=true' },
    { label: 'dense', query: 'modelValue=de&label=Country&dense=true' },
    { label: 'filled', query: 'modelValue=jp&label=Country&filled=true' },
    { label: 'clearable', query: 'modelValue=de&label=Country&clearable=true' },
    { label: 'dark', query: 'modelValue=de&label=Country&dark=true' },
    { label: 'dark-clearable', query: 'modelValue=de&label=Country&dark=true&clearable=true' },
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

test.describe('QSelect — MD3 spec conformance', () => {
  test('clearable — native has pr-48px to make room for clear and dropdown icons', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md3&modelValue=de&label=Country&clearable=true`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 30_000 })
    const s = await computedStyles(page, {
      '.q-field__native': ['padding-right']
    })
    expect(s['.q-field__native']?.['padding-right']).toBe('48px')
  })

  test('with value — dropdown icon is present', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md3&modelValue=de&label=Country`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 30_000 })
    const icon = page.locator('[data-testid="component-preview"] .q-select__dropdown-icon')
    await expect(icon).toBeVisible()
  })
})

test.describe('QSelect — MD2 spec conformance', () => {
  test('clearable — native has pr-48px', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md2&modelValue=de&label=Country&clearable=true`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 30_000 })
    const s = await computedStyles(page, {
      '.q-field__native': ['padding-right']
    })
    expect(s['.q-field__native']?.['padding-right']).toBe('48px')
  })
})
