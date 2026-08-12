import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import { shot, dumpDiagnostics } from '../helpers.js'

const SLUG = 'q-table'
const STYLES = ['md3', 'md2', 'unstyled'] as const

test.describe('QTable', () => {
  for (const style of STYLES) {
    test(`renders cleanly with ?style=${style}`, async ({ page }) => {
      await page.goto(`/${SLUG}?style=${style}`, { waitUntil: 'networkidle' })
      await expect(page.locator('.control-panel')).toBeVisible({ timeout: 10_000 })
      await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 45_000 })
      await expect(page.locator('.q-table__card')).toBeAttached({ timeout: 10_000 })
      const png = await shot(page, SLUG, { style }, style)
      await dumpDiagnostics(page, SLUG, { style }, style)
      expect(fs.existsSync(png)).toBe(true)
      expect(fs.statSync(png).size).toBeGreaterThan(100)
    })
  }
})

test.describe('QTable — prop variations', () => {
  // grid mode re-arranges the DOM and doesn't use .q-table__card,
  // so it needs a separate assertion.
  const isGrid = (q: string) => q.includes('grid=true')

  const variants = [
    { label: 'default', query: '' },
    { label: 'dense', query: 'dense=true' },
    { label: 'bordered', query: 'bordered=true' },
    { label: 'flat', query: 'flat=true' },
    { label: 'dark', query: 'dark=true' },
    { label: 'loading', query: 'loading=true' },
    { label: 'hide-header', query: 'hideHeader=true' },
    { label: 'hide-bottom', query: 'hideBottom=true' },
    { label: 'grid', query: 'grid=true' },
    { label: 'separator-vertical', query: 'separator=vertical' },
    { label: 'separator-cell', query: 'separator=cell' },
    { label: 'separator-none', query: 'separator=none' },
  ]

  test('all visual variants at md3', async ({ page }) => {
    for (const v of variants) {
      await page.goto(`/${SLUG}?style=md3&${v.query}`, { waitUntil: 'domcontentloaded' })
      await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 45_000 })

      if (isGrid(v.query)) {
        await expect(page.locator('.q-table--grid')).toBeAttached({ timeout: 10_000 })
      } else {
        await expect(page.locator('.q-table__card')).toBeAttached({ timeout: 10_000 })
      }

      await page.waitForTimeout(300)
      const png = await shot(page, SLUG, v.label, 'md3')
      await dumpDiagnostics(page, SLUG, v.label, 'md3')
      expect(fs.statSync(png).size).toBeGreaterThan(100)
    }
  })
})

test.describe('QTable — MD3 text color conformance', () => {
  test('card wrapper has explicit text color', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md3`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 45_000 })
    await expect(page.locator('.q-table__card')).toBeAttached({ timeout: 10_000 })
    const color = await page.evaluate(() => {
      const card = document.querySelector('.q-table__card') as HTMLElement | null
      if (!card) return null
      return window.getComputedStyle(card).color
    })
    expect(color).toBeTruthy()
    expect(color).not.toBe('rgba(0, 0, 0, 0)')
  })

  test('dark mode — card wrapper has visible text color', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md3&dark=true`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 45_000 })
    await expect(page.locator('.q-table__card')).toBeAttached({ timeout: 10_000 })
    const color = await page.evaluate(() => {
      const card = document.querySelector('.q-table__card') as HTMLElement | null
      if (!card) return null
      return window.getComputedStyle(card).color
    })
    expect(color).toBeTruthy()
  })
})
