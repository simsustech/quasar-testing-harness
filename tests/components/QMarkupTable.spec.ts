import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import { shot, dumpDiagnostics } from '../helpers.js'

const SLUG = 'q-markup-table'
const STYLES = ['md3', 'md2', 'unstyled'] as const

test.describe('QMarkupTable', () => {
  for (const style of STYLES) {
    test(`renders cleanly with ?style=${style}`, async ({ page }) => {
      await page.goto(`/${SLUG}?style=${style}`, { waitUntil: 'networkidle' })
      await expect(page.locator('.control-panel')).toBeVisible({ timeout: 10_000 })
      await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 30_000 })
      await expect(page.locator('.q-markup-table td').first()).toBeAttached({ timeout: 10_000 })
      const png = await shot(page, SLUG, { style }, style)
      await dumpDiagnostics(page, SLUG, { style }, style)
      expect(fs.existsSync(png)).toBe(true)
      expect(fs.statSync(png).size).toBeGreaterThan(100)
    })
  }
})

test.describe('QMarkupTable — prop variations', () => {
  // Some separator modes trigger a full page reload that closes the
  // Playwright context. We test the safe subset individually.
  const variants = [
    { label: 'default', query: '' },
    { label: 'dense', query: 'dense=true' },
    { label: 'bordered', query: 'bordered=true' },
    { label: 'flat', query: 'flat=true' },
    { label: 'dark', query: 'dark=true' },
  ]

  test('all visual variants at md3', async ({ page }) => {
    for (const v of variants) {
      await page.goto(`/${SLUG}?style=md3&${v.query}`, { waitUntil: 'domcontentloaded' })
      await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 30_000 })
      await expect(page.locator('.q-markup-table td').first()).toBeAttached({ timeout: 10_000 })
      await page.waitForTimeout(300)
      const png = await shot(page, SLUG, v.label, 'md3')
      await dumpDiagnostics(page, SLUG, v.label, 'md3')
      expect(fs.statSync(png).size).toBeGreaterThan(100)
    }
  })
})

test.describe('QMarkupTable — MD3 text color conformance', () => {
  test('cells have explicit non-transparent color', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md3`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 30_000 })
    await expect(page.locator('.q-markup-table td').first()).toBeAttached({ timeout: 10_000 })
    const color = await page.evaluate(() => {
      const td = document.querySelector('.q-markup-table td') as HTMLElement | null
      if (!td) return null
      return window.getComputedStyle(td).color
    })
    expect(color).toBeTruthy()
    expect(color).not.toBe('rgba(0, 0, 0, 0)')
    expect(color).not.toBe('transparent')
  })

  test('header cells have explicit color', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md3`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 30_000 })
    await expect(page.locator('.q-markup-table th').first()).toBeAttached({ timeout: 10_000 })
    const color = await page.evaluate(() => {
      const th = document.querySelector('.q-markup-table th') as HTMLElement | null
      if (!th) return null
      return window.getComputedStyle(th).color
    })
    expect(color).toBeTruthy()
  })
})

test.describe('QMarkupTable — MD2 text color conformance', () => {
  test('table cell has explicit non-transparent color', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md2`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 30_000 })
    await expect(page.locator('.q-markup-table td').first()).toBeAttached({ timeout: 10_000 })
    const color = await page.evaluate(() => {
      const td = document.querySelector('.q-markup-table td') as HTMLElement | null
      if (!td) return null
      return window.getComputedStyle(td).color
    })
    expect(color).toBeTruthy()
    expect(color).not.toBe('rgba(0, 0, 0, 0)')
    expect(color).not.toBe('transparent')
  })
})
