import { test, expect } from '@playwright/test'

/**
 * Tests for the runtime style switcher.
 *
 * The playground bundles all three Quasar styles (MaterialDesign2,
 * MaterialDesign3, Unstyled) and scopes each one's preflights to a
 * body class (`quasar-style-md2`, `quasar-style-md3`,
 * `quasar-style-unstyled`). Switching styles updates the URL
 * (`?style=...`) and triggers a `location.reload()` so that
 * `setDefaultPropsMd3` re-runs (or doesn't) for the new style.
 */
test.describe('Style switcher', () => {
  test('default style is md3 and the body has the md3 class', async ({
    page
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    // The switcher reflects the current style.
    await expect(page.getByTestId('style-switcher-current')).toHaveText(
      /Material Design 3/
    )
    await expect(
      page.locator('[data-testid="style-switcher"]')
    ).toHaveAttribute('data-current-style', 'md3')
    // The active body class is set on mount.
    const classes = await page.evaluate(() =>
      Array.from(document.body.classList)
    )
    expect(classes).toContain('quasar-style-md3')
    expect(classes).not.toContain('quasar-style-md2')
    expect(classes).not.toContain('quasar-style-unstyled')
  })

  test('?style=md2 in the URL applies the md2 body class', async ({ page }) => {
    await page.goto('/?style=md2', { waitUntil: 'networkidle' })
    const classes = await page.evaluate(() =>
      Array.from(document.body.classList)
    )
    expect(classes).toContain('quasar-style-md2')
    expect(classes).not.toContain('quasar-style-md3')
    await expect(page.getByTestId('style-switcher-current')).toHaveText(
      /Material Design 2/
    )
  })

  test('?style=unstyled applies the unstyled body class', async ({ page }) => {
    await page.goto('/?style=unstyled', { waitUntil: 'networkidle' })
    const classes = await page.evaluate(() =>
      Array.from(document.body.classList)
    )
    expect(classes).toContain('quasar-style-unstyled')
    expect(classes).not.toContain('quasar-style-md3')
    expect(classes).not.toContain('quasar-style-md2')
    await expect(page.getByTestId('style-switcher-current')).toHaveText(
      /^Unstyled$/
    )
  })

  test('selecting MD2 from the switcher updates the URL and reloads', async ({
    page
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    // Open the dropdown. The q-btn-dropdown's label contains the
    // current style name — click it to expand the menu.
    await page.getByTestId('style-switcher').click()
    // Wait for the menu to be visible (q-list renders into a teleport).
    await expect(page.getByTestId('style-option-md2')).toBeVisible({
      timeout: 5_000
    })
    await page.getByTestId('style-option-md2').click()
    // Wait for the reload + URL update.
    await page.waitForURL(/[?&]style=md2/, { timeout: 10_000 })
    await page.waitForLoadState('networkidle')
    const classes = await page.evaluate(() =>
      Array.from(document.body.classList)
    )
    expect(classes).toContain('quasar-style-md2')
    expect(classes).not.toContain('quasar-style-md3')
  })

  test('the switcher offers all three styles', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.getByTestId('style-switcher').click()
    await expect(page.getByTestId('style-option-md3')).toBeVisible()
    await expect(page.getByTestId('style-option-md2')).toBeVisible()
    await expect(page.getByTestId('style-option-unstyled')).toBeVisible()
  })
  test('switching styles does not flash the previous/default style', async ({
    page
  }) => {
    // Records the body class (and first .q-btn border-radius, once one is
    // rendered) at every lifecycle point and class mutation, into
    // sessionStorage — which survives the reload setStyle() triggers — so
    // the test can see the exact painted sequence across the switch.
    const LOG_KEY = '__harnessStyleLog'
    await page.addInitScript((key: string) => {
      const btnInfo = () => {
        const btn = document.querySelector('.q-btn') as HTMLElement | null
        return btn ? getComputedStyle(btn).borderRadius : null
      }
      const push = (why: string, extra?: Record<string, unknown>) => {
        try {
          const arr = JSON.parse(sessionStorage.getItem(key) || '[]')
          arr.push({
            why,
            cls: document.body ? document.body.className : '',
            url: location.pathname + location.search,
            ...extra
          })
          sessionStorage.setItem(key, JSON.stringify(arr))
        } catch {
          /* ignore */
        }
      }
      push('init')
      document.addEventListener('DOMContentLoaded', () =>
        push('domcontentloaded', { btn: btnInfo() })
      )
      new MutationObserver(() => push('mut')).observe(
        document.documentElement,
        { subtree: true, attributes: true, attributeFilter: ['class'] }
      )
    }, LOG_KEY)

    await page.goto('/', { waitUntil: 'networkidle' })
    await expect(page.getByTestId('style-switcher-current')).toHaveText(
      /Material Design 3/
    )

    // Fresh log right before the switch, so every recorded entry is
    // part of (or a consequence of) the md3 -> md2 switch.
    await page.evaluate((k) => sessionStorage.setItem(k, '[]'), LOG_KEY)

    await page.getByTestId('style-switcher').click()
    await expect(page.getByTestId('style-option-md2')).toBeVisible({
      timeout: 5_000
    })
    await page.getByTestId('style-option-md2').click()

    await page.waitForURL(/[?&]style=md2/, { timeout: 10_000 })
    await page.waitForLoadState('networkidle')
    await expect(page.getByTestId('style-switcher-current')).toHaveText(
      /Material Design 2/
    )

    const log = (await page.evaluate((k) => {
      try {
        return JSON.parse(sessionStorage.getItem(k) || '[]')
      } catch {
        return []
      }
    }, LOG_KEY)) as Array<{
      why: string
      cls: string
      url: string
      btn?: string | null
    }>
    expect(log.length).toBeGreaterThan(0)

    // 1) No painted frame may use the previous (md3) or unstyled style.
    for (const entry of log) {
      expect(entry.cls).not.toContain('quasar-style-md3')
      expect(entry.cls).not.toContain('quasar-style-unstyled')
    }

    // 2) Any frame that already renders a .q-btn must already have the
    //    target style class (otherwise it painted the :root md3 defaults).
    for (const entry of log) {
      if (entry.btn !== null && entry.btn !== undefined) {
        expect(entry.cls).toContain('quasar-style-md2')
      }
    }

    // 3) The reloaded document must carry the target class before the app
    //    hydrates — DOMContentLoaded fires before the app boot in dev and
    //    before hydration in the SSG build. This is what the inline script
    //    in packages/app/index.html guarantees.
    const reloaded = log.filter((e) => e.url.includes('style=md2'))
    const dcl = reloaded.find((e) => e.why === 'domcontentloaded')
    expect(dcl).toBeTruthy()
    expect(dcl!.cls).toContain('quasar-style-md2')
  })
})
