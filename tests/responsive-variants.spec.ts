import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import { shot, DEVICES } from './helpers.js'

const VIEWPORTS = DEVICES.filter((d) => d.slug !== 'sm') // md + lg only
const STYLE = 'md3'

const VARIANTS: Record<string, { label: string; query: string }[]> = {
  'q-btn': [
    { label: 'outline', query: 'label=Outline&outline=true&color=primary' },
    { label: 'rounded', query: 'label=Rounded&rounded=true&color=primary' },
    { label: 'icon-label', query: 'label=Home&icon=i-mdi-home&color=primary' },
    { label: 'dense', query: 'label=Dense&dense=true&color=primary' },
    { label: 'disabled', query: 'label=Off&disable=true&color=primary' },
    { label: 'loading', query: 'label=Saving&color=primary&loading=true' }
  ],
  'q-input': [
    {
      label: 'filled',
      query: 'label=Name&modelValue=Jane&color=primary&filled=true'
    },
    {
      label: 'outlined',
      query: 'label=Email&modelValue=hi@me.com&color=primary&outlined=true'
    },
    {
      label: 'dense',
      query: 'label=City&dense=true&outlined=true&color=primary'
    }
  ],
  'q-toggle': [
    { label: 'checked', query: 'label=On&modelValue=true' },
    { label: 'unchecked', query: 'label=Off&modelValue=false' },
    { label: 'dense', query: 'label=Compact&dense=true&modelValue=true' }
  ],
  'q-checkbox': [
    { label: 'checked', query: 'modelValue=true&color=primary' },
    { label: 'dense', query: 'dense=true&modelValue=true&color=primary' }
  ],
  'q-radio': [
    { label: 'checked', query: 'modelValue=opt1&color=primary' },
    { label: 'dense', query: 'dense=true&modelValue=opt1&color=primary' }
  ],
  'q-chip': [
    { label: 'outline', query: 'label=Tag&outline=true&color=primary' },
    { label: 'dense', query: 'label=Small&dense=true&color=primary' },
    { label: 'icon', query: 'label=Home&icon=i-mdi-home&color=primary' }
  ],
  'q-badge': [
    { label: 'floating', query: 'label=3&color=primary&floating=true' },
    { label: 'outline', query: 'label=New&outline=true&color=primary' }
  ],
  'q-card': [
    { label: 'flat', query: 'flat=true&bordered=true' },
    { label: 'dark', query: 'dark=true' }
  ],
  'q-banner': [
    { label: 'dense', query: 'dense=true' },
    { label: 'inline-actions', query: 'inlineActions=true' }
  ],
  'q-linear-progress': [
    { label: 'indeterminate', query: 'indeterminate=true&color=primary' },
    { label: 'stripe', query: 'value=65&color=primary&stripe=true' }
  ],
  'q-select': [
    { label: 'filled', query: 'label=Country&filled=true&color=primary' },
    { label: 'outlined', query: 'label=City&outlined=true&color=primary' },
    {
      label: 'dense',
      query: 'label=State&dense=true&outlined=true&color=primary'
    }
  ],
  'q-dialog': [
    { label: 'maximized', query: 'modelValue=true&maximized=true' },
    { label: 'position-top', query: 'modelValue=true&position=top' }
  ],
  'q-knob': [
    { label: 'value-65', query: 'modelValue=65&showValue=true&color=primary' },
    {
      label: 'disabled',
      query: 'modelValue=65&showValue=true&disable=true&color=primary'
    }
  ],
  'q-slider': [
    { label: 'value-50', query: 'modelValue=50&color=primary&label=true' },
    {
      label: 'dense',
      query: 'modelValue=50&dense=true&color=primary&label=true'
    }
  ],
  'q-range': [
    {
      label: 'value',
      query: 'modelValue={"min":20,"max":60}&color=primary&label=true'
    },
    {
      label: 'dense',
      query:
        'modelValue={"min":20,"max":60}&dense=true&color=primary&label=true'
    }
  ],
  'q-pagination': [
    { label: 'outline', query: 'modelValue=3&outline=true&color=primary' },
    { label: 'dense', query: 'modelValue=3&dense=true&color=primary' }
  ],
  'q-expansion-item': [
    { label: 'expanded', query: 'label=Details&modelValue=true' },
    { label: 'dense', query: 'label=Info&dense=true&modelValue=true' }
  ],
  'q-timeline': [
    { label: 'dense', query: 'dense=true&color=primary' },
    { label: 'dark', query: 'dark=true&color=primary' }
  ],
  'q-rating': [
    { label: 'value-3', query: 'modelValue=3&color=primary&size=32px' }
  ],
  'q-option-group': [
    { label: 'dense', query: 'dense=true&color=primary' },
    { label: 'inline', query: 'inline=true&color=primary' }
  ],
  'q-tabs': [{ label: 'dense', query: 'dense=true&color=primary' }],
  'q-tooltip': [{ label: 'visible', query: 'modelValue=true' }],
  'q-menu': [{ label: 'visible', query: 'modelValue=true' }]
}

test.describe('Responsive variant screenshots', () => {
  for (const [slug, compVariants] of Object.entries(VARIANTS)) {
    for (const vp of VIEWPORTS) {
      for (const v of compVariants) {
        test(`${slug} ${v.label} at ${vp.slug}`, async ({ page }) => {
          test.setTimeout(30_000)

          const errors: string[] = []
          page.on('pageerror', (err) =>
            errors.push(`pageerror: ${err.message}`)
          )
          page.on('console', (msg) => {
            if (msg.type() === 'error')
              errors.push(`console error: ${msg.text()}`)
            if (msg.type() === 'warning')
              errors.push(`console warning: ${msg.text()}`)
          })
          page.on('requestfailed', (req) =>
            errors.push(
              `request failed: ${req.url()} (${req.failure()?.errorText})`
            )
          )

          await page.setViewportSize({ width: vp.width, height: vp.height })
          await page.goto(`/${slug}?style=${STYLE}&${v.query}`, {
            waitUntil: 'networkidle',
            timeout: 20_000
          })
          await expect(page.getByTestId('component-preview')).toBeVisible({
            timeout: 30_000
          })

          expect(errors).toEqual([])

          const png = await shot(page, slug, v.label, STYLE, vp.slug)
          expect(fs.existsSync(png)).toBe(true)
          expect(fs.statSync(png).size).toBeGreaterThan(100)
        })
      }
    }
  }
})
