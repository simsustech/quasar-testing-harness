import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import { shot, dumpDiagnostics } from '../helpers.js'

const SLUG = 'composites'
const STYLES = ['md3', 'md2', 'unstyled'] as const
const TEST_TIMEOUT = 60_000

const sections = [
  'composite-btn-tooltip',
  'composite-btn-badge',
  'composite-card-actions',
  'composite-card-item-avatar',
  'composite-toolbar-btns',
  'composite-toolbar-tabs',
  'composite-item-avatar',
  'composite-item-badge',
  'composite-item-checkbox',
  'composite-item-radio',
  'composite-item-toggle',
  'composite-expansion-card',
  'composite-btn-dialog',
  'composite-header-toolbar',
  'composite-header-tabs',
  'composite-drawer-items',
  'composite-fab-actions',
  'composite-form-input-btn',
  'composite-input-icon',
  'composite-select-chips',
  'composite-field-icon',
  'composite-knob-icon',
  'composite-slider-badge',
  'composite-tabs-panels',
  'composite-menu-list',
  'composite-inner-loading',
  'composite-banner-btn',
  'composite-bar-icons',
  'composite-chat-avatar',
  'composite-progress-badge',
  'composite-checkbox-item',
  'composite-toolbar-breadcrumbs',
  'composite-dropdown-list',
  'composite-table-pagination',
  'composite-carousel',
  'composite-footer-toolbar',
  'composite-icon-badge'
]

// Split into batches of 6 sections to stay within timeouts
const BATCH_SIZE = 6
for (let i = 0; i < sections.length; i += BATCH_SIZE) {
  const batch = sections.slice(i, i + BATCH_SIZE)
  test.describe(`Composites batch ${Math.floor(i / BATCH_SIZE) + 1}`, () => {
    for (const style of STYLES) {
      test(`screenshots ${batch.length} sections with ?style=${style}`, async ({
        page
      }) => {
        test.setTimeout(TEST_TIMEOUT)
        await page.goto(`/${SLUG}?style=${style}`, {
          waitUntil: 'networkidle',
          timeout: 20_000
        })
        await expect(page.getByTestId('composite-btn-tooltip')).toBeVisible({
          timeout: 15_000
        })

        for (const section of batch) {
          await page.getByTestId(section).scrollIntoViewIfNeeded()
          await expect(page.getByTestId(section)).toBeVisible()
          await page.waitForTimeout(200)
          const png = await shot(page, SLUG, section, style, 'desktop', section)
          expect(fs.existsSync(png)).toBe(true)
          expect(fs.statSync(png).size).toBeGreaterThan(100)
        }
      })
    }
  })
}
