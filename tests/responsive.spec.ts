import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import { shot, DEVICES } from './helpers.js'

const SLUGS = [
  'q-avatar', 'q-badge', 'q-banner', 'q-bar', 'q-breadcrumbs', 'q-btn',
  'q-btn-dropdown', 'q-btn-group', 'q-btn-toggle', 'q-card', 'q-carousel',
  'q-chat', 'q-checkbox', 'q-chip', 'q-circular-progress', 'q-color',
  'q-date', 'q-dialog', 'q-drawer', 'q-editor', 'q-expansion-item', 'q-fab',
  'q-field', 'q-file', 'q-footer', 'q-form', 'q-header', 'q-icon', 'q-img',
  'q-infinite-scroll', 'q-inner-loading', 'q-input', 'q-intersection',
  'q-item', 'q-knob', 'q-layout', 'q-linear-progress', 'q-markup-table',
  'q-menu', 'q-no-ssr', 'q-option-group', 'q-page', 'q-page-sticky',
  'q-pagination', 'q-popup-edit', 'q-pull-to-refresh', 'q-radio', 'q-range',
  'q-rating', 'q-responsive', 'q-scroll-area', 'q-select', 'q-separator',
  'q-skeleton', 'q-slide-item', 'q-slider', 'q-space', 'q-spinner',
  'q-splitter', 'q-stepper', 'q-tab-panels', 'q-tabs', 'q-table', 'q-time',
  'q-timeline', 'q-toggle', 'q-toolbar', 'q-tooltip', 'q-tree', 'q-uploader',
  'q-video', 'q-virtual-scroll',
]

const VIEWPORTS = [
  { slug: 'desktop', width: 1280, height: 800 },
  ...DEVICES,
]
const MODES = ['light', 'dark'] as const

test.describe('Screenshots', () => {
  for (const slug of SLUGS) {
    for (const vp of VIEWPORTS) {
      for (const mode of MODES) {
        test(`${slug} ${vp.slug} ${mode} md3`, async ({ page }) => {
          test.setTimeout(30_000)
          const darkParam = mode === 'dark' ? '&dark=true' : ''
          await page.setViewportSize({ width: vp.width, height: vp.height })
          await page.goto(`/${slug}?style=md3${darkParam}`, { waitUntil: 'networkidle', timeout: 20_000 })
          await expect(page.getByTestId('component-preview')).toBeVisible({ timeout: 10_000 })
          const png = await shot(page, slug, 'default', 'md3', vp.slug)
          expect(fs.existsSync(png)).toBe(true)
          expect(fs.statSync(png).size).toBeGreaterThan(100)
        })
      }
    }
  }
})
