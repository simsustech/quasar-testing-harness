import { test, expect } from '@playwright/test'

/**
 * Tests for the runtime style switcher.
 *
 * The playground bundles all three Quasar styles (MaterialDesign2,
 * MaterialDesign3, Unstyled) and scopes each one's preflights to a
 * body class (`quasar-style-md2`, `quasar-style-md3`,
 * `quasar-style-unstyled`). Switching styles is instant: `setStyle()`
 * applies the body class, persists the choice to localStorage
 * (`quasar-style`) and updates the URL (`?style=...`) — no reload.
 * The inline script in `packages/app/index.html` resolves the same
 * URL → localStorage → md3 before first paint so fresh loads
 * (including the SSG prerender) never flash the md3 `:root` defaults.
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

  test('selecting MD2 from the switcher updates the URL without reloading', async ({
    page
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    // Marker that a full page reload would wipe out.
    await page.evaluate(() => {
      ;(window as unknown as Record<string, unknown>).__noReloadMarker = true
    })

    await page.getByTestId('style-switcher').click()
    await expect(page.getByTestId('style-option-md2')).toBeVisible({
      timeout: 5_000
    })
    await page.getByTestId('style-option-md2').click()

    // URL updates via router.replace; no navigation happens.
    await page.waitForURL(/[?&]style=md2/, { timeout: 10_000 })
    const classes = await page.evaluate(() =>
      Array.from(document.body.classList)
    )
    expect(classes).toContain('quasar-style-md2')
    expect(classes).not.toContain('quasar-style-md3')

    const marker = await page.evaluate(
      () =>
        (window as unknown as Record<string, unknown>).__noReloadMarker === true
    )
    expect(marker).toBe(true)
  })

  test('choosing a style persists the choice to localStorage', async ({
    page
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.getByTestId('style-switcher').click()
    await expect(page.getByTestId('style-option-md2')).toBeVisible({
      timeout: 5_000
    })
    await page.getByTestId('style-option-md2').click()
    await page.waitForURL(/[?&]style=md2/, { timeout: 10_000 })

    const stored = await page.evaluate(() =>
      window.localStorage.getItem('quasar-style')
    )
    expect(stored).toBe('md2')
  })

  test('a persisted style is restored before first paint on a fresh visit', async ({
    page
  }) => {
    // Seed the persisted choice before any page script runs (init scripts
    // run before the inline pre-paint script in index.html).
    await page.addInitScript(() => {
      window.localStorage.setItem('quasar-style', 'md2')
    })
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    // The inline pre-paint script applies the class during parse — the
    // body already carries it before the app boots/hydrates.
    const bodyClass = await page.evaluate(() => document.body.className)
    expect(bodyClass).toContain('quasar-style-md2')
    await expect(page.getByTestId('style-switcher-current')).toHaveText(
      /Material Design 2/
    )
  })
test('the persisted style survives navigation to a page without ?style=', async ({
    page
  }) => {
    await page.goto('/q-btn?style=md2', { waitUntil: 'networkidle' })
    await expect(page.getByTestId('style-switcher-current')).toHaveText(
      /Material Design 2/
    )

    // Client-side navigation (toolbar title link) to the homepage, which
    // has no ?style= param. The stored choice must win over the default.
    await page
      .getByRole('link', { name: 'Quasar Component Playground' })
      .click()
    await page.waitForURL(/\/$/, { timeout: 10_000 })

    await expect(page.getByTestId('style-switcher-current')).toHaveText(
      /Material Design 2/
    )
    const bodyClass = await page.evaluate(() => document.body.className)
    expect(bodyClass).toContain('quasar-style-md2')
    expect(bodyClass).not.toContain('quasar-style-md3')
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
    await page.goto('/', { waitUntil: 'networkidle' })
    await expect(page.getByTestId('style-switcher-current')).toHaveText(
      /Material Design 3/
    )

    // A full page reload would wipe this marker out.
    await page.evaluate(() => {
      ;(window as unknown as Record<string, unknown>).__noReloadMarker = true
    })

    await page.getByTestId('style-switcher').click()
    await expect(page.getByTestId('style-option-md2')).toBeVisible({
      timeout: 5_000
    })
    await page.getByTestId('style-option-md2').click()

    // The body class flips synchronously inside the click handler
    // (applyBodyClass) — assert it immediately, before any navigation:
    // there is no intermediate frame with the old (md3) style.
    const bodyClassAfterClick = await page.evaluate(
      () => document.body.className
    )
    expect(bodyClassAfterClick).toContain('quasar-style-md2')
    expect(bodyClassAfterClick).not.toContain('quasar-style-md3')
    expect(bodyClassAfterClick).not.toContain('quasar-style-unstyled')

    await page.waitForURL(/[?&]style=md2/, { timeout: 10_000 })
    await expect(page.getByTestId('style-switcher-current')).toHaveText(
      /Material Design 2/
    )

    // The switch must not have navigated/reloaded.
    const marker = await page.evaluate(
      () =>
        (window as unknown as Record<string, unknown>).__noReloadMarker === true
    )
    expect(marker).toBe(true)

    // And the style is still md2 after everything settles.
    const bodyClassSettled = await page.evaluate(() => document.body.className)
    expect(bodyClassSettled).toContain('quasar-style-md2')
    expect(bodyClassSettled).not.toContain('quasar-style-md3')
  })
})
