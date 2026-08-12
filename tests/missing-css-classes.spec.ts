import { test, expect, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Quasar adds classes to the DOM at runtime (state classes like
 * `q-btn--disabled`, `q-field--focused`, `q-btn--loading`, etc.)
 * that UnoCSS can't scan for statically. This test visits every
 * component page with varied props, interacts where relevant to
 * trigger runtime state classes, then cross-references the DOM
 * classes against the selectors actually present in the generated
 * CSS.  Anything in the DOM but missing in the CSS is reported so
 * it can be safelisted in `unocss-preset-quasar`.
 *
 * Run:  npx playwright test tests/missing-css-classes.spec.ts
 */

const REPORT_PATH = path.join(
  process.cwd(),
  'tests',
  'output',
  'missing-css-classes.json'
)

// Per-component recipe: which props + interactions to try so we
// trigger as many runtime state classes as possible.
const RECIPES: Record<string, { props?: string }> = {
  'q-btn': {
    props:
      'label=Click&color=primary&rounded=true&dense=true&disable=true&loading=true&outline=true&flat=true&push=true'
  },
  'q-avatar': {
    props: 'color=primary&rounded=true&square=true&size=120px'
  },
  'q-badge': {
    props:
      'color=primary&floating=true&transparent=true&outline=true&rounded=true&multiLine=true'
  },
  'q-banner': {
    props: 'dense=true&inlineActions=true&rounded=true'
  },
  'q-bar': { props: 'dense=true&dark=true' },
  'q-breadcrumbs': {
    props: 'gutter=lg&align=center&separatorColor=primary&activeColor=secondary'
  },
  'q-btn-dropdown': {
    props: 'label=Menu&color=primary&split=true&dense=true'
  },
  'q-btn-group': {
    props: 'outline=true&rounded=true&spread=true'
  },
  'q-btn-toggle': {
    props: 'outline=true&rounded=true&dense=true'
  },
  'q-card': {
    props: 'flat=true&bordered=true&square=true&dark=true'
  },
  'q-carousel': { props: 'arrows=true&navigation=true' },
  'q-chat': { props: 'dark=true' },
  'q-checkbox': {
    props:
      'label=Check&modelValue=true&dense=true&disable=true&color=secondary&leftLabel=true'
  },
  'q-chip': {
    props:
      'label=Chip&color=primary&outline=true&square=true&dense=true&removable=true&clickable=true&selected=true'
  },
  'q-circular-progress': {
    props: 'value=65&showValue=true&indeterminate=true'
  },
  'q-color': { props: 'flat=true&square=true' },
  'q-date': {
    props:
      'modelValue=2025/01/15&landscape=true&minimal=true&dark=true&bordered=true&color=secondary'
  },
  'q-dialog': {
    props:
      'modelValue=true&maximized=true&position=bottom&seamless=true&square=true'
  },
  'q-drawer': { props: 'modelValue=true&mini=true&overlay=true' },
  'q-editor': { props: 'flat=true&dense=true&dark=true' },
  'q-expansion-item': {
    props:
      'label=Expand&dense=true&popup=true&switchToggleSide=true&hideExpandIcon=true'
  },
  'q-fab': {
    props: 'color=primary&outline=true&square=true&direction=up'
  },
  'q-field': {
    props:
      'modelValue=Text&label=Field&filled=true&outlined=true&standard=true&dark=true&dense=true&error=true&disable=true'
  },
  'q-file': {
    props: 'filled=true&outlined=true&dense=true&disable=true'
  },
  'q-form': {},
  'q-footer': { props: 'bordered=true' },
  'q-header': { props: 'bordered=true' },
  'q-icon': {
    props: 'name=i-mdi-home&color=secondary&size=lg'
  },
  'q-img': { props: 'src=https://picsum.photos/200&ratio=1' },
  'q-inner-loading': {
    props: 'showing=true&color=secondary&label=Loading'
  },
  'q-input': {
    props:
      'modelValue=Text&label=Input&filled=true&outlined=true&dark=true&dense=true&disable=true&error=true&type=textarea'
  },
  'q-intersection': {},
  'q-knob': {
    props: 'modelValue=65&min=0&max=100&color=secondary&disable=true&size=lg'
  },
  'q-layout': { props: 'view=hHh lpR fFf' },
  'q-linear-progress': {
    props:
      'modelValue=65&stripe=true&indeterminate=true&query=true&color=secondary&rounded=true'
  },
  'q-menu': {
    props: 'modelValue=true&persistent=true&square=true'
  },
  'q-no-ssr': {},
  'q-option-group': {
    props: 'modelValue=opt1&dense=true&inline=true'
  },
  'q-page': {},
  'q-page-sticky': { props: 'position=bottom-right' },
  'q-pagination': {
    props:
      'modelValue=3&max=10&outline=true&rounded=true&boundaryNumbers=true&color=secondary'
  },
  'q-popup-edit': {
    props: 'modelValue=Edit&square=true&persistent=true'
  },
  'q-pull-to-refresh': { props: 'disable=true' },
  'q-radio': {
    props:
      'modelValue=opt1&color=secondary&dense=true&leftLabel=true&keepColor=true&disable=true'
  },
  'q-range': {
    props:
      'modelValue={min:25,max:75}&min=0&max=100&color=secondary&dense=true&disable=true'
  },
  'q-rating': {
    props:
      'modelValue=4&max=5&color=secondary&size=lg&noDimming=true&disable=true'
  },
  'q-scroll-area': { props: 'dark=true' },
  'q-select': {
    props:
      'modelValue=opt1&filled=true&outlined=true&dense=true&disable=true&dark=true'
  },
  'q-separator': {
    props: 'dark=true&vertical=true&spaced=true&inset=true'
  },
  'q-skeleton': {
    props: 'type=QBtn&bordered=true&square=true&dark=true&anim=wave'
  },
  'q-slide-item': { props: 'dark=true' },
  'q-slider': {
    props:
      'modelValue=35&min=0&max=100&disable=true&color=secondary&label=true&markers=true'
  },
  'q-space': {},
  'q-spinner': { props: 'color=secondary&size=lg' },
  'q-splitter': {
    props: 'modelValue=50&dark=true&vertical=true'
  },
  'q-stepper': {
    props: 'vertical=true&dark=true&flat=true&bordered=true'
  },
  'q-tab-panels': { props: 'modelValue=tab1' },
  'q-table': {
    props: 'flat=true&bordered=true&square=true&dark=true&dense=true&grid=true'
  },
  'q-tabs': {
    props: 'dense=true&noCaps=true&color=secondary&dark=true&vertical=true'
  },
  'q-time': {
    props: 'modelValue=12:30&landscape=true&dark=true&flat=true&bordered=true'
  },
  'q-timeline': {
    props: 'comfortable=true&loose=true&side=left&color=secondary&dark=true'
  },
  'q-toggle': {
    props:
      'label=Toggle&modelValue=true&dense=true&disable=true&leftLabel=true&color=secondary&keepColor=true&dark=true'
  },
  'q-toolbar': { props: 'inset=true' },
  'q-tooltip': { props: 'modelValue=true&delay=0' },
  'q-tree': {
    props: 'dark=true&noConnectors=true&dense=true'
  },
  'q-uploader': {
    props: 'bordered=true&disable=true&dark=true'
  },
  'q-video': {
    props: 'src=https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  'q-virtual-scroll': { props: 'horizontal=true' },
  'q-infinite-scroll': {}
}

// -----------------------------------------------------------------------
// Browser-side helpers
// -----------------------------------------------------------------------

/**
 * Collect every class name present on every element in the DOM.
 */
async function collectDomClasses(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const classes = new Set<string>()
    for (const el of document.querySelectorAll('*')) {
      for (const cls of el.classList) {
        classes.add(cls)
      }
    }
    return [...classes].sort()
  })
}

/**
 * Collect every class selector from all accessible stylesheets.
 *
 * Extracts the class portion from selectors like:
 *   body.quasar-style-md3 .q-btn--rounded:hover
 * → q-btn--rounded, quasar-style-md3
 *
 * Pseudo-classes (:hover, :focus) and pseudo-elements (::before)
 * are stripped before extraction.
 */
async function collectCssClasses(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const cssClasses = new Set<string>()
    const CLASS_RE = /\.([a-zA-Z0-9_-]+)/g

    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i]
      try {
        for (let j = 0; j < sheet.cssRules.length; j++) {
          const rule = sheet.cssRules[j]
          if ('selectorText' in rule) {
            const text = (rule as CSSStyleRule).selectorText
            const cleaned = text.replace(/:{1,2}[a-zA-Z-]+(?:\([^)]*\))?/g, '')
            let m: RegExpExecArray | null
            while ((m = CLASS_RE.exec(cleaned)) !== null) {
              cssClasses.add(m[1])
            }
          }
        }
      } catch {
        // Cross-origin stylesheets throw on cssRules access — skip
      }
    }
    return [...cssClasses].sort()
  })
}

// -----------------------------------------------------------------------
// Test suite
// -----------------------------------------------------------------------

test.describe('Quasar runtime class coverage', () => {
  test.describe.configure({ mode: 'serial' })

  // Aggregate across all components
  const domClasses = new Set<string>()
  const cssClasses = new Set<string>()
  let skipped = 0

  const slugs = Object.keys(RECIPES)

  for (const slug of slugs) {
    const recipe = RECIPES[slug] ?? {}

    test(`collect classes from /${slug}`, async ({ page }) => {
      test.setTimeout(60_000)
      const qs = [recipe.props ?? '', 'style=md3'].filter(Boolean).join('&')

      try {
        await page.goto(`/${slug}?${qs}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30_000
        })

        await expect(page.getByTestId('component-preview')).toBeVisible({
          timeout: 15_000
        })

        await page.waitForTimeout(300)

        const d = await collectDomClasses(page)
        const c = await collectCssClasses(page)

        for (const cls of d) domClasses.add(cls)
        for (const cls of c) cssClasses.add(cls)
      } catch (err) {
        skipped++
        console.warn(`  ⚠  Skipped /${slug}: ${String(err).slice(0, 180)}`)
      }
    })
  }

  // Final report
  test('report missing CSS classes', async () => {
    const domArray = [...domClasses].sort()
    const cssSet = cssClasses

    const QUASAR_PREFIXES = [
      'q-',
      'body--light',
      'body--dark',
      'quasar-style-',
      'q-transition--',
      'q-loading',
      'q-notification',
      'q-notifications',
      'q-body--',
      'q-bottom-sheet',
      'q-message'
    ]

    const QUASAR_UTILITY = [
      'q-focusable',
      'q-hoverable',
      'q-manual-focusable',
      'q-focus-helper',
      'q-animate--scale',
      'q-dark',
      'q-link',
      'q-link--focusable',
      'q-placeholder'
    ]

    const isQuasarClass = (cls: string) => {
      if (QUASAR_UTILITY.includes(cls)) return true
      for (const prefix of QUASAR_PREFIXES) {
        if (cls.startsWith(prefix)) return true
      }
      if (
        /^(bg-|text-|rounded-borders|shadow-|column|row|flex|items-|justify-|self-|col-|offset-|order-|gutter-|fit|fixed|absolute|relative|fullscreen|hidden|no-wrap|wrap|ellipsis|inline|block|scroll|overflow|z-|on-left|on-right|rotate-|q-gutter|disabled|readonly|transparent|glossy|no-shadow|no-border|cursor-pointer|hide-scrollbar|no-outline|no-pointer-events|q-position-engine|non-selectable)/.test(
          cls
        )
      ) {
        return true
      }
      return false
    }

    const missing = domArray.filter(
      (cls) => isQuasarClass(cls) && !cssSet.has(cls)
    )

    const cssArray = [...cssSet].sort()
    const unusedInDom = cssArray.filter(
      (cls) => isQuasarClass(cls) && !domClasses.has(cls)
    )

    const report = {
      summary: {
        totalDomClasses: domClasses.size,
        totalCssClasses: cssSet.size,
        quasarClassesMissingCss: missing.length,
        quasarClassesInCssNotInDom: unusedInDom.length,
        skippedPages: skipped
      },
      missingFromCss: missing,
      inCssButNotDom: unusedInDom
    }

    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true })
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2))

    console.log('\n========================================')
    console.log('   Quasar Runtime Class Coverage Report')
    console.log('========================================')
    console.log(
      `  DOM classes found:         ${String(domClasses.size).padStart(5)}`
    )
    console.log(
      `  CSS class selectors:       ${String(cssSet.size).padStart(5)}`
    )
    console.log(
      `  Missing from CSS:          ${String(missing.length).padStart(5)}`
    )
    console.log(
      `  In CSS but not in DOM:     ${String(unusedInDom.length).padStart(5)}`
    )
    if (skipped > 0) {
      console.log(`  Skipped pages:             ${String(skipped).padStart(5)}`)
    }

    if (missing.length > 0) {
      console.log('\n--- Classes in DOM but MISSING from CSS ---')
      for (const cls of missing) {
        console.log(`  ${cls}`)
      }
    }

    if (unusedInDom.length > 0) {
      console.log('\n--- Classes in CSS but NOT found in any visited DOM ---')
      for (const cls of unusedInDom.slice(0, 40)) {
        console.log(`  ${cls}`)
      }
      if (unusedInDom.length > 40) {
        console.log(`  ... and ${unusedInDom.length - 40} more`)
      }
    }

    console.log(`\n  Full report written to ${REPORT_PATH}`)
    console.log('========================================\n')

    // Informational — always passes
    expect(true).toBe(true)
  })
})
