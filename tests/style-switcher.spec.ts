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
    await expect(
      page.getByTestId('style-switcher-current')
    ).toHaveText(/Material Design 3/)
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

  test('?style=md2 in the URL applies the md2 body class', async ({
    page
  }) => {
    await page.goto('/?style=md2', { waitUntil: 'networkidle' })
    const classes = await page.evaluate(() =>
      Array.from(document.body.classList)
    )
    expect(classes).toContain('quasar-style-md2')
    expect(classes).not.toContain('quasar-style-md3')
    await expect(
      page.getByTestId('style-switcher-current')
    ).toHaveText(/Material Design 2/)
  })

  test('?style=unstyled applies the unstyled body class', async ({
    page
  }) => {
    await page.goto('/?style=unstyled', { waitUntil: 'networkidle' })
    const classes = await page.evaluate(() =>
      Array.from(document.body.classList)
    )
    expect(classes).toContain('quasar-style-unstyled')
    expect(classes).not.toContain('quasar-style-md3')
    expect(classes).not.toContain('quasar-style-md2')
    await expect(
      page.getByTestId('style-switcher-current')
    ).toHaveText(/^Unstyled$/)
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
    await expect(
      page.getByTestId('style-option-md3')
    ).toBeVisible()
    await expect(
      page.getByTestId('style-option-md2')
    ).toBeVisible()
    await expect(
      page.getByTestId('style-option-unstyled')
    ).toBeVisible()
  })
})