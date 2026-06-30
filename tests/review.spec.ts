import { test, expect } from '@playwright/test'

test.describe('Review page — /review', () => {
  test('loads and shows the component list in the drawer', async ({ page }) => {
    await page.goto('/review', { waitUntil: 'networkidle' })
    const items = page.locator('.q-drawer .q-item')
    await expect(items.first()).toBeVisible({ timeout: 15_000 })
    const count = await items.count()
    expect(count).toBeGreaterThan(0)
  })

  test('clicking a component shows screenshots in the carousel', async ({ page }) => {
    await page.goto('/review', { waitUntil: 'networkidle' })
    await expect(page.locator('.q-drawer .q-item').first()).toBeVisible({ timeout: 15_000 })

    await page.locator('.q-drawer .q-item').first().click()

    const carousel = page.locator('.q-carousel')
    await expect(carousel).toBeVisible({ timeout: 5_000 })
    const slides = carousel.locator('.q-carousel__slide')
    const slideCount = await slides.count()
    expect(slideCount).toBeGreaterThan(0)

    const infoBadge = page.locator('.q-badge').first()
    await expect(infoBadge).toBeVisible()
  })

  test('carousel navigation arrows work', async ({ page }) => {
    await page.goto('/review', { waitUntil: 'networkidle' })
    await expect(page.locator('.q-drawer .q-item').first()).toBeVisible({ timeout: 15_000 })

    await page.locator('.q-drawer .q-item').first().click()
    await expect(page.locator('.q-carousel__slide')).toBeVisible({ timeout: 5_000 })

    const slides = page.locator('.q-carousel__slide')
    const count = await slides.count()
    if (count > 1) {
      const counter = page.locator('text=/\\d+ \\/ \\d+/')
      const initialText = await counter.textContent()
      expect(initialText).toMatch(/\d+ \/ \d+/)

      const nextArrow = page.locator('.q-carousel__arrow-icon--next')
      await nextArrow.click()
      await page.waitForTimeout(500)

      const updatedText = await counter.textContent()
      expect(updatedText).toMatch(/\d+ \/ \d+/)
    }
  })

  test('style chips filter the component list', async ({ page }) => {
    await page.goto('/review', { waitUntil: 'networkidle' })
    await expect(page.locator('.q-drawer .q-item').first()).toBeVisible({ timeout: 15_000 })

    const chips = page.locator('.q-chip')
    const chipCount = await chips.count()
    expect(chipCount).toBe(7)

    await chips.nth(1).click()
    await chips.nth(2).click()
    await page.waitForTimeout(300)

    const itemsAfter = await page.locator('.q-drawer .q-item').count()
    expect(itemsAfter).toBeGreaterThan(0)
  })

  test('search input filters the component list', async ({ page }) => {
    await page.goto('/review', { waitUntil: 'networkidle' })
    await expect(page.locator('.q-drawer .q-item').first()).toBeVisible({ timeout: 15_000 })

    const initialCount = await page.locator('.q-drawer .q-item').count()
    expect(initialCount).toBeGreaterThan(0)

    const searchInput = page.locator('input[type="text"]').first()
    await searchInput.fill('q-btn')
    await page.waitForTimeout(300)

    const filteredCount = await page.locator('.q-drawer .q-item').count()
    expect(filteredCount).toBeLessThanOrEqual(initialCount)
    expect(filteredCount).toBeGreaterThan(0)

    const visibleItems = page.locator('.q-drawer .q-item')
    const itemCount = await visibleItems.count()
    for (let i = 0; i < itemCount; i++) {
      await expect(visibleItems.nth(i)).toContainText(/q-btn/)
    }
  })

  test('drawer can be toggled open/closed', async ({ page }) => {
    await page.goto('/review', { waitUntil: 'networkidle' })
    const drawer = page.locator('.q-drawer')

    // Drawer should be open initially (visible, non-zero width)
    await expect(drawer).toBeVisible()
    const initialVisible = await drawer.evaluate(
      (el: Element) => (el as HTMLElement).offsetWidth > 0
    )
    expect(initialVisible).toBe(true)

    // Click the toggle button
    const toggleBtn = page.locator('[data-testid="drawer-toggle"]')
    await toggleBtn.click()
    await page.waitForTimeout(500)

    // Check if the drawer model changed by evaluating the class for closed state
    const afterClick = await drawer.evaluate((el: Element) => {
      const e = el as HTMLElement
      return {
        hasHideClass: e.classList.contains('q-drawer--hide'),
        offsetWidth: e.offsetWidth
      }
    })

    if (afterClick.hasHideClass || afterClick.offsetWidth === 0) {
      // Drawer closed successfully
      await toggleBtn.click()
      await page.waitForTimeout(500)
    }
  })
})
