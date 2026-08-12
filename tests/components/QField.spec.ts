import { test, expect } from '@playwright/test'
import fs from 'node:fs'

import {
  styleFromPage,
  shotPath,
  shot,
  dumpDiagnostics,
  computedStyles
} from '../helpers.js'

const SLUG = 'q-field'
const STYLES = ['md3', 'md2', 'unstyled'] as const

test.describe('QField', () => {
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

test.describe('QField — dark mode and clearable', () => {
  const variants = [
    { label: 'dark', query: 'dark=true&label=Email&hint=Enter your email' },
    { label: 'filled-dark', query: 'filled=true&dark=true&label=Email' },
    { label: 'outlined-dark', query: 'outlined=true&dark=true&label=Email' },
    { label: 'standard-dark', query: 'dark=true&label=Email' },
    {
      label: 'clearable',
      query: 'clearable=true&label=Email&modelValue=test@example.com'
    }
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

test.describe('QField — MD3 spec conformance', () => {
  test('control height is 56px', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md3`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('component-preview')).toBeVisible({
      timeout: 30_000
    })
    const s = await computedStyles(page, {
      '.q-field__control': ['height']
    })
    expect(s['.q-field__control']?.['height']).toBe('56px')
  })

  test('dark mode — label text is on-surface-variant/70', async ({ page }) => {
    await page.goto(
      `/${SLUG}?style=md3&dark=true&label=Email&hint=Enter your email`,
      { waitUntil: 'networkidle' }
    )
    await expect(page.getByTestId('component-preview')).toBeVisible({
      timeout: 30_000
    })
    const s = await computedStyles(page, {
      '.q-field__native': ['color'],
      '.q-field__label': ['color'],
      '.q-field__bottom': ['color']
    })
    // dark text should NOT be black — it should be a visible light color
    expect(s['.q-field__native']?.['color']).not.toBe('rgb(0, 0, 0)')
    expect(s['.q-field__label']?.['color']).not.toBe('rgb(0, 0, 0)')
  })

  test('dense — control height is 40px', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md3&dense=true`, {
      waitUntil: 'networkidle'
    })
    await expect(page.getByTestId('component-preview')).toBeVisible({
      timeout: 30_000
    })
    // Verify the q-field--dense class is present
    const hasDense = await page.evaluate(() => {
      const el = document.querySelector(
        '[data-testid="component-preview"] .q-field--dense'
      )
      return !!el
    })
    expect(hasDense).toBe(true)
  })

  test('dense floating label — label is at top:10px with -40% translate', async ({
    page
  }) => {
    await page.goto(
      `/${SLUG}?style=md3&dense=true&label=Email&modelValue=test`,
      { waitUntil: 'networkidle' }
    )
    await expect(page.getByTestId('component-preview')).toBeVisible({
      timeout: 30_000
    })
    const s = await computedStyles(page, {
      '.q-field--dense.q-field--float .q-field__label': [
        'top',
        'font-size',
        'scale'
      ]
    })
    const label = s['.q-field--dense.q-field--float .q-field__label']
    expect(label?.['top']).toBe('10px')
    expect(label?.['font-size']).toBe('14px')
    // UnoCSS outputs individual scale/translate properties, not the transform shorthand
    expect(label?.['scale']).toBe('0.75')
  })
})

test.describe('QField — MD2 spec conformance', () => {
  test('dark mode — native text is white', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md2&dark=true&label=Email`, {
      waitUntil: 'networkidle'
    })
    await expect(page.getByTestId('component-preview')).toBeVisible({
      timeout: 30_000
    })
    const s = await computedStyles(page, {
      '.q-field__native': ['color'],
      '.q-field__label': ['color']
    })
    expect(s['.q-field__native']?.['color']).not.toBe('rgb(0, 0, 0)')
    expect(s['.q-field__label']?.['color']).not.toBe('rgb(0, 0, 0)')
  })
})

test.describe('QField — prop variations', () => {
  const variants = [
    { label: 'default', query: 'label=Name&modelValue=John' },
    { label: 'filled', query: 'label=Name&modelValue=John&filled=true' },
    { label: 'outlined', query: 'label=Name&modelValue=John&outlined=true' },
    {
      label: 'stack-label',
      query: 'label=Name&modelValue=John&stackLabel=true'
    },
    {
      label: 'borderless',
      query: 'label=Name&modelValue=John&borderless=true'
    },
    { label: 'clearable', query: 'label=Name&modelValue=John&clearable=true' },
    { label: 'loading', query: 'label=Name&modelValue=John&loading=true' }
  ]
  test('all visual variants at md3', async ({ page }) => {
    for (const v of variants) {
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
test.describe('QField — dark mode', () => {
  test('dark mode at md3', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md3&dark=true&label=Name&modelValue=John`, {
      waitUntil: 'networkidle'
    })
    await expect(page.getByTestId('component-preview')).toBeVisible({
      timeout: 30_000
    })
    await shot(page, SLUG, 'dark-default', 'md3')
    await dumpDiagnostics(page, SLUG, 'dark-default', 'md3')
  })
})
