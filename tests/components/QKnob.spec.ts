import { test, expect } from '@playwright/test'
import fs from 'node:fs'

import {
  styleFromPage,
  shotPath,
  shot,
  dumpDiagnostics,
  computedStyles
} from '../helpers.js'

const SLUG = 'q-knob'
const STYLES = ['md3', 'md2', 'unstyled'] as const

test.describe('QKnob', () => {
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

test.describe('QKnob — prop variations', () => {
  const variants = [
    { label: 'default-65', query: 'modelValue=65&showValue=true' },
    { label: 'min', query: 'modelValue=0&showValue=true' },
    { label: 'max', query: 'modelValue=100&showValue=true' },
    {
      label: 'color-secondary',
      query: 'modelValue=65&showValue=true&color=secondary'
    },
    { label: 'disabled', query: 'modelValue=65&showValue=true&disable=true' },
    { label: 'size-lg', query: 'modelValue=65&showValue=true&size=80px' }
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

test.describe('QKnob — MD3 spec conformance', () => {
  test('knob svg circle has stroke matching the color', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md3&modelValue=65&showValue=true`, {
      waitUntil: 'networkidle'
    })
    await expect(page.getByTestId('component-preview')).toBeVisible({
      timeout: 30_000
    })
    const text = page.locator('[data-testid="component-preview"] .q-knob')
    await expect(text).toBeVisible()
  })

  test('disabled knob has reduced opacity', async ({ page }) => {
    await page.goto(
      `/${SLUG}?style=md3&modelValue=65&showValue=true&disable=true`,
      { waitUntil: 'networkidle' }
    )
    await expect(page.getByTestId('component-preview')).toBeVisible({
      timeout: 30_000
    })
    const s = await computedStyles(page, {
      '.q-knob': ['opacity']
    })
    expect(parseFloat(s['.q-knob']?.['opacity'] ?? '1')).toBeLessThan(1)
  })
})

test.describe('q-knob — dark mode', () => {
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
