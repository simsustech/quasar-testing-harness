import { test, expect } from '@playwright/test'
import fs from 'node:fs'

import { styleFromPage, shotPath, shot, dumpDiagnostics, computedStyles } from '../helpers.js'

const SLUG = 'q-input'
const STYLES = ['md3', 'md2', 'unstyled'] as const

test.describe('QInput', () => {
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

test.describe('QInput — dark mode and clearable', () => {
  const variants = [
    { label: 'dark', query: 'dark=true&label=Email&hint=Enter your email' },
    { label: 'filled-dark', query: 'filled=true&dark=true&label=Email&modelValue=test@example.com' },
    { label: 'outlined-dark', query: 'outlined=true&dark=true&label=Email&modelValue=test@example.com' },
    { label: 'clearable', query: 'clearable=true&label=Email&modelValue=test@example.com' },
    { label: 'dark-clearable', query: 'dark=true&clearable=true&label=Email&modelValue=test@example.com' },
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

test.describe('QInput — MD3 spec conformance', () => {
  test('control height is 56px', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md3`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 10_000 })
    const s = await computedStyles(page, {
      '.q-field__control': ['height']
    })
    expect(s['.q-field__control']?.['height']).toBe('56px')
  })

  test('dark mode — native text is NOT black', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md3&dark=true&label=Email`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 10_000 })
    const s = await computedStyles(page, {
      '.q-field__native': ['color'],
      '.q-field__label': ['color']
    })
    expect(s['.q-field__native']?.['color']).not.toBe('rgb(0, 0, 0)')
    expect(s['.q-field__label']?.['color']).not.toBe('rgb(0, 0, 0)')
  })

  test('clearable — clear icon is present when modelValue set', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md3&clearable=true&label=Email&modelValue=test@example.com`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 10_000 })
    const icon = page.locator('[data-testid="component-preview"] .q-field__append .q-icon')
    await expect(icon).toBeVisible()
  })
})

test.describe('QInput — MD2 spec conformance', () => {
  test('dark mode — native text is NOT black', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md2&dark=true&label=Email`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 10_000 })
    const s = await computedStyles(page, {
      '.q-field__native': ['color'],
      '.q-field__label': ['color']
    })
    expect(s['.q-field__native']?.['color']).not.toBe('rgb(0, 0, 0)')
    expect(s['.q-field__label']?.['color']).not.toBe('rgb(0, 0, 0)')
  })
})
test.describe('QInput — prop variations', () => {
  const variants = [
    { label: 'default', query: 'label=Name&modelValue=John' },
    { label: 'filled', query: 'label=Name&modelValue=John&filled=true' },
    { label: 'outlined', query: 'label=Name&modelValue=John&outlined=true' },
    { label: 'stack-label', query: 'label=Name&modelValue=John&stackLabel=true' },
    { label: 'clearable', query: 'label=Name&modelValue=John&clearable=true' },
    { label: 'dense', query: 'label=Name&modelValue=John&dense=true' },
  ]
  test('all visual variants at md3', async ({ page }) => {
    for (const v of variants) {
      await page.goto(`/${SLUG}?style=md3&${v.query}`, { waitUntil: 'networkidle' })
      await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 10_000 })
      await shot(page, SLUG, v.label, 'md3')
      await dumpDiagnostics(page, SLUG, v.label, 'md3')
    }
  })
})
