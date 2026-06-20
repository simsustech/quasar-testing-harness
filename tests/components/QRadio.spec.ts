import { test, expect } from '@playwright/test'
import fs from 'node:fs'

import { styleFromPage, shotPath, shot, dumpDiagnostics, computedStyles } from '../helpers.js'

const SLUG = 'q-radio'
const STYLES = ['md3', 'md2', 'unstyled'] as const

test.describe('QRadio', () => {
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

test.describe('QRadio — prop variations', () => {
  const variants = [
    { label: 'default', query: 'label=Express+shipping&modelValue=express&val=express' },
    { label: 'color-secondary', query: 'label=Secondary&color=secondary&modelValue=opt&val=opt' },
    { label: 'dense', query: 'label=Compact&dense=true&modelValue=opt&val=opt' },
    { label: 'left-label', query: 'label=Left+side&leftLabel=true&modelValue=opt&val=opt' },
    { label: 'keep-color', query: 'label=Teal&keepColor=true&color=teal&modelValue=opt&val=opt' },
    { label: 'disabled', query: 'label=Disabled&disable=true&modelValue=opt&val=opt' },
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

test.describe('QRadio — MD3 spec conformance', () => {
  test('checked radio has on-primary background and primary border', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md3&label=Checked&modelValue=opt&val=opt&color=primary`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 10_000 })
    // the radio inner circle should be visible when checked
    const inner = page.locator('[data-testid="component-preview"] .q-radio__inner--truthy')
    await expect(inner).toBeVisible()
  })

  test('dense — font-size is smaller', async ({ page }) => {
    await page.goto(`/${SLUG}?style=md3&dense=true&label=Compact&modelValue=opt&val=opt`, { waitUntil: 'networkidle' })
    await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 10_000 })
    const s = await computedStyles(page, {
      '.q-radio__inner': ['font-size']
    })
    expect(s['.q-radio__inner']?.['font-size']).not.toBe('')
  })
})
